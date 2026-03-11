// id
// name
// email
// role
namespace SmartC.Models;

public class User
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public Role Role { get; set; } = Role.Viewer;
}