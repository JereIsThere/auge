# deploy/init.ps1  -  Einmaliges Setup von Windows aus
#
# Voraussetzungen:
#   - Windows 10/11 (OpenSSH eingebaut: ssh, scp, ssh-keygen, ssh-keyscan)
#   - gh (GitHub CLI):  winget install GitHub.cli  ->  gh auth login
#
# Aufruf in PowerShell (aus dem auge-2\deploy\ Ordner):
#   .\init.ps1

param(
    [string]$ServerHost = "",
    [string]$ServerUser = "",
    [string]$ServerPort = ""
)

$Repo      = "JereIsThere/claude-projects"
$KeyPath   = "$env:USERPROFILE\.ssh\auge2_deploy"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

function Write-Ok($msg)   { Write-Host "  [OK] $msg" -ForegroundColor Green }
function Write-Info($msg) { Write-Host "   ->  $msg" -ForegroundColor Cyan }
function Write-Fail($msg) { Write-Host "[FEHLER] $msg" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "=== Auge 2.0 - Einrichtung von Windows aus ===" -ForegroundColor Cyan
Write-Host ""

# -- 0. Voraussetzungen --
if (-not (Get-Command ssh -ErrorAction SilentlyContinue)) {
    Write-Fail "ssh nicht gefunden. Einstellungen -> Apps -> Optionale Features -> OpenSSH-Client"
}
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Fail "gh nicht gefunden. Ausfuehren: winget install GitHub.cli"
}

gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Fail "Nicht bei GitHub eingeloggt. Bitte zuerst: gh auth login"
}

# -- Verbindungsdaten abfragen --
Write-Host "Serververbindung:"
if (-not $ServerHost) { $ServerHost = Read-Host "  IP oder Hostname" }
if (-not $ServerUser) { $ServerUser = Read-Host "  SSH-Benutzername" }
if (-not $ServerPort) { $ServerPort = Read-Host "  SSH-Port [10022]" }
if (-not $ServerPort) { $ServerPort = "10022" }
$Target = "$ServerUser@$ServerHost"
Write-Host ""

# -- 1. SSH-Key generieren --
if (Test-Path $KeyPath) {
    Write-Ok "SSH-Key existiert bereits ($KeyPath)"
} else {
    Write-Info "SSH-Key generieren: $KeyPath"
    # Leerem Passphrase: einfach zweimal Enter druecken wenn gefragt
    & ssh-keygen -t ed25519 -C "auge2-deploy" -f $KeyPath
    if ($LASTEXITCODE -ne 0) { Write-Fail "ssh-keygen fehlgeschlagen." }
    Write-Ok "Key generiert"
}

# -- 2. Public Key auf Server uebertragen --
# Kein ssh-copy-id auf Windows -> Inhalt per Pipe uebertragen
Write-Info "Public Key auf ${Target}:${ServerPort} uebertragen"
Write-Host "   (Passwort des Servers eingeben - danach nie wieder noetig)"
Get-Content "$KeyPath.pub" | & ssh -p $ServerPort $Target "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
if ($LASTEXITCODE -ne 0) { Write-Fail "Public Key konnte nicht uebertragen werden." }
Write-Ok "Public Key uebertragen"

# -- 3. Known Hosts aktualisieren --
& ssh-keyscan -p $ServerPort -H $ServerHost 2>$null | Add-Content "$env:USERPROFILE\.ssh\known_hosts"
Write-Ok "Known Hosts aktualisiert"

# -- 4. setup.sh auf Server kopieren und ausfuehren --
Write-Info "setup.sh auf Server uebertragen"
& scp -P $ServerPort -i $KeyPath "$ScriptDir\setup.sh" "${Target}:/tmp/auge2-setup.sh"
if ($LASTEXITCODE -ne 0) { Write-Fail "scp fehlgeschlagen." }

Write-Info "Server-Setup ausfuehren (sudo Passwort eingeben)"
& ssh -t -p $ServerPort -i $KeyPath $Target "sed -i 's/\r//' /tmp/auge2-setup.sh && sudo bash /tmp/auge2-setup.sh"
if ($LASTEXITCODE -ne 0) { Write-Fail "Server-Setup fehlgeschlagen." }
Write-Ok "Server-Setup abgeschlossen"

# -- 5. GitHub-Secrets setzen --
Write-Host ""
Write-Info "GitHub-Secrets setzen (Repo: $Repo)"

Get-Content $KeyPath -Raw | & gh secret set AUGE2_SSH_KEY -R $Repo
Write-Ok "AUGE2_SSH_KEY gesetzt"

& gh secret set AUGE2_SSH_HOST -R $Repo --body $ServerHost
Write-Ok "AUGE2_SSH_HOST gesetzt"

& gh secret set AUGE2_SSH_USER -R $Repo --body $ServerUser
Write-Ok "AUGE2_SSH_USER gesetzt"

& gh secret set AUGE2_SSH_PORT -R $Repo --body $ServerPort
Write-Ok "AUGE2_SSH_PORT gesetzt"

# -- Fertig --
Write-Host ""
Write-Host "=== Fertig! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Naechste Schritte:" -ForegroundColor Green
Write-Host "  1. OrientDB-Passwort auf Server eintragen:" -ForegroundColor Green
Write-Host "     ssh -p $ServerPort $Target" -ForegroundColor Yellow
Write-Host "     sudo nano /var/www/auge2/.env.local" -ForegroundColor Yellow
Write-Host ""
Write-Host "  2. Ersten Push machen -> GitHub Actions deployt automatisch" -ForegroundColor Green
Write-Host "     git push origin claude/auge-2-react-orientdb-wp0ad" -ForegroundColor Yellow
Write-Host ""
Write-Host "  3. Live unter: https://auge2.jeremias-groehl.de" -ForegroundColor Green
Write-Host ""
