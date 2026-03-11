# SmartC Frontend

React frontend for the **SmartC** .NET API. It uses JWT authentication and shows weather forecasts. Depending on your role (Viewer or Admin), you can view data only or also create and delete forecasts.

## Prerequisites

- **Node.js 18+** and npm (Vite 5 requires Node 18+; the project has `"engines": { "node": ">=18.0.0" }` in `package.json`)
- **SmartC API** running at `http://localhost:5043` (see [Running the API](#running-the-api))

### Node.js on Ubuntu

If you don’t have Node 18+ or hit conflicts with system packages (e.g. `libnode-dev`), use **nvm** so Node is installed in your home directory and system packages are left unchanged:

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc

# Install and use Node 20 (includes npm)
nvm install 20
nvm use 20

# Optional: use Node 20 by default in new terminals
nvm alias default 20
```

Check with `node -v` (v20.x) and `npm -v`. Full steps and troubleshooting: [docs/NODE_SETUP_UBUNTU.md](docs/NODE_SETUP_UBUNTU.md).

## Quick start

### 1. Install dependencies

```bash
cd SmartC-Frontend
npm install
```

### 2. Run the frontend

```bash
npm run dev
```

The app will be at **http://localhost:5173**.
Vite proxies `/api` and `/WeatherForecast` to the backend, so the API must be on `http://localhost:5043`.

### 3. Running the API

From the project root:

```bash
cd SmartC
dotnet run
```

Use the **http** profile so it listens on `http://localhost:5043` (see `Properties/launchSettings.json`).
If your API uses another port, change the `proxy` target in `SmartC-Frontend/vite.config.js` to match.

## Functionality

| Feature | Viewer | Admin |
|--------|--------|--------|
| Login / Register | ok | ok |
| View weather forecasts | ok | ok |
| Create forecast | x | ok |
| Delete forecast | x | ok |

### Test users (in-memory in the API)

| Email | Password | Role |
|-------|----------|------|
| `admin@test.com` | `admin123` | Admin |
| `viewer@test.com` | `viewer123` | Viewer |

- **Viewer:** After login, you only see the list of forecasts.
- **Admin:** You also see “+ Add forecast” and “Delete” on each row; you can create new forecasts and delete by index.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 5173) with proxy to the API |
| `npm run build` | Production build in `dist/` |
| `npm run preview` | Serve the production build locally |

## Project structure

```
SmartC-Frontend/
├── docs/
│   ├── NODE_SETUP_UBUNTU.md     # Node 18+ / nvm setup on Ubuntu
│   ├── Guia_1_JavaScript_Desde_Cero.md  # Guía de estudio: JavaScript desde cero
│   └── Guia_2_React_Desde_Cero.md       # Guía de estudio: React desde cero
├── src/
│   ├── api/
│   │   └── client.js       # API calls (auth, weather CRUD)
│   ├── context/
│   │   └── AuthContext.jsx # Auth state and login/logout
│   ├── components/
│   │   ├── Layout.jsx      # Header + nav + outlet
│   │   └── Layout.module.css
│   ├── pages/
│   │   ├── Login.jsx       # Login form
│   │   ├── Register.jsx    # Register form
│   │   ├── Weather.jsx     # Forecast list + Admin create/delete
│   │   ├── Auth.module.css
│   │   └── Weather.module.css
│   ├── App.jsx             # Routes and protected route
│   ├── main.jsx
│   └── index.css           # Global styles and variables
├── index.html
├── vite.config.js          # Proxy to SmartC API
└── package.json
```

## Environment

- The app assumes the API base is the same origin (via Vite proxy).
- No `.env` is required for local dev: the proxy in `vite.config.js` forwards to `http://localhost:5043`.
- For a different API URL, change the `proxy` target in `vite.config.js` or introduce an env variable and use it in `src/api/client.js`.

## Build for production

```bash
npm run build
```

Serve the `dist/` folder with any static host.
Configure your server so that:

- `/api/*` and `/WeatherForecast*` are proxied to your deployed SmartC API, or
- the frontend uses the full API URL (e.g. via `import.meta.env.VITE_API_URL` in `client.js` and CORS allowed on the API for that origin).
