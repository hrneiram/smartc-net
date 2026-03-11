using SmartC.DTOs;
using SmartC.Models;

namespace SmartC.Services;

public interface IAuthService
{
    AuthResponseDto Login(LoginDto dto);
    User Register(RegisterDto dto);
}