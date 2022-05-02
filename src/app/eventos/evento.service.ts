import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {LogServiceService} from '../shared/log-service.service';
import {IEventoModel} from '../models/ievento-model';
import {EventoFactory} from '../modelFactories/evento-factory';
import {FormUtilsService} from '../shared/form-utils.service';
import { LoginService } from '../services/login.service';


// @Injectable({
//   providedIn: 'root'
// })

export enum EventoEvents {
  ReportaCatalog = 1,
  IncidenteCatalog = 2,
  UpsertEvent = 3,
  GetEventoById = 4,
  GetEventos = 5,
  AsignarEvento = 6,
  GetEventoIph = 7,
  GetEvento = 8,

}

@Injectable({
  providedIn: 'root'
})
export class EventoService {


  // MAIN OBSERVABLE ===========================================================
  private eventSource = new Subject<any>();
  public eventSource$ = this.eventSource.asObservable();

  uri = environment.APIEndpoint;

  constructor(private service: LoginService,
    private http: HttpClient,
    private log: LogServiceService,
    private eventoFactory: EventoFactory,
    private formUtils: FormUtilsService
  ) { }

  public async getReporta() {
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/catalogos/reporta/get`).toPromise();
    } catch (e) {
      this.log.show('Error');
    }
    // this.eventSource.next({
    //         event: EventoEvents.ReportaCatalog,
    //         data: response
    //       });
    return response;
  }

  public async getIncidente(id) {
    let retVal: any = {};
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/catalogos/incidente/get`).toPromise();
    } catch (e) {
      this.log.show('Error');
    }
    // this.eventSource.next({
    //   event: EventoEvents.IncidenteCatalog,
    //   data: response
    // });
    return response;
  }

  public async upsertEvento(data) {
    let response = null;
    try {
      const tmpEvento:IEventoModel = this.eventoFactory.newEventoFromForm(data);
      data.ubicacionEvento = tmpEvento.ubicacionEvento;
      //Agregar STR fecha
      data.strFecha = this.formUtils.getStrFechaCort(data.fecha);
      response = await this.http.post(`${this.uri}/eventos/upsert`, data).toPromise();
    } catch (e) {
      this.log.show('Error');
    }

    this.eventSource.next({
      event: EventoEvents.UpsertEvent,
      data: response
    });
    return response;
  }

  public async upsertEvento2(data) {
    let response = null;
    try {
      response = await this.http.post(`${this.uri}/eventos/upsert`, data).toPromise();
    } catch (e) {
      this.log.show('Error');
    }

    // this.eventSource.next({
    //   event: EventoEvents.UpsertEvent,
    //   data: response
    // });
    return response;
  }

  public async getEventoById(id) {
    let response = null;
    try {
      // const evento:IEventoModel = this.eventoFactory.newEventoFromForm(data);
      response = await this.http.get(`${this.uri}/eventos/getById/${id}`).toPromise();
    } catch (e) {
      this.log.show('Error');
    }

    // this.eventSource.next({
    //   event: EventoEvents.GetEventoById,
    //   data: response
    // });
    return response;
  }


  public async getEvento(tipo) {
    let response = null;
    console.log(response);

    try {
      if (tipo == '02') {
        return this.http.get(`${this.uri}/eventos/getevento?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve+'&mun='+this.service.getUser().municip.cve).toPromise();
      } else if (tipo !== '02') {
        return this.http.get(`${this.uri}/eventos/getevento?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve).toPromise();
      }

    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
            event: EventoEvents.GetEvento,
            data: response
          });
          console.log(response);
    return response;

  }

  public async getEventos(tipo, pageIndex, pageSize) {
    let response = null;
    console.log(response);

    try {
      if (tipo == '02') {
        return this.http.get(`${this.uri}/eventos/get?tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve+'&mun='+this.service.getUser().municip.cve+'&pageIndex='+pageIndex+'&pageSize='+pageSize).toPromise();
      } else if (tipo !== '02') {console.log('B');
        return this.http.get(`${this.uri}/eventos/get?tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve+'&pageIndex='+pageIndex+'&pageSize='+pageSize).toPromise();
      }console.log('C');

    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
            event: EventoEvents.GetEventos,
            data: response
          });
          console.log(response);
    return response;

  }

  // public async getEventos() {
  //   let response = null;

  //   try {
  //     response = await this.http.get(`${this.uri}/eventos/get?ent=`+this.service.getUser().entidad.entidad).toPromise();
  //   } catch (e) {
  //     this.log.show('Error');
  //   }
  //   this.eventSource.next({
  //           event: EventoEvents.GetEventos,
  //           data: response
  //         });
  //   return response;
  // }

  public async upsertAsignarEven(data) {
    let response = null;
    try {
      // const tmpEvento:IEventoModel = this.eventoFactory.newEventoFromForm(data);
      // data.ubicacionEvento = tmpEvento.ubicacionEvento;
      // //Agregar STR fecha
      // data.strFecha = this.formUtils.getStrFechaCort(data.fecha);
      response = await this.http.post(`${this.uri}/eventos/asignar`, data).toPromise();
    } catch (e) {
      this.log.show('Error');
    }

    this.eventSource.next({
      event: EventoEvents.AsignarEvento,
      data: response
    });
    return response;
  }

  public async grid1RemoveRow(id) {
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/eventos/remove/${id}`).toPromise();
    } catch (e) {
      this.log.show('Error');
    }
    return response;
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

  public async getCatalogos() {
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/catalogos/cattipos`).toPromise();
    } catch (e) {
      this.log.show('Error: evento.servicei -> getCatalogos');
    }
    return response;
  }

  public async sendNotifications(data) {
    let response = null;
    try {
      response = await this.http.post(`${this.uri}/mov/sendnot`, data).toPromise();
    } catch (e) {
      this.log.show('Error: evento.service -> sendNotifications');
    }
    return response;
  }


}
