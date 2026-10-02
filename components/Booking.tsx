"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { hasWebGL } from "@/lib/gsap";
import { bookingServices, site, timeSlots } from "@/lib/content";

const BookingScene = dynamic(() => import("./BookingScene"), { ssr: false });

export default function Booking() {
  const [gl, setGl] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  useEffect(() => { setGl(hasWebGL()); }, []);

  const [channel, setChannel] = useState<"whatsapp" | "max">("whatsapp");

  // Pas de backend : la demande est préparée ici (écran noir du site), puis le client ouvre l'app choisie
  // via un bouton (pas d'onglet blanc qui s'ouvre tout seul).
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const date = f.get("date") ? new Date(String(f.get("date"))).toLocaleDateString("ru-RU") : "—";
    const msg = `Здравствуйте! Хочу записаться.\nИмя: ${f.get("name")}\nТелефон: ${f.get("phone")}\nУслуга: ${f.get("service")}\nДата: ${date}\nВремя: ${f.get("time")}`;
    setDone(msg);
    // Max n'accepte pas de texte pré-rempli : on copie la заявка, le client la colle dans le chat.
    if (channel === "max") navigator.clipboard?.writeText(msg).catch(() => {});
  };

  return (
    <section id="booking" className="relative overflow-hidden px-6 py-28 md:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(214,184,141,.14),transparent_60%)]" />
      {gl && <div className="pointer-events-none absolute inset-0"><BookingScene /></div>}
      <div className="relative mx-auto max-w-2xl">
        <p className="eyebrow text-center">Запись</p>
        <h2 className="mt-4 text-center font-display text-4xl md:text-6xl">Запишитесь <span className="gold-text italic">на консультацию</span></h2>
        <p className="mt-4 text-center text-sm text-ivory/65">Создадим образ, который подчеркнёт вашу уникальность</p>

        <div className="glass mt-12 rounded-[2rem] p-8 md:p-12">
          {done ? (
            <div className="text-center">
              <p className="font-display text-2xl text-gold">Заявка готова</p>
              <p className="mt-3 text-sm text-ivory/70">{channel === "whatsapp" ? "Нажмите кнопку ниже — WhatsApp откроется с готовым сообщением." : "Текст скопирован. Нажмите кнопку, откройте чат Max и вставьте его."} Мастер подтвердит время записи.</p>
              <pre className="mt-6 whitespace-pre-wrap rounded-2xl bg-ink/50 p-4 text-left text-sm text-ivory/80">{done}</pre>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a className="btn btn-gold" href={channel === "whatsapp" ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(done)}` : site.maxUrl} target="_blank" rel="noopener noreferrer">{channel === "whatsapp" ? "Открыть WhatsApp" : "Открыть Max"}</a>
                <a className="btn btn-line" href={site.phoneMaxHref}>Позвонить</a>
                <a className="btn btn-line" href={site.vk} target="_blank" rel="noopener noreferrer">Написать в VK</a>
              </div>
              <button className="mt-6 text-xs uppercase tracking-[.25em] text-gold/70" onClick={() => setDone(null)}>Изменить</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-6">
              <label className="block text-xs uppercase tracking-[.25em] text-gold/80">Имя<input name="name" required autoComplete="name" /></label>
              <label className="block text-xs uppercase tracking-[.25em] text-gold/80">Телефон<input name="phone" type="tel" required autoComplete="tel" placeholder="+7" /></label>
              <label className="block text-xs uppercase tracking-[.25em] text-gold/80">Услуга
                <select name="service" required defaultValue="">
                  <option value="" disabled>Выберите услугу</option>
                  {bookingServices.map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-6">
                <label className="block text-xs uppercase tracking-[.25em] text-gold/80">Дата<input name="date" type="date" required min={new Date().toISOString().slice(0, 10)} /></label>
                <label className="block text-xs uppercase tracking-[.25em] text-gold/80">Время
                  <select name="time" required defaultValue="">
                    <option value="" disabled>—</option>
                    {timeSlots.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </label>
              </div>
              <fieldset>
                <legend className="text-xs uppercase tracking-[.25em] text-gold/80">Отправить заявку через</legend>
                <div className="mt-3 flex gap-3">
                  {(["whatsapp", "max"] as const).map((c) => (
                    <button type="button" key={c} onClick={() => setChannel(c)} aria-pressed={channel === c}
                      className={`btn flex-1 !text-[11px] ${channel === c ? "btn-gold" : "btn-line"}`}>{c === "whatsapp" ? "WhatsApp" : "Max"}</button>
                  ))}
                </div>
              </fieldset>
              <button className="btn btn-gold w-full">Записаться</button>
            </form>
          )}
        </div>
        <div className="mt-10 space-y-1 text-center text-sm text-ivory/70">
          <p>Макс: <a className="text-gold" href={site.phoneMaxHref}>{site.phoneMax}</a> · Звонки: <a className="text-gold" href={site.phoneCallHref}>{site.phoneCall}</a></p>
          <p>{site.address}</p>
        </div>
      </div>
    </section>
  );
}
