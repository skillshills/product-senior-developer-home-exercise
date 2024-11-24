using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using UKParliament.CodeTest.Data;

namespace UKParliament.CodeTest.Services;

public class DepartmentService(PersonManagerContext context, ILogger<DepartmentService> logger) : IDepartmentService
{
    private readonly PersonManagerContext _context = context;
    private readonly ILogger<DepartmentService> _logger = logger;

    public async Task<Department?> GetDepartmentByIdAsync(int id)
    {
        try
        {
            return await _context.Departments
                .Include(p => p.People)
                .FirstOrDefaultAsync(d => d.Id == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while getting department by id");
            throw;
        }
    }

    public async Task<int> GetDepartmentTotalAsync()
    {
        try
        {
            return await _context.Departments.CountAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while get count of departments");
            throw;
        }
    }

    public async Task<List<Department>> ListDepartmentsAsync()
    {
        try
        {
            return await _context.Departments
                .Include(d => d.People)
                .Select(d => new Department
                {
                    Id = d.Id,
                    Name = d.Name,
                    People = d.People
                })
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while listing departments");
            throw;
        }
    }
}
