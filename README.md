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
npm run dev
# open http://localhost:5173/app/
