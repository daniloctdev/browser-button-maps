import {
  DEFAULT_SETTINGS,
  SEARCH_ENGINE_BUTTON_SCOPES,
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

  for (const [key, value] of Object.entries(settings)) {
    const field = form.elements[key];

    if (!field) {
      continue;
    }

    if (field instanceof RadioNodeList) {
      field.value = value;
    } else {
      field.checked = Boolean(value);
    }
  }
}

function readFormSettings() {
  const scope = Object.values(SEARCH_ENGINE_BUTTON_SCOPES).includes(form.elements.searchEngineButtonScope.value)
    ? form.elements.searchEngineButtonScope.value
    : DEFAULT_SETTINGS.searchEngineButtonScope;

  return {
    contextSearchEnabled: Boolean(form.elements.contextSearchEnabled.checked),
    contextDirectionsEnabled: Boolean(form.elements.contextDirectionsEnabled.checked),
    searchEngineButtonEnabled: Boolean(form.elements.searchEngineButtonEnabled.checked),
    searchEngineButtonScope: scope
  };
}

function showStatus(message) {
  window.clearTimeout(statusTimeout);
  status.textContent = message;
  statusTimeout = window.setTimeout(() => {
    status.textContent = "";
  }, 1800);
}
