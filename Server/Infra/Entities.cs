using LinqToDB.Mapping;

namespace Infra;

public class UserItem
{
    [PrimaryKey, Identity] public int UserId { get; set; }
    [NotNull] public string UserName { get; set; }
    public string AvatarURL { get; set; }
    public int ItemsSold { get; set; }
    public enum Role
    {
        
    }
    
}