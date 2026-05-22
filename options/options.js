import {
  DEFAULT_SETTINGS,
  getSettings,
  saveSettings
} from "../src/settings.js";

const form = document.getElementById("settings-form");
const status = document.getElementById("status");
let statusTimeout;

restoreOptions();

form.addEventListener("change", async () => {
  await saveSettings(readFormSettings());
  showStatus("Impostazioni salvate.");
});

async function restoreOptions() {
  const settings = await getSettings();

  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    const field = form.elements[key];
    if (field) {
      field.checked = Boolean(settings[key]);
    }
  }
}

function readFormSettings() {
  return Object.fromEntries(
    Object.keys(DEFAULT_SETTINGS).map((key) => [
      key,
      Boolean(form.elements[key]?.checked)
    ])
  );
}

function showStatus(message) {
  window.clearTimeout(statusTimeout);
  status.textContent = message;
  statusTimeout = window.setTimeout(() => {
    status.textContent = "";
  }, 1800);
}
