import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Subject} from 'rxjs';
import {LogServiceService} from '../../shared/log-service.service';

export enum IncidenteEvents {
  GetAll = 1,
  Upsert = 2,
  GetById = 3,
  GetPersonal = 4,
}

@Injectable({
  providedIn: 'root'
})
export class IncService {
  uri = environment.APIEndpoint;

  // MAIN OBSERVABLE ===========================================================
  private eventSource = new Subject<any>();
  public eventSource$ = this.eventSource.asObservable();

  constructor(
    private http: HttpClient,
    private log: LogServiceService,
  ) { }

  public async upsertIncidente(data) {
    let response = null;
    try {
      response = await this.http.post(`${this.uri}/corps/incidente/upse`, data).toPromise();
    } catch (e) {
      console.log('Error');
    }
    this.eventSource.next({
      event: IncidenteEvents.Upsert,
      data: response
    });
    return response;
  }

  public async getAll() {
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/corps/incidente/getAll`).toPromise();
    } catch (e) {
      console.log('Error');
    }

    this.eventSource.next({
      event: IncidenteEvents.GetAll,
      data: response
    });
    return response;
  }

  public async getById(id) {
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/corps/incidente/getById/${id}`).toPromise();
    } catch (e) {
      console.log('Error');
    }

    this.eventSource.next({
      event: IncidenteEvents.GetById,
      data: response
    });
    return response;
  }


}
