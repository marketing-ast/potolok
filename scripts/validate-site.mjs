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
  "privacy/index.html",
  "personal-data/index.html",
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
  contactsRedirect: read("contacts.html"),
  privacyRedirect: read("privacy.html"),
  personalDataRedirect: read("personal-data.html"),
  privacy: read("privacy/index.html"),
  personalData: read("personal-data/index.html")
};
const css = read("assets/css/styles.css");
const js = read("assets/js/main.js");

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
  "отказ от уведомлений о новых продуктах и услугах и специальных предложениях",
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
  "Потолок<br><span class=\"nowrap\">от 2х дней</span>",
  "Быстро. Ровно.<br>Доступно",
  "Отзывы",
  "Называем цену и сроки сразу",
  "Оставьте номер, свяжемся в ближайшее рабочее время. Если не свяжемся быстро, с нас скидка.",
  "reviews-carousel",
  "review-controls",
  "review-viewport",
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
  "за 1 день",
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

const linkTargets = ["#request", "privacy/", "personal-data/"];
for (const target of linkTargets) {
  if (!pages.index.includes(`href="${target}"`)) {
    fail(`Index page must link to ${target}`);
  }
}

const outdatedIndexLinks = ["contacts.html", "privacy.html", "personal-data.html"];
for (const target of outdatedIndexLinks) {
  if (pages.index.includes(`href="${target}"`)) {
    fail(`Index page must not link to old ${target} URL.`);
  }
}

if (!pages.contactsRedirect.includes("url=index.html#request")) {
  fail("Old contacts.html must redirect to the request/contact block.");
}

if (!pages.privacyRedirect.includes("url=privacy/") || !pages.personalDataRedirect.includes("url=personal-data/")) {
  fail("Old legal .html pages must redirect to clean URL pages.");
}

const styleMarkers = ["scroll-snap-type: x mandatory", "-webkit-overflow-scrolling: touch", "border: 3px solid"];
for (const marker of styleMarkers) {
  if (!css.includes(marker)) {
    fail(`Missing mobile-first review style marker: ${marker}`);
  }
}

const scriptMarkers = ["scrollToReview", "getNearestIndex", "viewport.scrollBy"];
for (const marker of scriptMarkers) {
  if (!js.includes(marker)) {
    fail(`Missing review carousel behavior marker: ${marker}`);
  }
}

if (/(action=["']https?:|fetch\(|XMLHttpRequest)/i.test(pages.index + js)) {
  fail("The static request form must not send data to a backend.");
}

console.log("Site validation passed.");
