using System.ComponentModel.DataAnnotations;

namespace utad.PlayAble.Models
{
    public class Game
    {
        [Key]
        public required string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        [StringLength(100)]
        public required string Name { get; set; }

        [StringLength(500)]
        public required string Description { get; set; }
        
        [StringLength(500)]
        public string ? Credits { get; set; }

        [StringLength(100)]
        public required string Category { get; set; }

        [StringLength(255)]
        public required string Path { get; set; }

        [StringLength(1000)]
        public required string Instructions { get; set; }

        public int FavoriteCount { get; set; }

        public required DateTime DateAdded { get; set; } = DateTime.Now;

        public ICollection<UserFavoriteGame> UserFavorites { get; set; } = new List<UserFavoriteGame>();
        
    }

    public class UserFavoriteGame
    {
        public required string UserId { get; set; }
        public required string GameId { get; set; }

        public required ApplicationUser User { get; set; }
        public required Game Game { get; set; }

        public required DateTime FavoritedAt { get; set; } = DateTime.Now;
    }
}