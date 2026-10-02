"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap, hasWebGL } from "@/lib/gsap";
import { site } from "@/lib/content";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [gl, setGl] = useState<boolean | null>(null);

  useEffect(() => { setGl(hasWebGL()); }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-in", { y: 50, opacity: 0, duration: 1.4, ease: "power3.out", stagger: 0.14, delay: 0.3 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={root} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink">
      {gl === false ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/img/portrait.jpg" alt="Юлия Горбель" className="absolute right-0 top-0 h-full w-full object-cover object-top md:w-[60%]" />
      ) : (
        <div className="absolute inset-0"><HeroScene /></div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent md:via-ink/20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-16 lg:px-24">
        <p className="hero-in eyebrow mb-6">Профессиональный парикмахер</p>
        <h1 className="hero-in font-display text-[clamp(3rem,9vw,8rem)] font-normal leading-[.95] tracking-tight">
          <span className="gold-text italic">Юля</span><br />Горбель
        </h1>
        <p className="hero-in mt-8 max-w-md font-display text-2xl leading-snug md:text-3xl">
          Ваш стиль —<br /><span className="text-gold">моя профессия</span>
        </p>
        <p className="hero-in mt-5 max-w-sm text-sm text-ivory/70">
          Профессиональный стилист · {site.address}
        </p>
        <div className="hero-in pointer-events-auto mt-9 flex flex-wrap gap-3">
          <a href="#booking" className="btn btn-gold">Записаться</a>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-line">Instagram</a>
          <a href={site.vk} target="_blank" rel="noopener noreferrer" className="btn btn-line">VK</a>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[.4em] text-gold/70">листайте</div>
    </section>
  );
}
