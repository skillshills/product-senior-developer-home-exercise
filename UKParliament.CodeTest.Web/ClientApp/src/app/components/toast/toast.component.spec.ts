import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { ToastService } from '../../services/toast.service';
import { ToastViewModel } from '../../models/toast-view-model';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    const toastServiceMock = jasmine.createSpyObj('ToastService', ['removeToast']);

    TestBed.configureTestingModule({
      declarations: [ToastComponent],
      providers: [
        { provide: ToastService, useValue: toastServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call ToastService.removeToast when dismissToast is invoked', () => {
    const mockToast: ToastViewModel = {
      id: '1',
      type: 'info',
      message: 'Test Toast',
      duration: 5000
    };

    component.dismissToast(mockToast);

    // Assertions
    expect(toastService.removeToast).toHaveBeenCalledWith(mockToast);
  });
});
