using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AuthApi.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace AuthApi.Services;

public class TokenService : ITokenService
{
  private readonly IConfiguration _config;
  public TokenService(IConfiguration config)
  {
    _config = config;
  }

  public (string accessToken, DateTime expiresAt) CreateAccessToken(ApplicationUser user, IList<string> roles)
  {
    var jwtSection = _config.GetSection("Jwt");
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]!));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    var expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSection["AccessTokenMinutes"]!));

    var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(ClaimTypes.NameIdentifier, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new("displayName", user.DisplayName ?? string.Empty)
        };
    claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

    var token = new JwtSecurityToken(
        issuer: jwtSection["Issuer"],
        audience: jwtSection["Audience"],
        claims: claims,
        expires: expires,
        signingCredentials: creds
    );

    var jwt = new JwtSecurityTokenHandler().WriteToken(token);
    return (jwt, expires);
  }

  public string GenerateRefreshToken()
  {
    var bytes = RandomNumberGenerator.GetBytes(64);
    return Convert.ToBase64String(bytes);
  }
}
