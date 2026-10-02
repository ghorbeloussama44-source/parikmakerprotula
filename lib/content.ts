// Toutes les infos éditables du site sont ici.
export const site = {
  name: "Юлия Горбель",
  fullName: "Горбель Юлия Александровна",
  role: "Парикмахер-модельер",
  experience: "Стаж более 20 лет",
  motto: "С любовью к каждой пряди",
  phoneMax: "8 (995) 442-47-12",
  phoneMaxHref: "tel:+79954424712",
  phoneCall: "8 (991) 529-25-42",
  phoneCallHref: "tel:+79915292542",
  address: "пр. Ленина, 127а, офис 221",
  vk: "https://vk.ru/id1119607697",
  instagram: "https://instagram.com/yulia.gorbel",
  instagramHandle: "@yulia.gorbel",
  // Номер для WhatsApp (формат без +). Временный номер — заменить при необходимости.
  whatsapp: "79066291334",
  // Личная ссылка на профиль Юлии в Max (временная — заменить при необходимости).
  maxUrl: "https://max.ru/u/f9LHodD0cOIXb-E8Ut4IUglBv60T5tvZjXq21qtTRvgF7EUzT1195lbzNnU",
};

export const services = [
  { title: "Стрижки", text: "Стрижки для всех, любой сложности. Уверенная работа с детьми.", items: ["Для всех", "Любой сложности", "Детские"] },
  { title: "Окрашивание", text: "Сложные окрашивания с внимательным подходом к каждой пряди.", items: ["Сложные окрашивания"] },
  { title: "Завивка и кератин", text: "Химическая и кератиновая завивка, кератиновое выпрямление волос.", items: ["Химическая завивка", "Кератиновая завивка", "Кератиновое выпрямление"] },
  { title: "Праздничные прически", text: "Любые праздничные прически для особенного дня.", items: ["Любые праздничные"] },
];

export const bookingServices = [
  "Стрижка", "Детская стрижка", "Сложное окрашивание",
  "Химическая завивка", "Кератиновая завивка", "Кератиновое выпрямление",
  "Праздничная причёска",
];

export const transformations = [
  { id: "balayage", title: "Пепельный блонд · балаяж", before: "/img/balayage-before.jpg", after: "/img/balayage-after.jpg" },
  { id: "pixie", title: "Пикси с андеркатом · цвет", before: "/img/pixie-before.jpg", after: "/img/pixie-after.jpg" },
  { id: "fade", title: "Стрижка фейд · дизайн", before: "/img/fade-before.jpg", after: "/img/fade-after.jpg" },
];

export const gallery = [
  "balayage-after", "pixie-after", "fade-after", "g-hair", "balayage-before", "g-face", "pixie-before", "g-wave",
].map((n) => `/img/${n}.jpg`);

export const timeSlots = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];
