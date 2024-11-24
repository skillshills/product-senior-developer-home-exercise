namespace UKParliament.CodeTest.Data;

public class Person
{
    public int Id { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public DateOnly DateOfBirth { get; set; }

    public int DepartmentId { get; set; }

    public Department? Department { get; set; }
}