# Юлия Горбель — сайт-визитка (Next.js 15, React 19, Three.js, GSAP, Lenis)

    npm install && npm run dev      # http://localhost:3000
    npm run build && npm start

Контакты, услуги, цифры и отзывы редактируются в `lib/content.ts`.
Фото: `public/img/` (сейчас — кадры из одного портрета). Для блока «до/после» замените
`BEFORE`/`AFTER` в `components/Transformation.tsx` на реальные фото.
Форма записи не имеет сервера: формирует текст заявки, копирует его и предлагает позвонить / написать в VK.
