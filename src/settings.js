export const DEFAULT_SETTINGS = Object.freeze({
  contextSearchEnabled: true,
  contextDirectionsEnabled: true,
  searchEngineButtonEnabled: true
});

export async function getSettings() {
  const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function saveSettings(settings) {
  await chrome.storage.sync.set({
    ...DEFAULT_SETTINGS,
    ...settings
  });
}

export function buildMapsSearchUrl(query) {
  const encodedQuery = encodeURIComponent(query.trim());
  return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
}

export function buildMapsDirectionsUrl(destination) {
  const encodedDestination = encodeURIComponent(destination.trim());
  return `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`;
}
