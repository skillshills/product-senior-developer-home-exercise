using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using UKParliament.CodeTest.Data;
using UKParliament.CodeTest.Services;
using UKParliament.CodeTest.Web.Controllers;
using UKParliament.CodeTest.Web.ViewModels;
using Xunit;

namespace UKParliament.CodeTest.Tests.PresentationLayer.Controllers;

public class PersonControllerTests
{
    private readonly Mock<IPersonService> _personServiceMock;
    private readonly Mock<IDepartmentService> _departmentServiceMock;
    private readonly Mock<IValidator<PersonViewModel>> _validatorMock;
    private readonly PersonController _controller;

    public PersonControllerTests()
    {
        _personServiceMock = new Mock<IPersonService>();
        _departmentServiceMock = new Mock<IDepartmentService>();
        _validatorMock = new Mock<IValidator<PersonViewModel>>();
        _controller = new PersonController(_departmentServiceMock.Object, _personServiceMock.Object, _validatorMock.Object);
    }

    [Fact]
    public async Task GetPersonByIdAsync_ReturnsOk_WhenPersonExists()
    {
        // Arrange
        var person = new Person { Id = 1, FirstName = "John", LastName = "Doe" };
        _personServiceMock.Setup(service => service.GetPersonByIdAsync(1)).ReturnsAsync(person);

        // Act
        var result = await _controller.GetPersonByIdAsync(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<PersonViewModel>(okResult.Value);
        Assert.Equal(person.Id, returnValue.Id);
    }

    [Fact]
    public async Task GetPersonByIdAsync_ReturnsNotFound_WhenPersonDoesNotExist()
    {
        // Arrange
        _personServiceMock.Setup(service => service.GetPersonByIdAsync(1)).ReturnsAsync((Person)null);

        // Act
        var result = await _controller.GetPersonByIdAsync(1);

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task GetPersonListAsync_ReturnsOk_WithListOfPeople()
    {
        // Arrange
        var people = new List<Person> { new Person { Id = 1, FirstName = "John", LastName = "Doe" } };
        _personServiceMock.Setup(service => service.GetPersonListAsync()).ReturnsAsync(people);

        // Act
        var result = await _controller.GetPersonListAsync();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<List<PersonViewModel>>(okResult.Value);
        Assert.Single(returnValue);
    }

    [Fact]
    public async Task GetPersonTotalAsync_ReturnsOk_WithTotalCount()
    {
        // Arrange
        int expectedTotal = 42;
        _personServiceMock.Setup(service => service.GetPersonTotalAsync()).ReturnsAsync(expectedTotal);

        // Act
        var result = await _controller.GetPersonTotalAsync();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.NotNull(okResult.Value); 
        
        // Use reflection to extract the 'total' property dynamically
        var totalProperty = okResult.Value.GetType().GetProperty("total");
        Assert.NotNull(totalProperty); 

        Assert.Equal(expectedTotal, totalProperty.GetValue(okResult.Value));
    }

    [Fact]
    public async Task CreatePersonAsync_ReturnsCreatedAtRoute_WhenPersonIsValid()
    {
        // Arrange
        var newPerson = new PersonViewModel { Id = 1, FirstName = "John", LastName = "Doe" };
        var person = new Person { Id = 1, FirstName = "John", LastName = "Doe" };
        _validatorMock.Setup(v => v.ValidateAsync(newPerson, default)).ReturnsAsync(new ValidationResult());
        _personServiceMock.Setup(service => service.CreatePersonAsync(It.IsAny<Person>())).ReturnsAsync(person);

        // Act
        var result = await _controller.CreatePersonAsync(newPerson);

        // Assert
        var createdAtRouteResult = Assert.IsType<CreatedAtRouteResult>(result.Result);
        var returnValue = Assert.IsType<PersonViewModel>(createdAtRouteResult.Value);
        Assert.Equal(newPerson.Id, returnValue.Id);
    }

    [Fact]
    public async Task CreatePersonAsync_ReturnsBadRequest_WhenPersonIsInvalid()
    {
        // Arrange
        var newPerson = new PersonViewModel { Id = 1, FirstName = "", LastName = "Doe" };
        var validationResult = new ValidationResult(new List<ValidationFailure> { new ValidationFailure("FirstName", "Error") });
        _validatorMock.Setup(v => v.ValidateAsync(newPerson, default)).ReturnsAsync(validationResult);

        // Act
        var result = await _controller.CreatePersonAsync(newPerson);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task UpdatePersonAsync_ReturnsNoContent_WhenPersonIsValid()
    {
        // Arrange
        var personViewModel = new PersonViewModel { Id = 1, FirstName = "John", LastName = "Doe" };
        var person = new Person { Id = 1, FirstName = "John", LastName = "Doe" };

        _validatorMock.Setup(v => v.ValidateAsync(personViewModel, default)).ReturnsAsync(new ValidationResult());
        _personServiceMock.Setup(service => service.GetPersonByIdAsync(1)).ReturnsAsync(person);

        // Act
        var result = await _controller.UpdatePersonAsync(1, personViewModel);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task UpdatePersonAsync_ReturnsBadRequest_WhenPersonIsInvalid()
    {
        // Arrange
        var personViewModel = new PersonViewModel { Id = 1, FirstName = "John", LastName = "Doe" };
        var validationResult = new ValidationResult(new List<ValidationFailure> { new ValidationFailure("DateOfBirth", "Error") });
        _validatorMock.Setup(v => v.ValidateAsync(personViewModel, default)).ReturnsAsync(validationResult);

        // Act
        var result = await _controller.UpdatePersonAsync(1, personViewModel);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task UpdatePersonAsync_ReturnsNotFound_WhenPersonDoesNotExist()
    {
        // Arrange
        var personViewModel = new PersonViewModel { Id = 1, FirstName = "John", LastName = "Doe" };
        _validatorMock.Setup(v => v.ValidateAsync(personViewModel, default)).ReturnsAsync(new ValidationResult());
        _personServiceMock.Setup(service => service.GetPersonByIdAsync(1)).ReturnsAsync((Person)null);

        // Act
        var result = await _controller.UpdatePersonAsync(1, personViewModel);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task DeletePersonAsync_ReturnsNoContent_WhenPersonExists()
    {
        // Arrange
        var person = new Person { Id = 1, FirstName = "John", LastName = "Doe" };
        _personServiceMock.Setup(service => service.GetPersonByIdAsync(1)).ReturnsAsync(person);

        // Act
        var result = await _controller.DeletePersonAsync(1);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task DeletePersonAsync_ReturnsNotFound_WhenPersonDoesNotExist()
    {
        // Arrange
        _personServiceMock.Setup(service => service.GetPersonByIdAsync(1)).ReturnsAsync((Person)null);

        // Act
        var result = await _controller.DeletePersonAsync(1);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }
}