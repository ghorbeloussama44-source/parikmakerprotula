"use client";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

import { site } from "@/lib/content";

const lines = [site.experience, site.role, site.motto + "."];
const why = [
  "Индивидуальный подход к каждому клиенту",
  "Современные техники и профессиональные материалы",
  "Внимание к деталям и качественный результат",
  "Комфортная и дружелюбная атмосфера",
];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray<HTMLElement>(".ch");
      if (prefersReducedMotion()) { gsap.set(chars, { opacity: 1 }); return; }
      gsap.to(chars, {
        opacity: 1, stagger: 0.04, ease: "none",
        scrollTrigger: { trigger: ".about-pin", start: "top top", end: "+=180%", scrub: 0.6, pin: true },
      });
      gsap.fromTo(".about-bg", { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={root}>
      <div className="about-pin relative h-screen overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/portrait.jpg" alt="Юлия Горбель" className="about-bg absolute inset-0 h-full w-full object-cover object-[50%_20%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/20" />
        <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-16 lg:px-24">
          <p className="eyebrow mb-3">Обо мне</p>
          <p className="mb-8 text-sm text-ivory/70">{site.fullName}</p>
          {lines.map((l) => (
            <p key={l} className="font-display text-[clamp(2rem,6vw,5rem)] leading-[1.1]" aria-label={l}>
              {l.split("").map((c, i) => <span key={i} aria-hidden className="ch gold-text" style={{ opacity: 0.08, whiteSpace: "pre" }}>{c}</span>)}
            </p>
          ))}
          <ul className="mt-10 max-w-md space-y-2 text-sm text-ivory/75">
            {why.map((w) => <li key={w}><span className="text-gold">✔</span> {w}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
