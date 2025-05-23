using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using utad.PlayAble.Models;
using utad.PlayAble.Data;

namespace utad.PlayAble.Pages;

public class ListModel(utadPlayAbleContext context) : PageModel
{
    public List<Game> Results { get; set; } = new();
    public List<Game> FavouriteGames { get; set; } = new();

    public async Task OnGetAsync()
    {
        
        var q = Request.Query["q"].ToString();
        var npp = Request.Query["npp"].ToString();
        var np = Request.Query["np"].ToString();
        var sort = Request.Query["sort"].ToString();
        var generos = Request.Query["generos"].ToString();
        var favoritos = Request.Query["favoritos"].ToString();
        
        var query = q?.ToLower();
        
       
        if (string.IsNullOrEmpty(query))    
        {
            query = string.Empty;
        }
        
        
        var categories = await context.Games
            .Select(g => g.Category)
            .Distinct()
            .ToListAsync();
        
        
        // Add default categories if they don't exist
        var defaultCategories = new[] 
        {
            "Matemática", 
            "Letras", 
            "Ciência",
            "Geografia", 
            "Colorir", 
            "Música",
            "Memória",
            "Puzzle",
        };

        categories.AddRange(defaultCategories.Except(categories));
        categories.Sort();
        
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        ViewData["cgeneros"] = categories;
        
        IQueryable<Game> gamesQuery = context.Games;
        
        // Verifica se o utilizador está autenticado
        if (!string.IsNullOrEmpty((favoritos)))
        {
            if (favoritos == "true")
            {
                if (!string.IsNullOrEmpty(userId) && User.Identity?.IsAuthenticated == true)
                {
                    var favoriteGames = await context.UserFavoriteGames
                        .Where(f => f.UserId == userId)
                        .Select(f => f.GameId)
                        .ToListAsync();

                    gamesQuery = gamesQuery.Where(g => favoriteGames.Contains(g.Id));
                }
            }
        }
        
        if (!string.IsNullOrEmpty(query))
        {
            gamesQuery = gamesQuery.Where(g => g.Name.ToLower().Contains(query) || g.Description.ToLower().Contains(query));
        }

        // Filtro por géneros
        if (!string.IsNullOrEmpty(generos))
        {
            var generosList = generos.Split(';').ToList();
            gamesQuery = gamesQuery.Where(g => generosList.Contains(g.Category));
        }

        // Ordenação
        if (!string.IsNullOrEmpty(sort))
        {
            switch (sort)
            {
                case "alpha-az":
                    gamesQuery = gamesQuery.OrderBy(g => g.Name);
                    break;
                case "alpha-za":
                    gamesQuery = gamesQuery.OrderByDescending(g => g.Name);
                    break;
                case "data-desc":
                    gamesQuery = gamesQuery.OrderByDescending(g => g.DateAdded);
                    break;
                case "data-asc":
                    gamesQuery = gamesQuery.OrderBy(g => g.DateAdded);
                    break;
                case "popular":
                    gamesQuery = gamesQuery.OrderByDescending(g => g.FavoriteCount);
                    break;
                case "popular-inv":
                    gamesQuery = gamesQuery.OrderBy(g => g.FavoriteCount);
                    break;
                default:
                    gamesQuery = gamesQuery.OrderBy(g => g.Name);
                    break;
            }
        }
        else
        {
            gamesQuery = gamesQuery.OrderBy(g => g.Name);
        }

        // Paginação
        int numPorPagina = 15;
        int numPagina = 1;
        if (!string.IsNullOrEmpty(npp) && int.TryParse(npp, out int parsedNpp))
        {
            numPorPagina = parsedNpp;
        }
        if (!string.IsNullOrEmpty(np) && int.TryParse(np, out int parsedNp))
        {
            numPagina = parsedNp;
        }
        int skipQuant = (numPagina - 1) * numPorPagina;

        var numResultados = await gamesQuery.CountAsync();
        Results = await gamesQuery.Skip(skipQuant).Take(numPorPagina).ToListAsync();
        var numNaPagina = Results.Count;

        ViewData["textoresultados"] = $"A mostrar {numNaPagina} de {numResultados} resultados";
        ViewData["currentPage"] = numPagina;
        ViewData["totalPages"] = (int)Math.Ceiling((double)numResultados / numPorPagina);
        ViewData["resultados"] = Results;
    }

}
