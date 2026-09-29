using System.ComponentModel.DataAnnotations;
using Infra;
using LinqToDB;

namespace Service;

public class ListingService(MyDatabaseConnection db)
{
    public Dtos.ListingDto CreateListingDto(Dtos.CreateListingDto dto)
    {
        if(string.IsNullOrWhiteSpace(dto.ListingName)) throw new ValidationException("Listing name is required");
        if (dto.Price <= 0) throw new ValidationException("Incorrect Price");
        var owner = db.Users.FirstOrDefault(u => u.UserId == dto.OwnerId);
        if(owner == null) throw new ValidationException("Owner not found");
        if(owner.IsBanned) throw new ValidationException("Owner is banned");
        if(!db.Categories.Any(c => c.CategoryId == dto.CategoryId)) throw new ValidationException("Category not found");

        var item = new ListingItem
        {
            ListingName = dto.ListingName.Trim(),
            ListingDescription = dto.ListingDescription,
            Price = dto.Price,
            ImageURL = dto.ImageUrl,
            CategoryId = dto.CategoryId,
            OwnerId = dto.OwnerId,
            IsListed = true
        };

        item.ListingId = db.InsertWithInt32Identity(item);
        
        return GetListingById(item.ListingId);
    }

    public List<Dtos.ListingDto> GetAllListings()
    {
        return db.Items
            .Where(i => i.IsListed)
            .Select(i => new Dtos.ListingDto(
            i.ListingId,
            i.ListingName,
            i.ListingDescription,
            i.Price,
            i.ImageURL,
            i.CategoryId,
            i.Category.CategoryName,
            i.OwnerId,
            i.Owner.UserName
        )).ToList();
    }

    public Dtos.ListingDto GetListingById(int listingId)
    {
        if (!db.Items.Any(i => i.ListingId == listingId)) throw new KeyNotFoundException("no such listing");

        var listing = db.Items.Where(l => l.ListingId == listingId).Select(l => new Dtos.ListingDto(
            l.ListingId,
            l.ListingName,
            l.ListingDescription,
            l.Price,
            l.ImageURL,
            l.CategoryId,
            l.Category.CategoryName,
            l.OwnerId,
            l.Owner.UserName)).FirstOrDefault();

        return listing;
    }

    public Dtos.ListingDto UpdateListing(int listingId, Dtos.UpdateListingDto dto)
    {
        if (!db.Items.Any(i => i.ListingId == listingId)) throw new KeyNotFoundException("no such listing");
        if (dto.Price <= 0) throw new ValidationException("Incorrect Price");
        if(!db.Categories.Any(c => c.CategoryId == dto.CategoryId)) throw new ValidationException("Category not found");
        if(string.IsNullOrWhiteSpace(dto.ListingName)) throw new ValidationException("Listing name is required");
        if (db.Deals.Any(d => d.ListingId == listingId)) throw new ValidationException("This item was already sold");


        var listing = db.Items.FirstOrDefault(l => l.ListingId == listingId);
        listing.ListingName = dto.ListingName;
        listing.ListingDescription = dto.ListingDescription;
        listing.Price = dto.Price;
        listing.ImageURL = dto.ImageUrl;
        listing.CategoryId = dto.CategoryId;

        db.Update(listing);
        
        return GetListingById(listingId);

    }

    public void DeleteListing(int listingId)
    {
        if (!db.Items.Any(i => i.ListingId == listingId)) throw new KeyNotFoundException("no such listing");
        if (db.Deals.Any(d => d.ListingId == listingId)) throw new ValidationException("This item was already sold");
        
        var listing = db.Items.FirstOrDefault(l => l.ListingId == listingId);
        db.Delete(listing);

    }
    
    public Dtos.ListingDto InactivateListing(int listingId)
    {
        if (!db.Items.Any(i => i.ListingId == listingId)) throw new KeyNotFoundException("no such listing");
        if (db.Deals.Any(d => d.ListingId == listingId)) throw new ValidationException("This item was already sold");


        var listing = db.Items.FirstOrDefault(l => l.ListingId == listingId);
        listing.IsListed = false;

        db.Update(listing);
        
        return GetListingById(listingId);

    } 
}