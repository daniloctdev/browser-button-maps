# Browser Button Maps

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Chrome](https://img.shields.io/badge/Chrome-Compatible-4285F4.svg)](#compatibilita)
[![Edge](https://img.shields.io/badge/Edge-Compatible-0078D7.svg)](#compatibilita)

Estensione Chrome/Edge Manifest V3 per cercare velocemente indirizzi su Google Maps partendo da testo selezionato, Google Search o Bing Search.

Repository: [daniloctdev/browser-button-maps](https://github.com/daniloctdev/browser-button-maps)

## Italiano

### Funzionalita

- Cerca su Google Maps il testo selezionato da qualsiasi pagina web.
- Apre le indicazioni stradali verso il testo selezionato.
- Aggiunge un pulsante `Maps` nella barra dei risultati Google.
- Aggiunge un pulsante `GMaps` nella barra dei risultati Bing.
- Permette di mostrare il pulsante su Google, su Bing o su entrambi.
- Mantiene il dominio Google originale quando possibile, per esempio `google.it` apre `google.it/maps`.
- Propaga la lingua della pagina a Google Maps quando disponibile.
- Ogni funzione puo essere attivata o disattivata dalla pagina impostazioni.

### Installazione in sviluppo

1. Apri `chrome://extensions` oppure `edge://extensions`.
2. Attiva `Modalita sviluppatore`.
3. Clicca `Carica estensione non pacchettizzata`.
4. Seleziona la cartella del progetto.

### Uso

Seleziona un indirizzo in una pagina web, fai clic con il tasto destro e scegli una voce Google Maps dal menu contestuale.

Nelle pagine di ricerca:

- Google mostra `Maps` nella barra dei risultati.
- Bing mostra `GMaps` nella barra dei risultati.

### Impostazioni

Dal popup o dalla pagina opzioni puoi gestire:

- Ricerca da testo selezionato.
- Indicazioni da testo selezionato.
- Pulsante nei motori di ricerca.
- Ambito del pulsante: Google e Bing, solo Google, oppure solo Bing.

### Compatibilita

- Google Chrome con supporto Manifest V3.
- Microsoft Edge con supporto Manifest V3.

### Packaging e Rilascio

#### Packaging Locale (Windows)
Se desideri creare un pacchetto ZIP locale per test o distribuzione manuale:
1. Apri PowerShell nella cartella del progetto.
2. Esegui lo script:
   ```powershell
   ./package.ps1
   ```
3. Troverai il pacchetto ZIP pronto all'uso in `dist/cerca-indirizzo-su-google-maps.zip`.

#### Rilascio automatico su GitHub
Il repository è configurato con un workflow GitHub Actions che crea automaticamente una Release ufficiale e allega lo ZIP pronto:
1. Crea un tag locale (es. `v0.1.0`):
   ```bash
   git tag v0.1.0
   ```
2. Invia il tag su GitHub:
   ```bash
   git push origin v0.1.0
   ```
3. GitHub Actions creerà automaticamente una nuova Release caricando il file `.zip` come asset.

## English

### Features

- Search selected text on Google Maps from any webpage.
- Open Google Maps directions to the selected text.
- Adds a `Maps` button to Google Search results.
- Adds a `GMaps` button to Bing Search results.
- Lets you show the search button on Google, Bing, or both.
- Preserves the current Google domain when possible, for example `google.it` opens `google.it/maps`.
- Passes the page language to Google Maps when available.
- Each feature can be enabled or disabled from the options page.

### Development Install

1. Open `chrome://extensions` or `edge://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select this project folder.

### Usage

Select an address on a webpage, right-click it, and choose one of the Google Maps context menu actions.

On search result pages:

- Google shows `Maps` in the result navigation bar.
- Bing shows `GMaps` in the result navigation bar.

### Settings

From the popup or options page you can configure:

- Search selected text.
- Directions to selected text.
- Search engine result button.
- Button scope: Google and Bing, Google only, or Bing only.

### Compatibility

- Google Chrome with Manifest V3 support.
- Microsoft Edge with Manifest V3 support.

### Packaging & Releasing

#### Local Packaging (Windows)
If you want to create a local ZIP package for testing or manual distribution:
1. Open PowerShell in the project root directory.
2. Run the script:
   ```powershell
   ./package.ps1
   ```
3. You will find the ready-to-use ZIP package at `dist/cerca-indirizzo-su-google-maps.zip`.

#### Automated GitHub Release
The repository is set up with a GitHub Actions workflow that automatically creates an official Release with the ZIP attached:
1. Create a local tag (e.g. `v0.1.0`):
   ```bash
   git tag v0.1.0
   ```
2. Push the tag to GitHub:
   ```bash
   git push origin v0.1.0
   ```
3. GitHub Actions will automatically create a new Release and upload the `.zip` file as an asset.

## Project Structure

```text
manifest.json
package.ps1
src/
  background.js
  settings.js
content/
  maps-button.js
  maps-button.css
options/
  options.html
  options.css
  options.js
LICENSE
```

## Technical Notes

- Built with Manifest V3.
- Uses `chrome.storage.sync` for settings.
- Uses the Google Maps URLs `https://www.google.com/maps/search/?api=1` and `https://www.google.com/maps/dir/?api=1`.
- Uses `include_globs` to cover international Google TLDs because Chrome match patterns do not support `www.google.*` directly as a host.
- No external runtime dependencies are required.

## License

MIT License. See [LICENSE](LICENSE).

Copyright 2026 Danilo Carbonaro.

Fatto con amore <3 a Catania.
