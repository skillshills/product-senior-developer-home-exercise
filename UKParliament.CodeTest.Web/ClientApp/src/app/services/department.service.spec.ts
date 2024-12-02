import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DepartmentService } from './department.service';
import { DepartmentViewModel } from '../models/department-view-model';

describe('DepartmentService', () => {
  let service: DepartmentService;
  let httpMock: HttpTestingController;
  const mockBaseUrl = 'http://example.com/';
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DepartmentService,
        { provide: 'BASE_URL', useValue: mockBaseUrl },
      ],
    });

    service = TestBed.inject(DepartmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch department list', () => {
    const mockDepartments: DepartmentViewModel[] = [
      { id: 1, name: 'HR', totalPeople: 10},
      { id: 2, name: 'Finance', totalPeople: 5}
    ];

    service.getDepartmentList().subscribe((departments) => {
      expect(departments).toEqual(mockDepartments);
    });

    const req = httpMock.expectOne(`${mockBaseUrl}api/departments/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDepartments);
  });

  it('should fetch a department by ID', () => {
    const mockDepartment: DepartmentViewModel = { id: 1, name: 'HR', totalPeople: 10}

    service.getById(1).subscribe((department) => {
      expect(department).toEqual(mockDepartment);
    });

    const req = httpMock.expectOne(`${mockBaseUrl}api/departments/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDepartment);
  });
});
