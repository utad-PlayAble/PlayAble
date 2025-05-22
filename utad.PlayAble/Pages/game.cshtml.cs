using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using utad.PlayAble.Data;
using utad.PlayAble.Models;

namespace utad.PlayAble.Pages
{
    public class GameModel(utadPlayAbleContext context) : PageModel
    {
        public Game? Game { get; set; } 
        public List<Game> RelatedGames { get; set; } = new();

        public async Task OnGetAsync(string path)
        {
            if (string.IsNullOrEmpty(path))
            {
                RedirectToPage("/NotFound");
                return;
            }
            
            Game = await context.Games.Include(g => g.UserFavorites)
                .FirstOrDefaultAsync(g => g.Path == path);

            if (Game == null)
            {
                RedirectToPage("/NotFound");
                return;
            }

            RelatedGames = await context.Games
                .Where(g => g.Category == Game.Category && g.Id != Game.Id)
                .Take(3)
                .ToListAsync();

            if (RelatedGames.Count == 0)
            {
                RelatedGames = await context.Games
                    .Where(g => g.Id != Game.Id)
                    .Take(3)
                    .ToListAsync();
            }
            
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId != null)
            {
                var isFavorite = await context.UserFavoriteGames
                    .AnyAsync(f => f.UserId == userId && f.GameId == Game.Id);
                
                ViewData["IsFavorite"] = isFavorite;
            }
            else
            {
                ViewData["IsFavorite"] = false;
            }
            

            
        }
        
        public async Task<IActionResult> OnPostToggleFavoriteAsync(string gameId)
        {
            if (string.IsNullOrEmpty(gameId))
            {
                Console.WriteLine("Game ID is null or empty.");
                return RedirectToPage("/NotFound");
            }

            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Redirect("/Identity/Account/Login");
            }
            
            var gameobj = await context.Games
                .Include(g => g.UserFavorites)
                .FirstOrDefaultAsync(g => g.Id == gameId);
            
            if (gameobj == null)
            {
                Console.WriteLine("Game not found.");
                return RedirectToPage("/NotFound");
            }
            
            var userobj = await context.Users
                .Include(u => u.FavoriteGames)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (userobj == null)
            {
                Console.WriteLine("User not found. + " + userId);
                return RedirectToPage("/NotFound");
            }

            var favorite = await context.UserFavoriteGames
                .FirstOrDefaultAsync(ufg => ufg.UserId == userId && ufg.GameId == gameId);

            if (favorite == null)
            {
                // Add to favorites
                context.UserFavoriteGames.Add(new UserFavoriteGame
                {
                    UserId = userId,
                    GameId = gameId,
                    User = userobj,
                    Game = gameobj,
                    FavoritedAt = DateTime.Now
                });
                
                gameobj.FavoriteCount++;
                
            }
            else
            {
                context.UserFavoriteGames.Remove(favorite);
                gameobj.FavoriteCount--;
                
            }

            await context.SaveChangesAsync();

            var isFavorite = await context.UserFavoriteGames
                .AnyAsync(f => f.UserId == userId && f.GameId == gameId);

            ViewData["IsFavorite"] = isFavorite;

            return Redirect("/game/"+gameobj.Path);
        }
        
        
        
    }
}
