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
        // Busca todas as categorias distintas
        var categories = await _context.Games
            .Select(g => g.Category)
            .Distinct()
            .ToListAsync();

        // Para cada categoria, busca os 3 primeiros jogos
        foreach (var category in categories)
        {
            var games = await _context.Games
                .Where(g => g.Category == category)
                .Take(3)
                .ToListAsync();

            GamesByCategory[category] = games;
        }
    }
}
