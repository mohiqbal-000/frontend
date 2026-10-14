# IdeaForge — Frontend

React + Vite single-page app for the AI Startup Incubator project. Pairs with the
Spring Boot backend (`ideaforge-backend.zip`).

## Stack
- React 18 + React Router 6
- Vite (dev server + build)
- Axios (JWT attached automatically via interceptor)
- Plain CSS design system (no framework) — see `src/index.css`

## Design identity: "IdeaForge"
The whole app is framed as a blacksmith's workshop: raw ideas get forged into an
investor-ready plan across four stations, each mapped 1:1 to a backend module group:

| Station        | Covers                          |
|----------------|----------------------------------|
| The Forge      | Idea Generator + Validation       |
| The Blueprint  | Business Model Canvas + Competitor Analysis |
| The Ledger     | Financial Plan + MVP Roadmap      |
| The Showcase   | Investor Pitch + PDF Report Export |

Palette: graphite background, molten-ember orange accent, spark-yellow secondary,
cool steel-gray for muted text. Headlines in Oswald (industrial/stamped), body in
Inter, data/labels in JetBrains Mono.

## Running locally

1. Install dependencies:
   ```
   npm install
   ```
2. Make sure the backend is running on `http://localhost:8080` (see backend README).
   The Vite dev server proxies `/api/*` to it — see `vite.config.js`.
3. Start the dev server:
   ```
   npm run dev
   ```
   App runs on `http://localhost:5173`.
4. Build for production:
   ```
   npm run build
   ```
   Output goes to `dist/`.

## Structure
```
src/
  api/client.js          axios instance, attaches JWT from localStorage
  context/AuthContext.jsx login/register/logout state, persisted to localStorage
  components/
    Navbar.jsx, ProtectedRoute.jsx
    stations/             one component per workshop station (see table above)
  pages/
    Landing.jsx           public marketing page
    Login.jsx / Register.jsx
    Dashboard.jsx         list + create startups
    Workspace.jsx         tabbed view of the 4 stations for one startup
  index.css               design tokens + all global styles
```

## Notes
- Every station follows the same pattern: `GET` the latest result on mount (if one
  exists), and a button to `POST` a new generation. This matches the backend's
  "every generate call creates a new row" design — regenerating doesn't lose history
  server-side, even though the UI only shows the latest.
- Auth token lives in `localStorage` (`ideaforge_token`); a 401 response anywhere
  clears it and redirects to `/login` via the axios response interceptor.
- No component library — the design system is a handful of utility classes
  (`.panel`, `.station-card`, `.btn`, `.field`, `.badge`, `.data-table`) defined
  in `index.css`, so the whole visual identity lives in one file.
