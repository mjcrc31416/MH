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

export enum CertifEvents {
  UpsertCertificado = 1,
  GetByIdDone = 2,
  GetCertificados = 3,
  DetCatalog = 4,
}

@Injectable({
  providedIn: 'root'
})
export class CertificadoService {

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

  public async getAllCatalogo(id) {
    let retVal: any = {};
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/iphadm/getdetenciones/${id}`).toPromise();
      // estadoCivil
      // grupoSangre
      // factorRH
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
      event: CertifEvents.DetCatalog,
      data: response
    });
    return retVal;
  }

  public async upsertcertificado(data) {
    console.log(data);
    let response = null;
    try {
      
      response = await this.http.post(`${this.uri}/corps/upsertcertificado`,data).toPromise();
    } catch (e) {
      this.log.show('Error');
    }

    this.eventSource.next({
      event: CertifEvents.UpsertCertificado,
      data: response
    });
    return response;
  }


  public async getById(id) {
    let retVal: any = {};
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/corps/certificado/getById/${id}`).toPromise();
      retVal = response;
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
      event: CertifEvents.GetByIdDone,
      data: retVal
    });
    return retVal;
  }

  public async getCertificados() {
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/certificado/get`).toPromise();
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
            event: CertifEvents.GetCertificados,
            data: response
          });
    return response;
  }


}
