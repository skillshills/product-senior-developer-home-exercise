using FluentValidation.TestHelper;
using Moq;
using UKParliament.CodeTest.Data;
using UKParliament.CodeTest.Services;
using UKParliament.CodeTest.Web.Constants;
using UKParliament.CodeTest.Web.Validators;
using UKParliament.CodeTest.Web.ViewModels;
using Xunit;

namespace UKParliament.CodeTest.Tests.PresentationLayer.Validators;

public class PersonRequestValidatorTests
{
    private readonly PersonRequestValidator _validator;
    private readonly Mock<IDepartmentService> _departmentServiceMock;

    public PersonRequestValidatorTests()
    {
        _departmentServiceMock = new Mock<IDepartmentService>();
        _validator = new PersonRequestValidator(_departmentServiceMock.Object);
    }

    [Fact]
    public void Should_Have_Error_When_FirstName_Is_NullOrEmpty()
    {
        var model = new PersonViewModel { FirstName = "" };
        var result = _validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.FirstName);
    }

    [Fact]
    public void Should_Have_Error_When_LastName_Is_NullOrEmpty()
    {
        var model = new PersonViewModel { LastName = "" };
        var result = _validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.LastName);
    }

    [Fact]
    public void Should_Have_Error_When_DateOfBirth_Is_NullOrEmpty()
    {
        var model = new PersonViewModel { DateOfBirth = "" };
        var result = _validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.DateOfBirth);
    }

    [Fact]
    public void Should_Have_Error_When_DateOfBirth_Is_Invalid()
    {
        var model = new PersonViewModel { DateOfBirth = "invalid-date" };
        var result = _validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.DateOfBirth);
    }

    [Fact]
    public void Should_Have_Error_When_DateOfBirth_Is_In_The_Future()
    {
        var model = new PersonViewModel { DateOfBirth = DateTime.Now.AddDays(1).ToString(GlobalConstants.DateFormat) };
        var result = _validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.DateOfBirth);
    }

    [Fact]
    public void Should_Not_Have_Error_When_DateOfBirth_Is_Valid_And_In_The_Past()
    {
        var model = new PersonViewModel { DateOfBirth = DateTime.Now.AddDays(-1).ToString(GlobalConstants.DateFormat) };
        var result = _validator.TestValidate(model);
        result.ShouldNotHaveValidationErrorFor(x => x.DateOfBirth);
    }

    [Fact]
    public void Should_Have_Error_When_DepartmentId_Is_Zero_Or_Less()
    {
        var model = new PersonViewModel { DepartmentId = 0 };
        var result = _validator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.DepartmentId);
    }

    [Fact]
    public async Task Should_Have_Error_When_Department_Does_Not_Exist()
    {
        _departmentServiceMock.Setup(x => x.GetDepartmentByIdAsync(It.IsAny<int>())).ReturnsAsync((Department)null);

        var model = new PersonViewModel { DepartmentId = 1 };
        var result = await _validator.TestValidateAsync(model);
        result.ShouldHaveValidationErrorFor(x => x.DepartmentId);
    }

    [Fact]
    public async Task Should_Not_Have_Error_When_Department_Exists()
    {
        _departmentServiceMock.Setup(x => x.GetDepartmentByIdAsync(It.IsAny<int>())).ReturnsAsync(new Department());

        var model = new PersonViewModel { DepartmentId = 1 };
        var result = await _validator.TestValidateAsync(model);
        result.ShouldNotHaveValidationErrorFor(x => x.DepartmentId);
    }
}