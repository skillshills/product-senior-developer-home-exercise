import { Component } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { ToastViewModel } from '../../models/toast-view-model';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  constructor(public toastService: ToastService) { }

  dismissToast(toastToRemove: ToastViewModel): void {
    this.toastService.removeToast(toastToRemove);
  }
}
