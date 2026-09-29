using LinqToDB;
using LinqToDB.Data;

namespace Infra;

public class MyDatabaseConnection : DataConnection
{
    public MyDatabaseConnection(DataOptions<MyDatabaseConnection> options) : base(options.Options)
    {
    }

    public ITable<User> Users => this.GetTable<User>();
    public ITable<Item> Items => this.GetTable<Item>();
    public ITable<Category> Categories => this.GetTable<Category>();
    public ITable<Deal> Deals => this.GetTable<Deal>();
}