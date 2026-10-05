using System.ComponentModel.DataAnnotations;
using Infra;
using LinqToDB;

namespace Service;

public class DealService(MyDatabaseConnection db)
{
    public Dtos.ReceiptDto SellItem(Dtos.DealRequestDto dto)
    {
        var listing = db.Items.FirstOrDefault(l => l.ListingId == dto.ListingId);
        if (listing == null) throw new ValidationException("No such listing");
        if(!listing.IsListed) throw new ValidationException("Listing is currently inactive");
        if (listing.OwnerId == dto.BuyerId) throw new ValidationException("You cant buy your own item");

        var isBanned = db.Users.Where(u => u.UserId == listing.OwnerId).Select(u => u.IsBanned).FirstOrDefault();
        if (isBanned) throw new ValidationException("This seller was banned");

        var buyer = db.Users.FirstOrDefault(u => u.UserId == dto.BuyerId);
        if (buyer == null) throw new ValidationException("Buyer not found");
        if(buyer.IsBanned) throw new ValidationException("This buyer was banned");

        using var transaction = db.BeginTransaction();

        var affected = db.Items.Where(l => l.ListingId == dto.ListingId && l.IsListed)
            .Set(l => l.IsListed, false).Update();

        if (affected == 0) throw new ValidationException("this listing was just bought or deactivated");

        var deal = new DealItem
        {
            Seller_Id = listing.OwnerId,
            Buyer_Id = dto.BuyerId,
            Date = DateTime.UtcNow,
            ListingId = dto.ListingId
        };

        deal.DealId = db.InsertWithInt32Identity(deal);
        transaction.Commit();

        return GetReceiptById(deal.DealId);

    }

    public Dtos.ReceiptDto GetReceiptById(int dealId)
    {
        var deal = db.Deals.Where(d => d.DealId == dealId).Select(d => new Dtos.ReceiptDto(
            d.DealId,
            d.Date,
            d.ListingId,
            d.Listing.ListingName,
            d.Listing.Price,
            d.Listing.ImageURL,
            d.Seller_Id,
            d.Seller.UserName,
            d.Buyer_Id,
            d.Buyer.UserName)).FirstOrDefault();
        
        if (deal == null) throw new ValidationException("No such transaction");
        
        return deal;
    }

    public List<Dtos.ReceiptDto> GetReceiptsByUserId(int userId)
    {
        if (!db.Users.Any(u => u.UserId == userId)) throw new KeyNotFoundException("This user doesnt exist");

        return db.Deals.Where(d => d.Seller_Id == userId || d.Buyer_Id == userId)
            .Select(d => new Dtos.ReceiptDto(
            d.DealId,
            d.Date,
            d.ListingId,
            d.Listing.ListingName,
            d.Listing.Price,
            d.Listing.ImageURL,
            d.Seller_Id,
            d.Seller.UserName,
            d.Buyer_Id,
            d.Buyer.UserName)).OrderByDescending(d => d.Date).ToList();
    }
}