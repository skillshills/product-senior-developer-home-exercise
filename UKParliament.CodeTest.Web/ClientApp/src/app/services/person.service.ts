import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonViewModel } from '../models/person-view-model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getPersonList(): Observable<PersonViewModel[]> {
    return this.http.get<PersonViewModel[]>(`${this.baseUrl}api/person`);
  }  

  getById(id: number): Observable<PersonViewModel> {
    return this.http.get<PersonViewModel>(`${this.baseUrl}api/person/${id}`);
  }
  
  createPerson(personData: PersonViewModel): Observable<any> {
    return this.http.post(`${this.baseUrl}api/person`, personData);
  }

  updatePerson(id: number, personData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}api/person/${id}`, personData);
  }

  deletePerson(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}api/person/${id}`);
  }
}
