import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {LogServiceService} from '../shared/log-service.service';
import {FormUtilsService} from '../shared/form-utils.service';
import {EventoFactory} from '../modelFactories/evento-factory';


// @Injectable({
//   providedIn: 'root'
// })

export enum EtiquetasEvents {
  UpsertEtiquetas = 1,
  GetByIdDone = 2,
  GetEtiquetas = 3,
}

@Injectable({
  providedIn: 'root'
})
export class EtiquetasDocumentoService {

  // MAIN OBSERVABLE ===========================================================
  private eventSource = new Subject<any>();
  public eventSource$ = this.eventSource.asObservable();

  uri = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
    private log: LogServiceService,
    private eventoFactory: EventoFactory,
    private formUtils: FormUtilsService
  ) { }

  public async upsertEtiquetas(data) {
    console.log(data);
    let response = null;
    try {
      
      response = await this.http.post(`${this.uri}/corps/etiquetas/upse`,data).toPromise();
    } catch (e) {
      this.log.show('Error');
    }

    this.eventSource.next({
      event: EtiquetasEvents.UpsertEtiquetas,
      data: response
    });
    return response;
  }

  public async getById(id) {
    let retVal: any = {};
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/corps/etiqueta/getById/${id}`).toPromise();
      retVal = response[0];
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
      event: EtiquetasEvents.GetByIdDone,
      data: retVal
    });
    return retVal;
  }

  public async getEtiquetas() {
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/corps/getetiqueta`).toPromise();
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
            event: EtiquetasEvents.GetEtiquetas,
            data: response
          });
    return response;
  }

  public async grid1RemoveRow(id) {
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/corps/removeetiquetas/${id}`).toPromise();
    } catch (e) {
      this.log.show('Error');
    }
    return response;
  }

}
