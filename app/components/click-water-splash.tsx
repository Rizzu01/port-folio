"use client";

import { useEffect, useRef } from "react";

type Splash = {
  x: number;
  y: number;
  started: number;
  duration: number;
  droplets: { angle: number; distance: number; radius: number; delay: number }[];
  light: boolean;
};

const DURATION = 850;
const MAX_SPLASHES = 8;

/**
 * Lightweight, non-interactive canvas overlay for click / tap splashes.
 * Only draws while effects are active and never intercepts click events.
 */
export default function ClickWaterSplash() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const splashes: Splash[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;
    let ratio = 1;
    let lastPointerEvent = 0;

    const resize = () => {
      ratio = Math.min(window.devicePixelRatio || 1, 2);
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

      for (let i = splashes.length - 1; i >= 0; i--) {
        const splash = splashes[i];
        const t = Math.min((now - splash.started) / splash.duration, 1);
        if (t >= 1) {
          splashes.splice(i, 1);
          continue;
        }
        const fade = Math.pow(1 - t, 1.5);
        const ease = 1 - Math.pow(1 - t, 3);
        // Cool water-white rings stay legible on the black section, with an
        // orange center echo of the portfolio's existing accent.
        const ring = splash.light ? "236,246,255" : "79,130,157";
        const orange = "255,145,0";

        for (let ringIndex = 0; ringIndex < 2; ringIndex++) {
          const progress = Math.max(0, (t - ringIndex * 0.12) / (1 - ringIndex * 0.12));
          const radius = 12 + progress * (54 + ringIndex * 23);
          context.beginPath();
          context.arc(splash.x, splash.y, radius, 0, Math.PI * 2);
          context.strokeStyle = `rgba(${ring},${Math.max(0, 0.7 - progress) * fade})`;
          context.lineWidth = 1.7 - progress * 0.75;
          context.stroke();
        }

        for (const droplet of splash.droplets) {
          const local = Math.max(0, (t - droplet.delay) / (1 - droplet.delay));
          if (local === 0) continue;
          const travel = droplet.distance * (1 - Math.pow(1 - local, 2));
          const x = splash.x + Math.cos(droplet.angle) * travel;
          const y = splash.y + Math.sin(droplet.angle) * travel + local * local * 12;
          const alpha = Math.pow(1 - local, 1.6) * 0.9;
          context.beginPath();
          context.ellipse(x, y, droplet.radius * (1 - 0.3 * local), droplet.radius * 0.72, droplet.angle, 0, Math.PI * 2);
          context.fillStyle = `rgba(${ring},${alpha})`;
          context.fill();
        }

        context.beginPath();
        context.arc(splash.x, splash.y, 3 + ease * 12, 0, Math.PI * 2);
        context.strokeStyle = `rgba(${orange},${0.5 * fade})`;
        context.lineWidth = 1.3;
        context.stroke();
      }

      if (splashes.length) frame = window.requestAnimationFrame(draw);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (reducedMotion.matches || !event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
      lastPointerEvent = performance.now();

      const target = event.target;
      // Don't add decorative particles on inputs: focus and caret clarity matter.
      if (target instanceof Element && target.closest("input, textarea, select, [contenteditable='true']")) return;

      const dark = target instanceof Element &&
        Boolean(target.closest(".reference-experience, .contact-modal, .pinterest-lightbox"));
      const themeDark = document.documentElement.dataset.theme === "dark";
      const count = event.pointerType === "touch" ? 7 : 11;
      const droplets = Array.from({ length: count }, (_, i) => ({
        angle: i * (Math.PI * 2 / count) + Math.random() * 0.25,
        distance: 32 + Math.random() * 44,
        radius: 1.3 + Math.random() * 2.1,
        delay: Math.random() * 0.12,
      }));

      if (splashes.length >= MAX_SPLASHES) splashes.shift();
      splashes.push({
        x: event.clientX, y: event.clientY,
        started: performance.now(), duration: DURATION, droplets,
        light: dark || themeDark,
      });

      if (!frame) frame = window.requestAnimationFrame(draw);
    };

    // Avoid older synthetic pointer duplication on some browsers.
    const onMouseDown = (event: MouseEvent) => {
      if (performance.now() - lastPointerEvent < 450) return;
      onPointerDown(event as unknown as PointerEvent);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("mousedown", onMouseDown);
      if (frame) window.cancelAnimationFrame(frame);
      splashes.length = 0;
    };
  }, []);

  return <canvas ref={canvasRef} className="click-water-splash" aria-hidden="true" />;
}
