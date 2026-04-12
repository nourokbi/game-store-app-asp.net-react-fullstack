# ArcadeShelf Web (GameStore.Web)

React + TypeScript frontend for **ArcadeShelf**.

## What you can do in the UI

- Create and edit games
- Select one or more games to delete
- Switch view: **Table** / **Cards**
- Switch theme: **Light** / **Dark**

## Run in development

```bash
npm install
npm run dev
```

Vite runs on:

- `http://localhost:5173`

## Backend URL configuration

Frontend calls the API using `VITE_API_BASE_URL`.

Default:

- `http://localhost:5277`

Override in `.env`:

```env
VITE_API_BASE_URL=http://localhost:5277
```

## Persistence (localStorage)

The UI stores small preferences in the browser:

- Theme: `gamestore.theme` (`light` | `dark`)
- View mode: `gamestore.view` (`table` | `cards`)

## Docker

This project ships with a simple Dockerfile that builds the app and serves the static `dist/` folder.

Build (recommended on Windows to reach the API running on your host):

```bash
docker build -t gamestore-web \
  --build-arg VITE_API_BASE_URL=http://host.docker.internal:5277 \
  .
```

Run:

```bash
docker run --rm -p 5173:5173 gamestore-web
```

Then open:

- `http://localhost:5173`
