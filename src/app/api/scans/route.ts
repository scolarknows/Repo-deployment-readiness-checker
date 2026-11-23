import { NextRequest, NextResponse } from "next/server";
import { parseRepoUrl, getDefaultBranch, getRepoTree, selectFilesToRead, fetchFileContents, detectProjectRoots, GitHubError } from "@/lib/github";
import { buildScanContext } from "@/lib/engine/context";
import { runAllRules } from "@/lib/engine/registry";
import { computeScore } from "@/lib/engine/score";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "Repository URL is required" }, { status: 400 });
    }

    // 1. Parse and validate URL
    const repoRef = parseRepoUrl(url);

    // 2. Fetch default branch and tree
    const githubToken = process.env.GITHUB_TOKEN;
    const defaultBranch = await getDefaultBranch(repoRef, githubToken);
    const { tree } = await getRepoTree(repoRef, defaultBranch, githubToken);

    // 3. Select files and read contents
    const filesToRead = selectFilesToRead(tree);
    const fetchedFiles = await fetchFileContents(repoRef, filesToRead, githubToken);
    const scannedRoots = detectProjectRoots(tree);

    // 4. Build context and run rules
    const context = buildScanContext(tree, fetchedFiles, scannedRoots);
    const { findings, passedRules } = runAllRules(context);

    // 5. Compute score
    const { score, grade } = computeScore(findings);

    const scanResult = {
      repoUrl: url,
      repoOwner: repoRef.owner,
      repoName: repoRef.repo,
      branch: defaultBranch,
      status: "completed",
      score,
      grade,
      findings,
      passedRules,
      scannedRoots,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(scanResult);
  } catch (error: any) {
    if (error instanceof GitHubError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status || 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during the scan" },
      { status: 500 }
    );
  }
}