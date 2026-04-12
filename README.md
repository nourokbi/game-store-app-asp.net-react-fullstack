# ArcadeShelf

A small full-stack **practice project** (my first ASP.NET application) where you can manage a list of games.

- **Backend**: ASP.NET Core Minimal API + EF Core (SQLite)
- **Frontend**: React + TypeScript (Vite)

## Features

- Create, edit, and delete games
- View games as a **table** or **cards**
- Select multiple games to delete (unchecked games are kept)
- Light/Dark theme
- Saves **theme** and **view preference** in `localStorage`

## Tech Stack

- .NET 10 + ASP.NET Core Minimal APIs
- Entity Framework Core 10 (SQLite)
- React + TypeScript (Vite)
- lucide-react (icons)

## Prerequisites

- .NET SDK 10
- Node.js 20+ (npm)

## Quick Start

### 1) Run the backend API

```bash
cd GameStore.Api
dotnet run
```

The API runs on:

- `http://localhost:5277`

### 2) Run the frontend

```bash
cd GameStore.Web
npm install
npm run dev
```

Open:

- `http://localhost:5173`

## Configuration

Frontend uses `VITE_API_BASE_URL`.

- Default backend URL (dev): `http://localhost:5277`
- You can override it in `GameStore.Web/.env`:

```env
VITE_API_BASE_URL=http://localhost:5277
```

## API Endpoints (Summary)

- `GET /games`
- `GET /games/{id}`
- `POST /games`
- `PUT /games/{id}`
- `DELETE /games/{id}`
- `GET /genres`

You can test them using [GameStore.Api/games.http](GameStore.Api/games.http).

## Project Docs

- Backend docs: [GameStore.Api/README.md](GameStore.Api/README.md)
- Frontend docs: [GameStore.Web/README.md](GameStore.Web/README.md)

## Notes

- The backend uses SQLite (`GameStore.Api/GameStore.db`) and applies EF migrations automatically on startup.
- CORS is enabled in Development for `http://localhost:5173` so the Vite dev server can call the API.
- The repo includes a root `.gitignore` to avoid committing build output, `node_modules`, and the local SQLite DB.
