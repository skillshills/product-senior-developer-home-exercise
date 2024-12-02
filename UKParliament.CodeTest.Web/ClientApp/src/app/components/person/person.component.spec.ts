import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { PersonComponent } from './person.component';
import { PersonService } from 'src/app/services/person.service';
import { DepartmentService } from 'src/app/services/department.service';
import { LoadingOverlayService } from '../../services/loading-overlay.service';
import { ToastService } from '../../services/toast.service';
import { FormBuilder } from '@angular/forms';
import { PersonViewModel } from '../../models/person-view-model';

describe('PersonComponent', () => {
    let component: PersonComponent;
    let fixture: ComponentFixture<PersonComponent>;
    let personService: jasmine.SpyObj<PersonService>;
    let router: jasmine.SpyObj<Router>;
    let toastService: jasmine.SpyObj<ToastService>;
    let loadingOverlayService: jasmine.SpyObj<LoadingOverlayService>;

    let validPersonData: PersonViewModel;

    beforeEach(async () => {
        const personServiceSpy = jasmine.createSpyObj('PersonService', ['getById', 'updatePerson', 'createPerson']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        const toastServiceSpy = jasmine.createSpyObj('ToastService', ['addToast']);
        const loadingOverlayServiceSpy = jasmine.createSpyObj('LoadingOverlayService', ['show', 'hide']);

        await TestBed.configureTestingModule({
            declarations: [PersonComponent],
            providers: [
                FormBuilder,
                { provide: PersonService, useValue: personServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: ToastService, useValue: toastServiceSpy },
                { provide: LoadingOverlayService, useValue: loadingOverlayServiceSpy },
                { provide: ActivatedRoute, useValue: { params: of({ id: 1 }) } },
                { provide: DepartmentService, useValue: {} }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PersonComponent);
        component = fixture.componentInstance;
        personService = TestBed.inject(PersonService) as jasmine.SpyObj<PersonService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
        loadingOverlayService = TestBed.inject(LoadingOverlayService) as jasmine.SpyObj<LoadingOverlayService>;

        // Initialize the form
        component.personForm = new FormGroup({
            firstname: new FormControl('', Validators.required),
            lastname: new FormControl('', Validators.required),
            departmentId: new FormControl('', Validators.required),
            day: new FormControl('', Validators.required),
            month: new FormControl('', Validators.required),
            year: new FormControl('', Validators.required)
        });

        validPersonData = {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '2000-01-01',
            departmentId: 1,
            fullName: 'John Doe'
        };
    });

    it('This is an example test for the PersonComponent', () => {
        expect(true).toBeTruthy();
    })

    it('should load person data successfully', fakeAsync(() => {
        const mockPersonData = {
            body: {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                fullName: 'John Doe',
                departmentId: 1,
                dateOfBirth: '1990-01-01'
            }
        };

        personService.getById.and.returnValue(of(new HttpResponse({ status: 200, body: mockPersonData.body })));

        component.loadPersonData(1);

        // Simulate the setTimeout
        tick(500);

        // Assertions
        expect(component.loadingData).toBeFalse();
        expect(component.personForm.value).toEqual({
            firstname: 'John',
            lastname: 'Doe',
            departmentId: 1,
            day: 1,
            month: 1,
            year: 1990
        });
    }));

    it('should navigate to not-found page if person data is not found', fakeAsync(() => {
        personService.getById.and.returnValue(throwError(() => ({ status: 404 })));

        component.loadPersonData(1);

        // Simulate the setTimeout
        tick(400);

        // Assertions
        expect(router.navigate).toHaveBeenCalledWith(['/person/1/not-found']);
    }));

    it('should show error toast if there is an error loading person data', fakeAsync(() => {
        personService.getById.and.returnValue(throwError(() => new Error('Error')));

        component.loadPersonData(1);

        // Simulate the setTimeout
        tick(400);

        // Assertions
        expect(toastService.addToast).toHaveBeenCalledWith('Error loading person data', 'error', false);
    }));

    describe('Update Form Actions', () => {

        it('should call updatePerson on the service with the correct data', fakeAsync(() => {
            personService.updatePerson.and.returnValue(of(new HttpResponse({ status: 204, body: [] })));

            component.updatePerson(validPersonData);

            // Simulate the setTimeout
            tick(500);

            // Assertions
            expect(personService.updatePerson).toHaveBeenCalledWith(validPersonData.id, validPersonData);
        }));

        it('should show a success toast and navigate to home on successful update', fakeAsync(() => {
            personService.updatePerson.and.returnValue(of(new HttpResponse({ status: 204, body: [] })));

            component.updatePerson(validPersonData);

            // Simulate the setTimeout
            tick(500);

            // Assertions
            expect(toastService.addToast).toHaveBeenCalledWith('Person updated successfully', 'success');
            expect(router.navigate).toHaveBeenCalledWith(['/']);
        }));

        it('should show an error toast on update failure', fakeAsync(() => {
            personService.updatePerson.and.returnValue(throwError(() => new Error('Update failed')));

            component.updatePerson(validPersonData);

            // Simulate the setTimeout
            tick(500);

            // Assertions
            expect(toastService.addToast).toHaveBeenCalledWith('Error updating person', 'error', false);
        }));

        it('should hide the loading overlay after update, success or error', fakeAsync(() => {
            personService.updatePerson.and.returnValue(of(new HttpResponse({ status: 204, body: [] })));

            component.updatePerson(validPersonData);

            // Simulate the setTimeout
            tick(5000);

            // Assertions
            expect(loadingOverlayService.hide).toHaveBeenCalled();
        }));
    });

    describe('Create Form Actions', () => {

        it('should call createPerson on the service with the correct data', fakeAsync(() => {
            personService.createPerson.and.returnValue(of(new HttpResponse({ status: 201, body: [] })));

            component.createPerson(validPersonData);

            // Simulate the setTimeout
            tick(500);

            // Assertions
            expect(personService.createPerson).toHaveBeenCalledWith(validPersonData);
        }));

        it('should show a success toast and navigate to home on successful update', fakeAsync(() => {
            personService.createPerson.and.returnValue(of(new HttpResponse({ status: 201, body: [] })));

            component.createPerson(validPersonData);

            // Simulate the setTimeout
            tick(500);

            // Assertions
            expect(toastService.addToast).toHaveBeenCalledWith('Person created successfully', 'success');
            expect(router.navigate).toHaveBeenCalledWith(['/']);
        }));

        it('should show an error toast on update failure', fakeAsync(() => {
            personService.createPerson.and.returnValue(throwError(() => new Error('Update failed')));

            component.createPerson(validPersonData);

            // Simulate the setTimeout
            tick(500);

            // Assertions
            expect(toastService.addToast).toHaveBeenCalledWith('Error creating person', 'error', false);
        }));

        it('should hide the loading overlay after update, success or error', fakeAsync(() => {

            personService.createPerson.and.returnValue(of(new HttpResponse({ status: 201, body: [] })));

            component.createPerson(validPersonData);

            // Simulate the setTimeout
            tick(5000);

            // Assertions
            expect(loadingOverlayService.hide).toHaveBeenCalled();
        }));
    });    

    describe('dob Validation', () => {
        it('should mark dobInvalid as true if form control is invalid', () => {
            spyOn(component, 'formControlIsValid').and.returnValue(true);
            component.validateDOB();

            // Assertions
            expect(component.dobInvalid).toBeTrue();
        });

        it('should mark dobInvalid as true for an invalid date 31-FEB-2023', () => {
            spyOn(component, 'formControlIsValid').and.returnValue(false);
            component.personForm.setValue({ firstname: 'Joe', lastname: 'Blogs', departmentId: 101, day: 31, month: 2, year: 2023 });
            spyOn(component, 'isValidDate').and.returnValue(false);

            component.validateDOB();

            // Assertions
            expect(component.dobInvalid).toBeTrue();
        });

        it('should mark dobInvalid as true if the date is in the future', () => {
            spyOn(component, 'formControlIsValid').and.returnValue(false);
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 1);

            component.personForm.setValue({
                firstname: 'Joe',
                lastname: 'Blogs',
                departmentId: 101,
                day: futureDate.getDate(),
                month: futureDate.getMonth() + 1,
                year: futureDate.getFullYear(),
            });

            spyOn(component, 'isValidDate').and.returnValue(true);

            component.validateDOB();

            // Assertions
            expect(component.dobInvalid).toBeTrue();
        });

        it('should mark dobInvalid as false for a valid date in the past', () => {
            spyOn(component, 'formControlIsValid').and.returnValue(false);
            component.personForm.setValue({ firstname: 'Joe', lastname: 'Blogs', departmentId: 101, day: 14, month: 3, year: 1978 });
            spyOn(component, 'isValidDate').and.returnValue(true);

            component.validateDOB();

            // Assertions
            expect(component.dobInvalid).toBeFalse();
        });
    });
});
