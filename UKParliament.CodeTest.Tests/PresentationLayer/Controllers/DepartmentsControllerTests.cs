using Microsoft.AspNetCore.Mvc;
using Moq;
using UKParliament.CodeTest.Data;
using UKParliament.CodeTest.Services;
using UKParliament.CodeTest.Web.Controllers;
using UKParliament.CodeTest.Web.Extensions;
using UKParliament.CodeTest.Web.ViewModels;
using Xunit;

namespace UKParliament.CodeTest.Tests.PresentationLayer.Controllers;

public class DepartmentsControllerTests
{
    private readonly Mock<IDepartmentService> _mockService;
    private readonly DepartmentsController _controller;

    public DepartmentsControllerTests()
    {
        _mockService = new Mock<IDepartmentService>();
        _controller = new DepartmentsController(_mockService.Object);
    }

    [Fact]
    public async Task GetDepartmentByIdAsync_ReturnsOkResult_WithValidDepartment()
    {
        // Arrange
        int departmentId = 1;
        var mockDepartment = new DepartmentViewModel { Id = departmentId, Name = "HR" };

        _mockService
            .Setup(service => service.GetDepartmentByIdAsync(departmentId))
            .ReturnsAsync(mockDepartment.ToDataModel());

        // Act
        var result = await _controller.GetDepartmentByIdAsync(departmentId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var department = Assert.IsType<DepartmentViewModel>(okResult.Value);
        Assert.Equal(departmentId, department.Id);
    }

    [Fact]
    public async Task GetDepartmentByIdAsync_ReturnsNotFound_WhenDepartmentDoesNotExist()
    {
        // Arrange
        int departmentId = 1;

        _mockService
             .Setup(service => service.GetDepartmentByIdAsync(departmentId))
             .ReturnsAsync((Department?)null);

        // Act
        var result = await _controller.GetDepartmentByIdAsync(departmentId);

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task ListDepartments_ReturnsOkResult_WithDepartmentList()
    {
        // Arrange
        var departments = new List<DepartmentViewModel>
        {
            new DepartmentViewModel { Id = 1, Name = "HR" },
            new DepartmentViewModel { Id = 2, Name = "IT" }
        };
        _mockService
            .Setup(service => service.ListDepartmentsAsync())
            .ReturnsAsync(departments.Select(d => d.ToDataModel()).ToList());

        // Act
        var result = await _controller.ListDepartments();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var departmentList = Assert.IsType<List<DepartmentViewModel>>(okResult.Value);
        Assert.Equal(2, departmentList.Count);
    }

    [Fact]
    public async Task ListDepartments_ReturnsOkResult_WithEmptyList_WhenNoDepartmentsExist()
    {
        // Arrange
        _mockService
            .Setup(service => service.ListDepartmentsAsync())
            .ReturnsAsync([]);

        // Act
        var result = await _controller.ListDepartments();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var departmentList = Assert.IsType<List<DepartmentViewModel>>(okResult.Value);
        Assert.Empty(departmentList);
    }

    [Fact]
    public async Task GetDepartmentTotalAsync_ReturnsOkResult_WithTotalCount()
    {
        // Arrange
        int expectedTotal = 55;
        _mockService.Setup(service => service.GetDepartmentTotalAsync()).ReturnsAsync(expectedTotal);

        // Act
        var result = await _controller.GetDepartmentTotalAsync();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.NotNull(okResult.Value);

        // Use reflection to extract the 'total' property dynamically
        var totalProperty = okResult.Value.GetType().GetProperty("total");
        Assert.NotNull(totalProperty);

        Assert.Equal(expectedTotal, totalProperty.GetValue(okResult.Value));
    }
}
