using GameStore.Api.Data;
using GameStore.Api.Dtos;
using GameStore.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.Endpoints;

public static class GamesEndpoints
{
  const string GetGameByIdEndpointName = "GetGameById";

  public static void MapGamesEndpoints(this WebApplication app)
  {
    var gamesGroup = app.MapGroup("/games").WithTags("Games");
    // Getting all the games list.
    gamesGroup.MapGet("/", async (GameStoreContext dbContext) =>
    {
      var games = await dbContext.Games
                    .Include(game => game.Genre)
                    .Select(game => new GameDto(game.Id, game.Name, game.Genre!.Name, game.Price, game.ReleaseDate))
                    .AsNoTracking()
                    .ToListAsync();
      return Results.Ok(games);
    });

    // Getting a specific game by its id.
    gamesGroup.MapGet("/{id}", async (int id, GameStoreContext dbContext) =>
    {
      var game = await dbContext.Games.FindAsync(id);
      return game is null ? Results.NotFound() : Results.Ok(new GameDetailsDto(game.Id, game.Name, game.GenreId, game.Price, game.ReleaseDate));
    })
    .WithName(GetGameByIdEndpointName);

    // Creating a new game.
    gamesGroup.MapPost("/", (CreateGameDto createGame, GameStoreContext dbContext) =>
    {
      Game game = new()
      {
        Name = createGame.Name,
        GenreId = createGame.GenreId,
        Price = createGame.Price,
        ReleaseDate = createGame.ReleaseDate
      };


      dbContext.Games.Add(game);
      dbContext.SaveChanges();

      GameDetailsDto gameDetails = new(game.Id, game.Name, game.GenreId, game.Price, game.ReleaseDate);

      return Results.CreatedAtRoute(GetGameByIdEndpointName, new { id = gameDetails.Id }, gameDetails);
    });

    // updating an existing game.
    gamesGroup.MapPut("/{id}", async (int id, UpdateGameDto updatedGame, GameStoreContext dbContext) =>
    {
      var game = await dbContext.Games.FindAsync(id);
      if (game is null)
      {
        return Results.NotFound(new
        {
          Message = $"Game with id {id} not found."
        });
      }
      game.Name = updatedGame.Name;
      game.GenreId = updatedGame.GenreId;
      game.Price = updatedGame.Price;
      game.ReleaseDate = updatedGame.ReleaseDate;

      await dbContext.SaveChangesAsync();
      return Results.NoContent();
    });

    // Deleting a game by its id.
    gamesGroup.MapDelete("/{id}", async (int id, GameStoreContext dbContext) =>
    {
      // games.RemoveAll(game => game.Id == id);
      await dbContext.Games.Where(game => game.Id == id).ExecuteDeleteAsync();

      // return a message of success with the deleted game id.
      return Results.Ok(new
      {
        Message = $"Game with id {id} has been deleted successfully."
      });
    });
  }
}
