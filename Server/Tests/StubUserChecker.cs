using Service;

namespace Tests;

public class StubUserChecker : IUserStatusChecker
{
    public bool ReturnBanned { get; set; }
    public bool isUserBanned(int userId)
    {
        return ReturnBanned;    
    }
}