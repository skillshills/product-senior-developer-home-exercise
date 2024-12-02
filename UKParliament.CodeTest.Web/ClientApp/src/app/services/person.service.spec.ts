import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PersonService } from './person.service';
import { PersonViewModel } from '../models/person-view-model';

describe('PersonService', () => {
  let service: PersonService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:4200/'; // Replace with actual BASE_URL value if needed

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PersonService,
        { provide: 'BASE_URL', useValue: baseUrl },
      ],
    });
    service = TestBed.inject(PersonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch person list', () => {
    const mockResponse: PersonViewModel[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        dateOfBirth: '1990-01-01',
        departmentId: 1,
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        fullName: 'Jane Doe',
        dateOfBirth: '1992-02-02',
        departmentId: 2,
      },
    ];

    service.getPersonList().subscribe((response) => {
      expect(response.body).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}api/person`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch a person by ID', () => {
    const id = 1;
    const mockResponse: PersonViewModel = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      dateOfBirth: '1990-01-01',
      departmentId: 1,
    };

    service.getById(id).subscribe((response) => {
      expect(response.body).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}api/person/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create a person', () => {
    const personData: PersonViewModel = {
      id: 3,
      firstName: 'Alice',
      lastName: 'Smith',
      fullName: 'Alice Smith',
      dateOfBirth: '1985-05-15',
      departmentId: 3,
    };
    const mockResponse = { success: true };

    service.createPerson(personData).subscribe((response) => {
      expect(response.body).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}api/person`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(personData);
    req.flush(mockResponse);
  });

  it('should update a person', () => {
    const id = 1;
    const personData = {
      firstName: 'Updated',
      lastName: 'Person',
      fullName: 'Updated Person',
      dateOfBirth: '1988-08-08',
      departmentId: 4
    };

    const mockResponse = { success: true };

    service.updatePerson(id, personData).subscribe((response) => {
      expect(response.body).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}api/person/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(personData);
    req.flush(mockResponse);
  });

  it('should delete a person', () => {
    const id = 1;
    const mockResponse = { success: true };

    service.deletePerson(id).subscribe((response) => {
      expect(response.body).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}api/person/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
