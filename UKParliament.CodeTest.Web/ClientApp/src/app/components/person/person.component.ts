import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PersonService } from 'src/app/services/person.service';
import { DepartmentService } from 'src/app/services/department.service';
import { DepartmentViewModel } from 'src/app/models/department-view-model';

@Component({
  selector: 'app-person-form',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
  personForm: FormGroup;
  isUpdateMode: boolean = false;
  personId: number | null = null;
  departments: DepartmentViewModel[] = [];
  //departments = ['HR', 'Finance', 'Engineering', 'Marketing'];
  days: number[] = [];
  months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(0, i); // Create a date for each month (0-based index)
    return { name: date.toLocaleString('default', { month: 'long' }), value: i + 1 };
  });
  years: number[] = [];
  dobInvalid: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private personService: PersonService,
    private departmentService: DepartmentService
  ) {
    this.personForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      day: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      departmentId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadDepartments();

    this.route.params.subscribe((params) => {
      this.personId = params['id'];
      this.isUpdateMode = !!this.personId;

      if (this.isUpdateMode) {
        if (this.personId) {
          this.loadPersonData(this.personId);
        }
      }
    });

    // Populate days
    this.days = Array.from({ length: 31 }, (_, i) => i + 1);

    // Populate years (last 100 years)
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    // Validate DOB whenever form changes
    this.personForm.valueChanges.subscribe(() => {
      this.validateDOB();
    });
  }

  loadDepartments() {
    this.departmentService.getDepartmentList().subscribe({
      next: (data) => (this.departments = data),
      error: (err) => console.error('Error loading departments', err),
    });
  }

  loadPersonData(id: number): void {
    this.personService.getById(id).subscribe({
      next: (data) => {
        // Split the DOB into day, month, and year
        const [year, month, day] = data.dateOfBirth.split('-').map(Number);

        // Populate the form
        this.personForm.patchValue({
          firstname: data.firstName,
          lastname: data.lastName,
          departmentId: data.departmentId,
          day: day,
          month: month,
          year: year
        });
      },
      error: (err) => {
        console.error('Error fetching person data:', err);
      }
    });
  }

  formControlIsValid(fieldName: string) {
    return this.personForm.get(fieldName)?.invalid && this.personForm.get(fieldName)?.touched;
  }  

  validateDOB() {
    if (this.formControlIsValid('day') || this.formControlIsValid('month') || this.formControlIsValid('year')) {
      this.dobInvalid = true;
      return;
    }

    const { day, month, year } = this.personForm.value;
    const dateOfBirth = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
    if (!this.isValidDate(dateOfBirth)) {
      this.dobInvalid = true;
      return;
    }
  
    const dob = new Date(dateOfBirth);
    const today = new Date();
  
    this.dobInvalid = dob >= today;
  }

  isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return false; // Invalid date
    }

    // Ensure the components match the input
    const [year, month, day] = dateString.split('-').map(Number);
    return (
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day
    );
  }

  // Mark all form controls as touched to trigger validation messages
  markAllAsTouched(): void {
    Object.values(this.personForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }  

  onSubmit() {
    this.markAllAsTouched();

    if (this.personForm.valid && !this.dobInvalid) {
      const { day, month, year, ...rest } = this.personForm.value;
      const dateOfBirth = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const personData = { ...rest, dateOfBirth };

      if (this.isUpdateMode && this.personId) {
        // Call update service
        this.personService.updatePerson(this.personId, personData).subscribe(() => {
          console.log('Person updated successfully!');
          this.router.navigate(['/']);
        });
      } else {
        // Call create service
        this.personService.createPerson(personData).subscribe(() => {
          console.log('Person created successfully!');
          this.router.navigate(['/']); // Navigate to the list page or elsewhere
        });
      }
    }
  }
}
