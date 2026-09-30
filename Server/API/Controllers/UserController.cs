using Microsoft.AspNetCore.Mvc;
using Service;

namespace API.Controllers;

public class UserController(UserService service) : ControllerBase
{
    [HttpPost(nameof(CreateUser))]
    public Dtos.UserDto CreateUser(Dtos.CreateUserDto dto)
    {
        return service.CreateUser(dto);
    }

    [HttpGet(nameof(GetUsers))]
    public List<Dtos.UserDto> GetUsers()
    {
        return service.GetUsers();
    }
    
    [HttpGet(nameof(GetUserById))]
    public Dtos.UserDto GetUserById([FromQuery] int userId)
    {
        return service.GetUserById(userId);
    }

    [HttpPut(nameof(UpdateUser))]
    public Dtos.UserDto UpdateUser([FromQuery] int id, Dtos.CreateUserDto dto)
    {
        return service.UpdateUser(id, dto);
    }
    
    [HttpDelete(nameof(DeleteUser))]
    public void  DeleteUser([FromQuery] int userId)
    {
        service.DeleteUser(userId);
    }

    [HttpPut(nameof(BanUser))]
    public Dtos.UserDto BanUser([FromQuery] int userId)
    {
        return service.BanUser(userId);
    }

}