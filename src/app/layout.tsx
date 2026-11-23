import type { Metadata } from "next";
import "./globals.css";

// DM Sans is loaded via <link> in the <head> below —
// next/font/google is avoided here because Turbopack has issues with it
// in this environment; the CSS variable approach is used instead.

export const metadata: Metadata = {
  title: "Preflight",
  description: "Repo deploy-readiness checker",
};

// Remove the inline <link> elements from the JSX — we'll use next/config for font loading
// or just rely on the CSS @import approach. For now, DM Sans is expected to be
// available as a CSS variable set by the build process or manually added.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full bg-[var(--bg)] text-[var(--fg)] antialiased font-serif">
        <main className="flex flex-col min-w-0">{children}</main>
      </body>
    </html>
  );
}