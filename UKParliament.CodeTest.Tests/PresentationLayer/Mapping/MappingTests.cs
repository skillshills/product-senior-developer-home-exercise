using System.Globalization;
using UKParliament.CodeTest.Data;
using UKParliament.CodeTest.Web.Constants;
using UKParliament.CodeTest.Web.Extensions;
using UKParliament.CodeTest.Web.ViewModels;
using Xunit;

namespace UKParliament.CodeTest.Tests.PresentationLayer.Mapping;

public class MappingTests
{

    [Fact]
    public void Department_ToViewModel_ShouldMapCorrectly()
    {
        // Arrange
        var department = new Department
        {
            Id = 1,
            Name = "HR",
            People = new List<Person> { new Person(), new Person() }
        };

        // Act
        var result = department.ToViewModel();

        // Assert
        Assert.Equal(department.Id, result.Id);
        Assert.Equal(department.Name, result.Name);
        Assert.Equal(department.People.Count, result.TotalPeople);
    }

    [Fact]
    public void DepartmentViewModel_ToDataModel_ShouldMapCorrectly()
    {
        // Arrange
        var departmentViewModel = new DepartmentViewModel
        {
            Id = 1,
            Name = "HR"
        };

        // Act
        var result = departmentViewModel.ToDataModel();

        // Assert
        Assert.Equal(departmentViewModel.Id, result.Id);
        Assert.Equal(departmentViewModel.Name, result.Name);
    }

    [Fact]
    public void Person_ToViewModel_ShouldMapCorrectly()
    {
        // Arrange
        var person = new Person
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            DateOfBirth = new DateOnly(1990, 1, 1),
            DepartmentId = 2
        };

        // Act
        var result = person.ToViewModel();

        // Assert
        Assert.Equal(person.Id, result.Id);
        Assert.Equal(person.FirstName, result.FirstName);
        Assert.Equal(person.LastName, result.LastName);
        Assert.Equal(person.DateOfBirth.ToString(GlobalConstants.DateFormat), result.DateOfBirth);
        Assert.Equal(person.DepartmentId, result.DepartmentId);
    }

    [Fact]
    public void PersonViewModel_ToDataModel_ShouldMapCorrectly()
    {
        // Arrange
        var personViewModel = new PersonViewModel
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            DateOfBirth = "1990-01-01",
            DepartmentId = 2
        };

        // Act
        var result = personViewModel.ToDataModel();

        // Assert
        Assert.Equal(personViewModel.Id, result.Id);
        Assert.Equal(personViewModel.FirstName, result.FirstName);
        Assert.Equal(personViewModel.LastName, result.LastName);
        Assert.Equal(DateOnly.ParseExact(personViewModel.DateOfBirth, GlobalConstants.DateFormat, CultureInfo.InvariantCulture), result.DateOfBirth);
        Assert.Equal(personViewModel.DepartmentId, result.DepartmentId);
    }

}
