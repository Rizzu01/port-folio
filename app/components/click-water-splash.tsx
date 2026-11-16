"use client";

import { useEffect, useRef } from "react";

type Ripple = { x: number; y: number; started: number };
const DURATION = 850;
const MAX_RIPPLES = 8;

/** Orange click ripples without droplets or pointer interception. */
export default function ClickWaterSplash() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ripples: Ripple[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (now: number) => {
      frame = 0;
      context.clearRect(0, 0, width, height);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        const t = Math.min((now - ripple.started) / DURATION, 1);
        if (t >= 1) {
          ripples.splice(i, 1);
          continue;
        }

        for (let ringIndex = 0; ringIndex < 2; ringIndex++) {
          const progress = Math.max(0, (t - ringIndex * 0.13) / (1 - ringIndex * 0.13));
          const eased = 1 - Math.pow(1 - progress, 3);
          const radius = 8 + eased * (52 + ringIndex * 24);
          const alpha = Math.pow(1 - progress, 1.4) * (ringIndex === 0 ? 0.78 : 0.5);
          context.beginPath();
          context.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
          context.strokeStyle = `rgba(255,145,0,${alpha})`;
          context.lineWidth = 2 - eased * 0.7;
          context.stroke();
        }
      }

      if (ripples.length) frame = window.requestAnimationFrame(draw);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (reducedMotion.matches || !event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
      const target = event.target;
      if (target instanceof Element && target.closest("input, textarea, select, [contenteditable='true']")) return;

      if (ripples.length >= MAX_RIPPLES) ripples.shift();
      ripples.push({ x: event.clientX, y: event.clientY, started: performance.now() });
      if (!frame) frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown);
      if (frame) window.cancelAnimationFrame(frame);
      ripples.length = 0;
    };
  }, []);

  return <canvas ref={canvasRef} className="click-water-splash" aria-hidden="true" />;
}
