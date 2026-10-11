# ArcadeShelf

A small full-stack app for managing a game collection. It was my first ASP.NET Core project, built to learn Minimal APIs and EF Core with a React and TypeScript frontend.

## Features

- Add, edit and delete games, each with a name, genre, price and release date
- Table view or card view
- Select several games and delete them in one go
- Light and dark theme
- Remembers your theme and view in `localStorage`

## Tech stack

| Part | Tools |
|---|---|
| Backend | .NET 10, ASP.NET Core Minimal APIs, Entity Framework Core, SQLite |
| Frontend | React, TypeScript, Vite, lucide-react |
| Tooling | EF Core migrations, `.http` request file, Dockerfile for the frontend |

## Backend notes

- Endpoints are grouped with `MapGroup` and kept in their own files under `Endpoints/`
- Request DTOs use data annotations: name is required and at most 50 characters, and price must be between 1 and 100. They're checked with the built-in .NET 10 validation (`AddValidation`)
- Responses use DTOs, so the EF entities never go straight to the client
- Migrations apply automatically on startup, and the genre table is seeded the first time if it's empty
- CORS allows the Vite dev server in development

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/games` | List games |
| GET | `/games/{id}` | Get one game |
| POST | `/games` | Create a game |
| PUT | `/games/{id}` | Update a game |
| DELETE | `/games/{id}` | Delete a game |
| GET | `/genres` | List genres |

You can try them with [GameStore.Api/games.http](GameStore.Api/games.http).

## Run locally

Requirements: .NET 10 SDK and Node.js 20+

```bash
# API, runs on http://localhost:5277
cd GameStore.Api
dotnet run
```

```bash
# Frontend, runs on http://localhost:5173
cd GameStore.Web
npm install
npm run dev
```

To point the frontend at a different API, set `VITE_API_BASE_URL` in `GameStore.Web/.env`.

## Project structure

```
GameStore.Api/
  Endpoints/   Games and genres endpoints
  Dtos/        Request and response records
  Models/      Game, Genre
  Data/        DbContext, migrations, seeding
GameStore.Web/
  src/App.tsx                 UI: table and card views, forms
  src/api.ts                  API calls
  src/useLocalStorageState.ts Hook for saved preferences
```
