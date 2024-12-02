import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

import { PersonViewModel } from '../../models/person-view-model';
import { PersonService } from '../../services/person.service';
import { LoadingOverlayService } from '../../services/loading-overlay.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss'
})
export class PeopleComponent {
  people: PersonViewModel[] = [];
  loadingData: boolean = true;
  showDeleteConfirmation: boolean = false;
  personToDelete: PersonViewModel | null = null;

  constructor(
    private toastService: ToastService,
    private personService: PersonService,
    private loadingOverlayService: LoadingOverlayService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadPeople();
  }

  loadPeople(): void {
    this.loadingData = true;

    setTimeout(() => {
      this.personService.getPersonList().pipe(
        filter((response: HttpResponse<any>) => response.status === 200)
      ).subscribe({
        next: (data) => (this.people = data.body),
        error: () => {
          this.toastService.addToast('Error loading people', 'error');
        }
      });

      this.loadingData = false;
    }, 500);
  }

  navigateToPerson(id: number | null): void {
    const route = id !== null ? `person/${id}` : 'person';
    this.router.navigate([route]);
  }

  deletePersonBtnClick(person: PersonViewModel, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.personToDelete = person;
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.personToDelete = null;
    this.showDeleteConfirmation = false;
  }

  deletePerson(person: PersonViewModel): void {
    this.showDeleteConfirmation = false;
    this.loadingOverlayService.show(`Deleting ${person.firstName}`);

    setTimeout(() => {
      this.personService.deletePerson(person.id).pipe(
        filter((response: HttpResponse<any>) => response.status === 204)
      ).subscribe({
        next: () => {
          this.loadingOverlayService.hide();
          this.loadPeople();
          this.toastService.addToast(`${person.firstName} deleted`, 'success');
        },
        error: () => {
          this.loadingOverlayService.hide();
          this.toastService.addToast('Error deleting person', 'error', false);
        }
      });
    }, 750);

    this.personToDelete = null;
  }
}
