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

    note.textContent = `${name ? `${name}, ` : ""}заявка подготовлена. Сейчас быстрее позвонить: ${phone || "+7 776 381 13 16"}.`;
    form.reset();
  });
}
