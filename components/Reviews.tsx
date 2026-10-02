import { reviews } from "@/lib/content";

export default function Reviews() {
  return (
    <section id="reviews" className="relative overflow-hidden px-6 py-28 md:px-16">
      <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-gold/20 blur-[120px]" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-gold/10 blur-[120px]" />
      <div className="relative mx-auto max-w-6xl">
        <p className="eyebrow">Отзывы</p>
        <h2 className="mt-4 font-display text-4xl md:text-6xl">Говорят <span className="gold-text italic">клиенты</span></h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <figure key={i} className="glass rounded-3xl p-8 transition-transform duration-500 hover:-translate-y-2">
              <div className="text-gold" aria-label="5 из 5">★★★★★</div>
              <blockquote className="mt-5 font-display text-lg leading-relaxed text-ivory/90">«{r.text}»</blockquote>
              <figcaption className="mt-6 text-xs uppercase tracking-[.25em] text-gold/80">{r.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
