# package.ps1
# Genera un pacchetto ZIP pronto per il rilascio dell'estensione, escludendo i file di sviluppo.

$ErrorActionPreference = "Stop"

Write-Host "=== CREAZIONE PACCHETTO ESTENSIONE ===" -ForegroundColor Cyan

$buildDir = "dist"
$archiveName = "$buildDir/cerca-indirizzo-su-google-maps.zip"

# 1. Crea la cartella dist se non esiste
if (!(Test-Path -Path $buildDir)) {
    New-Item -ItemType Directory -Path $buildDir | Out-Null
    Write-Host "Creata cartella $buildDir/" -ForegroundColor Yellow
}

# 2. Rimuove eventuali archivi precedenti
if (Test-Path -Path $archiveName) {
    Remove-Item -Path $archiveName -Force
    Write-Host "Rimosso vecchio archivio $archiveName" -ForegroundColor Yellow
}

# 3. Definisce i file e le cartelle da includere nell'estensione
$filesToInclude = @(
    "manifest.json",
    "LICENSE",
    "assets",
    "content",
    "options",
    "src"
)

# 4. Crea una cartella temporanea per il packaging
$tempDir = "$buildDir/temp_package"
if (Test-Path -Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# 5. Copia solo i file selezionati nella cartella temporanea
Write-Host "Copia dei file dell'estensione..." -ForegroundColor Yellow
foreach ($item in $filesToInclude) {
    if (Test-Path -Path $item) {
        $dest = Join-Path $tempDir $item
        # Crea la cartella di destinazione se necessario per il caricamento ricorsivo
        if (Test-Path -Path $item -PathType Container) {
            New-Item -ItemType Directory -Path $dest -Force | Out-Null
            Copy-Item -Path "$item\*" -Destination $dest -Recurse -Force
        } else {
            Copy-Item -Path $item -Destination $dest -Force
        }
        Write-Host "  [+] $item" -ForegroundColor Gray
    }
}

# 6. Comprime la cartella temporanea in formato ZIP
Write-Host "Compressione dei file..." -ForegroundColor Yellow
Compress-Archive -Path "$tempDir\*" -DestinationPath $archiveName -Force

# 7. Pulisce la cartella temporanea
Remove-Item -Recurse -Force $tempDir

Write-Host "=== PACCHETTO CREATO CON SUCCESSO! ===" -ForegroundColor Green
Write-Host "File salvato in: $archiveName" -ForegroundColor Green
