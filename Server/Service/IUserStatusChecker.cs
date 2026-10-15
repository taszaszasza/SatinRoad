namespace Service;

public interface IUserStatusChecker
{
    bool isUserBanned(int userId);
}