#!/bin/bash
# Deploys the latest master of amaclean2/SundayPeak to this server's avys (pm2) process.
# Triggered by the GitHub push webhook (see /etc/webhook.conf); safe to run by hand too.
set -uo pipefail

REPO=/srv/sundaypeak
APP=$REPO/avys
LOG=/var/log/sundaypeak-deploy.log
HEALTH_URL=http://127.0.0.1:5000/services/initial

exec >>"$LOG" 2>&1
exec 9>/run/sundaypeak-deploy.lock
flock 9   # one deploy at a time; a second push waits for the first to finish

log() { echo "[$(date -u +%FT%TZ)] $*"; }

install_deps() {
  NPM_TOKEN=$(grep '^NPM_TOKEN=' "$APP/.env" | tail -1 | cut -d= -f2-) \
    npm --prefix "$APP" install --omit=dev --no-audit --no-fund --loglevel=error
}

healthy() {
  for _ in $(seq 1 15); do
    [ "$(curl -s -o /dev/null -w '%{http_code}' "$HEALTH_URL")" = 200 ] && return 0
    sleep 2
  done
  return 1
}

cd "$REPO" || exit 1
prev=$(git rev-parse HEAD)
git fetch -q origin master || { log "git fetch failed"; exit 1; }
next=$(git rev-parse origin/master)

if [ "$prev" = "$next" ]; then log "already at ${next:0:8}, nothing to do"; exit 0; fi

if git diff --quiet "$prev" "$next" -- avys/; then
  git reset -q --hard "$next"
  log "${prev:0:8} -> ${next:0:8}: no avys changes, code updated without restart"
  exit 0
fi

log "deploying ${prev:0:8} -> ${next:0:8}: $(git log -1 --format=%s "$next")"
git reset -q --hard "$next"

deps_changed=0
git diff --quiet "$prev" "$next" -- avys/package.json || deps_changed=1
if [ $deps_changed = 1 ]; then
  log "package.json changed, installing dependencies"
  install_deps || { log "npm install failed"; }
fi

pm2 reload avys --update-env >/dev/null

if healthy; then
  pm2 save >/dev/null
  log "deploy of ${next:0:8} OK"
  exit 0
fi

log "health check FAILED for ${next:0:8}; rolling back to ${prev:0:8}"
git reset -q --hard "$prev"
[ $deps_changed = 1 ] && install_deps
pm2 reload avys --update-env >/dev/null
healthy && log "rollback to ${prev:0:8} OK" || log "rollback ALSO FAILED - check: pm2 logs avys"
exit 1
