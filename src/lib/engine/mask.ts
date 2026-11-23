/**
 * Secret masking utilities for Preflight
 * Ensures detected secrets are masked before storage and never logged.
 */

export function maskSecret(secret: string): string {
  if (!secret || secret.length < 8) {
    return "[MASKED SECRET]";
  }
  const prefix = secret.slice(0, 4);
  return `${prefix}...[MASKED]`;
}