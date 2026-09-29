using Infra;
using LinqToDB;
using Service;
using Tests.API;

var builder = WebApplication.CreateBuilder(args);


var options = new DataOptions<MyDatabaseConnection>(
    new DataOptions().UseSQLite("Data Source=../Infra/db.db"));

builder.Services.AddScoped<MyDatabaseConnection>(_ => new MyDatabaseConnection(options));

builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<ListingService>();
builder.Services.AddScoped<DealService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddControllers();
builder.Services.AddOpenApiDocument();
builder.Services.AddCors();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<MyExceptionHandler>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<MyDatabaseConnection>();
    db.CreateTable<UserItem>(tableOptions: TableOptions.CreateIfNotExists);
    db.CreateTable<ListingItem>(tableOptions: TableOptions.CreateIfNotExists);
    db.CreateTable<DealItem>(tableOptions: TableOptions.CreateIfNotExists);
    db.CreateTable<CategoryItem>(tableOptions: TableOptions.CreateIfNotExists);

}

app.UseExceptionHandler();
app.UseCors(config => config
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowAnyOrigin()
    .SetIsOriginAllowed(_ => true));
    
    app.MapControllers();
    app.UseOpenApi();
    app.UseSwaggerUi();
    app.Run();