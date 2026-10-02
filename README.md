# Юлия Горбель — сайт-визитка (Next.js 15, React 19, Three.js, GSAP, Lenis)

    npm install && npm run dev      # http://localhost:3000
    npm run build && npm start

Контакты, услуги, цифры и отзывы редактируются в `lib/content.ts`.
Фото: `public/img/` (сейчас — кадры из одного портрета). Для блока «до/после» замените
`BEFORE`/`AFTER` в `components/Transformation.tsx` на реальные фото.
Форма записи: клиент выбирает услугу, дату, время и мессенджер (WhatsApp или Max); сообщение открывается в приложении. Номер WhatsApp и ссылка Max — в `lib/content.ts` (`whatsapp`, `maxUrl`).
