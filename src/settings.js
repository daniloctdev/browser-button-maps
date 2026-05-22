export const SEARCH_ENGINE_BUTTON_SCOPES = Object.freeze({
  BOTH: "both",
  GOOGLE: "google",
  BING: "bing"
});

export const DEFAULT_SETTINGS = Object.freeze({
  contextSearchEnabled: true,
  contextDirectionsEnabled: true,
  searchEngineButtonEnabled: true,
  searchEngineButtonScope: SEARCH_ENGINE_BUTTON_SCOPES.BOTH
});

export async function getSettings() {
  const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  return normalizeSettings(stored);
}

export async function saveSettings(settings) {
  await chrome.storage.sync.set(normalizeSettings(settings));
}

export function buildMapsSearchUrl(query, options = {}) {
  const mapsOrigin = normalizeGoogleMapsOrigin(options.mapsOrigin);
  const url = new URL(`${mapsOrigin}/maps/search/`);
  url.searchParams.set("api", "1");
  url.searchParams.set("query", query.trim());
  applyLanguage(url, options.language);

  return url.toString();
}

export function buildMapsDirectionsUrl(destination, options = {}) {
  const mapsOrigin = normalizeGoogleMapsOrigin(options.mapsOrigin);
  const url = new URL(`${mapsOrigin}/maps/dir/`);
  url.searchParams.set("api", "1");
  url.searchParams.set("destination", destination.trim());
  applyLanguage(url, options.language);

  return url.toString();
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

function normalizeGoogleMapsOrigin(origin) {
  if (!origin) {
    return "https://www.google.com";
  }

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

function applyLanguage(url, language) {
  const normalized = normalizeLanguage(language);

  if (normalized) {
    url.searchParams.set("hl", normalized);
  }
}

function normalizeLanguage(language) {
  const normalized = (language || "").trim().toLowerCase();
  return /^[a-z]{2,3}(-[a-z]{2})?$/.test(normalized) ? normalized : "";
}
