# avys: Sunday Peak backend

One Node app that serves the REST API and the websockets on the same port.
It used to be four npm packages (avys, rivers, couloirs, water); they now live here as folders.

```
index.js            server: TLS or reverse proxy, port, certbot
serviceHandler.js   the single Water instance (one DB pool) shared by rivers and couloirs
rivers/             REST API: routes, validators, handlers   (Express app)
couloirs/           websocket layer: messaging, push notifications
water/              data layer: services, SQL, caching
```

Requests flow `rivers` / `couloirs` → `serviceHandler` → `water` → MySQL.

## Layer rules

ESLint (`npm run lint`) enforces these:

- `rivers` and `couloirs` reach Water only through `serviceHandler.js` (plus `water/Config/logger`).
- `water` never imports from `rivers`, `couloirs`, or `serviceHandler.js`.

## Commands

```shell
npm run dev        # nodemon with .env.dev
npm start
npm test           # all tests (needs the test MySQL from testConfig/)
npm run test:water
npm run test:rivers
```

Deploys happen automatically on push to master (see `appConfiguration/server/deploy-avys.sh`).
No package publishing is needed anymore.
