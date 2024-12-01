import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-person-not-found',
  templateUrl: './person-not-found.component.html',
  styleUrl: './person-not-found.component.scss'
})
export class PersonNotFoundComponent implements OnInit {

  personId: number | null = null;

  constructor(    private route: ActivatedRoute,
    private router: Router,) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.personId = params['id'];
    });
  } 

  backToHome() {
    this.router.navigate(['/']);
  }
}