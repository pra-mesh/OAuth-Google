using AuthApi.Models;

namespace AuthApi.Services;

public interface ITokenService
{
  (string accessToken, DateTime expiresAt) CreateAccessToken(ApplicationUser user, IList<string> roles);
  string GenerateRefreshToken();
}
