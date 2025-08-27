using System.Security.Claims;
using AuthApi.Models;
using AuthApi.Services;
using AuthApi.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuthApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExternalAuthController : ControllerBase
{
  private readonly UserManager<ApplicationUser> _userManager;
  private readonly ITokenService _tokenService;
  private readonly ApplicationDbContext _db;
  private readonly IConfiguration _config;

  public ExternalAuthController(UserManager<ApplicationUser> userManager, ITokenService tokenService, ApplicationDbContext db, IConfiguration config)
  {
    _userManager = userManager;
    _tokenService = tokenService;
    _db = db;
    _config = config;
  }

  [HttpGet("google-login")]
  public IActionResult GoogleLogin(string? returnUrl = null)
  {
    var redirectUrl = Url.Action(nameof(GoogleCallback), "ExternalAuth", new { returnUrl });
    var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
    return Challenge(properties, GoogleDefaults.AuthenticationScheme);
  }

  [HttpGet("google-callback")]
  public async Task<ActionResult> GoogleCallback(string? returnUrl = null)
  {
    var result = await HttpContext.AuthenticateAsync(IdentityConstants.ExternalScheme);
    if (!result.Succeeded)
    {
      return BadRequest("External authentication failed");
    }
    var claims = result.Principal!.Claims.ToList();
    var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
    if (email == null) return BadRequest("Email not provided by Google");
    var user = await _userManager.FindByEmailAsync(email);
    if (user == null)
    {
      user = new ApplicationUser
      {
        UserName = email,
        Email = email,
        DisplayName = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value
      };
      var createResult = await _userManager.CreateAsync(user);
      if (!createResult.Succeeded) return BadRequest(createResult.Errors);
    }
    var roles = await _userManager.GetRolesAsync(user);
    var (access, exp) = _tokenService.CreateAccessToken(user, roles);
    var refreshToken = _tokenService.GenerateRefreshToken();
    var jwtSection = _config.GetSection("Jwt");
    var refresh = new Models.RefreshToken
    {
      Token = refreshToken,
      UserId = user.Id,
      ExpiresAt = DateTime.UtcNow.AddDays(double.Parse(jwtSection["RefreshTokenDays"]!))
    };
    _db.RefreshTokens.Add(refresh);
    await _db.SaveChangesAsync();

    return Ok(new { accessToken = access, refreshToken, expiresAt = exp });
  }
}
