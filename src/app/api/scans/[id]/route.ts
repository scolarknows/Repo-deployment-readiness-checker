import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Scan ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("scans")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: data.id,
      repoUrl: data.repo_url,
      repoOwner: data.repo_owner,
      repoName: data.repo_name,
      branch: data.branch,
      status: data.status,
      score: data.score,
      grade: data.grade,
      findings: data.findings,
      passedRules: data.passed_rules,
      scannedRoots: data.scanned_roots,
      isPublic: data.is_public,
      createdAt: data.created_at,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load scan" }, { status: 500 });
  }
}
