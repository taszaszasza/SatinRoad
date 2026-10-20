using Infra;
using LinqToDB;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;

namespace Tests;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private SqliteConnection _connection;
    private const string ConnectionString = "Data Source=TestDB;Mode=Memory;Cache=Shared";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DataOptions<MyDatabaseConnection>));
            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            _connection = new SqliteConnection(ConnectionString);
            _connection.Open();

            var options = new DataOptions<MyDatabaseConnection>(new DataOptions().UseSQLite(ConnectionString));

            services.AddScoped<MyDatabaseConnection>(_ => new MyDatabaseConnection(options));

            using var sp = services.BuildServiceProvider();
            using var scope = sp.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<MyDatabaseConnection>();

            db.DropTable<DealItem>(tableOptions: TableOptions.DropIfExists);
            db.DropTable<ListingItem>(tableOptions: TableOptions.DropIfExists);
            db.DropTable<CategoryItem>(tableOptions: TableOptions.DropIfExists);
            db.DropTable<UserItem>(tableOptions: TableOptions.DropIfExists);

            db.CreateTable<UserItem>();
            db.CreateTable<CategoryItem>();
            db.CreateTable<ListingItem>();
            db.CreateTable<DealItem>();
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        _connection?.Close();
        _connection?.Dispose();
    }
}