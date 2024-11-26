import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DepartmentViewModel } from '../models/department-view-model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getDepartmentList(): Observable<DepartmentViewModel[]> {
    return this.http.get<DepartmentViewModel[]>(this.baseUrl + `api/departments/`)
  }  

  getById(id: number): Observable<DepartmentViewModel> {
    return this.http.get<DepartmentViewModel>(this.baseUrl + `api/departments/${id}`)
  }
}
