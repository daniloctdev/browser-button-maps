const BUTTON_ID = "quick-google-maps-button";
const DEFAULT_SETTINGS = Object.freeze({
  contextSearchEnabled: true,
  contextDirectionsEnabled: true,
  searchEngineButtonEnabled: true
});

init();

async function init() {
  const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);

  if (!settings.searchEngineButtonEnabled) {
    removeButton();
    return;
  }

  renderButton();
  observeSearchPageChanges();

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "sync" || !Object.hasOwn(changes, "searchEngineButtonEnabled")) {
      return;
    }

    if (changes.searchEngineButtonEnabled.newValue) {
      renderButton();
    } else {
      removeButton();
    }
  });
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

  button.href = buildMapsSearchUrl(query);
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

  return document.querySelector("input[name='q']");
}

function observeSearchPageChanges() {
  const observer = new MutationObserver(() => {
    if (!document.getElementById(BUTTON_ID)) {
      renderButton();
    } else {
      updateButtonHref();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function isGoogle() {
  return window.location.hostname.includes("google.");
}

function isBing() {
  return window.location.hostname === "www.bing.com";
}

function buildMapsSearchUrl(query) {
  const encodedQuery = encodeURIComponent(query.trim());
  return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
}
