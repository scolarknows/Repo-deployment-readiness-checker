import { NextRequest, NextResponse } from "next/server";
import { parseRepoUrl, getDefaultBranch, getRepoTree, selectFilesToRead, fetchFileContents, detectProjectRoots, GitHubError } from "@/lib/github";
import { buildScanContext } from "@/lib/engine/context";
import { runAllRules } from "@/lib/engine/registry";
import { computeScore } from "@/lib/engine/score";
import { createClient } from "@/lib/supabase/server";

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

    const scanData = {
      repo_url: url,
      repo_owner: repoRef.owner,
      repo_name: repoRef.repo,
      branch: defaultBranch,
      status: "completed",
      score,
      grade,
      findings,
      passed_rules: passedRules,
      scanned_roots: scannedRoots,
      created_at: new Date().toISOString(),
    };

    let savedId: string | null = null;

    // Optional Supabase persistence if connected
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
          .from("scans")
          .insert({
            ...scanData,
            user_id: user?.id || null,
          })
          .select("id")
          .single();

        if (!error && data) {
          savedId = data.id;
        }
      } catch {
        // Fall back gracefully if database connection is offline
      }
    }

    return NextResponse.json({
      id: savedId,
      repoUrl: scanData.repo_url,
      repoOwner: scanData.repo_owner,
      repoName: scanData.repo_name,
      branch: scanData.branch,
      status: scanData.status,
      score: scanData.score,
      grade: scanData.grade,
      findings: scanData.findings,
      passedRules: scanData.passed_rules,
      scannedRoots: scanData.scanned_roots,
      createdAt: scanData.created_at,
    });
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

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ scans: [] });
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ scans: [] });
    }

    const { data, error } = await supabase
      .from("scans")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ scans: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
