"use client";

import React, { useState, useEffect } from "react";
import { useReducedMotion } from "@/app/fx/use-reduced-motion";

const BAR_COUNT = 12;
const BAR_WIDTH = 5;
const GAP = 3;
const ANIMATION_DURATION = 1.2;

interface AnalysingLoaderProps {
  /** Optional message to display below the animation */
  message?: string;
  /** Optional title/heading */
  title?: string;
}

export function AnalysingLoader({ title, message }: AnalysingLoaderProps = {}) {
  const reducedMotion = useReducedMotion();

  // Generate staggered delay for each bar
  const generateDelays = () => {
    const delays = [];
    for (let i = 0; i < BAR_COUNT; i++) {
      // Stagger: later bars start later
      const delay = (i / BAR_COUNT) * ANIMATION_DURATION;
      delays.push(delay);
    }
    return delays;
  };

  const delays = generateDelays();

  return (
    <div className="relative flex flex-col items-center gap-4 min-h-[200px]">
      {title && (
        <h3 className="text-lg font-semibold text-[var(--fg)]">
          {title}
        </h3>
      )}

      <div
        className={reducedMotion
          ? "grid grid-cols-12 gap-2 bg-[var(--surface)] rounded-md py-2"
          : "grid grid-cols-12 gap-2 bg-[var(--surface)] rounded-md py-2 overflow-hidden"}
      >
        {Array.from({ length: BAR_COUNT }, (_, i) => (
          <div
            key={i}
            className={`flex-0 w-[${BAR_WIDTH}px] bg-[var(--primary)] rounded-t-md ${
              reducedMotion
                ? "animate-none"
                : `animate-bar ${ANIMATION_DURATION}s ease-in-out infinite ${
                    delays[i] * 1000
                  }ms`
            }`}
            style={{
              animationDelay: reducedMotion ? "0ms" : `${delays[i]}s`,
            }}
          >
            <div
              className={`h-full rounded-b-md bg-[var(--primary)] ${
                reducedMotion ? "animate-none" : `animate-pulse-slow ${ANIMATION_DURATION}s ease-in-out infinite`
              }`}
            />
          </div>
        ))}
      </div>

      {message && (
        <p className="text-sm text-[var(--muted)]">{message}</p>
      )}
    </div>
  );
}