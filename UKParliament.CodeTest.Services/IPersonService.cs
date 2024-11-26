using UKParliament.CodeTest.Data;

namespace UKParliament.CodeTest.Services;

public interface IPersonService
{
    Task<Person> CreatePersonAsync(Person newPerson);

    Task<int> GetPersonTotalAsync();
    
    Task<List<Person>> GetPersonListAsync();

    Task<Person?> GetPersonByIdAsync(int id);

    Task UpdatePersonAsync(int id, Person updatedPerson);

    Task DeletePersonAsync(int id);
}