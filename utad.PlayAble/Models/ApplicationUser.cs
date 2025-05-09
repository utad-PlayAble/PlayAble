using Microsoft.AspNetCore.Identity;

namespace utad.PlayAble.Models
{
    public class ApplicationUser : IdentityUser
    {
        public DateTime RegistrationDate { get; set; } = DateTime.Now;
        public string? ProfilePictureUrl { get; set; }

        public ICollection<UserFavoriteGame> FavoriteGames { get; set; } = new List<UserFavoriteGame>();
    }
}