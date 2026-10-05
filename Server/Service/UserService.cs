using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata;
using Infra;
using LinqToDB;
using Microsoft.AspNetCore.Builder;

namespace Service;

public class UserService(MyDatabaseConnection db)
{
    public Dtos.UserDto CreateUser(Dtos.CreateUserDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.UserName)) throw new ValidationException("Username cannot be empty");
        if (db.Users.Any(u => u.UserName.ToLower().Trim() == dto.UserName.ToLower().Trim()))
            throw new ValidationException("User with this username already exists");

        var item = new UserItem
        {
            UserName = dto.UserName.Trim(),
            AvatarUrl = dto.AvatarUrl,
            Role = dto.Role,
            IsBanned = false
        };
        item.UserId = db.InsertWithInt32Identity(item);
        
        return new Dtos.UserDto(item.UserId, item.UserName, item.AvatarUrl, item.Role, item.IsBanned);
    }

    public List<Dtos.UserDto> GetUsers()
    {
        return db.Users.Select(u => new Dtos.UserDto(
            u.UserId,
            u.UserName,
            u.AvatarUrl,
            u.Role,
            u.IsBanned)).ToList();
    }

    public Dtos.UserDto GetUserById(int userId)
    {
        if (!db.Users.Any(user => user.UserId == userId)) throw new KeyNotFoundException("No user with this id");

        var user = db.Users.Where(u => u.UserId == userId).Select(u => new Dtos.UserDto(
            u.UserId,
            u.UserName,
            u.AvatarUrl,
            u.Role,
            u.IsBanned)).FirstOrDefault();
        
        return user;
    }

    public Dtos.UserDto UpdateUser(int userId, Dtos.CreateUserDto dto)
    {
        if (!db.Users.Any(u => u.UserId == userId)) throw new KeyNotFoundException("No user with this id");

        if (string.IsNullOrWhiteSpace(dto.UserName)) throw new ValidationException("Username cannot be null");
        if (db.Users.Any(u => u.UserName.ToLower().Trim() == dto.UserName.ToLower().Trim()))
            throw new ValidationException("User with this username already exists");


        var user = db.Users.FirstOrDefault(u => u.UserId == userId);

        user.UserName = dto.UserName;
        user.AvatarUrl = dto.AvatarUrl;
        db.Update(user);
        
        return new Dtos.UserDto(user.UserId, user.UserName, user.AvatarUrl, user.Role, user.IsBanned);
    }

    public void DeleteUser(int userId)
    {
        if (!db.Users.Any(u => u.UserId == userId)) throw new KeyNotFoundException("No user with this id");
        
        var hasDeals = db.Deals.Any(d => d.Buyer_Id == userId || d.Seller_Id == userId);
        
        var user = db.Users.FirstOrDefault(u => u.UserId == userId);

        using var transaction = db.BeginTransaction();

        if (hasDeals)
        {
            db.Users
                .Where(u => u.UserId == userId)
                .Set(u => u.IsBanned, true)
                .Update();
            
            db.Items
                .Where(l => l.OwnerId == userId)
                .Set(l => l.IsListed, false)
                .Update();
        }
        else
        {
            db.Items.Where(l => l.OwnerId == userId).Delete();
            
            db.Delete(user);
        }
        
        transaction.Commit();
    }

    public Dtos.UserDto BanUser(int userId)
    {
        var item = db.Users.FirstOrDefault(u => u.UserId == userId);
        if (item == null) throw new KeyNotFoundException("No such user");
        if (item.IsBanned) throw new ValidationException("User is already banned");
        
        using var transaction = db.BeginTransaction();
        
        db.Users.Where(u => u.UserId == userId).Set(u => u.IsBanned, true).Update();

        db.Items.Where(l => l.OwnerId == userId && l.IsListed).Set(l => l.IsListed, false).Update();
        
        transaction.Commit();

        return GetUserById(userId);

    }

    public Dtos.UserDto Login(Dtos.LoginRequestDto dto)
    {
        if(string.IsNullOrWhiteSpace(dto.Username)) throw new ValidationException("Username cannot be empty");
        var trimmedUsername = dto.Username.ToLower().Trim();
        
        var user = db.Users.FirstOrDefault(u => u.UserName.ToLower().Trim() == trimmedUsername);
        if (user == null) throw new KeyNotFoundException("No user with this username");
        
        if(user.IsBanned) throw new ValidationException("User is already banned");
        
        if(user.Role != dto.SelectedRole) throw new ValidationException($"Access denied, this user is not a {dto.SelectedRole}");
        
        return new Dtos.UserDto(user.UserId, user.UserName, user.AvatarUrl, user.Role, user.IsBanned);
    }
}