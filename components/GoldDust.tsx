"use client";
import { useEffect, useRef } from "react";

// Poussière dorée en canvas 2D (léger) : évite un 2e contexte WebGL sur mobile.
export default function GoldDust({ count = 70 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!, g = cv.getContext("2d");
    if (!g) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, raf = 0, visible = true;
    const P = Array.from({ length: count }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.8, v: 0.02 + Math.random() * 0.05, s: Math.random() * 6 }));

    const size = () => { w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const draw = (t: number) => {
      g.clearRect(0, 0, w, h);
      for (const p of P) {
        if (!still) p.y -= p.v / 60;
        if (p.y < -0.02) p.y = 1.02;
        const x = p.x * w + Math.sin(t / 2000 + p.s) * 10, y = p.y * h;
        const grad = g.createRadialGradient(x, y, 0, x, y, p.r * 4);
        grad.addColorStop(0, "rgba(255,236,200,.9)"); grad.addColorStop(0.4, "rgba(214,184,141,.35)"); grad.addColorStop(1, "rgba(214,184,141,0)");
        g.fillStyle = grad; g.beginPath(); g.arc(x, y, p.r * 4, 0, 6.283); g.fill();
      }
    };
    const loop = (t: number) => { if (visible && !document.hidden) draw(t); raf = requestAnimationFrame(loop); };
    size(); draw(0);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(cv);
    addEventListener("resize", size);
    if (!still) raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener("resize", size); };
  }, [count]);

  return <canvas ref={ref} className="h-full w-full" aria-hidden />;
}
