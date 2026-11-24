import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function createSupabaseServerClient(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
      },
    }
  );
}

export async function protectRoute(request: NextRequest) {
  const supabase = createSupabaseServerClient(request);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    const url = new URL(request.nextUrl.pathname, request.url);
    url.searchParams.set("redirect_url", request.nextUrl.pathname);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}