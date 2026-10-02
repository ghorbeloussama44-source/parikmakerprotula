// Toutes les infos éditables du site sont ici.
export const site = {
  name: "Юлия Горбель",
  phoneMax: "8 (995) 442-47-12",
  phoneMaxHref: "tel:+79954424712",
  phoneCall: "8 (991) 529-25-42",
  phoneCallHref: "tel:+79915292542",
  address: "пр. Ленина, 127а, офис 221",
  vk: "https://vk.ru/id1119607697",
  instagram: "https://instagram.com/yulia.gorbel",
  instagramHandle: "@yulia.gorbel",
  // Номер для WhatsApp (формат без +). Проверьте — взят номер из Max.
  whatsapp: "79954424712",
  // Ссылка на чат Max мастера. Если есть личная ссылка вида https://max.ru/u/..., вставьте сюда.
  maxUrl: "https://max.ru",
};

export const services = [
  { icon: "✂", title: "Стрижки", text: "Женские, мужские и детские стрижки с индивидуальным подходом.", items: ["Женские", "Мужские", "Детские"] },
  { icon: "◈", title: "Окрашивание", text: "Окрашивание любой сложности, современные техники и профессиональные материалы.", items: ["Любой сложности", "Локоны", "Химическая завивка"] },
  { icon: "✦", title: "Восстановление", text: "Глубокий уход и восстановление структуры волос.", items: ["Ботокс волос", "Кератиновое выпрямление"] },
  { icon: "♛", title: "Образы и прически", text: "Свадебные и вечерние прически, укладки, плетение кос.", items: ["Свадебные", "Вечерние", "Косы"] },
];

export const extras = ["Архитектура бровей", "Оформление бороды"];

export const bookingServices = [
  "Женская стрижка", "Мужская стрижка", "Детская стрижка", "Окрашивание",
  "Свадебная причёска", "Вечерняя причёска / укладка", "Локоны / плетение кос",
  "Химическая завивка", "Ботокс волос", "Кератиновое выпрямление",
  "Архитектура бровей", "Оформление бороды",
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

// ВНИМАНИЕ: цифры и отзывы ниже — черновик из концепции. Замените на реальные.
export const stats = [
  { value: "15 лет", label: "опыта" },
  { value: "5000+", label: "довольных клиентов" },
  { value: "Проф.", label: "образование и обучение" },
];

export const reviews = [
  { name: "Клиентка", text: "Текст отзыва — замените на реальный отзыв клиента." },
  { name: "Клиентка", text: "Текст отзыва — замените на реальный отзыв клиента." },
  { name: "Клиент", text: "Текст отзыва — замените на реальный отзыв клиента." },
];
