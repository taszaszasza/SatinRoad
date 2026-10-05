using Infra;

namespace Service;

public class Dtos
{
    public record CreateUserDto(
        string UserName,
        string? AvatarUrl,
        Role Role = Role.User
    );

    public record UserDto(
        int UserId,
        string UserName,
        string? AvatarUrl,
        Role Role,
        bool IsBanned
        );

    public record CategoryDto(
        int CategoryId,
        string CategoryName,
        string? CategoryDescription
        );

    public record CreateCategoryDto(
        string CategoryName,
        string? CategoryDescription
        );

    public record ListingDto(
        int ListingId,
        string ListingName,
        string? ListingDescription,
        decimal Price,
        string? ImageUrl,
        int CategoryId,
        string CategoryName,
        int OwnerId,
        string OwnerName
        );

    public record CreateListingDto(
        string ListingName,
        string? ListingDescription,
        decimal Price,
        string? ImageUrl,
        int CategoryId,
        int OwnerId
    );

    public record UpdateListingDto(
        string ListingName,
        string? ListingDescription,
        decimal Price,
        string? ImageUrl,
        int CategoryId
        );

    public record GetListingDto(
        int ListingId,
        string ListingName,
        string? ListingDescription,
        decimal Price,
        string? ImageUrl,
        int CategoryId,
        string CategoryName,
        int OwnerId,
        string OwnerName

    );

    public record DealRequestDto(
        int ListingId,
        int BuyerId
    );

    public record ReceiptDto(
        int DealId,
        DateTime Date,
        int ListingId,
        string ListingName,
        decimal PricePaid,
        string? ImageUrl,
        int SellerId,
        string SellerName,
        int BuyerId,
        string BuyerName
    );

    public record LoginRequestDto(
        string Username,
        Role SelectedRole
        );


}