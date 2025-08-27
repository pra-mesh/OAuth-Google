using System.Security.Claims;
using AuthApi.Data;
using AuthApi.DTOs;
using AuthApi.Models;
using AuthApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuthApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
  private readonly UserManager<ApplicationUser> _userManager;
  private readonly SignInManager<ApplicationUser> _signInManager;
  private readonly ApplicationDbContext _db;
  private readonly ITokenService _tokenService;
  private readonly IConfiguration _config;

  public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, ApplicationDbContext db, ITokenService tokenService, IConfiguration config)
  {
    _userManager = userManager;
    _signInManager = signInManager;
    _db = db;
    _tokenService = tokenService;
    _config = config;
  }

  [HttpPost("register")]
  public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
  {
    var existing = await _userManager.FindByEmailAsync(request.Email);
    if (existing != null) return BadRequest("Email already registered");
    var user = new ApplicationUser { UserName = request.Email, Email = request.Email, DisplayName = request.DisplayName };
    var result = await _userManager.CreateAsync(user, request.Password);
    if (!result.Succeeded) return BadRequest(result.Errors);
    return await GenerateAuthResponse(user);
  }

  [HttpPost("login")]
  public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
  {
    var user = await _userManager.FindByEmailAsync(request.Email);
    if (user == null) return Unauthorized();
    var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
    if (!result.Succeeded) return Unauthorized();
    return await GenerateAuthResponse(user);
  }

  [HttpPost("refresh")]
  public async Task<ActionResult<AuthResponse>> Refresh(RefreshRequest request)
  {
    var stored = await _db.RefreshTokens.Include(r => r.User).SingleOrDefaultAsync(r => r.Token == request.RefreshToken);
    if (stored == null || stored.ExpiresAt < DateTime.UtcNow || stored.Revoked) return Unauthorized();
    // rotate token
    stored.Revoked = true;
    var user = stored.User!;
    var newTokenString = _tokenService.GenerateRefreshToken();
    var jwtSection = _config.GetSection("Jwt");
    var refresh = new Models.RefreshToken
    {
      Token = newTokenString,
      UserId = user.Id,
      ExpiresAt = DateTime.UtcNow.AddDays(double.Parse(jwtSection["RefreshTokenDays"]!))
    };
    _db.RefreshTokens.Add(refresh);
    await _db.SaveChangesAsync();
    var roles = await _userManager.GetRolesAsync(user);
    var (access, exp) = _tokenService.CreateAccessToken(user, roles);
    return new AuthResponse(access, newTokenString, exp);
  }

  [Authorize]
  [HttpGet("me")]
  public async Task<ActionResult<object>> Me()
  {
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
    if (userId == null) return Unauthorized();
    var user = await _userManager.FindByIdAsync(userId);
    if (user == null) return Unauthorized();
    var roles = await _userManager.GetRolesAsync(user);
    return new { user.Id, user.Email, user.DisplayName, roles };
  }

  private async Task<AuthResponse> GenerateAuthResponse(ApplicationUser user)
  {
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
    return new AuthResponse(access, refreshToken, exp);
  }
}
