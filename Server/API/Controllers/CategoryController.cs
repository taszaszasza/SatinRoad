using Microsoft.AspNetCore.Mvc;
using Service;

namespace API.Controllers;

public class CategoryController(CategoryService service) : ControllerBase
{
    [HttpGet(nameof(GetCategories))]
    public List<Dtos.CategoryDto> GetCategories()
    {
        return service.GetCategories();
    }

    [HttpPost(nameof(CreateCategory))]
    public Dtos.CategoryDto CreateCategory(Dtos.CreateCategoryDto dto)
    {
        return service.CreateCategory(dto);
    }

    [HttpPut(nameof(UpdateCategory))]
    public Dtos.CategoryDto UpdateCategory(int id, Dtos.CreateCategoryDto dto)
    {
        return service.UpdateCategory(id, dto);
    }

    [HttpDelete(nameof(DeleteCategory))]
    public void DeleteCategory(int id)
    {
        service.DeleteCategory(id);
    }

}