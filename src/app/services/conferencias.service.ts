import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConferenciasService {
  uri = environment.APIEndpoint;

  add(data) {
    return this.http.post(`${this.uri}/conferencias/add`, data);
  }

  update(data, id) {
    return this.http.post(`${this.uri}/conferencias/update/${id}`, data);
  }

  getAll() {
    return this.http.get<any>(`${this.uri}/conferencias/getall`);
  }

  getEmpresas(): Observable<any> {
    return this.http.get<any>(`${this.uri}/conferencias/getallacuerdos`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  getConfById(id) {
    if (!id) {
      id = '0';
    }
    return this.http.get<any>(`${this.uri}/conferencias/get/${id}`);
  }

  getNextNumSes() {
    return this.http.get<any>(`${this.uri}/conferencias/nextcnsp`);
  }

  getByNumSes(numSes) {
    return this.http.get<any>(`${this.uri}/conferencias/getByNumSes/${numSes}`);
  }

  rmCnsp(id, data) {
    return this.http.post(`${this.uri}/conferencias/rmcnsp/${id}`, data);
  }

  constructor(
    private http: HttpClient
  ) { }
}
