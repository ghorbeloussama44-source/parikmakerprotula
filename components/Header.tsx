import { site } from "@/lib/content";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 md:px-12 bg-gradient-to-b from-ink/80 to-transparent">
      <a href="#top" className="font-script italic text-2xl text-gold">Юлия Горбель</a>
      <nav className="hidden gap-8 text-xs uppercase tracking-[.2em] text-ivory/70 md:flex">
        <a href="#services" className="hover:text-gold">Услуги</a>
        <a href="#transform" className="hover:text-gold">Результат</a>
        <a href="#gallery" className="hover:text-gold">Галерея</a>
        <a href="#about" className="hover:text-gold">Обо мне</a>
        <a href="#reviews" className="hover:text-gold">Отзывы</a>
      </nav>
      <div className="flex items-center gap-3">
        <a href={site.phoneCallHref} className="hidden text-sm text-ivory/80 lg:block">{site.phoneCall}</a>
        <a href="#booking" className="btn btn-gold !px-5 !py-2.5">Записаться</a>
      </div>
    </header>
  );
}
