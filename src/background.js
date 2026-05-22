import {
  buildMapsDirectionsUrl,
  buildMapsSearchUrl,
  getSettings
} from "./settings.js";

const MENU_SEARCH_ID = "maps-search-selection";
const MENU_DIRECTIONS_ID = "maps-directions-selection";

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.sync.get(null);
  await refreshContextMenus();
});

chrome.runtime.onStartup.addListener(refreshContextMenus);

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync" && hasRelevantSettingChange(changes)) {
    refreshContextMenus();
  }
});

chrome.contextMenus.onClicked.addListener((info) => {
  const selectedText = (info.selectionText || "").trim();
  if (!selectedText) {
    return;
  }

  if (info.menuItemId === MENU_SEARCH_ID) {
    chrome.tabs.create({ url: buildMapsSearchUrl(selectedText) });
  }

  if (info.menuItemId === MENU_DIRECTIONS_ID) {
    chrome.tabs.create({ url: buildMapsDirectionsUrl(selectedText) });
  }
});

async function refreshContextMenus() {
  const settings = await getSettings();

  await chrome.contextMenus.removeAll();

  if (settings.contextSearchEnabled) {
    chrome.contextMenus.create({
      id: MENU_SEARCH_ID,
      title: "Cerca \"%s\" su Google Maps",
      contexts: ["selection"]
    });
  }

  if (settings.contextDirectionsEnabled) {
    chrome.contextMenus.create({
      id: MENU_DIRECTIONS_ID,
      title: "Indicazioni per \"%s\" con Google Maps",
      contexts: ["selection"]
    });
  }
}

function hasRelevantSettingChange(changes) {
  return [
    "contextSearchEnabled",
    "contextDirectionsEnabled"
  ].some((key) => Object.hasOwn(changes, key));
}
