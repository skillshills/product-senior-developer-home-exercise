import { Component } from '@angular/core';
import { LoadingOverlayService } from './services/loading-overlay.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';

  loadingState = { isVisible: false, message: '' };

  constructor(private loadingOverlayService: LoadingOverlayService) {
    this.loadingOverlayService.loadingState$.subscribe(state => {
      this.loadingState = state;
    });
  }
}
