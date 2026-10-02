"use client";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { gallery } from "@/lib/content";

// Mur flottant : les images avancent en profondeur pendant le scroll (GSAP ScrollTrigger, transforms 3D).
const slots = [
  [-34, -22], [28, -26], [-8, 4], [36, 10], [-38, 24], [12, 28], [-22, -2], [4, -30],
];

export default function Gallery() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tiles = gsap.utils.toArray<HTMLElement>(".g-tile");
      if (prefersReducedMotion()) { gsap.set(tiles, { z: 0, opacity: 1 }); return; }
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "+=250%", scrub: 1, pin: true } });
      tiles.forEach((t, i) => {
        tl.fromTo(t, { z: -2600, opacity: 0 }, { z: 500, opacity: 1, ease: "none", duration: 1 }, i * 0.28)
          .to(t, { opacity: 0, duration: 0.15 }, i * 0.28 + 0.85);
      });
      gsap.fromTo(".g-title", { opacity: 1 }, { opacity: 0.12, scrollTrigger: { trigger: root.current, start: "top top", end: "+=60%", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="gallery" ref={root} className="relative h-screen overflow-hidden" style={{ perspective: 900 }}>
      <div className="g-title pointer-events-none absolute inset-0 z-10 grid place-items-center text-center">
        <div>
          <p className="eyebrow">Галерея</p>
          <h2 className="mt-4 font-display text-5xl md:text-7xl">Работы <span className="gold-text italic">мастера</span></h2>
        </div>
      </div>
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        {gallery.map((src, i) => (
          <div key={i} className="g-tile absolute left-1/2 top-1/2 h-[42vh] w-[26vh] md:h-[46vh] md:w-[30vh] overflow-hidden rounded-2xl border border-gold/30 shadow-[0_0_60px_rgba(214,184,141,.15)]"
            style={{ marginLeft: `calc(${slots[i][0]}vw - 13vh)`, marginTop: `calc(${slots[i][1]}vh - 21vh)`, opacity: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
          </div>
        ))}
      </div>
    </section>
  );
}
