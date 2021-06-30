import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InstitucionesService {
  uri = environment.APIEndpoint;

  add(data) {
    return this.http.post(`${this.uri}/instituciones/add`, data);
    // .subscribe(res => console.log('Done'));
  }

  getAll() {
    return this.http.get<any>(`${this.uri}/instituciones/getall`);
  }

  removeById(id) {
    return this.http.get<any>(`${this.uri}/instituciones/remove/${id}`);
  }

  getById(id) {
    if (id !== '0') {
      return this.http.get<any>(`${this.uri}/instituciones/get/${id}`);
    } else {
      return of (null);
    }

  }

  constructor(
    private http: HttpClient
  ) { }

}
