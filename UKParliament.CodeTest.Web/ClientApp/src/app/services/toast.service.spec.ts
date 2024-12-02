import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ToastService } from './toast.service';
import { ToastViewModel } from '../models/toast-view-model';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addToast', () => {
    it('should add a toast to the toasts array', () => {
      const message = 'Test Message';
      const type = 'success';

      service.addToast(message, type);

      // Assertions
      expect(service.toasts.length).toBe(1);
      expect(service.toasts[0].message).toBe(message);
      expect(service.toasts[0].type).toBe(type);
    });

    it('should assign a unique ID to each toast', () => {
      service.addToast('Message 1', 'info');
      service.addToast('Message 2', 'warning');

      // Assertions
      expect(service.toasts[0].id).not.toBe(service.toasts[1].id);
    });

    it('should automatically remove a toast after the duration if autoHide is true', fakeAsync(() => {
      const message = 'Auto-hide Test';
      const type = 'info';

      spyOn(service, 'removeToast').and.callThrough();
      service.addToast(message, type, true);

      expect(service.toasts.length).toBe(1);

      // Simulate the setTimeout
      tick(5000);

      // Assertions
      expect(service.removeToast).toHaveBeenCalled();
      expect(service.toasts.length).toBe(0);
    }));

    it('should not automatically remove a toast if autoHide is false', fakeAsync(() => {
      const message = 'No Auto-hide Test';
      const type = 'info';

      service.addToast(message, type, false);

      expect(service.toasts.length).toBe(1);

      // Simulate the setTimeout
      tick(5000);

      // Assertions
      expect(service.toasts.length).toBe(1); // Toast should still exist
    }));
  });

  describe('removeToast', () => {
    it('should remove a specific toast from the toasts array', () => {
      service.addToast('Toast 1', 'success');
      service.addToast('Toast 2', 'error');

      const toastToRemove = service.toasts[0];
      service.removeToast(toastToRemove);

      // Assertions
      expect(service.toasts.length).toBe(1);
      expect(service.toasts.find(t => t.id === toastToRemove.id)).toBeUndefined();
    });

    it('should not remove any toast if the specified toast does not exist', () => {
      service.addToast('Toast 1', 'success');
      const initialLength = service.toasts.length;

      const nonExistentToast: ToastViewModel = {
        id: 'non-existent-id',
        message: 'Non-existent',
        type: 'info',
        duration: 50
      };

      service.removeToast(nonExistentToast);

      // Assertions
      expect(service.toasts.length).toBe(initialLength);
    });
  });
});
