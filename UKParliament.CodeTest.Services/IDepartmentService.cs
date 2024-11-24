using UKParliament.CodeTest.Data;

namespace UKParliament.CodeTest.Services;

public interface IDepartmentService
{
    Task<Department?> GetDepartmentByIdAsync(int id);

    Task<int> GetDepartmentTotalAsync();

    Task<List<Department>> ListDepartmentsAsync();
}
