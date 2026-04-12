import { useEffect, useState } from "react";
import "./App.css";
import {
  createGame,
  deleteGame,
  getGameById,
  getGames,
  getGenres,
  updateGame,
} from "./api";
import type { GameDto, GenreDto } from "./types";
import { useLocalStorageState } from "./useLocalStorageState";
import { LayoutGrid, Moon, Sun, Table2 } from "lucide-react";

type Theme = "light" | "dark";
type ViewMode = "table" | "cards";

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function App() {
  const backendBaseUrl =
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
    "http://localhost:5277";

  const [theme, setTheme] = useLocalStorageState<Theme>(
    "gamestore.theme",
    "light",
  );
  const [viewMode, setViewMode] = useLocalStorageState<ViewMode>(
    "gamestore.view",
    "table",
  );

  const [genres, setGenres] = useState<GenreDto[]>([]);
  const [games, setGames] = useState<GameDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedToDelete, setSelectedToDelete] = useState<Set<number>>(
    () => new Set(),
  );

  const [name, setName] = useState("");
  const [genreId, setGenreId] = useState<number>(0);
  const [price, setPrice] = useState<string>("");
  const [releaseDate, setReleaseDate] = useState<string>(todayIsoDate());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.title = "ArcadeShelf";
  }, []);

  async function refreshAll() {
    setLoading(true);
    setError(null);
    try {
      const [g, list] = await Promise.all([getGenres(), getGames()]);
      setGenres(g);
      setGames(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshAll();
  }, []);

  useEffect(() => {
    if (genreId !== 0) return;
    if (genres.length === 0) return;
    setGenreId(genres[0]!.id);
  }, [genres, genreId]);

  function resetForm() {
    setEditingId(null);
    setName("");
    setPrice("");
    setReleaseDate(todayIsoDate());
    if (genres.length > 0) setGenreId(genres[0]!.id);
  }

  async function startEdit(id: number) {
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const details = await getGameById(id);
      setEditingId(details.id);
      setName(details.name);
      setGenreId(details.genreId);
      setPrice(String(details.price));
      setReleaseDate(details.releaseDate);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load game");
    } finally {
      setBusy(false);
    }
  }

  function toggleDeleteSelection(id: number, checked: boolean) {
    setSelectedToDelete((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setStatus(null);

    try {
      const dto = {
        name: name.trim(),
        genreId,
        price: Number(price),
        releaseDate,
      };

      if (!dto.name) {
        setError("Name is required");
        return;
      }
      if (!Number.isFinite(dto.price)) {
        setError("Price must be a number");
        return;
      }

      if (editingId == null) {
        await createGame(dto);
        setStatus("Game created");
      } else {
        await updateGame(editingId, dto);
        setStatus("Game updated");
      }

      await refreshAll();
      resetForm();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function deleteSelected() {
    const ids = Array.from(selectedToDelete);
    if (ids.length === 0) return;
    const ok = window.confirm(
      `Delete ${ids.length} game(s)? This cannot be undone.`,
    );
    if (!ok) return;

    setBusy(true);
    setError(null);
    setStatus(null);

    try {
      await Promise.all(ids.map((id) => deleteGame(id)));
      setSelectedToDelete(new Set());
      if (editingId != null && ids.includes(editingId)) resetForm();
      setStatus("Deleted");
      await refreshAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>ArcadeShelf</h1>
        <div className="controls">
          <div className="pill" role="group" aria-label="Theme">
            <span className="pillLabel">Theme</span>
            <button
              type="button"
              className={theme === "light" ? "toggleBtn active" : "toggleBtn"}
              onClick={() => setTheme("light")}
              aria-pressed={theme === "light"}
              title="Light theme"
            >
              <Sun size={16} />
              Light
            </button>
            <button
              type="button"
              className={theme === "dark" ? "toggleBtn active" : "toggleBtn"}
              onClick={() => setTheme("dark")}
              aria-pressed={theme === "dark"}
              title="Dark theme"
            >
              <Moon size={16} />
              Dark
            </button>
          </div>

          <div className="pill" role="group" aria-label="View">
            <span className="pillLabel">View</span>
            <button
              type="button"
              className={
                viewMode === "table" ? "toggleBtn active" : "toggleBtn"
              }
              onClick={() => setViewMode("table")}
              aria-pressed={viewMode === "table"}
              title="Table view"
            >
              <Table2 size={16} />
              Table
            </button>
            <button
              type="button"
              className={
                viewMode === "cards" ? "toggleBtn active" : "toggleBtn"
              }
              onClick={() => setViewMode("cards")}
              aria-pressed={viewMode === "cards"}
              title="Cards view"
            >
              <LayoutGrid size={16} />
              Cards
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="grid">
          <section className="panel">
            <h2>
              {editingId == null ? "Create game" : `Edit game #${editingId}`}
            </h2>
            <p className="muted">
              Backend: <code>{backendBaseUrl}</code>
            </p>

            <form onSubmit={onSubmit}>
              <div className="row">
                <div className="field">
                  <label>Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Hollow Knight"
                    maxLength={50}
                    required
                  />
                </div>
                <div className="field">
                  <label>Genre</label>
                  <select
                    value={genreId}
                    onChange={(e) => setGenreId(Number(e.target.value))}
                  >
                    {genres.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Price</label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    type="number"
                    min={1}
                    max={100}
                    step="0.01"
                    placeholder="1 - 100"
                    required
                  />
                </div>
                <div className="field">
                  <label>Release date</label>
                  <input
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    type="date"
                    required
                  />
                </div>
              </div>

              <div className="actions">
                <button className="btn primary" type="submit" disabled={busy}>
                  {editingId == null ? "Create" : "Save"}
                </button>
                <button className="btn" type="button" onClick={resetForm}>
                  {editingId == null ? "Clear" : "Cancel edit"}
                </button>
              </div>
            </form>

            {error ? <p className="muted">Error: {error}</p> : null}
            {status ? <p className="muted">{status}</p> : null}
          </section>

          <section className="panel">
            <h2>Games</h2>
            <p className="muted">
              Select games to delete (unchecked games will be kept).
            </p>

            <div className="actions">
              <button
                className="btn danger"
                type="button"
                onClick={deleteSelected}
                disabled={busy || selectedToDelete.size === 0}
              >
                Delete selected ({selectedToDelete.size})
              </button>
              <button
                className="btn"
                type="button"
                onClick={refreshAll}
                disabled={busy}
              >
                Refresh
              </button>
            </div>

            {loading ? <p className="muted">Loading…</p> : null}
            {!loading && games.length === 0 ? (
              <p className="muted">No games yet. Create your first one.</p>
            ) : null}

            {!loading && games.length > 0 && viewMode === "table" ? (
              <table className="table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Genre</th>
                    <th>Price</th>
                    <th>Release</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((g) => (
                    <tr key={g.id} data-editing={editingId === g.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedToDelete.has(g.id)}
                          onChange={(e) =>
                            toggleDeleteSelection(g.id, e.target.checked)
                          }
                          aria-label={`Select ${g.name} for delete`}
                        />
                      </td>
                      <td>{g.name}</td>
                      <td>{g.genre}</td>
                      <td>${g.price.toFixed(2)}</td>
                      <td>{g.releaseDate}</td>
                      <td>
                        <button
                          className="btn"
                          type="button"
                          onClick={() => startEdit(g.id)}
                          disabled={busy}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}

            {!loading && games.length > 0 && viewMode === "cards" ? (
              <div className="cards">
                {games.map((g) => (
                  <div
                    key={g.id}
                    className="card"
                    data-editing={editingId === g.id}
                  >
                    <div className="actions cardHeader">
                      <label className="muted selectLabel">
                        <input
                          type="checkbox"
                          checked={selectedToDelete.has(g.id)}
                          onChange={(e) =>
                            toggleDeleteSelection(g.id, e.target.checked)
                          }
                        />
                        Select
                      </label>
                      <button
                        className="btn"
                        type="button"
                        onClick={() => startEdit(g.id)}
                        disabled={busy}
                      >
                        Edit
                      </button>
                    </div>

                    <h3>{g.name}</h3>
                    <div className="kv">
                      <div>
                        <span>Genre:</span> {g.genre}
                      </div>
                      <div>
                        <span>Price:</span> ${g.price.toFixed(2)}
                      </div>
                      <div>
                        <span>Release:</span> {g.releaseDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
