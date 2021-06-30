import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {LogServiceService} from '../shared/log-service.service';
import {IEventoModel} from '../models/ievento-model';
import {EventoFactory} from '../modelFactories/evento-factory';


// @Injectable({
//   providedIn: 'root'
// })

export enum RegistroEvents {
  UpsertRegistro = 1,
  GetDactiloscopiaById = 2,
  GetDactiloscopia = 3,
  DacCatalog = 4,
  GetByIdDone = 5,
}

@Injectable({
  providedIn: 'root'
})
export class RegistroService {


  // MAIN OBSERVABLE ===========================================================
  private eventSource = new Subject<any>();
  public eventSource$ = this.eventSource.asObservable();

  uri = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
    private log: LogServiceService,
    private eventoFactory: EventoFactory
  ) { }

  public async upsertRegistro(data) {
    console.log(data);
    let response = null;
    try {
      
      response = await this.http.post(`${this.uri}/corps/upsertregistro`,data).toPromise();
    } catch (e) {
      this.log.show('Error');
    }

    this.eventSource.next({
      event: RegistroEvents.UpsertRegistro,
      data: response
    });
    return response;
  }

  public async dactiloscopiaGetById(id) {
    let response = null;
    try {
      // const evento:IEventoModel = this.eventoFactory.newEventoFromForm(data);
      response = await this.http.get(`${this.uri}/corps/mediagetById/${id}`).toPromise();
    } catch (e) {
      this.log.show('Error');
    }

    this.eventSource.next({
      event: RegistroEvents.GetDactiloscopiaById,
      data: response
    });
    return response;
  }

  public async getAllCatalog(id) {
    let retVal: any = {};
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/iphadm/getdetregistro/${id}`).toPromise();
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
      event: RegistroEvents.DacCatalog,
      data: response
    });
    return retVal;
  }

  public async getById(id) {
    let retVal: any = {};
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/corps/registro/getById/${id}`).toPromise();
      retVal = response;
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
      event: RegistroEvents.GetByIdDone,
      data: retVal
    });
    return retVal;
  }


}
