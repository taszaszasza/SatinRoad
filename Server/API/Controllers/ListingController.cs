using Microsoft.AspNetCore.Mvc;
using Service;

namespace API.Controllers;

public class ListingController(ListingService service) : ControllerBase
{
    [HttpPost(nameof(CreateListing))]
    public Dtos.ListingDto CreateListing(Dtos.CreateListingDto dto)
    {
        return service.CreateListing(dto);
    }
    
    [HttpGet(nameof(GetAllListings))]
    public List<Dtos.ListingDto> GetAllListings()
    {
        return service.GetAllListings();
    }

    [HttpGet(nameof(GetListingById))]
    public Dtos.ListingDto GetListingById(int id)
    {
        return service.GetListingById(id);
    }

    [HttpGet(nameof(GetListingByUserId))]
    public List<Dtos.ListingDto> GetListingByUserId(int id)
    {
        return service.GetListingsByUserId(id);
    }

    [HttpPut(nameof(UpdateListing))]
    public Dtos.ListingDto UpdateListing(int id, Dtos.UpdateListingDto dto)
    {
        return service.UpdateListing(id, dto);
    }

    [HttpDelete(nameof(DeleteListing))]
    public void DeleteListing(int id)
    {
        service.DeleteListing(id);
    }

    [HttpPut(nameof(ToggleActivateListing))]
    public Dtos.ListingDto ToggleActivateListing(int id)
    {
        return service.ToggleActivateListing(id);
    }
}