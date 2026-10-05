using LinqToDB.Mapping;

namespace Infra;

public enum Role
{
    User = 1,
    Admin = 0
}

public class UserItem
{
    [PrimaryKey, Identity] public int UserId { get; set; }
    [NotNull] public string UserName { get; set; } = null!;
    public string? AvatarUrl { get; set; }
    [NotNull] public Role Role { get; set; } = Role.User;
    [NotNull] public bool IsBanned { get; set; } = false;

    [Association(ThisKey = nameof(UserId), OtherKey = nameof(ListingItem.OwnerId))]
    public List<ListingItem> Inventory { get; set; } = new();

}

public class ListingItem
{
    [PrimaryKey, Identity] public int ListingId { get; set; }
    [NotNull] public string ListingName { get; set; } = null!;
    public string? ListingDescription { get; set; }
    public string? ImageURL { get; set; }
    [NotNull] public decimal Price { get; set; } = 0;
    public bool IsListed { get; set; } = true;
    
    [NotNull] public int OwnerId { get; set; }

    [Association(ThisKey = nameof(OwnerId), OtherKey = nameof(UserItem.UserId))]
    [NotNull] public UserItem Owner { get; set; }
    
    [NotNull] public int CategoryId { get; set; }
    
    [Association(ThisKey = nameof(CategoryId), OtherKey = nameof(CategoryItem.CategoryId))]
    [NotNull] public CategoryItem Category { get; set; }
    
}

public class CategoryItem
{
    [PrimaryKey, Identity] public int CategoryId { get; set; }
    [NotNull] public string CategoryName { get; set; } = null!;
    public string? CategoryDescription { get; set; }

    [Association(ThisKey = nameof(CategoryId), OtherKey = nameof(ListingItem.CategoryId))]
    public List<ListingItem> ListingItems { get; set; } = new();
}

public class DealItem
{
    [PrimaryKey, Identity] public int DealId { get; set; }
    [NotNull] public int Seller_Id { get; set; }
    [Association(ThisKey = nameof(Seller_Id), OtherKey = nameof(UserItem.UserId))]
    [NotNull] public UserItem Seller { get; set; }
    
    [NotNull] public int Buyer_Id { get; set; }
    [Association(ThisKey = nameof(Buyer_Id), OtherKey = nameof(UserItem.UserId))]
    [NotNull] public UserItem Buyer { get; set; }
    
    [NotNull] public DateTime Date { get; set; }
    
    [NotNull] public int ListingId { get; set; }
    [Association(ThisKey = nameof(ListingId), OtherKey = nameof(ListingItem.ListingId))]
    [NotNull] public ListingItem Listing { get; set; }
    
    
}