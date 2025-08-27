using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using AuthApi.Models;

namespace AuthApi.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole, string>
{
  public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
  {
  }

  public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
  public DbSet<TodoItem> TodoItems => Set<TodoItem>();

  protected override void OnModelCreating(ModelBuilder builder)
  {
    base.OnModelCreating(builder);
    builder.Entity<RefreshToken>()
        .HasIndex(r => r.Token)
        .IsUnique();
    builder.Entity<RefreshToken>()
        .HasOne(r => r.User)
        .WithMany(u => u.RefreshTokens)
        .HasForeignKey(r => r.UserId)
        .OnDelete(DeleteBehavior.Cascade);

    builder.Entity<TodoItem>()
        .HasOne(t => t.Owner)
        .WithMany()
        .HasForeignKey(t => t.OwnerId)
        .OnDelete(DeleteBehavior.Cascade);
  }
}
