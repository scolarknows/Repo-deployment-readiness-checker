"use server";

import { createServerClient, type SanitizedRequestHeaders, type SerializeCookieOptions } from "@supabase/ssr";
import { type NextRequest } from "next/server";
import { supabaseUrl, supabaseAnonKey } from "./index";

export function createClient(request: NextRequest) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: SerializeCookieOptions[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
        });
      },
    },
  });
}