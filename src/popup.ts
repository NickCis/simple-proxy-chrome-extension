function validateProxy(proxy) {
  try {
    const url = new URL(proxy);
  } catch (e) {
    return false;
  }
  return true;
}

function update(form, checked, proxy) {
  form.enabled.checked = checked;
  form.proxy.value = proxy;
  form.proxy.disabled = !checked;
  form.querySelector('[data-id="save-button"]').disabled = !checked;

  const valid = !checked || !proxy || validateProxy(proxy);
  form
    .querySelector('[data-id="proxy-title"]')
    .classList[valid ? "remove" : "add"]("text-destructive");
  form
    .querySelector('[data-id="proxy-error-message"]')
    .classList[valid ? "add" : "remove"]("hidden");
}

window.addEventListener("load", async () => {
  const form = document.querySelector("form");
  const data = await chrome.storage.session.get(["enabled", "proxy"]);

  update(form, Boolean(data.enabled), data.proxy || "");

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const enabled = form.enabled.checked;
    const proxy = form.proxy.value;
    const valid = validateProxy(proxy);
    if (!enabled || valid)
      await chrome.storage.session.set({
        enabled,
        proxy: valid ? proxy : "",
      });
  });

  form.enabled.addEventListener("change", async (ev) => {
    const enabled = ev.target.checked;
    update(form, enabled, form.proxy.value);

    if (!enabled)
      await chrome.storage.session.set({
        enabled: false,
        proxy: validateProxy(form.proxy.value) ? form.proxy.value : "",
      });
  });
});
