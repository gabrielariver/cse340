const form = document.getElementById("updateForm");
const submitBtn = document.getElementById("updateBtn");

if (form && submitBtn) {
  const originalValues = {};

  form.querySelectorAll("input, textarea, select").forEach((el) => {
    if (el.name && el.type !== "hidden" && el.type !== "submit") {
      originalValues[el.name] = el.value;
    }
  });

  form.addEventListener("input", () => {
    let hasChanges = false;

    for (const name in originalValues) {
      const field = form.querySelector(`[name="${name}"]`);
      if (field && field.value !== originalValues[name]) {
        hasChanges = true;
        break;
      }
    }

    submitBtn.disabled = !hasChanges;
  });
}
