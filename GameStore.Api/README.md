# ArcadeShelf API (GameStore.Api)

ASP.NET Core Minimal API backend for **ArcadeShelf**.

## What this API does

- Stores games and genres in a SQLite database (EF Core)
- Exposes CRUD endpoints for games
- Exposes a read endpoint for genres

## Run the API

```bash
dotnet run
```

Default URLs (from `Properties/launchSettings.json`):

- `http://localhost:5277`
- `https://localhost:7178`

## Database

- Provider: SQLite
- Connection string: `Data Source=GameStore.db`
- DB file location: `GameStore.Api/GameStore.db`

On startup the app:

- Applies EF Core migrations automatically
- Seeds a few default genres (Action, Adventure, RPG, Strategy, Sports)

If you want to reset the database (practice mode), stop the API and delete:

- `GameStore.Api/GameStore.db`
- `GameStore.Api/GameStore.db-wal`
- `GameStore.Api/GameStore.db-shm`

Then run the API again.

## CORS (Frontend support)

In Development, CORS is enabled for:

- `http://localhost:5173` (Vite dev)
- `http://localhost:4173` (Vite preview)

## Endpoints

### Genres

- `GET /genres`

Response:

```json
[{ "id": 1, "name": "Action" }]
```

### Games

- `GET /games` → list games (includes genre name)
- `GET /games/{id}` → game details (includes `genreId`)
- `POST /games` → create
- `PUT /games/{id}` → update
- `DELETE /games/{id}` → delete

#### Game DTOs

`POST /games` body:

```json
{
  "name": "Farcry 5",
  "genreId": 1,
  "price": 19.99,
  "releaseDate": "2018-03-27"
}
```

Notes:

- `releaseDate` is a `DateOnly` and is serialized as `YYYY-MM-DD`
- DTOs use data annotations (required, string length, ranges)

## Try requests quickly

Use the VS Code REST Client file:

- `games.http`

It contains examples for GET/POST/PUT/DELETE against `http://localhost:5277`.
