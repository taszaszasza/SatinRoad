using LinqToDB;
using LinqToDB.Data;

namespace Infra;

public class MyDatabaseConnection : DataConnection
{
    public MyDatabaseConnection(DataOptions<MyDatabaseConnection> options) : base(options.Options)
    {
    }

    public ITable<UserItem> Users => this.GetTable<UserItem>();
    public ITable<ListingItem> Items => this.GetTable<ListingItem>();
    public ITable<CategoryItem> Categories => this.GetTable<CategoryItem>();
    public ITable<DealItem> Deals => this.GetTable<DealItem>();
}