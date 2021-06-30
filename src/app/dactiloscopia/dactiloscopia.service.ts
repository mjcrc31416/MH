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

export enum DactilEvents {
  UpsertDactiloscopia = 1,
  GetDactiloscopiaById = 2,
  GetDactiloscopia = 3,
  DacCatalog = 4,
  GetByIdDone = 5,
}

@Injectable({
  providedIn: 'root'
})
export class DactiloscopiaService {
  GetByIdDone(_id: any) {
    throw new Error("Method not implemented.");
  }


  // MAIN OBSERVABLE ===========================================================
  private eventSource = new Subject<any>();
  public eventSource$ = this.eventSource.asObservable();

  uri = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
    private log: LogServiceService,
    private eventoFactory: EventoFactory
  ) { }

  public async upsertDactiloscopia(data) {
    console.log(data);
    let response = null;
    try {
      
      response = await this.http.post(`${this.uri}/corps/upsertmediafil`,data).toPromise();
    } catch (e) {
      this.log.show('Error');
    }

    this.eventSource.next({
      event: DactilEvents.UpsertDactiloscopia,
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
      event: DactilEvents.GetDactiloscopiaById,
      data: response
    });
    return response;
  }

  // public async getDactiloscopia() {
  //   let response = null;
  //   try {
  //     response = await this.http.get(`${this.uri}/dactiloscopia/get`).toPromise();
  //   } catch (e) {
  //     this.log.show('Error');
  //   }
  //   this.eventSource.next({
  //           event: DactilEvents.GetDactiloscopia,
  //           data: response
  //         });
  //   return response;
  // }

  public async getAllCatalog(id) {
    let retVal: any = {};
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/iphadm/getdetdactiloscopia/${id}`).toPromise();
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
      event: DactilEvents.DacCatalog,
      data: response
    });
    return retVal;
  }

  public async getById(id) {
    let retVal: any = {};
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/corps/mediafiliacion/getById/${id}`).toPromise();
      retVal = response;
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
      event: DactilEvents.GetByIdDone,
      data: retVal
    });
    return retVal;
  }

  public async getCatalogs() {
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/catalogos/catentfed`).toPromise();
    } catch (e) {
      this.log.show('Error: evento.servicei -> getCatalogs');
    }
    return response;
  }

}
