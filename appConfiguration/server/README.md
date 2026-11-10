# Backend server (api.sundaypeak.com)

The API (`avys`) runs directly on the DigitalOcean droplet `128.199.3.44` (Ubuntu 22.04, 1 GB RAM). No Docker.
The frontend (`mountains`) is on DigitalOcean App Platform; see `/.do/app.yaml`.

```
GitHub push ──► Caddy :443 ──/hooks/*──► webhook 127.0.0.1:9000 ──► deploy-avys.sh
                    │
                    └──── everything else ──► avys (pm2) 127.0.0.1:5000 ──► MySQL 127.0.0.1:3306
```

## Files in this folder

| File | Lives on the server at | Purpose |
|---|---|---|
| `Caddyfile` | `/etc/caddy/Caddyfile` | HTTPS (auto Let's Encrypt), proxies API, websockets and the deploy hook |
| `deploy-avys.sh` | `/usr/local/bin/deploy-avys.sh` | Pulls `master`, installs deps if `avys/package.json` changed, reloads pm2, health-checks, rolls back on failure |
| `webhook.conf.tmpl` | `/etc/webhook.conf` | GitHub hook rule: valid HMAC signature **and** push to `master`. `__WEBHOOK_SECRET__` is replaced with `/root/.secrets/webhook_secret` |
| `webhook.service.override.conf` | `/etc/systemd/system/webhook.service.d/override.conf` | Binds the listener to localhost only |
| `mysql-lowmem.cnf` | `/etc/mysql/mysql.conf.d/zz-lowmem.cnf` | MySQL tuned for a 1 GB droplet, localhost only |
| `../../avys/ecosystem.config.js` | `/srv/sundaypeak/avys/` | pm2 process definition |

Not in git (server only): `/srv/sundaypeak/avys/.env` (app secrets, `NPM_TOKEN`), `/root/.secrets/` (DB password, webhook secret),
`/home/images` (user uploads), `/home/keys` (APNS key), `/home/text`.

## Day to day

- **Deploy:** push to `master`. Only changes under `avys/` restart the API.
- **Library changes (Rivers / Couloirs / Water):** publish the package, bump the version in `avys/package.json`, push.
- **Deploy log:** `ssh sp-server tail -20 /var/log/sundaypeak-deploy.log`
- **Manual deploy:** `ssh sp-server deploy-avys.sh`
- **App logs / status:** `ssh sp-server pm2 logs avys` / `pm2 status`
- **Change a secret:** edit `/srv/sundaypeak/avys/.env`, then `pm2 restart avys --update-env`

## Rebuilding the server from scratch

1. Ubuntu 22.04+, add 1 GB swap, `ufw allow 22,80,443/tcp`.
2. Install Node 22 (NodeSource), `npm i -g pm2`, Caddy (official apt repo), `mysql-server`, `webhook`.
3. Copy the files above into place; create the `friends` DB and `byf@localhost` user; restore the latest dump.
4. `git clone https://github.com/amaclean2/SundayPeak.git /srv/sundaypeak`, write `avys/.env`, then
   `NPM_TOKEN=... npm --prefix /srv/sundaypeak/avys install --omit=dev`.
5. `pm2 start /srv/sundaypeak/avys/ecosystem.config.js && pm2 save && pm2 startup systemd`.
6. `systemctl enable --now caddy webhook`; add the GitHub webhook
   (`https://api.sundaypeak.com/hooks/deploy`, `application/json`, push events, same secret).

Note: when restoring with `mysqldump`, FLOAT columns (adventure/zone coordinates) are written with only
6 significant digits. Copy them across with `CAST(col AS DOUBLE)` afterwards, or dump with a tool that preserves them.
