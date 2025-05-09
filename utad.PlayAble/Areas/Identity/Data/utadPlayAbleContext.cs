using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using utad.PlayAble.Models;

namespace utad.PlayAble.Data;

public class utadPlayAbleContext : IdentityDbContext<ApplicationUser>
{
    public utadPlayAbleContext(DbContextOptions<utadPlayAbleContext> options)
        : base(options)
    {
    }

    public DbSet<Game> Games { get; set; }
    public DbSet<UserFavoriteGame> UserFavoriteGames { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurar a relação muitos-para-muitos entre User e Game (UserFavoriteGame)
        modelBuilder.Entity<UserFavoriteGame>()
            .HasKey(ufg => new { ufg.UserId, ufg.GameId });

        modelBuilder.Entity<UserFavoriteGame>()
            .HasOne(ufg => ufg.User)
            .WithMany(u => u.FavoriteGames)
            .HasForeignKey(ufg => ufg.UserId);

        modelBuilder.Entity<UserFavoriteGame>()
            .HasOne(ufg => ufg.Game)
            .WithMany(g => g.UserFavorites)
            .HasForeignKey(ufg => ufg.GameId);

        modelBuilder.Entity<Game>().HasData(
            new Game
            {
                Id = 1,
                Name = "Tetris",
                Description = "O clássico jogo de quebra-cabeças onde você deve encaixar peças que caem para formar linhas completas.",
                Category = "Puzzle",
                ImageUrl = "/images/games/tetris.jpg",
                PartialViewName = "e/_tetris",
                FavoriteCount = 120,
                Instructions = "Use as setas do teclado para mover as peças. Pressione a tecla para baixo para acelerar a queda. Pressione a tecla de espaço para girar a peça.",
                DateAdded = DateTime.Now
            });

    }
}
