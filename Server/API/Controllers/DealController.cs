using Microsoft.AspNetCore.Mvc;
using Service;

namespace API.Controllers;

public class DealController(DealService service) : ControllerBase
{
    [HttpPost(nameof(SellItem))]
    public Dtos.ReceiptDto SellItem(Dtos.DealRequestDto dto)
    {
        return service.SellItem(dto);
    }

    [HttpGet(nameof(GetReceiptById))]
    public Dtos.ReceiptDto GetReceiptById(int id)
    {
        return service.GetReceiptById(id);
    }

    [HttpGet(nameof(GetReceiptsByUserId))]
    public List<Dtos.ReceiptDto> GetReceiptsByUserId(int id)
    {
        return service.GetReceiptsByUserId(id);
    }



}