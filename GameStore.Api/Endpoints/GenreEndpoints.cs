using GameStore.Api.Data;
using GameStore.Api.Dtos;
using GameStore.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.Endpoints;

public static class GenreEndpoints
{
  public static void MapGenreEndpoints(this WebApplication app)
  {
    app.MapGet("/genres", async (GameStoreContext dbContext) =>
    {
      var genres = await dbContext.Genres
          .Select(genre => new GenreDto(genre.Id, genre.Name))
          .AsNoTracking()
          .ToListAsync();
      return Results.Ok(genres);
    });
  }
}
