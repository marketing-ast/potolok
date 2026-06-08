import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const read = (file) => readFileSync(path.join(root, file), "utf8");
const fail = (message) => {
  throw new Error(message);
};

const files = [
  "index.html",
  "contacts.html",
  "privacy.html",
  "personal-data.html",
  "assets/css/styles.css",
  "assets/js/main.js",
  "docs/reference/behance-landing-reference.md"
];

for (const file of files) {
  if (!existsSync(path.join(root, file))) {
    fail(`Missing required file: ${file}`);
  }
}

const pages = {
  index: read("index.html"),
  contacts: read("contacts.html"),
  privacy: read("privacy.html"),
  personalData: read("personal-data.html")
};

const combined = Object.values(pages).join("\n").toLowerCase();

const requiredFragments = [
  "ип bakha potolok",
  "алматинская обл",
  "тулпар, 3",
  "+7 776 381 13 16",
  "bakhapotolok@gmail.com",
  "12 месяцев",
  "политика конфиденциальности",
  "обработка персональных данных",
  "уведомлен",
  "отказ",
  "заявк",
  "натяжн",
  "доступно"
];

for (const fragment of requiredFragments) {
  if (!combined.includes(fragment)) {
    fail(`Missing required content fragment: ${fragment}`);
  }
}

const mustInclude = [
  "Потолок<br>за 1 день",
  "Быстро. Ровно.<br>Доступно",
  "Отзывы",
  "Называем цену и сроки сразу",
  "Оставьте номер, свяжемся в ближайшее рабочее время. Если не свяжемся быстро, с нас скидка.",
  "reviews-carousel",
  "review-track",
  "review-button"
];

for (const marker of mustInclude) {
  if (!pages.index.includes(marker)) {
    fail(`Missing updated landing content: ${marker}`);
  }
}

const mustNotInclude = [
  "КАЗАХСТАН",
  "Говорят просто",
  "Посчитаем ваш потолок",
  "Пока форма работает как заглушка",
  "Жанна",
  "Олег",
  "Айгуль",
  "Сергей",
  "Айдана",
  "Нурлан",
  "Мадина",
  "Ермек"
];

for (const marker of mustNotInclude) {
  if (pages.index.includes(marker)) {
    fail(`Outdated content still present: ${marker}`);
  }
}

const linkTargets = ["contacts.html", "privacy.html", "personal-data.html"];
for (const target of linkTargets) {
  if (!pages.index.includes(`href="${target}"`)) {
    fail(`Index page must link to ${target}`);
  }
}

if (/(action=["']https?:|fetch\(|XMLHttpRequest)/i.test(pages.index + read("assets/js/main.js"))) {
  fail("The static request form must not send data to a backend.");
}

console.log("Site validation passed.");
