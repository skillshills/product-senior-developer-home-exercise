import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonViewModel } from '../models/person-view-model';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getPersonList(): Observable<HttpResponse<PersonViewModel[]>> {
    return this.http.get<PersonViewModel[]>(`${this.baseUrl}api/person`, { observe: 'response' });
  }

  getById(id: number): Observable<HttpResponse<PersonViewModel>> {
    return this.http.get<PersonViewModel>(`${this.baseUrl}api/person/${id}`, { observe: 'response' });
  }
  
  createPerson(personData: PersonViewModel): Observable<any> {
    return this.http.post<HttpResponse<any>>(`${this.baseUrl}api/person`, personData, { observe: 'response' });
  }

  updatePerson(id: number, personData: any): Observable<any> {
    return this.http.put<HttpResponse<any>>(`${this.baseUrl}api/person/${id}`, personData, { observe: 'response' });
  }

  deletePerson(id: number): Observable<any> {
    return this.http.delete<HttpResponse<any>>(`${this.baseUrl}api/person/${id}`, { observe: 'response' });
  }
}
