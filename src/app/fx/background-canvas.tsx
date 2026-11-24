"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Background canvas component
 *
 * PRD 8.5:
 * - A faint orthogonal grid with sparse light pulses traveling along circuit-style paths.
 * - Single canvas, fixed behind page with pointer-events: none.
 * - Caps frame rate around 30 fps, pauses when tab is hidden.
 * - Reduced motion fallback: static grid.
 */

const GRID_SPACING = 40;
const PULSE_SPEED = 1.5;
const MAX_PULSES = 18;

interface Pulse {
  x: number;
  y: number;
  dx: number;
  dy: number;
  alpha: number;
}

export function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let lastTime = 0;
    const fpsInterval = 1000 / 30; // ~30 fps cap

    const pulses: Pulse[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    function drawGrid(w: number, h: number) {
      if (!ctx) return;
      ctx.strokeStyle = "rgba(27, 54, 93, 0.4)"; // #1B365D at low opacity
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = 0; x <= w; x += GRID_SPACING) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= h; y += GRID_SPACING) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    }

    function render(currentTime: number) {
      animId = requestAnimationFrame(render);

      if (document.hidden) return;

      const elapsed = currentTime - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = currentTime - (elapsed % fpsInterval);

      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      drawGrid(w, h);

      if (reducedMotion) return;

      // Spawn new pulses randomly at grid intersections
      if (Math.random() > 0.92 && pulses.length < MAX_PULSES) {
        const gridX = Math.floor((Math.random() * w) / GRID_SPACING) * GRID_SPACING;
        const gridY = Math.floor((Math.random() * h) / GRID_SPACING) * GRID_SPACING;
        const axis = Math.random() > 0.5;
        pulses.push({
          x: gridX,
          y: gridY,
          dx: axis ? (Math.random() > 0.5 ? PULSE_SPEED : -PULSE_SPEED) : 0,
          dy: !axis ? (Math.random() > 0.5 ? PULSE_SPEED : -PULSE_SPEED) : 0,
          alpha: 0.6,
        });
      }

      // Draw and update pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.x += p.dx;
        p.y += p.dy;
        p.alpha -= 0.005;

        if (p.alpha <= 0 || p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
          pulses.splice(i, 1);
          continue;
        }

        // Draw traveling circuit glow (sky blue #60C1E5)
        ctx.fillStyle = `rgba(96, 193, 229, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

export default BackgroundCanvas;
