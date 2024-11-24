using FluentValidation;
using System.Globalization;
using UKParliament.CodeTest.Services;
using UKParliament.CodeTest.Web.ViewModels;

namespace UKParliament.CodeTest.Web.Validators;

public class PersonRequestValidator : AbstractValidator<PersonViewModel>
{
    public PersonRequestValidator(IDepartmentService departmentService)
    {
        RuleFor(x => x.FirstName)
            .Must(NotBeNullOrEmpty).WithMessage("First name is required");

        RuleFor(x => x.LastName)
            .Must(NotBeNullOrEmpty).WithMessage("Last name is required");

        RuleFor(x => x.DateOfBirth)
            .Must(NotBeNullOrEmpty).WithMessage("Date of birth is required");

        RuleFor(x => x.DateOfBirth)
            .Must(BeAValidDate).WithMessage($"Date of birth invalid date format. Must be '{Constants.GlobalConstants.DateFormat}'")
            .When(x => NotBeNullOrEmpty(x.DateOfBirth));

        RuleFor(x => x.DateOfBirth)
            .Must(BeInThePast).WithMessage("Date of birth date must be in the past")
            .When(x => BeAValidDate(x.DateOfBirth));

        RuleFor(x => x.DepartmentId)
            .GreaterThan(0).WithMessage("Department is required");

        RuleFor(x => x.DepartmentId)
            .MustAsync(async (departmentId, cancellation) =>
                (await departmentService.GetDepartmentByIdAsync(departmentId)) != null)
            .WithMessage("Department does not exist")
            .When(x => x.DepartmentId > 0); 
    }

    private bool NotBeNullOrEmpty(string? value)
    {
        return !string.IsNullOrEmpty(value?.Replace(" ", "").Trim());
    }

    private bool BeAValidDate(string? dateInput)
    {
        return DateOnly.TryParseExact(dateInput, Constants.GlobalConstants.DateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly validDate);
    }

    // Check if the date is in the past
    private bool BeInThePast(string? dateInput)
    {
        if (DateOnly.TryParseExact(dateInput, Constants.GlobalConstants.DateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly validDate))
        {
            return validDate < DateOnly.FromDateTime(DateTime.Now);
        }

        return false;
    }
}
