"use client";

import React from "react";
import { HeroScanDemo } from "./HeroScanDemo";

export function Hero() {

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 max-w-6xl mx-auto px-6">
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--fg)] mb-6">
          Find what breaks your deploy before your deploy does.
        </h1>
        <p className="text-lg md:text-xl font-extralight text-[var(--near-white)] leading-relaxed mb-8">
          Static deployment readiness heuristics for frontend repositories. Inspect environment variables, build configuration, missing lockfiles, and server bindings before shipping to production.
        </p>
      </div>

      <HeroScanDemo />
    </section>
  );
}