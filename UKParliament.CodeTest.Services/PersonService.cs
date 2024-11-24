using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using UKParliament.CodeTest.Data;

namespace UKParliament.CodeTest.Services;

public class PersonService(PersonManagerContext context, ILogger<PersonService> logger) : IPersonService
{
    private readonly PersonManagerContext _context = context;
    private readonly ILogger<PersonService> _logger = logger;

    public async Task<Person> CreatePersonAsync(Person newPerson)
    {
        try
        {
            _context.People.Add(newPerson);
            await _context.SaveChangesAsync();

            return newPerson;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while creating a person");
            throw;
        }
    }

    public async Task<Person?> GetPersonByIdAsync(int id)
    {
        try
        {
            return await _context.People
                .Include(p => p.Department)
                .FirstOrDefaultAsync(p => p.Id == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while getting person by id");
            throw;
        }
    }

    public async Task<int> GetPeopleTotalAsync()
    {
        try
        {
            return await _context.People.CountAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while get count of people");
            throw;
        }
    }

    public async Task<List<Person>> ListPeopleAsync()
    {
        try
        {
            return await _context.People
                .Include(d => d.Department)
                .Select(d => new Person
                {
                    Id = d.Id,
                    FirstName = d.FirstName,
                    LastName = d.LastName,
                    DateOfBirth = d.DateOfBirth,
                    Department = d.Department,
                })
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while listing people");
            throw;
        }
    }

    public async Task UpdatePersonAsync(int id, Person updatedPerson)
    {
        try {
            var person = await _context.People.FirstOrDefaultAsync(p => p.Id == id);
            if (person == null)
                return;

            person.FirstName = updatedPerson.FirstName.Trim();
            person.LastName = updatedPerson.LastName.Trim();
            person.DateOfBirth = updatedPerson.DateOfBirth;
            person.DepartmentId = updatedPerson.DepartmentId;

            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating a person");
            throw;
        }
    }

    public async Task DeletePersonAsync(int id)
    {
        try {
            var person = await _context.People.FirstOrDefaultAsync(p => p.Id == id);
            if (person == null)
                return;

            _context.People.Remove(person);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting a person");
            throw;
        }
    }
}