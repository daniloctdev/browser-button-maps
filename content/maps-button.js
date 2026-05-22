const BUTTON_ID = "quick-google-maps-button";
const SEARCH_ENGINE_BUTTON_SCOPES = Object.freeze({
  BOTH: "both",
  GOOGLE: "google",
  BING: "bing"
});
const DEFAULT_SETTINGS = Object.freeze({
  contextSearchEnabled: true,
  contextDirectionsEnabled: true,
  searchEngineButtonEnabled: true,
  searchEngineButtonScope: SEARCH_ENGINE_BUTTON_SCOPES.BOTH
});

let currentSettings = DEFAULT_SETTINGS;
let observer;

init();

async function init() {
  currentSettings = normalizeSettings(await chrome.storage.sync.get(DEFAULT_SETTINGS));
  syncButton();
  observeSearchPageChanges();

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "sync" || !hasButtonSettingChange(changes)) {
      return;
    }

    currentSettings = normalizeSettings({
      ...currentSettings,
      ...Object.fromEntries(
        Object.entries(changes).map(([key, change]) => [key, change.newValue])
      )
    });
    syncButton();
  });
}

function syncButton() {
  if (!shouldRenderButton()) {
    removeButton();
    return;
  }

  renderButton();
}

function shouldRenderButton() {
  if (!currentSettings.searchEngineButtonEnabled) {
    return false;
  }

  if (isGoogle()) {
    return [
      SEARCH_ENGINE_BUTTON_SCOPES.BOTH,
      SEARCH_ENGINE_BUTTON_SCOPES.GOOGLE
    ].includes(currentSettings.searchEngineButtonScope);
  }

  if (isBing()) {
    return [
      SEARCH_ENGINE_BUTTON_SCOPES.BOTH,
      SEARCH_ENGINE_BUTTON_SCOPES.BING
    ].includes(currentSettings.searchEngineButtonScope);
  }

  return false;
}

function renderButton() {
  if (document.getElementById(BUTTON_ID)) {
    updateButtonHref();
    return;
  }

  const anchor = document.createElement("a");
  anchor.id = BUTTON_ID;
  anchor.className = "quick-google-maps-button";
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.textContent = "Maps";
  anchor.setAttribute("aria-label", "Cerca questa query su Google Maps");

  const host = findInsertionPoint();
  if (!host) {
    return;
  }

  host.insertAdjacentElement("afterend", anchor);
  updateButtonHref();
}

function updateButtonHref() {
  const button = document.getElementById(BUTTON_ID);
  const query = getCurrentSearchQuery();

  if (!button || !query) {
    removeButton();
    return;
  }

  button.href = buildMapsSearchUrl(query, getMapsContext());
}

function removeButton() {
  document.getElementById(BUTTON_ID)?.remove();
}

function getCurrentSearchQuery() {
  const url = new URL(window.location.href);
  const urlQuery = url.searchParams.get("q");

  if (urlQuery) {
    return urlQuery;
  }

  const input = document.querySelector("textarea[name='q'], input[name='q']");
  return input?.value?.trim() || "";
}

function findInsertionPoint() {
  if (isGoogle()) {
    return document.querySelector("form[role='search'] textarea[name='q']")
      || document.querySelector("form[role='search'] input[name='q']")
      || document.querySelector("textarea[name='q']")
      || document.querySelector("input[name='q']");
  }

  if (isBing()) {
    return document.querySelector("#sb_form_q")
      || document.querySelector("input[name='q']");
  }

  return null;
}

function observeSearchPageChanges() {
  if (observer) {
    return;
  }

  observer = new MutationObserver(() => {
    syncButton();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function getMapsContext() {
  return {
    mapsOrigin: getGoogleMapsOrigin(),
    language: getPageLanguage()
  };
}

function getGoogleMapsOrigin() {
  if (isGoogle()) {
    return window.location.origin;
  }

  return "https://www.google.com";
}

function getPageLanguage() {
  const url = new URL(window.location.href);
  const googleLanguage = url.searchParams.get("hl");
  const bingLanguage = url.searchParams.get("setlang")
    || normalizeBingMarket(url.searchParams.get("mkt"));
  const htmlLanguage = document.documentElement.lang;

  return normalizeLanguage(googleLanguage || bingLanguage || htmlLanguage);
}

function normalizeBingMarket(market) {
  if (!market) {
    return "";
  }

  return market.split("-")[0];
}

function normalizeLanguage(language) {
  const normalized = (language || "").trim().toLowerCase();
  return /^[a-z]{2,3}(-[a-z]{2})?$/.test(normalized) ? normalized : "";
}

function isGoogle() {
  return /^www\.google\./.test(window.location.hostname);
}

function isBing() {
  return window.location.hostname === "www.bing.com";
}

function buildMapsSearchUrl(query, context = {}) {
  const origin = normalizeGoogleMapsOrigin(context.mapsOrigin);
  const url = new URL(`${origin}/maps/search/`);
  url.searchParams.set("api", "1");
  url.searchParams.set("query", query.trim());

  if (context.language) {
    url.searchParams.set("hl", context.language);
  }

  return url.toString();
}

function normalizeGoogleMapsOrigin(origin) {
  try {
    const url = new URL(origin);
    if (url.protocol === "https:" && /^www\.google\./.test(url.hostname)) {
      return url.origin;
    }
  } catch {
    return "https://www.google.com";
  }

  return "https://www.google.com";
}

function normalizeSettings(settings) {
  const scope = Object.values(SEARCH_ENGINE_BUTTON_SCOPES).includes(settings.searchEngineButtonScope)
    ? settings.searchEngineButtonScope
    : DEFAULT_SETTINGS.searchEngineButtonScope;

  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    searchEngineButtonScope: scope
  };
}

function hasButtonSettingChange(changes) {
  return [
    "searchEngineButtonEnabled",
    "searchEngineButtonScope"
  ].some((key) => Object.hasOwn(changes, key));
}
