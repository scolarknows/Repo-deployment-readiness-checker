import { GitHubFile, TreeItem } from "../github";

export interface ScanContext {
  tree: TreeItem[];
  files: Map<string, string>; // path -> content
  packageJsons: Map<string, any>; // rootPath -> parsed package.json
  scannedRoots: string[];
}

export function buildScanContext(
  tree: TreeItem[],
  fetchedFiles: GitHubFile[],
  scannedRoots: string[]
): ScanContext {
  const filesMap = new Map<string, string>();
  for (const file of fetchedFiles) {
    filesMap.set(file.path, file.content);
  }

  const packageJsonsMap = new Map<string, any>();
  for (const root of scannedRoots) {
    const pkgPath = root === "." ? "package.json" : `${root}/package.json`;
    const content = filesMap.get(pkgPath);
    if (content) {
      try {
        packageJsonsMap.set(root, JSON.parse(content));
      } catch {
        // Invalid JSON - ignore
      }
    }
  }

  return {
    tree,
    files: filesMap,
    packageJsons: packageJsonsMap,
    scannedRoots,
  };
}