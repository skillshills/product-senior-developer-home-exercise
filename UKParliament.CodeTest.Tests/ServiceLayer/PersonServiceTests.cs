using Moq;
using UKParliament.CodeTest.Data;
using UKParliament.CodeTest.Services;
using Xunit;

namespace UKParliament.CodeTest.Tests.ServiceLayer;

public class PersonServiceTests
{
    private readonly Mock<IPersonService> _personServiceMock = new Mock<IPersonService>();

    [Fact]
    public async Task CreatePersonAsync_ShouldCreatePerson()
    {
        // Arrange
        var newPerson = new Person { FirstName = "John", LastName = "Doe", DateOfBirth = new DateOnly(1990, 1, 1), DepartmentId = 1 };
        var expectedPerson = new Person { Id = 1, FirstName = "John", LastName = "Doe", DateOfBirth = new DateOnly(1990, 1, 1), DepartmentId = 1 };
        _personServiceMock.Setup(service => service.CreatePersonAsync(newPerson)).ReturnsAsync(expectedPerson);

        // Act
        await _personServiceMock.Object.CreatePersonAsync(newPerson);

        // Assert
        _personServiceMock.Verify(service => service.CreatePersonAsync(newPerson), Times.Once);
    }

    [Fact]
    public async Task GetPersonTotalAsync_ShouldReturnPersonTotal()
    {
        // Arrange
        var expectedCount = 5;
        _personServiceMock.Setup(service => service.GetPersonTotalAsync()).ReturnsAsync(expectedCount);

        // Act
        var actualCount = await _personServiceMock.Object.GetPersonTotalAsync();

        // Assert
        Assert.Equal(expectedCount, actualCount);
    }

    [Fact]
    public async Task GetPersonListAsync_ShouldReturnListOfPeople()
    {
        // Arrange
        var expectedPeople = new List<Person>
        {
            new Person { Id = 1, FirstName = "John", LastName = "Doe", DateOfBirth = new DateOnly(1990, 1, 1), DepartmentId = 1 },
            new Person { Id = 2, FirstName = "Jane", LastName = "Doe", DateOfBirth = new DateOnly(1992, 2, 2), DepartmentId = 2 }
        };
        _personServiceMock.Setup(service => service.GetPersonListAsync()).ReturnsAsync(expectedPeople);

        // Act
        var actualPeople = await _personServiceMock.Object.GetPersonListAsync();

        // Assert
        Assert.Equal(expectedPeople, actualPeople);
    }

    [Fact]
    public async Task GetPersonByIdAsync_ShouldReturnPerson()
    {
        // Arrange
        var personId = 1;
        var expectedPerson = new Person { Id = personId, FirstName = "John", LastName = "Doe", DateOfBirth = new DateOnly(1990, 1, 1), DepartmentId = 1 };
        _personServiceMock.Setup(service => service.GetPersonByIdAsync(personId)).ReturnsAsync(expectedPerson);

        // Act
        var actualPerson = await _personServiceMock.Object.GetPersonByIdAsync(personId);

        // Assert
        Assert.Equal(expectedPerson, actualPerson);
    }

    [Fact]
    public async Task UpdatePersonAsync_ShouldUpdatePerson()
    {
        // Arrange
        var personId = 1;
        var updatedPerson = new Person { Id = personId, FirstName = "John", LastName = "Doe", DateOfBirth = new DateOnly(1990, 1, 1), DepartmentId = 1 };
        _personServiceMock.Setup(service => service.UpdatePersonAsync(personId, updatedPerson)).Returns(Task.CompletedTask);

        // Act
        await _personServiceMock.Object.UpdatePersonAsync(personId, updatedPerson);

        // Assert
        _personServiceMock.Verify(service => service.UpdatePersonAsync(personId, updatedPerson), Times.Once);
    }

    [Fact]
    public async Task DeletePersonAsync_ShouldDeletePerson()
    {
        // Arrange
        var personId = 1;
        _personServiceMock.Setup(service => service.DeletePersonAsync(personId)).Returns(Task.CompletedTask);

        // Act
        await _personServiceMock.Object.DeletePersonAsync(personId);

        // Assert
        _personServiceMock.Verify(service => service.DeletePersonAsync(personId), Times.Once);
    }
}
