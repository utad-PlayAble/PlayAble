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

        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (userId != null)
        {
            var favoriteGames = await context.UserFavoriteGames
                .Where(f => f.UserId == userId)
                .Select(f => f.GameId)
                .ToListAsync();

            var favoriteGameObj = await context.Games
                .Where(g => favoriteGames.Contains(g.Id))
                .ToListAsync();
            
            if (favoriteGameObj.Count > 0)
            {
                GamesByCategory["Jogos Favoritos"] = favoriteGameObj;
            }
            
        }
     
        
        foreach (var category in categories)
        {
            var games = await context.Games
                .Where(g => g.Category == category)
                .ToListAsync();
            

            GamesByCategory[category] = games;
        }
    }

}
