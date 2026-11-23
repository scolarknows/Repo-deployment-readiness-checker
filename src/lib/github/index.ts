/**
 * GitHub REST API integration for Preflight
 *
 * Implements:
 * - URL parsing and validation (pattern from PRD 6.2)
 * - Metadata fetching (default branch)
 * - Tree fetching (recursive API call)
 * - Truncated-tree handling
 * - Capped parallel file reading (concurrency limit)
 * - Project root detection
 */

import { z } from "zod";

// Pattern for repo owner/name validation (PRD 6.2)
const OWNER_REPO_PATTERN = /^[A-Za-z0-9_.-]+$/;

export interface GitHubRepoRef {
  owner: string;
  repo: string;
}

export interface TreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
}

export interface GitHubFile {
  path: string;
  content: string;
  size: number;
}

export class GitHubError extends Error {
  constructor(
    message: string,
    public code: "INVALID_URL" | "NOT_FOUND" | "TOO_LARGE" | "RATE_LIMITED" | "API_ERROR",
    public status?: number
  ) {
    super(message);
    this.name = "GitHubError";
  }
}

/**
 * Parse and validate a GitHub repository URL
 * Accepted forms: https://github.com/owner/repo, with or without trailing slash or .git
 */
export function parseRepoUrl(url: string): GitHubRepoRef {
  let cleaned = url.trim();
  if (!cleaned) {
    throw new GitHubError("Repository URL is required", "INVALID_URL");
  }

  // Handle trailing slash and .git extension
  cleaned = cleaned.replace(/\/+$/, "").replace(/\.git$/, "");

  // Match URL structure
  const match = cleaned.match(/^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)$/);
  if (!match) {
    throw new GitHubError(
      "Invalid GitHub repository URL format. Example: https://github.com/owner/repo",
      "INVALID_URL"
    );
  }

  const [, owner, repo] = match;

  // Validate owner and repo against strict pattern
  if (!OWNER_REPO_PATTERN.test(owner) || !OWNER_REPO_PATTERN.test(repo)) {
    throw new GitHubError(
      "Repository owner and name contain invalid characters",
      "INVALID_URL"
    );
  }

  return { owner, repo };
}

/**
 * Fetch default branch for a repository
 */
export async function getDefaultBranch(
  { owner, repo }: GitHubRepoRef,
  token?: string
): Promise<string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Preflight-App",
  };

  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers }
  );

  if (response.status === 404) {
    throw new GitHubError("Repository not found or is private", "NOT_FOUND", 404);
  }

  if (response.status === 403 || response.status === 429) {
    throw new GitHubError("GitHub API rate limit reached", "RATE_LIMITED", response.status);
  }

  if (!response.ok) {
    throw new GitHubError(
      `GitHub API error: ${response.statusText}`,
      "API_ERROR",
      response.status
    );
  }

  const data = await response.json();
  return data.default_branch || "main";
}

/**
 * Fetch full file tree recursively
 */
export async function getRepoTree(
  { owner, repo }: GitHubRepoRef,
  branch: string,
  token?: string
): Promise<{ tree: TreeItem[]; truncated: boolean }> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Preflight-App",
  };

  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers }
  );

  if (!response.ok) {
    throw new GitHubError(
      `Failed to fetch file tree: ${response.statusText}`,
      "API_ERROR",
      response.status
    );
  }

  const data = await response.json();

  if (data.truncated) {
    throw new GitHubError(
      "Repository file tree is too large to scan",
      "TOO_LARGE"
    );
  }

  return {
    tree: data.tree || [],
    truncated: false,
  };
}

/**
 * Select priority files to read based on PRD requirements
 */
