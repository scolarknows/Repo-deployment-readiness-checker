import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { protectRoute } from "./lib/supabase/server";

export function middleware(request: NextRequest) {
  return protectRoute(request);
}