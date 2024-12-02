import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SpinnerComponent } from './spinner.component';

@Component({
  selector: 'app-host',
  template: `<app-spinner [message]="testMessage"></app-spinner>`
})
class TestHostComponent {
  testMessage: string = 'Loading...';
}

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpinnerComponent, TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;

    hostFixture = TestBed.createComponent(TestHostComponent);
  });

  it('should create the spinner component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the default message if no input is provided', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // Assertions
    expect(compiled.textContent).toContain('Processing...');
  });

  it('should display the input message when provided', () => {
    hostFixture.componentInstance.testMessage = 'Please wait...';
    hostFixture.detectChanges();

    const compiled = hostFixture.nativeElement as HTMLElement;
    const spinnerElement = compiled.querySelector('app-spinner');

    // Assertions
    expect(spinnerElement?.textContent).toContain('Please wait...');
  });
});
