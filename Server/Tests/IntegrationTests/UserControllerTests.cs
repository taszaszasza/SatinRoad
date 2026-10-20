using System.Net;
using Infra;
using Service;

namespace Tests;

public class UserControllerTests(CustomWebApplicationFactory factory) : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client =  factory.CreateClient();
    
    [Fact]
    public async Task Post_And_Get_Users_ReturnsCreatedAndSuccess()
    {
        var request = new Dtos.CreateUserDto("Tasza", "https://exampleimg.com", Role.User);
        var postResponse = await _client.PostAsJsonAsync("/api/user/CreateUser", request);
        Assert.Equal(HttpStatusCode.OK, postResponse.StatusCode);
        
        var getResponse = await _client.GetAsync("/api/user/GetUsers");
        var users = await getResponse.Content.ReadFromJsonAsync<List<Dtos.UserDto>>();
        
        Assert.NotNull(users);
        Assert.Single(users);
        Assert.Equal("Tasza", users[0].UserName);
    }


    [Fact]
    public async Task Post_And_Get_InvalidUsers_ReturnsNotFound()
    {
        var request = new Dtos.CreateUserDto(" ", "https://exampleimg.com", Role.User);
        var postResponse = await _client.PostAsJsonAsync("/api/user/CreateUser", request);
        Assert.Equal(HttpStatusCode.BadRequest, postResponse.StatusCode);
        
        var getResponse = await _client.GetAsync("/api/user/GetUsers");
        var users = await getResponse.Content.ReadFromJsonAsync<List<Dtos.UserDto>>();
        
        Assert.Empty(users);
        
    }

    [Fact]
    public async Task Get_By_Id_ReturnsUser()
    {
        var request = new Dtos.CreateUserDto("Tasza", "https://exampleimg.com", Role.User);
        var postResponse = await _client.PostAsJsonAsync("/api/user/CreateUser", request);
        postResponse.EnsureSuccessStatusCode();
        
        var createdFirstUser = await postResponse.Content.ReadFromJsonAsync<Dtos.UserDto>();
        Assert.NotNull(createdFirstUser);
        
        var anotherRequest = new Dtos.CreateUserDto("Tasza2", "https://exampleimg2.com", Role.User);
        var postAnotherResponse = await _client.PostAsJsonAsync("/api/user/CreateUser", anotherRequest);
        postAnotherResponse.EnsureSuccessStatusCode();

        
        var getResponse = await _client.GetAsync($"/api/user/GetUserById?userId={createdFirstUser.UserId}");
        
        var user = await getResponse.Content.ReadFromJsonAsync<Dtos.UserDto>();
        
        Assert.NotNull(user);
        Assert.Equal(createdFirstUser.UserId, user.UserId);
        Assert.Equal("Tasza", user.UserName);
        Assert.Equal("https://exampleimg.com", user.AvatarUrl);
    }
}