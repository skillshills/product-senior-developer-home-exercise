using Microsoft.EntityFrameworkCore;

namespace UKParliament.CodeTest.Data;

public class PersonManagerContext(DbContextOptions<PersonManagerContext> options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Person>()
            .Property(p => p.DateOfBirth)
            .HasConversion(
                v => v.ToString("yyyy-MM-dd"),
                v => DateOnly.Parse(v)
            );

        modelBuilder.Entity<Person>()
            .HasOne(p => p.Department)
            .WithMany(d => d.People)
            .HasForeignKey(p => p.DepartmentId);

        modelBuilder.Entity<Department>().HasData(
            new Department { Id = 1, Name = "Sales" },
            new Department { Id = 2, Name = "Marketing" },
            new Department { Id = 3, Name = "Finance" },
            new Department { Id = 4, Name = "HR" });

        modelBuilder.Entity<Person>().HasData(
                    new Person
                    {
                        Id = 1,
                        FirstName = "John",
                        LastName = "Doe",
                        DateOfBirth = new DateOnly(1985, 5, 15),
                        DepartmentId = 1
                    },
                    new Person
                    {
                        Id = 2,
                        FirstName = "Jane",
                        LastName = "Smith",
                        DateOfBirth = new DateOnly(1992, 8, 24),
                        DepartmentId = 2
                    },
                    new Person
                    {
                        Id = 3,
                        FirstName = "Alice",
                        LastName = "Johnson",
                        DateOfBirth = new DateOnly(2000, 3, 10),
                        DepartmentId = 3
                    });
    }

    public DbSet<Person> People => Set<Person>();

    public DbSet<Department> Departments => Set<Department>();
}