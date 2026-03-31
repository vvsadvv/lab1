const bcrypt = require("bcryptjs");
const { User, Page, sequelize } = require("../models");

const defaultPages = [
  {
    slug: "home",
    title: "Кафе Aroma Lane",
    summary: "Уютное кафе для завтраков, кофе и встреч в центре города.",
    content:
      "Aroma Lane - это атмосферное кафе с авторскими напитками, сезонной кухней и живыми вечерами по пятницам.",
    pageType: "home",
    menuLabel: "Главная",
    menuOrder: 1,
    showInMenu: true,
    isPublished: true,
    isSystem: true,
    extraData: JSON.stringify({
      highlightList: [
        "Свежая выпечка каждое утро",
        "Бизнес-ланчи по будням с 12:00 до 16:00",
        "Авторская кофейная карта",
      ],
      videoUrl: "https://www.youtube.com/embed/R2M0nRY7rSc",
    }),
  },
  {
    slug: "contacts",
    title: "Контакты",
    summary: "Как нас найти и когда мы работаем.",
    content:
      "Мы находимся в центре города, в 5 минутах от метро. Бронируйте столик заранее в выходные дни.",
    pageType: "contacts",
    menuLabel: "Контакты",
    menuOrder: 2,
    showInMenu: true,
    isPublished: true,
    isSystem: true,
    extraData: JSON.stringify({
      rows: [
        ["Адрес", "г. Москва, ул. Примерная, 10"],
        ["Телефон", "+7 (495) 123-45-67"],
        ["Email", "hello@aromalane.ru"],
        ["Пн-Пт", "08:00 - 22:00"],
        ["Сб-Вс", "09:00 - 23:00"],
      ],
    }),
  },
  {
    slug: "gallery",
    title: "Фотогалерея",
    summary: "Интерьер, кухня и атмосфера нашего кафе.",
    content:
      "Небольшой взгляд на наш интерьер, блюда и вечерние мероприятия. Больше фото в наших соцсетях.",
    pageType: "gallery",
    menuLabel: "Фотогалерея",
    menuOrder: 3,
    showInMenu: true,
    isPublished: true,
    isSystem: true,
    extraData: JSON.stringify({
      images: [
        "/gallery/photos/interior-1.jpg",
        "/gallery/photos/interior-2.jpg",
        "/gallery/photos/interior-3.jpg",
        "/gallery/photos/coffee-1.jpg",
        "/gallery/photos/coffee-2.jpg",
        "/gallery/photos/coffee-3.jpg",
      ],
    }),
  },
  {
    slug: "feedback",
    title: "Обратная связь",
    summary: "Оставьте отзыв или задайте вопрос.",
    content:
      "Нам важно ваше мнение. Заполните форму, и мы ответим в ближайшее время на указанную почту.",
    pageType: "feedback",
    menuLabel: "Обратная связь",
    menuOrder: 4,
    showInMenu: true,
    isPublished: true,
    isSystem: true,
    extraData: JSON.stringify({
      placeholderTopic: "Например: хотим забронировать столик на пятницу",
    }),
  },
];

const ensureAdminUser = async () => {
  const user = await User.findOne({ where: { username: "admin" } });
  if (user) {
    if (user.role !== "admin") {
      await user.update({ role: "admin" });
    }
    return;
  }

  const passwordHash = await bcrypt.hash("admin123", 10);
  await User.create({
    username: "admin",
    passwordHash,
    role: "admin",
  });
};

const ensureDefaultPages = async () => {
  for (const page of defaultPages) {
    const existingPage = await Page.findOne({ where: { slug: page.slug } });
    if (!existingPage) {
      await Page.create(page);
      continue;
    }

    if (existingPage.slug === "gallery" && existingPage.isSystem) {
      let currentImages = [];
      try {
        currentImages = JSON.parse(existingPage.extraData || "{}").images || [];
      } catch (error) {
        currentImages = [];
      }

      const hasOldRemoteImages = currentImages.some((image) =>
        String(image).includes("unsplash.com")
      );
      const hasLegacySvgImages = currentImages.some((image) =>
        String(image).toLowerCase().endsWith(".svg")
      );

      if (hasOldRemoteImages || hasLegacySvgImages || currentImages.length === 0) {
        await existingPage.update({
          extraData: page.extraData,
        });
      }
    }
  }
};

const initializeDatabase = async () => {
  if (typeof sequelize.ensureDatabaseExists === "function") {
    await sequelize.ensureDatabaseExists();
  }
  await sequelize.sync();
  await ensureAdminUser();
  await ensureDefaultPages();
};

module.exports = {
  initializeDatabase,
};
