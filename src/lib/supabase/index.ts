"use server";

import { createServerClient, type SanitizedRequestHeaders } from "@supabase/ssr";
import { type NextResponse } from "next/server";
import type { SerializeCookieOptions } from "@supabase/ssr";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

export function createServerClient(request: Request) {
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: SerializeCookieOptions[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          // We need to set the response cookies after NextResponse is created
          // This is handled by the Next.js middleware pattern
        },
      },
    }
  );
}

export function createBrowserClient(headers: SanitizedRequestHeaders) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll(_cookiesToSet: SerializeCookieOptions[]) {
        // Browser clients handle cookies differently
      },
    },
    awayFromHome: true,
  });
}

export type Session = {
  user: {
    id: string;
    email: string | null;
  };
  expiresAt: string;
};

export type User = {
  id: string;
  email: string | null;
};

export async function signInWithPassword(
  email: string,
  password: string
) {
  const supabase = createBrowserClient({} as any);
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(
  email: string,
  password: string,
  options?: { data: { username: string } }
) {
  const supabase = createBrowserClient({} as any);
  return supabase.auth.signUp({ email, password, options });
}

export async function signOut() {
  const supabase = createBrowserClient({} as any);
  return supabase.auth.signOut();
}