import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {LogServiceService} from '../../shared/log-service.service';
import {PersonalEvents} from '../personal/personal.service';
import { LoginService } from '../../services/login.service';

export enum VehiculosEvents {
  GetCatalogs = 1,
  UpsertDone = 2,
  GetByIdDone = 3,
  GetVehiculos = 4,
}

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {
  // MAIN OBSERVABLE ===========================================================
  private eventSource = new Subject<any>();
  public eventSource$ = this.eventSource.asObservable();
  uri = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
    private log: LogServiceService,
    private service: LoginService,
  ) { }

  public async getAllCatalog() {
    let retVal: any = {};
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/corps/vehi/getVehiCatalogs`).toPromise();
      // retVal.vehcEstatus = response.vehcEstatus;
      // retVal.vehcMarcas = response.vehcMarcas;
      // retVal.vehcUsos = response.vehcUsos;
      retVal = response;
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
      event: PersonalEvents.CorpCatalog,
      data: retVal
    });
    return retVal;
  }

  public async upseVehi(data) {
    let retVal: any = {};
    let response = null;
    try {
      response = await this.http.post(`${this.uri}/corps/vehi/upse`, data).toPromise();
      retVal = response;
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
      event: VehiculosEvents.UpsertDone,
      data: retVal
    });
    return retVal;
  }

  public async getById(id) {
    let retVal: any = {};
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/corps/vehi/getById/${id}`).toPromise();
      retVal = response[0];
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
      event: VehiculosEvents.GetByIdDone,
      data: retVal
    });
    return retVal;
  }

  // public async getVehiculos(tipo) {
  //   let response = null;
  //   console.log(response);
    
  //   try {
  //     if (tipo == '02') {
  //       return this.http.get(`${this.uri}/corps/getvehiculo?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve+'&mun='+this.service.getUser().municip.cve).toPromise();
  //     } else if (tipo !== '02') {
  //       return this.http.get(`${this.uri}/corps/getvehiculo?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve).toPromise();
  //     }
        
  //   } catch (e) {
  //     this.log.show('Error');
  //   }
  //   this.eventSource.next({
  //           event: VehiculosEvents.GetVehiculos,
  //           data: response
  //         });
  //         console.log(response);
  //   return response;
    
  // }

  public async getVehiculos(tipo) {
    let response = null;
    try {
          if (tipo == '02') {
            return this.http.get(`${this.uri}/corps/getvehiculo?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve+'&mun='+this.service.getUser().municip.cve).toPromise();
          } else if (tipo !== '02') {
            return this.http.get(`${this.uri}/corps/getvehiculo?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve).toPromise();
          }

      // response = await this.http.get(`${this.uri}/corps/getvehiculo?ent=`+this.service.getUser().entidad.entidad).toPromise();
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
            event: VehiculosEvents.GetVehiculos,
            data: response
          });
    return response;
  }

  public async grid1RemoveRow(id) {
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/corps/remo/${id}`).toPromise();
    } catch (e) {
      this.log.show('Error');
    }
    return response;
  }

  public async getCatalogs() {
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/catalogos/cattipos`).toPromise();
    } catch (e) {
      this.log.show('Error: evento.servicei -> getCatalogs');
    }
    return response;
  }

}
