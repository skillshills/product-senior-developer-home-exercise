import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingOverlayService {
  private loadingSubject = new BehaviorSubject<{ isVisible: boolean; message: string }>({
    isVisible: false,
    message: 'Processing...',
  });

  loadingState$ = this.loadingSubject.asObservable();

  show(message: string = 'Processing...') {
    this.loadingSubject.next({ isVisible: true, message });
  }

  hide() {
    this.loadingSubject.next({ isVisible: false, message: '' });
  }
}
