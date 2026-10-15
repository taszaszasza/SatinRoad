# 1. Build environment (SDK)
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

# Copy all project files from Server/ into the container
COPY . .

# Restore dependencies across the solution
RUN dotnet restore API/API.csproj

# Build and publish your API project
RUN dotnet publish API/API.csproj -c Release -o /app/publish

# 2. Production runtime environment (smaller, faster)
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Fly expects traffic on 8080 by default
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "API.dll"]