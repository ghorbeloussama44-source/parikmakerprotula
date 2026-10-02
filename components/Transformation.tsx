"use client";
import { useEffect, useRef, useState } from "react";
import { transformations } from "@/lib/content";

export default function Transformation() {
  const box = useRef<HTMLDivElement>(null);
  const target = useRef(0.5);
  const dragging = useRef(false);
  const [pos, setPos] = useState(0.5);
  const [idx, setIdx] = useState(0);
  const t = transformations[idx];

  useEffect(() => {
    let raf = 0, cur = 0.5;
    const loop = () => {
      cur += (target.current - cur) * 0.12;
      setPos(cur);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const setFrom = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    target.current = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
  };

  return (
    <section id="transform" className="px-6 py-28 md:px-16">
      <div className="mx-auto max-w-5xl text-center">
        <p className="eyebrow">Трансформация</p>
        <h2 className="mt-4 font-display text-4xl md:text-6xl">До и <span className="gold-text italic">после</span></h2>
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {transformations.map((x, i) => (
            <button key={x.id} onClick={() => { setIdx(i); target.current = 0.5; }}
              className={`btn !px-4 !py-2 !text-[10px] ${i === idx ? "btn-gold" : "btn-line"}`}>{x.title}</button>
          ))}
        </div>
        <div
          ref={box}
          className="relative mx-auto mt-8 aspect-[3/4] max-w-md cursor-ew-resize touch-none select-none overflow-hidden rounded-[2rem] border border-gold/30"
          onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); setFrom(e.clientX); }}
          onPointerMove={(e) => { if (dragging.current || e.pointerType === "mouse") setFrom(e.clientX); }}
          onPointerUp={() => (dragging.current = false)}
        >
          {/* eslint-disable @next/next/no-img-element */}
          <img src={t.after} alt="После" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
          <img src={t.before} alt="До" draggable={false} className="absolute inset-0 h-full w-full object-cover"
            style={{ clipPath: `inset(0 ${(1 - pos) * 100}% 0 0)` }} />
          <span className="absolute left-4 top-4 rounded-full bg-ink/60 px-3 py-1 text-[10px] uppercase tracking-[.25em] backdrop-blur">До</span>
          <span className="absolute right-4 top-4 rounded-full bg-gold/90 px-3 py-1 text-[10px] uppercase tracking-[.25em] text-ink">После</span>
          <div className="absolute inset-y-0 w-px bg-gold shadow-[0_0_20px_#D6B88D]" style={{ left: `${pos * 100}%` }}>
            <div className="absolute top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold bg-ink/70 text-gold backdrop-blur">⟷</div>
          </div>
        </div>
        <p className="mt-5 text-xs uppercase tracking-[.3em] text-gold/70">двигайте →</p>
      </div>
    </section>
  );
}
