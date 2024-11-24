namespace UKParliament.CodeTest.Web.ViewModels;

public class PersonViewModel
{
    public int Id { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string FullName => $"{FirstName} {LastName}".Trim();

    public string DateOfBirth { get; set; } = string.Empty;

    public int DepartmentId { get; set; }
}