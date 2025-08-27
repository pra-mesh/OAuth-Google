using System.ComponentModel.DataAnnotations;

namespace AuthApi.Models;

public class TodoItem
{
  public int Id { get; set; }
  [Required]
  public string Title { get; set; } = string.Empty;
  public bool IsCompleted { get; set; }
  [Required]
  public string OwnerId { get; set; } = string.Empty;
  public ApplicationUser? Owner { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
