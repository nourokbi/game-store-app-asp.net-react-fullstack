import type {
  CreateGameDto,
  GameDetailsDto,
  GameDto,
  GenreDto,
  UpdateGameDto,
} from './types'

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  'http://localhost:5277'

function url(path: string) {
  if (!API_BASE_URL) return path
  return new URL(path, API_BASE_URL).toString()
}

async function readErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    try {
      const body = (await response.json()) as unknown
      return JSON.stringify(body)
    } catch {
      // ignore
    }
  }
  try {
    return await response.text()
  } catch {
    return `${response.status} ${response.statusText}`
  }
}

export async function getGenres(): Promise<GenreDto[]> {
  const response = await fetch(url('/genres'))
  if (!response.ok) throw new Error(await readErrorMessage(response))
  return (await response.json()) as GenreDto[]
}

export async function getGames(): Promise<GameDto[]> {
  const response = await fetch(url('/games'))
  if (!response.ok) throw new Error(await readErrorMessage(response))
  return (await response.json()) as GameDto[]
}

export async function getGameById(id: number): Promise<GameDetailsDto> {
  const response = await fetch(url(`/games/${id}`))
  if (!response.ok) throw new Error(await readErrorMessage(response))
  return (await response.json()) as GameDetailsDto
}

export async function createGame(dto: CreateGameDto): Promise<GameDetailsDto> {
  const response = await fetch(url('/games'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(dto),
  })

  if (!response.ok) throw new Error(await readErrorMessage(response))
  return (await response.json()) as GameDetailsDto
}

export async function updateGame(id: number, dto: UpdateGameDto): Promise<void> {
  const response = await fetch(url(`/games/${id}`), {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(dto),
  })

  if (!response.ok) throw new Error(await readErrorMessage(response))
}

export async function deleteGame(id: number): Promise<void> {
  const response = await fetch(url(`/games/${id}`), { method: 'DELETE' })
  if (!response.ok) throw new Error(await readErrorMessage(response))
}
