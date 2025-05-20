using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using utad.PlayAble.Data;
using utad.PlayAble.Models;

namespace utad.PlayAble.Pages;

public class IndexModel(utadPlayAbleContext context) : PageModel
{
    public Dictionary<string, List<Game>> GamesByCategory { get; set; } = new();

    public async Task OnGetAsync()
    {
        var categories = await context.Games
            .Select(g => g.Category)
            .Distinct()
            .ToListAsync();

        foreach (var category in categories)
        {
            var games = await context.Games
                .Where(g => g.Category == category)
                .ToListAsync();




            GamesByCategory[category] = games;
        }
    }

    public async Task<IActionResult> OnGetIsFavoriteAsync(int gameId)
    {
        var userId = User.Identity?.Name;
        if (userId == null)
        {
            return Unauthorized();
        }

        var isFavorite = await context.UserFavoriteGames
            .AnyAsync(f => f.UserId == userId && f.GameId == gameId);

        return new JsonResult(new { isFavorite });
    }

    public async Task<IActionResult> OnPostToggleFavoriteAsync(int gameId)
    {
        var userId = User.Identity?.Name; 
        if (userId == null)
        {
            return Unauthorized();
        }

        var favorite = await context.UserFavoriteGames
            .FirstOrDefaultAsync(f => f.UserId == userId && f.GameId == gameId);

        var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            return NotFound("User não encontrado.");
        }


        if (favorite == null)
        {
            // verifica se o jogo existe
            var game = await context.Games.FindAsync(gameId);

            if (game == null)
            {
                return NotFound("Jogo não encontrado.");
            }
            
            // criar relação
            favorite = new UserFavoriteGame
            {
                User = user,
                UserId = userId,
                GameId = gameId,
                Game = game,
                FavoritedAt = DateTime.Now
            };
            context.UserFavoriteGames.Add(favorite);
        }
        else
        {
            // remover relação existente
            context.UserFavoriteGames.Remove(favorite);
        }

        await context.SaveChangesAsync();
        return new JsonResult(new { success = true });
    }
}
