"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Cursor trail component
 *
 * PRD 8.6:
 * - A green trail follows the pointer: short fading polyline with soft glow.
 * - Implemented on a separate fixed canvas with pointer-events: none.
 * - Enabled only for fine pointers ((pointer: fine)), disabled on touch and reduced-motion.
 * - Max ~24 points; trail fades in ~400ms.
 */

const MAX_POINTS = 24;
const FADE_DURATION = 400; // ms

interface Point {
  x: number;
  y: number;
  time: number;
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Enable only for fine pointers (mouse/trackpad), not touch
    if (typeof window === "undefined") return;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    setEnabled(hasFinePointer && !reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let points: Point[] = [];
    let animId: number;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      points.push({
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
      });
      if (points.length > MAX_POINTS) {
        points.shift();
      }
    }

    window.addEventListener("pointermove", onPointerMove);

    function render() {
      animId = requestAnimationFrame(render);
      if (!canvas || !ctx) return;

      const now = Date.now();
      points = points.filter((p) => now - p.time < FADE_DURATION);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (points.length < 2) return;

      // Draw glowing green fading polyline (#22c55e / reserved green)
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 1; i < points.length; i++) {
        const p1 = points[i - 1];
        const p2 = points[i];
        const age = now - p2.time;
        const progress = 1 - age / FADE_DURATION;
        const alpha = Math.max(0, Math.min(1, progress * 0.7));

        ctx.strokeStyle = `rgba(34, 197, 94, ${alpha})`;
        ctx.lineWidth = Math.max(1, progress * 2.5);
        ctx.shadowColor = "rgba(34, 197, 94, 0.5)";
        ctx.shadowBlur = 4;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      aria-hidden="true"
    />
  );
}

export default CursorTrail;
