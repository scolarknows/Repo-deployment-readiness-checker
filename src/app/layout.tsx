import "./globals.css";
import BackgroundCanvas from "@/app/fx/background-canvas";
import CursorTrail from "@/app/fx/cursor-trail";

export const metadata = {
  title: "Preflight - Repo Deploy-Readiness Checker",
  description: "Scan public GitHub repositories for deployment risks",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[var(--bg)] text-[var(--fg)] antialiased">
        <BackgroundCanvas />
        <CursorTrail />
        {children}
      </body>
    </html>
  );
}
