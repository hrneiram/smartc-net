using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SmartC.Data;
using SmartC.DTOs;
using SmartC.Models;

namespace SmartC.Services;

public class AuthService : IAuthService
{
    private readonly IConfiguration _config;
    private readonly AppDbContext _appDbContext;

    // private static readonly List<User> _users = new()
    // {
    //     new User { Id = 1, Email = "admin@test.com", Password = "admin123", Role = Role.Admin },
    //     new User { Id = 2, Email = "viewer@test.com", Password = "viewer123", Role = Role.Viewer }
    // };

    public AuthService(IConfiguration config, AppDbContext appDbContext)
    {
        _config = config;
        _appDbContext = appDbContext;
    }

    public AuthResponseDto Login(LoginDto dto)
    {
        User? user = _appDbContext.Users.FirstOrDefault(user =>
        user.Email == dto.Email &&
        user.Password == dto.Password
        );

        if (user == null)
            throw new UnauthorizedAccessException("Invalid Credentials");

        var token = GenerateToken(user);

        return token;

    }
    public User Register(RegisterDto dto)
    {
        if (_appDbContext.Users.Any(user => user.Email == dto.Email))
            throw new InvalidOperationException("The email is already registered");

        User user = new User
        {
            Email = dto.Email,
            Password = dto.Password,
            Role = Role.Viewer
        };

        _appDbContext.Users.Add(user);
        return user;
    }

    private AuthResponseDto GenerateToken(User user)
    {
        SymmetricSecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));

        SigningCredentials credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        Claim[] claims =
        [
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        ];

        DateTime expiration = DateTime.UtcNow.AddMinutes(
            double.Parse(_config["Jwt:ExpireMinutes"]!));

        JwtSecurityToken token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: expiration,
            signingCredentials: credentials
        );

        return new AuthResponseDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Expiration = expiration,
            Role = user.Role.ToString()
        };
    }
}