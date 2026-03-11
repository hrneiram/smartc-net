using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using SmartC.DTOs;
using SmartC.Models;
using SmartC.Services;

namespace SmartC.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {
        try
        {
            AuthResponseDto response = _authService.Login(dto);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("register")]
    public IActionResult Register(RegisterDto dto)
    {
        try
        {
            User user = _authService.Register(dto);
            return Ok(new {message = "User Registered", email = user.Email, role = user.Role.ToString() });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}