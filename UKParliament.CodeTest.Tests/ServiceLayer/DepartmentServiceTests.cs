using Moq;
using UKParliament.CodeTest.Data;
using UKParliament.CodeTest.Services;
using Xunit;

namespace UKParliament.CodeTest.Tests.ServiceLayer;

public class DepartmentServiceTests
{
    private readonly Mock<IDepartmentService> _departmentServiceMock = new Mock<IDepartmentService>();

    [Fact]
    public async Task GetDepartmentByIdAsync_ShouldReturnDepartment()
    {
        // Arrange
        var departmentId = 1;
        var expectedDepartment = new Department { Id = departmentId, Name = "HR" };
        _departmentServiceMock.Setup(service => service.GetDepartmentByIdAsync(departmentId)).ReturnsAsync(expectedDepartment);

        // Act
        var actualDepartment = await _departmentServiceMock.Object.GetDepartmentByIdAsync(departmentId);

        // Assert
        Assert.Equal(expectedDepartment, actualDepartment);
    }

    [Fact]
    public async Task GetDepartmentCountAsync_ShouldReturnDepartmentTotal()
    {
        // Arrange
        var expectedCount = 3;
        _departmentServiceMock.Setup(service => service.GetDepartmentTotalAsync()).ReturnsAsync(expectedCount);

        // Act
        var actualCount = await _departmentServiceMock.Object.GetDepartmentTotalAsync();

        // Assert
        Assert.Equal(expectedCount, actualCount);
    }

    [Fact]
    public async Task ListDepartmentsAsync_ShouldReturnListOfDepartments()
    {
        // Arrange
        var expectedDepartments = new List<Department>
        {
            new Department { Id = 1, Name = "HR" },
            new Department { Id = 2, Name = "IT" }
        };
        _departmentServiceMock.Setup(service => service.ListDepartmentsAsync()).ReturnsAsync(expectedDepartments);

        // Act
        var actualDepartments = await _departmentServiceMock.Object.ListDepartmentsAsync();

        // Assert
        Assert.Equal(expectedDepartments, actualDepartments);
    }
}