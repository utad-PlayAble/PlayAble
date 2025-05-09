using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using utad.PlayAble.Data;
using utad.PlayAble.Models;

namespace utad.PlayAble.Pages;

public class IndexModel : PageModel
{
    private readonly utadPlayAbleContext _context;

    public IndexModel(utadPlayAbleContext context)
    {
        _context = context;
    }

    public Dictionary<string, List<Game>> GamesByCategory { get; set; } = new();

    public async Task OnGetAsync()
    {
        var categories = await _context.Games
            .Select(g => g.Category)
            .Distinct()
            .ToListAsync();

        foreach (var category in categories)
        {
            var games = await _context.Games
                .Where(g => g.Category == category)
                .ToListAsync();




            GamesByCategory[category] = games;
        }
    }

    public async Task<IActionResult> OnGetIsFavoriteAsync(int gameId)
    {
        var userId = User.Identity?.Name; // Assumindo que o nome do usuário é o ID
        if (userId == null)
        {
            return Unauthorized();
        }

        var isFavorite = await _context.UserFavoriteGames
            .AnyAsync(f => f.UserId == userId && f.GameId == gameId);

        return new JsonResult(new { isFavorite });
    }

    public async Task<IActionResult> OnPostToggleFavoriteAsync(int gameId)
    {
        var userId = User.Identity?.Name; // Assumindo que o nome do usuário é o ID
        if (userId == null)
        {
            return Unauthorized();
        }

        var favorite = await _context.UserFavoriteGames
            .FirstOrDefaultAsync(f => f.UserId == userId && f.GameId == gameId);

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            return NotFound("Usuário não encontrado.");
        }


        if (favorite == null)
        {
            // Criar nova relação
            favorite = new UserFavoriteGame
            {
                User = user,
                UserId = userId,
                GameId = gameId,
                Game = await _context.Games.FindAsync(gameId),
                FavoritedAt = DateTime.Now
            };
            _context.UserFavoriteGames.Add(favorite);
        }
        else
        {
            // Remover relação existente
            _context.UserFavoriteGames.Remove(favorite);
        }

        await _context.SaveChangesAsync();
        return new JsonResult(new { success = true });
    }
}
