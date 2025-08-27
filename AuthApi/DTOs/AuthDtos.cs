namespace AuthApi.DTOs;

public record RegisterRequest(string Email, string Password, string? DisplayName);
public record LoginRequest(string Email, string Password);
public record AuthResponse(string AccessToken, string RefreshToken, DateTime ExpiresAt);
public record RefreshRequest(string RefreshToken);
