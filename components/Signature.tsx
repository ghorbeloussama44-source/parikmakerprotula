"use client";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/lib/content";

// Signature : tracé doré en temps réel (stroke-dashoffset), puis le texte se remplit
// et la signature devient le bouton de réservation.
export default function Signature() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const txt = root.current!.querySelector<SVGTextElement>("text")!;
    const len = Math.ceil(txt.getComputedTextLength() * 6) || 2000;
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) { gsap.set(txt, { fillOpacity: 1, strokeOpacity: 0 }); gsap.set(".sig-cta", { opacity: 1 }); return; }
      gsap.set(txt, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 75%", once: true } })
        .to(txt, { strokeDashoffset: 0, duration: 3.2, ease: "power1.inOut" })
        .to(txt, { fillOpacity: 1, strokeOpacity: 0.25, duration: 1 })
        .to(".sig-cta", { opacity: 1, y: 0, duration: 0.8 }, "-=0.4")
        .to(".sig-btn", { borderColor: "rgba(214,184,141,.8)", boxShadow: "0 0 50px rgba(214,184,141,.35)", duration: 0.8 }, "<");
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={root} className="relative px-6 pb-16 pt-24 text-center">
      <a href="#booking" aria-label="Записаться" className="sig-btn mx-auto block w-full max-w-xl rounded-[3rem] border border-transparent px-6 py-8 transition hover:!shadow-[0_0_70px_rgba(214,184,141,.5)]">
        <svg viewBox="0 0 640 150" className="w-full" role="img" aria-label="Юлия Горбель">
          <defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
          <text x="320" y="100" textAnchor="middle" fontSize="92" fontStyle="italic" fill="#D6B88D" stroke="#F1DCB9" strokeWidth="1.4" filter="url(#glow)"
            style={{ fontFamily: "var(--font-cormorant), serif" }}>Юля Горбель</text>
        </svg>
        <span className="sig-cta mt-2 block translate-y-3 text-sm uppercase tracking-[.4em] text-gold opacity-0">Записаться</span>
      </a>
      <p className="mt-14 text-xs text-ivory/50">Ваш стиль — моя профессия. Ваш результат — моя репутация.</p>
      <p className="mt-2 text-xs text-ivory/40">© {new Date().getFullYear()} {site.name} · {site.address} · <a href={site.instagram} className="hover:text-gold">{site.instagramHandle}</a></p>
    </footer>
  );
}
