import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { PersonNotFoundComponent } from './person-not-found.component';

describe('PersonNotFoundComponent', () => {
  let component: PersonNotFoundComponent;
  let fixture: ComponentFixture<PersonNotFoundComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      params: of({ id: 123 }), // Mocked route parameter
    };

    await TestBed.configureTestingModule({
      declarations: [PersonNotFoundComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonNotFoundComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve the person ID from route parameters on init', () => {
    fixture.detectChanges(); // Triggers ngOnInit

    // Assertions
    expect(component.personId).toBe(123);
  });

  it('should navigate to home when backToHome is called', () => {
    component.backToHome();

    // Assertions
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
