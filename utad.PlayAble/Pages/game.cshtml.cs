using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using utad.PlayAble.Data;
using utad.PlayAble.Models;

namespace utad.PlayAble.Pages
{
    public class gameModel : PageModel
    {
        private readonly utadPlayAbleContext _context;

        public gameModel(utadPlayAbleContext context)
        {
            _context = context;
        }

        public Game Game { get; set; } = default!;
        public List<Game> RelatedGames { get; set; } = new();

        public async Task OnGetAsync(int id)
        {
            // Busca o jogo pelo ID
            Game = await _context.Games.Include(g => g.UserFavorites)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (Game == null)
            {
                RedirectToPage("/NotFound");
                return;
            }

            // Busca jogos relacionados pela mesma categoria
            RelatedGames = await _context.Games
                .Where(g => g.Category == Game.Category && g.Id != Game.Id)
                .Take(3)
                .ToListAsync();

            // Se não houver jogos relacionados, busca outros jogos
            if (!RelatedGames.Any())
            {
                RelatedGames = await _context.Games
                    .Where(g => g.Id != Game.Id)
                    .Take(3)
                    .ToListAsync();
            }
        }
    }
}
