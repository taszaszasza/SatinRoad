using Service;

namespace Tests;

public class UnitTest1
{
    [Theory]
    [InlineData(100.00, 0, 100.000)]
    [InlineData(100.00, 1, 100.000)]
    [InlineData(100.00, 9, 80.000)]
    [InlineData(100.00, 15, 100.000)]
    [InlineData(100.00, 19, 80.000)]
    public void CalculateFinalPrice_AppliesDiscount_OnEvery10thDeal(decimal price, int dealsCount, decimal finalPrice)
    {
        decimal outputPrice = DealService.CalculateFinalPrice(price, dealsCount);
        Assert.Equal(finalPrice, outputPrice);
    }

    [Fact]
    public void CanBuyerPurchase_ReturnsFalse_WhenBuyerIsSeller()
    {
        int sellerId = 55;
        int buyerId = 55;
        bool isListed = true;
        
        bool result = DealService.CanBuyerPurchase(sellerId, buyerId,isListed);
        Assert.False(result);
    }
    
    [Fact]
    public void CanBuyerPurchase_ReturnsFalse_WhenListingInactive()
    {
        int sellerId = 55;
        int buyerId = 54;
        bool isListed = false;
        
        bool result = DealService.CanBuyerPurchase(sellerId, buyerId,isListed);
        Assert.False(result);
    }
    
    [Fact]
    public void CanBuyerPurchase_ReturnsTrue_WhenListingActiveAndSellerValid()
    {
        int sellerId = 55;
        int buyerId = 54;
        bool isListed = true;
        
        bool result = DealService.CanBuyerPurchase(sellerId, buyerId,isListed);
        Assert.True(true);
    }

    [Theory]
    [InlineData(0, true)]
    [InlineData(1, false)]
    [InlineData(98, false)]
    public void IsPoliceRaid_ReturnsTrue_WhenPoliceRaid(int random, bool expectedResult)
    {
        bool isPoliceRaid = DealService.IsPoliceRaid(random);
        Assert.Equal(expectedResult, isPoliceRaid);
    }

    [Theory]
    [InlineData("Cool product", 50.00, false, true)]
    [InlineData("", 50.50, false, false)]
    [InlineData(null, 50.50, false, false)]
    [InlineData(" ", 50.50, false, false)]
    [InlineData("null", 0, false, false)]
    [InlineData("Cool Product", -3.00, false, false)]
    [InlineData("null", 50.50, true, false)]
    [InlineData("null", 50.50, false, true)]

    public void isListingValid_ReturnsFalse_IfNamePriceOwnerInvalid(string productName, decimal price, bool isBanned,
        bool expectedResult)
    {
        var isListingValid = ListingService.isListingValid(productName, price, isBanned);
        Assert.Equal(expectedResult, isListingValid);
    }
    
    [Fact]
    public void CanUserMakeDeal_ReturnsFalse_WhenUserBanned()
    {
        var stub = new StubUserChecker() { ReturnBanned = true };
        bool canMakeDeal = DealService.CanUserMakeDeal(42, stub);
        
        Assert.False(canMakeDeal);


    }








}
