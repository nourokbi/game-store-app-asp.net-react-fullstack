export type GameDto = {
  id: number
  name: string
  genre: string
  price: number
  releaseDate: string // DateOnly serialized as YYYY-MM-DD
}

export type GameDetailsDto = {
  id: number
  name: string
  genreId: number
  price: number
  releaseDate: string // YYYY-MM-DD
}

export type GenreDto = {
  id: number
  name: string
}

export type CreateGameDto = {
  name: string
  genreId: number
  price: number
  releaseDate: string // YYYY-MM-DD
}

export type UpdateGameDto = CreateGameDto
