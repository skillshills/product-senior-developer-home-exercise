import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { PersonViewModel } from '../../models/person-view-model';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss'
})
export class PeopleComponent {
  people: PersonViewModel[] = [];

  constructor(private personService: PersonService, private router: Router) { }

  ngOnInit(): void {
    this.loadPeople();
  }

  loadPeople(): void {
    this.personService.getPersonList().subscribe({
      next: (data) => (this.people = data),
      error: (err) => console.error('Error loading persons', err),
    });
  }

  navigateToPerson(id: number | null): void {
    const route = id !== null ? `person/${id}` : 'person';
    this.router.navigate([route]);
  }

  deletePerson(id: number, event: MouseEvent): void {
    event.stopPropagation();
    
    this.personService.deletePerson(id).subscribe({
      next: () => {
        this.loadPeople();
      },
      error: (err) => console.error('Error deleting person', err),
    });
  }
}
