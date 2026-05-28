#!/usr/bin/env bash
# deploy/setup.sh  -  Auge 2.0 Server-Setup (selbststaendig)
#
# Aufruf: sudo bash setup.sh

set -euo pipefail

APP_DIR="/var/www/auge2"
PORT="3010"
DOMAIN="auge2.jeremias-groehl.de"
CERTBOT_MAIL="admin@jeremias-groehl.de"

echo ""
echo "=== Auge 2.0 - Server-Setup ==="
echo ""

# -- 0. sudoers-Regel (GitHub Actions braucht passwordlosen systemctl restart) --
DEPLOY_USER="${SUDO_USER:-}"
if [ -n "$DEPLOY_USER" ]; then
    echo "-> sudoers-Regel fuer $DEPLOY_USER"
    cat > /etc/sudoers.d/auge2 << SUDOEOF
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart auge2, /usr/bin/systemctl is-active auge2
SUDOEOF
    chmod 440 /etc/sudoers.d/auge2
    echo "   OK: /etc/sudoers.d/auge2 angelegt"
fi

# -- 1. Verzeichnis --
# Deploy-User bekommt Schreibrechte (rsync laeuft als dieser User).
# www-data kann Dateien lesen (755/644 reicht).
echo "-> Verzeichnis $APP_DIR"
mkdir -p "$APP_DIR"
if [ -n "${DEPLOY_USER:-}" ]; then
    chown -R "$DEPLOY_USER":"$DEPLOY_USER" "$APP_DIR"
fi
chmod 755 "$APP_DIR"

# -- 2. .env.local (nur anlegen, nie ueberschreiben) --
ENV_FILE="$APP_DIR/.env.local"
if [ ! -f "$ENV_FILE" ]; then
    echo "-> .env.local anlegen"
    cat > "$ENV_FILE" << 'ENVEOF'
NODE_ENV=production
PORT=3010
HOSTNAME=127.0.0.1

ORIENTDB_HOST=localhost
ORIENTDB_PORT=2480
ORIENTDB_DATABASE=auge
ORIENTDB_USERNAME=root
ORIENTDB_PASSWORD=HIER_EINTRAGEN

USE_EXAMPLE_DATA=false

N8N_WEBHOOK_GENERIEREN=http://localhost:5678/webhook/auge-generieren
ENVEOF
    chmod 600 "$ENV_FILE"
    echo "   !! Passwort eintragen: nano $ENV_FILE"
else
    echo "-> .env.local existiert - nicht ueberschrieben"
fi

# -- 3. systemd-Service --
echo "-> systemd-Service /etc/systemd/system/auge2.service"
cat > /etc/systemd/system/auge2.service << SVCEOF
[Unit]
Description=Auge 2.0 Next.js Lernportal
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=5s
Environment=NODE_ENV=production
Environment=PORT=${PORT}
Environment=HOSTNAME=127.0.0.1
EnvironmentFile=${ENV_FILE}
LimitNOFILE=65536
StandardOutput=journal
StandardError=journal
SyslogIdentifier=auge2

[Install]
WantedBy=multi-user.target
SVCEOF
systemctl daemon-reload
systemctl enable auge2
echo "   OK: Service aktiviert"

# -- 4. nginx: erst HTTP-only, damit nginx -t nicht wegen fehlender Zertifikate scheitert --
echo "-> nginx HTTP-Config (vorlaeufig, SSL kommt via certbot)"
cat > /etc/nginx/sites-available/auge2 << NGINXEOF
# Auge 2.0  -  ${DOMAIN}  (HTTP-only bis certbot laeuft)
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location /_next/static/ {
        alias ${APP_DIR}/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location / {
        proxy_pass         http://127.0.0.1:${PORT};
        proxy_http_version 1.1;
        proxy_set_header   Upgrade    \$http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host       \$host;
        proxy_set_header   X-Real-IP  \$remote_addr;
        proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 60s;
    }
}
NGINXEOF

if [ ! -L /etc/nginx/sites-enabled/auge2 ]; then
    ln -s /etc/nginx/sites-available/auge2 /etc/nginx/sites-enabled/auge2
fi

nginx -t
systemctl reload nginx
echo "   OK: nginx neu geladen (HTTP)"

# -- 5. SSL via certbot --nginx (erweitert die Config automatisch um HTTPS) --
if command -v certbot &>/dev/null; then
    echo "-> SSL-Zertifikat via certbot (${DOMAIN})"
    certbot --nginx -d "${DOMAIN}" \
        --non-interactive --agree-tos -m "${CERTBOT_MAIL}" \
        && echo "   OK: SSL eingerichtet" \
        || echo "   !! certbot fehlgeschlagen - DNS-A-Record fuer ${DOMAIN} auf diesen Server?"
else
    echo "   !! certbot nicht installiert:"
    echo "      apt install certbot python3-certbot-nginx"
    echo "      certbot --nginx -d ${DOMAIN}"
fi

echo ""
echo "=== Setup abgeschlossen ==="
echo ""
echo "Naechste Schritte:"
echo "  1. nano ${ENV_FILE}"
echo "     -> OrientDB-Passwort eintragen, USE_EXAMPLE_DATA=false"
echo "  2. Ersten Push auf den Branch -> GitHub Actions deployt automatisch"
echo "  3. Logs: journalctl -u auge2 -f"
echo ""
