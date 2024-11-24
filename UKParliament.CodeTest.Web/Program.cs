using FluentValidation;
using Microsoft.EntityFrameworkCore;
using UKParliament.CodeTest.Data;
using UKParliament.CodeTest.Services;
using UKParliament.CodeTest.Web.Middleware;
using UKParliament.CodeTest.Web.Validators;
using UKParliament.CodeTest.Web.ViewModels;

namespace UKParliament.CodeTest.Web;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddControllersWithViews();

        builder.Services.AddDbContext<PersonManagerContext>(op => op.UseInMemoryDatabase("PersonManager"));

        builder.Services.AddScoped<IPersonService, PersonService>();
        builder.Services.AddScoped<IDepartmentService, DepartmentService>();

        // Add validators
        builder.Services.AddScoped<IValidator<PersonViewModel>, PersonRequestValidator>();

        var app = builder.Build();

        // Create database so the data seeds
        using (var serviceScope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope())
        {
            using var context = serviceScope.ServiceProvider.GetRequiredService<PersonManagerContext>();
            context.Database.EnsureCreated();
        }

        // Configure the HTTP request pipeline.
        if (!app.Environment.IsDevelopment())
        {
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
        }

        app.UseMiddleware<ExceptionHandlingMiddleware>();

        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseRouting();
        app.MapControllerRoute(
            name: "default",
            pattern: "{controller}/{action=Index}/{id?}");

        app.MapFallbackToFile("index.html");

        app.Run();
    }
}