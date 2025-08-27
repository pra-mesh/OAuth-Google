using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthApi.Models;

public class RefreshToken
{
  [Key]
  public int Id { get; set; }
  [Required]
  public string Token { get; set; } = string.Empty;
  [Required]
  public string UserId { get; set; } = string.Empty;
  [ForeignKey(nameof(UserId))]
  public ApplicationUser? User { get; set; }
  public DateTime ExpiresAt { get; set; }
  public bool Revoked { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
