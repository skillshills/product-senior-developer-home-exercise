import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { PeopleComponent } from './people.component';
import { PersonService } from '../../services/person.service';
import { LoadingOverlayService } from '../../services/loading-overlay.service';
import { ToastService } from '../../services/toast.service';
import { PersonViewModel } from '../../models/person-view-model';

describe('PeopleComponent', () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;
  let personService: jasmine.SpyObj<PersonService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let loadingOverlayService: jasmine.SpyObj<LoadingOverlayService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const personServiceSpy = jasmine.createSpyObj('PersonService', ['getPersonList', 'deletePerson']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['addToast']);
    const loadingOverlayServiceSpy = jasmine.createSpyObj('LoadingOverlayService', ['show', 'hide']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [PeopleComponent],
      imports: [RouterModule],
      providers: [
        { provide: PersonService, useValue: personServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: LoadingOverlayService, useValue: loadingOverlayServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.componentInstance;
    personService = TestBed.inject(PersonService) as jasmine.SpyObj<PersonService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    loadingOverlayService = TestBed.inject(LoadingOverlayService) as jasmine.SpyObj<LoadingOverlayService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load people and update the state on success', fakeAsync(() => {
    const mockResponse = { body: [{ name: 'John Doe' }], status: 200 } as HttpResponse<any>;

    personService.getPersonList.and.returnValue(of(mockResponse));

    component.loadPeople();

    // Simulate the setTimeout
    tick(500); 

    // Assertions
    expect(personService.getPersonList).toHaveBeenCalled();
    expect(component.people).toEqual(mockResponse.body);
    expect(component.loadingData).toBe(false);
    expect(toastService.addToast).not.toHaveBeenCalled();
  }));

  it('should show an error toast on failure', fakeAsync(() => {
    personService.getPersonList.and.returnValue(throwError(() => new Error('Service error'))); // Mock error

    component.loadPeople();

    // Simulate the setTimeout
    tick(500); 

    // Assertions
    expect(personService.getPersonList).toHaveBeenCalled();
    expect(component.people).toEqual([]);
    expect(component.loadingData).toBe(false);
  }));

  it('should set loadingData to true initially and false after completion', fakeAsync(() => {
    personService.getPersonList.and.returnValue(of(new HttpResponse({ status: 200, body: [] })));

    component.loadPeople();
    expect(component.loadingData).toBe(true);

    // Simulate the setTimeout
    tick(500); 

    // Assertions
    expect(component.loadingData).toBe(false);
  }));

  it('should set personToDelete and showDeleteConfirmation on deletePersonBtnClick', () => {
    const mockPerson: PersonViewModel = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2000-01-01',
      departmentId: 1,
      fullName: 'John Doe'
    };

    const event = new MouseEvent('click');

    component.deletePersonBtnClick(mockPerson, event);

    // Assertions
    expect(component.personToDelete).toBe(mockPerson);
    expect(component.showDeleteConfirmation).toBeTrue();
  });

  it('should cancel delete', () => {
    component.cancelDelete();

    // Assertions
    expect(component.personToDelete).toBeNull();
    expect(component.showDeleteConfirmation).toBeFalse();
  });

  it('should delete person and reload people on deletePerson', fakeAsync(() => {
    const mockPerson: PersonViewModel = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2000-01-01',
      departmentId: 1,
      fullName: 'John Doe'
    };

    personService.deletePerson.and.returnValue(of(new HttpResponse({ status: 204 })));
    personService.getPersonList.and.returnValue(of(new HttpResponse({ status: 200, body: [] })));

    component.deletePerson(mockPerson);

    // Simulate the setTimeout
    tick(2000);

    // Assertions
    expect(loadingOverlayService.show).toHaveBeenCalledWith('Deleting John');
    expect(personService.deletePerson).toHaveBeenCalledWith(1);
    expect(loadingOverlayService.hide).toHaveBeenCalled();
    expect(toastService.addToast).toHaveBeenCalledWith('John deleted', 'success');
    expect(component.people).toEqual([]);
  }));

  it('should show error toast on delete person failure', fakeAsync(() => {
    const mockPerson: PersonViewModel = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2000-01-01',
      departmentId: 1,
      fullName: 'John Doe'
    };

    personService.deletePerson.and.returnValue(throwError(() => new Error('Error')));

    component.deletePerson(mockPerson);

    // Simulate the setTimeout
    tick(1000);

    // Assertions
    expect(loadingOverlayService.hide).toHaveBeenCalled();
    expect(toastService.addToast).toHaveBeenCalledWith('Error deleting person', 'error', false);
  }));

  it('should navigate to person detail when navigateToPerson is called', () => {
    component.navigateToPerson(1);
    expect(component['router'].navigate).toHaveBeenCalledWith(['person/1']);

    component.navigateToPerson(null);
    expect(component['router'].navigate).toHaveBeenCalledWith(['person']);
  });
});