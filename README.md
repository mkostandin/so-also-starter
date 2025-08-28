# So Also — MVP Starter (React + Vite + PWA at /app)

Includes:
- Tabs: Map, List, Submit, Conferences, Settings
- Event detail `/app/e/:slug`
- Conferences `/app/conference/:id` with Program / Workshops / Panels / Main / Marathon / Hotel Map / Notifications
- Notifications toggles (topic stubs; FCM-ready)
- Auto-hide past: always query with `endUTC >= now`
- Report an issue (flags) — client stub + server callable template + rules
- Recurring meetings (Series):
  - Series editor for weekly & monthly nth-weekday
  - Instance generator → `/occurrences` (next 6 months)
  - Simple combined queries

## Quickstart
```bash
npm i
# Create environment file for Mapbox (see Environment Setup below)
npm run dev
# open http://localhost:5173/app/
```

## Environment Setup
Create a `.env.local` file in the project root with:
```bash
# Get your token from: https://account.mapbox.com/access-tokens/
VITE_MAPBOX_TOKEN=pk.YOUR_MAPBOX_TOKEN_HERE
```
This is required for the map functionality to work properly.

### Troubleshooting
If the map doesn't load locally:
1. Ensure `.env.local` exists in the project root
2. Restart the development server (`npm run dev`) after creating the file
3. Check that the token starts with `pk.` (public token for client-side use)
4. Verify the token has the necessary scopes for Maps API access
