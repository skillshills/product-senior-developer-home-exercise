import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingOverlayComponent } from './loading-overlay.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-host',
  template: `<app-loading-overlay [isVisible]="isVisible" [message]="testMessage"></app-loading-overlay>`
})
class TestHostComponent {
  isVisible: boolean = true;
  testMessage: string = 'Loading data...';
}

describe('LoadingOverlayComponent', () => {
  let component: LoadingOverlayComponent;
  let fixture: ComponentFixture<LoadingOverlayComponent>;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadingOverlayComponent, TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingOverlayComponent);
    component = fixture.componentInstance;

    hostFixture = TestBed.createComponent(TestHostComponent);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

});
