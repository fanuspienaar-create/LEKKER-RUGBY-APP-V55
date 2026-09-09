# LEKKER RUGBY APP

## V12 — Players, flags and Admin control

This build preserves the approved LEKKER RUGBY layout and adds:
- Players grouped by country; country bars are closed until tapped.
- Real image flags for England, Scotland and Wales; image flags for the other supported countries too.
- Historical rugby Test-player directory loaded from the Rugby-Wanderers rugby dataset for players debuting from 1978 onward, plus the app's current player seed list.
- Player photo resolver restricted to rugby-oriented Wikimedia/Wikidata/RugbyPass sources where available.
- Player-photo fallback initials are contained inside the photo frame and cannot cover the page.
- Admin login password default: `LekkerRugby1234` (override with Cloudflare secret `ADMIN_PASSWORD`).
- Admin can create/activate voting competitions, inspect votes and aggregate rankings, reset votes for a selected competition, add players, and store simple backend settings.
- Admin reset and voting controls do not touch LEKKER Rugby Voorspel tables.

## Central backend

Set the deployed Cloudflare Worker URL in `api-config.js`:

`window.LEKKER_RUGBY_CONFIG={apiUrl:"https://YOUR-WORKER.workers.dev"};`

For production, set these Cloudflare secrets instead of relying on the development fallbacks:
- `ADMIN_PASSWORD`
- `ADMIN_SECRET`
- `IP_SALT`
- `RUGBY_API_KEY` (if live API-Sports Rugby data is enabled)

The public app exposes aggregate voting rankings/counts. Individual ballots are available only to authenticated admin endpoints.

## Validation

- `node --check app.js`
- `node --check worker/worker.js`
- ZIP integrity verified with `unzip -t`
