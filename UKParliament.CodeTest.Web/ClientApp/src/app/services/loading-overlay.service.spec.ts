import { TestBed } from '@angular/core/testing';
import { LoadingOverlayService } from './loading-overlay.service';

describe('LoadingOverlayService', () => {
  let service: LoadingOverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingOverlayService],
    });
    service = TestBed.inject(LoadingOverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default loading state', (done: DoneFn) => {
    service.loadingState$.subscribe((state) => {
      expect(state).toEqual({
        isVisible: false,
        message: 'Processing...',
      });
      done();
    });
  });

  it('should update loading state to visible with a custom message', (done: DoneFn) => {
    const customMessage = 'Loading data...';

    service.loadingState$.subscribe((state) => {
      if (state.isVisible) {
        expect(state).toEqual({
          isVisible: true,
          message: customMessage,
        });
        done();
      }
    });

    service.show(customMessage);
  });

  it('should update loading state to visible with the default message', (done: DoneFn) => {
    service.loadingState$.subscribe((state) => {
      if (state.isVisible) {
        expect(state).toEqual({
          isVisible: true,
          message: 'Processing...',
        });
        done();
      }
    });

    service.show();
  });

  it('should update loading state to hidden', (done: DoneFn) => {
    service.show('Some message'); // First show it
    service.hide(); // Then hide it

    service.loadingState$.subscribe((state) => {
      if (!state.isVisible) {
        expect(state).toEqual({
          isVisible: false,
          message: '',
        });
        done();
      }
    });
  });
});
