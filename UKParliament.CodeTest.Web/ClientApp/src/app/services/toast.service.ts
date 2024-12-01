import { Injectable } from '@angular/core';
import { ToastViewModel } from '../models/toast-view-model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  public toasts: ToastViewModel[] = [];

  constructor() {}

  addToast(message: string, type: string, autoHide: boolean = true): void {
    const id = (this.toasts.length + 1).toString();
    const toast: ToastViewModel = {id: id, message: message, type: type,  duration: 4000 };
    this.toasts.push(toast);
    
    if (autoHide) {
      setTimeout(() => this.removeToast(toast), toast.duration);
    }
  }

  removeToast(toastToRemove: ToastViewModel) {
    this.toasts = this.toasts.filter(t => t.id !== toastToRemove.id );
  }
}
