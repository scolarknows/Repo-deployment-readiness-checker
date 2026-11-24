// Re-export standard clients for backwards compatibility
export { createClient as createBrowserClient } from "./client";
export { createClient as createServerClient, createAdminClient } from "./server";
