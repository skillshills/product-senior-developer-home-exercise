using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using UKParliament.CodeTest.Services;
using UKParliament.CodeTest.Web.Extensions;
using UKParliament.CodeTest.Web.ViewModels;

namespace UKParliament.CodeTest.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PersonController(IDepartmentService departmentService, IPersonService personService, IValidator<PersonViewModel> validator) : ControllerBase
{
    private readonly IPersonService _personService = personService;
    private readonly IDepartmentService _departmentService = departmentService;

    [Route("{id:int}", Name = nameof(GetPersonByIdAsync))]
    [HttpGet]
    public async Task<ActionResult<PersonViewModel>> GetPersonByIdAsync(int id)
    {
        var person = await _personService.GetPersonByIdAsync(id);
        if (person == null)
            return NotFound();

        return Ok(person.ToViewModel());
    }

    [Route("")]
    [HttpGet]
    public async Task<ActionResult<PersonViewModel>> GetPersonListAsync()
    {
        var people = await _personService.GetPersonListAsync();
        return Ok(people.Select(p => p.ToViewModel()).ToList());
    }

    [Route("total")]
    [HttpGet]
    public async Task<ActionResult<PersonViewModel>> GetPersonTotalAsync()
    {
        var total = await _personService.GetPersonTotalAsync();
        return Ok(new { total });
    }

    [Route("")]
    [HttpPost]
    public async Task<ActionResult<PersonViewModel>> CreatePersonAsync(PersonViewModel newPerson)
    {
        var validationResult = await validator.ValidateAsync(newPerson);
        if (!validationResult.IsValid)
            return BadRequest(validationResult.ToDictionary());

        var request = newPerson.ToDataModel();

        var response = await _personService.CreatePersonAsync(request);

        return CreatedAtRoute(nameof(GetPersonByIdAsync), new { id = response.Id }, request.ToViewModel());
    }

    [Route("{id:int}")]
    [HttpPut]
    public async Task<ActionResult> UpdatePersonAsync(int id, PersonViewModel personViewModel)
    {
        
        var validationResult = await validator.ValidateAsync(personViewModel);
        if (!validationResult.IsValid)
            return BadRequest(validationResult.ToDictionary());

        var existingPerson = await _personService.GetPersonByIdAsync(id);
        if (existingPerson == null)
            return NotFound();

        var request = personViewModel.ToDataModel();

        await _personService.UpdatePersonAsync(id, request);

        return NoContent();
    }

    [Route("{id:int}")]
    [HttpDelete]
    public async Task<ActionResult> DeletePersonAsync(int id)
    {
        var existingPerson = await _personService.GetPersonByIdAsync(id);
        if (existingPerson == null)
            return NotFound();

        await _personService.DeletePersonAsync(id);

        return NoContent();
    }
}