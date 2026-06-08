const form = document.querySelector("#requestForm");
const note = document.querySelector("#formNote");

if (form && note) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      note.textContent = "Заполните телефон и согласие, чтобы мы могли ответить по заявке.";
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();

    note.textContent = `${name ? `${name}, ` : ""}заявка принята в браузере. Быстрее всего сейчас позвонить: ${phone || "+7 776 381 13 16"}.`;
    form.reset();
  });
}

const carousel = document.querySelector(".reviews-carousel");

if (carousel) {
  const viewport = carousel.querySelector(".review-viewport");
  const cards = Array.from(carousel.querySelectorAll(".review-card"));
  const previous = carousel.querySelector(".review-prev");
  const next = carousel.querySelector(".review-next");
  let activeIndex = cards.length > 1 ? 1 : 0;
  let settleTimer;

  const getNearestIndex = () => {
    if (!viewport || !cards.length) return 0;

    const viewportRect = viewport.getBoundingClientRect();
    const viewportCenter = viewportRect.left + viewportRect.width / 2;

    return cards.reduce((nearest, card, index) => {
      const rect = card.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distance = Math.abs(center - viewportCenter);
      return distance < nearest.distance ? { index, distance } : nearest;
    }, { index: 0, distance: Number.POSITIVE_INFINITY }).index;
  };

  const scrollToReview = (index, behavior = "smooth") => {
    if (!viewport || !cards.length) return;

    activeIndex = (index + cards.length) % cards.length;
    const card = cards[activeIndex];
    const viewportRect = viewport.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const delta = cardRect.left + cardRect.width / 2 - (viewportRect.left + viewportRect.width / 2);

    viewport.scrollBy({ left: delta, behavior });
  };

  previous?.addEventListener("click", () => {
    scrollToReview(getNearestIndex() - 1);
  });

  next?.addEventListener("click", () => {
    scrollToReview(getNearestIndex() + 1);
  });

  viewport?.addEventListener("scroll", () => {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => {
      activeIndex = getNearestIndex();
    }, 90);
  });

  window.addEventListener("resize", () => scrollToReview(activeIndex, "auto"));
  window.addEventListener("load", () => scrollToReview(activeIndex, "auto"));
  window.setTimeout(() => scrollToReview(activeIndex, "auto"), 80);
}