export function selectFilesToRead(tree: TreeItem[]): TreeItem[] {
  const ALWAYS_READ = [
    "package.json",
    ".env.example",
    ".gitignore",
    "README.md",
    "vercel.json",
    "render.yaml",
    "Dockerfile",
    ".nvmrc",
  ];

  const ALWAYS_READ_PATTERNS = [
    /^\.github\/workflows\/.*\.ya?ml$/,
  ];

  const SOURCE_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"];

  const SKIP_DIRS = [
    "node_modules",
    "dist",
    "build",
    ".next",
    "coverage",
    ".git",
  ];

  // Priority path prefixes
  const PRIORITY_PATHS = [
    "server",
    "backend",
    "api",
    "src",
    "app",
    "lib",
  ];

  const selected: TreeItem[] = [];
  const selectedPaths = new Set<string>();

  // 1. Always read priority files at root or matching patterns
  for (const item of tree) {
    if (item.type !== "blob") continue;
    if (item.size && item.size > 200 * 1024) continue; // Skip files > 200KB

    // Check skip dirs
    if (SKIP_DIRS.some((dir) => item.path.split("/").includes(dir))) {
      continue;
    }

    const filename = item.path.split("/").pop() || "";

    // Always read list
    if (ALWAYS_READ.includes(filename) || ALWAYS_READ_PATTERNS.some((p) => p.test(item.path))) {
      selected.push(item);
      selectedPaths.add(item.path);
    }
  }

  // 2. Select up to 60 source files, prioritized by path
  const sourceItems: TreeItem[] = [];

  for (const item of tree) {
    if (item.type !== "blob") continue;
    if (selectedPaths.has(item.path)) continue;
    if (item.size && item.size > 200 * 1024) continue;

    if (SKIP_DIRS.some((dir) => item.path.split("/").includes(dir))) {
      continue;
    }

    const ext = "." + item.path.split(".").pop();
    if (SOURCE_EXTENSIONS.includes(ext)) {
      sourceItems.push(item);
    }
  }

  // Sort source files by priority path
  sourceItems.sort((a, b) => {
    const aPriority = PRIORITY_PATHS.some((p) => a.path.startsWith(p + "/")) ? 0 : 1;
    const bPriority = PRIORITY_PATHS.some((p) => b.path.startsWith(p + "/")) ? 0 : 1;
    return aPriority - bPriority;
  });

  // Limit source files to 60
  const maxSource = 60 - selected.length;
  if (maxSource > 0) {
    selected.push(...sourceItems.slice(0, maxSource));
  }

  return selected;
}

/**
 * Fetch blob contents in parallel with concurrency limit
 */
export async function fetchFileContents(
  { owner, repo }: GitHubRepoRef,
  items: TreeItem[],
  token?: string,
  concurrency = 5
): Promise<GitHubFile[]> {
  const results: GitHubFile[] = [];

  for (let i = 0; i < items.length; i += concurrency) {
    const chunk = items.slice(i, i + concurrency);
    const chunkResults = await Promise.all(
      chunk.map(async (item) => {
        try {
          const headers: Record<string, string> = {
            Accept: "application/vnd.github.v3.raw",
            "User-Agent": "Preflight-App",
          };

          if (token) {
            headers.Authorization = `token ${token}`;
          }

          const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${item.path}`,
            { headers }
          );

          if (!response.ok) return null;

          const content = await response.text();
          return {
            path: item.path,
            content,
            size: item.size || content.length,
          };
        } catch {
          return null;
        }
      })
    );

    for (const res of chunkResults) {
      if (res) results.push(res);
    }
  }

  return results;
}

/**
 * Detect project roots (root or subfolders like frontend, backend, etc.)
 */
export function detectProjectRoots(tree: TreeItem[]): string[] {
  const SUBFOLDERS = ["frontend", "client", "backend", "server", "api", "web"];
  const roots: string[] = [];

  // Check root package.json
  const hasRootPackageJson = tree.some(
    (item) => item.path === "package.json" && item.type === "blob"
  );

  if (hasRootPackageJson) {
    roots.push(".");
  }

  // Check subfolders
  for (const folder of SUBFOLDERS) {
    const hasSubPackageJson = tree.some(
      (item) => item.path === `${folder}/package.json` && item.type === "blob"
    );
    if (hasSubPackageJson) {
      roots.push(folder);
    }
  }

  // If no package.json found anywhere, default to "."
  return roots.length > 0 ? roots : ["."];
}