"use client";
import { useEffect, useRef, useState } from "react";

// Curseur → la couleur « apparaît » progressivement. Démo avec la photo disponible :
// remplacer /img/portrait.jpg par de vraies photos avant/après dans AFTER / BEFORE.
const BEFORE = "/img/portrait.jpg";
const AFTER = "/img/portrait.jpg";

export default function Transformation() {
  const box = useRef<HTMLDivElement>(null);
  const target = useRef(0.5);
  const [pos, setPos] = useState(0.5);
  const dragging = useRef(false);

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
        <h2 className="mt-4 font-display text-4xl md:text-6xl">Образ, который подчеркнёт <span className="gold-text italic">вашу уникальность</span></h2>
        <div
          ref={box}
          className="relative mx-auto mt-14 aspect-[4/3] max-w-3xl cursor-ew-resize touch-none select-none overflow-hidden rounded-[2rem] border border-gold/30"
          onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); setFrom(e.clientX); }}
          onPointerMove={(e) => { if (dragging.current || e.pointerType === "mouse") setFrom(e.clientX); }}
          onPointerUp={() => (dragging.current = false)}
        >
          {/* eslint-disable @next/next/no-img-element */}
          <img src={AFTER} alt="После" draggable={false} className="absolute inset-0 h-full w-full object-cover object-[50%_25%]" />
          <img
            src={BEFORE} alt="До" draggable={false}
            className="absolute inset-0 h-full w-full object-cover object-[50%_25%]"
            style={{ filter: "grayscale(1) contrast(.85) brightness(.8)", clipPath: `inset(0 ${(1 - pos) * 100}% 0 0)` }}
          />
          <span className="absolute left-4 top-4 rounded-full bg-ink/60 px-3 py-1 text-[10px] uppercase tracking-[.25em] backdrop-blur">До</span>
          <span className="absolute right-4 top-4 rounded-full bg-gold/90 px-3 py-1 text-[10px] uppercase tracking-[.25em] text-ink">После</span>
          <div className="absolute inset-y-0 w-px bg-gold shadow-[0_0_20px_#D6B88D]" style={{ left: `${pos * 100}%` }}>
            <div className="absolute top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold bg-ink/70 text-gold backdrop-blur">⟷</div>
          </div>
        </div>
        <p className="mt-5 text-xs uppercase tracking-[.3em] text-gold/70">drag →</p>
      </div>
    </section>
  );
}
