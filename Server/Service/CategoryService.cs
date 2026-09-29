using System.ComponentModel.DataAnnotations;
using Infra;
using LinqToDB;

namespace Service;

public class CategoryService(MyDatabaseConnection db)
{
    public List<Dtos.CategoryDto> GetCategories()
    {
        return db.Categories.Select(c => new Dtos.CategoryDto(
            c.CategoryId,
            c.CategoryName,
            c.CategoryDescription)).ToList();
    }

    public Dtos.CategoryDto CreateCategory(Dtos.CreateCategoryDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CategoryName)) throw new ValidationException("Category name cannot be empty");
        if (db.Categories.Any(c => c.CategoryName.ToLower().Trim() == dto.CategoryName.ToLower().Trim())) throw new ValidationException("Category name already exists");

        var item = new CategoryItem
        {
            CategoryName = dto.CategoryName.Trim(),
            CategoryDescription = dto.CategoryDescription
        };

        item.CategoryId = db.InsertWithInt32Identity(item);
        return new Dtos.CategoryDto(item.CategoryId, item.CategoryName, item.CategoryDescription);
    }

    public Dtos.CategoryDto UpdateCategory(int categoryId, Dtos.CreateCategoryDto dto)
    {
        var item = db.Categories.FirstOrDefault(c => c.CategoryId == categoryId);
        if (item == null) throw new KeyNotFoundException("Category not found");
        
        if (string.IsNullOrWhiteSpace(dto.CategoryName)) throw new ValidationException("Category name cannot be empty");

        item.CategoryName = dto.CategoryName.Trim();
        item.CategoryDescription = dto.CategoryDescription;

        db.Update(item);
        
        return new Dtos.CategoryDto(item.CategoryId, item.CategoryName, item.CategoryDescription);
    }

    public void DeleteCategory(int categoryId)
    {
        var item = db.Categories.FirstOrDefault(c => c.CategoryId == categoryId);
        if(item == null) throw new KeyNotFoundException("Category not found");

        var hasListings = db.Items.Any(i => i.CategoryId == categoryId);
        if (hasListings) throw new InvalidOperationException("Category contains listings - you are not allowed to delete it...");
        
        db.Delete(item);

    }
}