using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.EntityFrameworkCore;
using utad.PlayAble.Data;
using utad.PlayAble.Models;
using utad.PlayAble.Services;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("utadPlayAbleContextConnection") ?? throw new InvalidOperationException("Connection string 'utadPlayAbleContextConnection' not found.");

builder.Services.AddDbContext<utadPlayAbleContext>(options => options.UseSqlServer(connectionString));

builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true).AddEntityFrameworkStores<utadPlayAbleContext>();

builder.Services.AddScoped<GameMetadataService>();

// Add services to the container.
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

var options = new RewriteOptions()
    .AddRedirect(@"^games/(.+)/?$", "games/$1/index.html");

app.UseRewriter(options);



app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var gameService = services.GetRequiredService<GameMetadataService>();
    await gameService.SyncGamesMetadata();
}

app.Run();
