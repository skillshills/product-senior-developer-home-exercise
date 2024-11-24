using Microsoft.AspNetCore.Mvc;
using UKParliament.CodeTest.Services;
using UKParliament.CodeTest.Web.Extensions;
using UKParliament.CodeTest.Web.ViewModels;

namespace UKParliament.CodeTest.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentsController(IDepartmentService departmentService) : ControllerBase
{
    private readonly IDepartmentService _departmentService = departmentService;

    [Route("{id:int}")]
    [HttpGet]
    public async Task<ActionResult<DepartmentViewModel?>> GetDepartmentByIdAsync(int id)
    {
        var department = await _departmentService.GetDepartmentByIdAsync(id);
        if (department == null)
            return NotFound();

        return Ok(department.ToViewModel());
    }

    [Route("")]
    [HttpGet]
    public async Task<ActionResult<List<DepartmentViewModel>>> ListDepartments()
    {
        var departments = await _departmentService.ListDepartmentsAsync();
        return Ok(departments.Select(d => d.ToViewModel()).ToList());
    }

    [Route("total")]
    [HttpGet]
    public async Task<ActionResult<PersonViewModel>> GetDepartmentTotalAsync()
    {
        var total = await _departmentService.GetDepartmentTotalAsync();
        return Ok(new { total });
    }
}