# Deployment — OCI Ubuntu + IONOS domain (summary)

Single Node process: the NestJS server serves the (API-less) app **and** the built
React client from `server/dist/public` on `PORT` (default 3000). Caddy sits in
front for HTTPS.

**What changed since the first draft**
- GitHub module + token **removed** — there is no secret to manage. `.env` is now
  optional (only `PORT`, which `ecosystem.config.js` already sets).
- Server sends **Helmet** security headers (CSP/HSTS) — HSTS only takes effect once
  you're on HTTPS (Caddy handles that).
- Client bundle is **obfuscated** automatically by `npm run build` (build-only).
- Build order matters: `nest build` wipes `dist/`, so **server builds first, then
  the client** writes into `dist/public`. `npm run build:all` does this for you.

---

## 0 · Local — push to GitHub
```bash
cd /home/bagui/Dev/portfolio
git add -A
git commit -m "Deploy: drop github module, add helmet + obfuscation"
# create repo on github.com (MirouBagui/portfolio), then:
git remote add origin git@github.com:MirouBagui/portfolio.git
git push -u origin terminal-split-pane     # or merge to main and push main
```

## 1 · OCI — open ports (TWO firewall layers)
- **VCN ingress** (OCI Console → Networking → VCN → Security List / NSG): add ingress
  `0.0.0.0/0` TCP **80** and **443** (22 already open).
- **Instance iptables** (Ubuntu OCI images block by default):
```bash
sudo iptables -I INPUT -p tcp --dport 80  -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

## 2 · IONOS — point the domain at the server
IONOS control panel → **Domains & SSL** → your domain → **DNS**:
- **A** record: host `@`   → value `<OCI_PUBLIC_IP>`  (TTL 1h)
- **A** record: host `www` → value `<OCI_PUBLIC_IP>`  (or CNAME `www` → `yourdomain.com`)

Delete any default IONOS parking/forwarding record first. Verify:
```bash
dig +short yourdomain.com        # must return your OCI IP
```

## 3 · Server — install runtime (SSH in as `ubuntu`)
```bash
ssh ubuntu@<OCI_PUBLIC_IP>

curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -   # Node 22 LTS
sudo apt-get install -y nodejs git
sudo npm install -g pm2

# Caddy (auto-HTTPS reverse proxy)
sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt-get update && sudo apt-get install -y caddy
```

## 4 · Deploy the app
```bash
cd ~ && git clone git@github.com:MirouBagui/portfolio.git
cd portfolio && git checkout terminal-split-pane
npm run install:all        # root + server + client deps
npm run build:all          # server, then obfuscated client → server/dist/public
pm2 start ecosystem.config.js
pm2 save
pm2 startup                # run the sudo line it prints (restart on reboot)
curl -I http://localhost:3000   # expect 200
```
> No `.env` required. For a non-default port, `cp .env.example .env` and set `PORT`.

## 5 · HTTPS via Caddy
```bash
sudo tee /etc/caddy/Caddyfile >/dev/null <<'EOF'
yourdomain.com, www.yourdomain.com {
    reverse_proxy localhost:3000
}
EOF
sudo systemctl reload caddy
```
Caddy fetches a Let's Encrypt cert automatically. Open `https://yourdomain.com`.

## 6 · Future updates
```bash
cd ~/portfolio && git pull
npm run install:all        # only if deps changed
npm run build:all
pm2 reload portfolio
```

**Notes**
- ARM (Ampere A1): give ≥1 GB RAM or add a swapfile so the Vite + obfuscation build doesn't OOM.
- The CSP allows Google Fonts; if you self-host fonts later, tighten `font-src`/`style-src` in `server/src/main.ts`.
- `dig` not resolving yet? Wait for IONOS DNS propagation (minutes, up to a few hours) before reloading Caddy, or the cert request will fail.
