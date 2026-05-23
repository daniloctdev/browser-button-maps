# Cerca indirizzo su Google Maps

Estensione Chrome/Edge Manifest V3 per cercare rapidamente indirizzi su Google Maps.

## Cosa fa

- Aggiunge al menu contestuale una voce per cercare su Google Maps il testo selezionato.
- Aggiunge al menu contestuale una voce per ottenere indicazioni stradali verso il testo selezionato.
- Aggiunge un pulsante `GMaps` nelle pagine di ricerca Google e Bing.
- Permette di scegliere se mostrare il pulsante su Google, su Bing o su entrambi.
- Mantiene il TLD Google originale quando il pulsante viene usato da Google, ad esempio `google.it` apre `google.it/maps`.
- Propaga la lingua della pagina quando disponibile tramite parametro `hl`.
- Permette di attivare o disattivare singolarmente le tre funzioni.

## Installazione in sviluppo

1. Apri `chrome://extensions` oppure `edge://extensions`.
2. Attiva `Modalita sviluppatore`.
3. Clicca `Carica estensione non pacchettizzata`.
4. Seleziona questa cartella di progetto.

## Uso

Seleziona un indirizzo su una pagina web, fai clic con il tasto destro e scegli una delle voci Google Maps. Nelle ricerche Google e Bing puoi usare il pulsante `GMaps` per aprire subito la query corrente su Google Maps.

## Impostazioni

Apri il popup dell'estensione o la pagina opzioni per gestire:

- Ricerca da testo selezionato.
- Indicazioni da testo selezionato.
- Pulsante GMaps su Google e Bing.
- Ambito del pulsante: Google e Bing, solo Google, oppure solo Bing.

## Struttura

```text
manifest.json
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
docs/
  PLAN.md
```

## Note tecniche

Il progetto usa Manifest V3 e `chrome.storage.sync` per mantenere sincronizzate le impostazioni tra browser compatibili. Gli URL Maps vengono generati con gli endpoint `https://www.google.com/maps/search/?api=1` e `https://www.google.com/maps/dir/?api=1`. Per il pulsante su Google viene preservata l'origine corrente, per esempio `https://www.google.it` o `https://www.google.co.uk`; su Bing viene usato `https://www.google.com` e viene mantenuta la lingua rilevabile da `setlang`, `mkt` o `lang` HTML quando disponibile. Il manifest usa `include_globs` per coprire i TLD Google internazionali, dato che i match pattern Chrome non supportano direttamente `www.google.*` come host.
