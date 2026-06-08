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
  const track = carousel.querySelector(".review-track");
  const cards = Array.from(carousel.querySelectorAll(".review-card"));
  const previous = carousel.querySelector(".review-prev");
  const next = carousel.querySelector(".review-next");
  let activeIndex = 1;
  let autoplayId;

  const px = (value) => Number(String(value).replace("px", "")) || 0;

  const cardStep = () => {
    const first = cards[0];
    if (!first) return 0;
    const gap = px(getComputedStyle(track).gap);
    return first.getBoundingClientRect().width + gap;
  };

  const centerOffset = () => {
    const first = cards[0];
    if (!first) return 0;
    const gap = px(getComputedStyle(track).gap);
    const cardWidth = first.getBoundingClientRect().width;
    const pageWidth = document.documentElement.clientWidth;
    const visibleCount = pageWidth <= 640 ? 1 : 2;
    const viewport = carousel.querySelector(".review-viewport");
    const targetLeft = (pageWidth - cardWidth * visibleCount - gap * (visibleCount - 1)) / 2;
    return targetLeft - viewport.getBoundingClientRect().left;
  };

  const render = () => {
    track.style.transform = `translateX(${centerOffset() - activeIndex * cardStep()}px)`;
  };

  const go = (direction) => {
    activeIndex += direction;
    if (activeIndex >= cards.length - 1) activeIndex = 1;
    if (activeIndex <= 0) activeIndex = cards.length - 2;
    render();
  };

  const restartAutoplay = () => {
    window.clearInterval(autoplayId);
    autoplayId = window.setInterval(() => go(1), 5200);
  };

  previous?.addEventListener("click", () => {
    go(-1);
    restartAutoplay();
  });

  next?.addEventListener("click", () => {
    go(1);
    restartAutoplay();
  });

  window.addEventListener("resize", render);
  window.addEventListener("load", render);
  render();
  window.setTimeout(render, 80);
  window.setTimeout(render, 350);
  restartAutoplay();
}
