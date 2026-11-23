import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple middleware - just a placeholder for now
// Real Supabase auth will be integrated per-phase requirements
export function middleware(request: NextRequest) {
  // For now, allow all routes
  // Authentication will be properly implemented in Phase 2
  return NextResponse.next();
}