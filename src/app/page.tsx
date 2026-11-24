import React from "react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { Hero } from "@/components/marketing/Hero";
import { CategoryChecks } from "@/components/marketing/CategoryChecks";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { SampleReport } from "@/components/marketing/SampleReport";
import { HonestLimits } from "@/components/marketing/HonestLimits";
import { FAQ } from "@/components/marketing/FAQ";
import { Footer } from "@/components/marketing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <MarketingNav />
      <main>
        <Hero />
        <CategoryChecks />
        <HowItWorks />
        <SampleReport />
        <HonestLimits />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
