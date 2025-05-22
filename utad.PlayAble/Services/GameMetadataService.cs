using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using utad.PlayAble.Data;
using utad.PlayAble.Models;

namespace utad.PlayAble.Services;

public class GameMetadataService
{
    private readonly string _gamesBasePath;
    private readonly utadPlayAbleContext _context;

    public GameMetadataService(IWebHostEnvironment env, utadPlayAbleContext context)
    {
        _gamesBasePath = Path.Combine(env.WebRootPath, "games");
        _context = context;
    }

    public async Task SyncGamesMetadata()
    {
        var gameDirs = Directory.GetDirectories(_gamesBasePath);

        foreach (var dir in gameDirs)
        {
            var dirName = Path.GetFileName(dir);
            var metaPath = Path.Combine(dir, "playable-meta", "meta.json");

            if (!File.Exists(metaPath)) continue;

            var jsonContent = await File.ReadAllTextAsync(metaPath);
            var metadata = JsonSerializer.Deserialize<GameMetadata>(jsonContent);

            var game = await _context.Games
                .FirstOrDefaultAsync(g => g.Path == dirName);

            if (metadata == null)
            {
                Console.WriteLine($"Metadata not found for game in {dirName}");
                continue;
            }
            
            if (game == null)
            {
                game = new Game
                {
                    Id = Guid.NewGuid().ToString(),
                    Path = dirName,
                    Name = metadata.Title,
                    Instructions = metadata.Instructions,
                    Description = metadata.Description,
                    Category = metadata.Category,
                    DateAdded = DateTime.Now,
                    Credits = metadata.Credits,
                };
                _context.Games.Add(game);
            }
            else
            {
                game.Name = metadata.Title;
                game.Description = metadata.Description;
                game.Category = metadata.Category;
                game.Instructions = metadata.Instructions;
                game.Credits = metadata.Credits;
            }
            
            Console.WriteLine($"Game {game.Name} ({game.Path}) metadata synced.");
            Console.WriteLine($"Title: {metadata.Title}");
            Console.WriteLine($"Description: {metadata.Description}");
            Console.WriteLine($"Instructions: {metadata.Instructions}");
            Console.WriteLine($"Credits: {metadata.Credits}");
            Console.WriteLine($"Category: {metadata.Category}");
            Console.WriteLine($"Date Added: {game.DateAdded}");
            
        }

        
        
        
        
        await _context.SaveChangesAsync();
    }
}

public class GameMetadata
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string Instructions { get; set; }
    public string Credits { get; set; }
    public string Category { get; set; }
}