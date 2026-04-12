using GameStore.Api.Data;
using GameStore.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
  options.AddDefaultPolicy(policy =>
    policy
      .WithOrigins("http://localhost:5173", "http://localhost:4173")
      .AllowAnyHeader()
      .AllowAnyMethod());
});

builder.Services.AddValidation();
builder.AddGameStoreDB();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
  app.UseCors();
}

app.MapGamesEndpoints();
app.MapGenreEndpoints();

app.MigrateDB();

app.Run();
