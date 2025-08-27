using Microsoft.AspNetCore.Identity;

namespace AuthApi.Models;

public class ApplicationUser : IdentityUser
{
  public string? DisplayName { get; set; }
  public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
