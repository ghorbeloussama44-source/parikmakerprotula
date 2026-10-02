"use client";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { services } from "@/lib/content";

const icons: Record<string, React.ReactNode> = {
  "Стрижки": <><circle cx="8" cy="8" r="3" /><circle cx="8" cy="20" r="3" /><path d="M10.5 10 28 24M10.5 18 28 6" /></>,
  "Окрашивание": <path d="M16 3c5 6 8 10 8 14a8 8 0 0 1-16 0c0-4 3-8 8-14Z" />,
  "Завивка и кератин": <path d="M16 3c1 7 3 9 10 10-7 1-9 3-10 10-1-7-3-9-10-10 7-1 9-3 10-10Z" />,
  "Праздничные прически": <path d="M4 24 6 10l6 6 4-9 4 9 6-6 2 14Z M4 28h24" />,
};

export default function Services() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".svc-card", {
        rotationX: -55, z: -400, y: 120, opacity: 0, transformOrigin: "50% 100%",
        stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: ".svc-grid", start: "top 85%", end: "top 25%", scrub: 0.8 },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const tilt = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el.querySelector(".svc-inner"), { rotationY: px * 14, rotationX: -py * 14, duration: 0.4, ease: "power2.out" });
  };
  const untilt = (e: React.PointerEvent<HTMLDivElement>) =>
    gsap.to(e.currentTarget.querySelector(".svc-inner"), { rotationY: 0, rotationX: 0, duration: 0.6 });

  return (
    <section id="services" ref={root} className="relative px-6 py-28 md:px-16">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow">Услуги</p>
        <h2 className="mt-4 max-w-2xl font-display text-4xl md:text-6xl">Профессиональный подход <span className="gold-text italic">к красоте</span></h2>
        <div className="svc-grid mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" style={{ perspective: 1200 }}>
          {services.map((s) => (
            <div key={s.title} className="svc-card" onPointerMove={tilt} onPointerLeave={untilt}>
              <div className="svc-inner glass h-full rounded-3xl p-7" style={{ transformStyle: "preserve-3d" }}>
                <div className="grid h-16 w-16 place-items-center rounded-full border border-gold/50" style={{ transform: "translateZ(40px)" }}>
                  <svg viewBox="0 0 32 32" className="h-8 w-8 fill-none stroke-gold" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">{icons[s.title]}</svg>
                </div>
                <h3 className="mt-6 font-display text-2xl" style={{ transform: "translateZ(30px)" }}>{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/70">{s.text}</p>
                <ul className="mt-5 space-y-1.5 text-sm text-gold">
                  {s.items.map((i) => <li key={i}>— {i}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
