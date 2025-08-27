# AuthApi

ASP.NET Core 9 Web API with:

- Entity Framework Core (SQL Server LocalDB)
- ASP.NET Core Identity (JWT + Refresh Tokens)
- Google OAuth2 external login
- Swagger (JWT auth support)
- Sample protected CRUD (Todo items)

## Configuration

Edit `AuthApi/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=AuthApiDb;Trusted_Connection=True;MultipleActiveResultSets=true"
},
"Jwt": {
  "Issuer": "AuthApi",
  "Audience": "AuthApiAudience",
  "Key": "CHANGE_ME_Key",
  "AccessTokenMinutes": 30,
  "RefreshTokenDays": 7
},
"GoogleAuth": {
  "ClientId": "<your-client-id>",
  "ClientSecret": "<your-client-secret>"
}
```

Replace the Jwt Key with a long secret and set Google credentials.

## Run

```bash
dotnet build
cd AuthApi
dotnet run
```

Swagger UI: https://localhost:5001/swagger (port may vary).

## Auth Flow

1. Register: POST `/api/auth/register` JSON: `{ "email": "user@example.com", "password": "Pass123$" }`
2. Login: POST `/api/auth/login`
3. Use `accessToken` as: `Authorization: Bearer <token>`
4. Refresh: POST `/api/auth/refresh` `{ "refreshToken": "..." }`
5. Google: GET `/api/externalauth/google-login`

## Todo Endpoints (require Bearer token)
- GET `/api/todo`
- POST `/api/todo` `{ "title": "Test" }`
- GET `/api/todo/{id}`
- PUT `/api/todo/{id}`
- DELETE `/api/todo/{id}`

## Migrations
If the model changes:

```bash
dotnet ef migrations add SomeChange --project AuthApi --startup-project AuthApi
dotnet ef database update --project AuthApi --startup-project AuthApi
```

## Notes

- Refresh tokens are rotated on refresh.
- Add role management as needed with `RoleManager`.
- For production, store secrets in User Secrets or environment variables.
