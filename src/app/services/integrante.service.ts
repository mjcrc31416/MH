import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Subject} from 'rxjs';
import { LoginService } from '../services/login.service';
import {LogServiceService} from '../shared/log-service.service';

export enum TerminalEvents {
  GetTerminal = 1,

}

@Injectable({
  providedIn: 'root'
})
export class IntegranteService {
  uri = environment.APIEndpoint;
  private eventSource = new Subject<any>();
  public eventSource$ = this.eventSource.asObservable();

  add(data) {
    return this.http.post(`${this.uri}/integrante/add`, data);
    // .subscribe(res => console.log('Done'));
  }

  getAll() {
    return this.http.get<any>(`${this.uri}/integrante/getall`);
  }

  getAlli(tipo) {

    let response = null;
    console.log(response);
    
    try {
      if (tipo == '02') {
        return this.http.get(`${this.uri}/corps/getPersona?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve+'&mun='+this.service.getUser().municip.cve).toPromise();
      } else if (tipo !== '02') {
        return this.http.get(`${this.uri}/corps/getPersona?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve).toPromise();
      }
        
    } catch (e) {
      this.log.show('Error');
    }
    // return this.http.get<any>(`${this.uri}/corps/getPersona?ent=`+this.service.getUser().entidad.entidad);
  }

  // public async getAllo(tipo) {
  //   let response = null;
  //   console.log(response);
    
  //   try {
  //     if (tipo == '02') {
  //       return this.http.get(`${this.uri}/corps/getusuars?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve+'&mun='+this.service.getUser().municipio.cve).toPromise();
  //     } else if (tipo !== '02') {
  //       return this.http.get(`${this.uri}/corps/getusuars?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve).toPromise();
  //     }
        
  //   } catch (e) {
  //     this.log.show('Error');
  //   }
  //   this.eventSource.next({
  //           event: TerminalEvents.GetTerminal,
  //           data: response
  //         });
  //         console.log(response);
  //   return response;
    
  // }

  getAllo(tipo) {

    let response = null;
    console.log(response);
    
    try {
      if (tipo == '02') {
        return this.http.get(`${this.uri}/corps/getusuario?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve+'&mun='+this.service.getUser().municip.cve).toPromise();
      } else if (tipo !== '02') {
        return this.http.get(`${this.uri}/corps/getusuario?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve).toPromise();
      }
        
    } catch (e) {
      this.log.show('Error');
    }
    //return this.http.get<any>(`${this.uri}/corps/getusuario?ent=`+this.service.getUser().entidad.entidad);
  }


  // getAllo() {
  //   return this.http.get<any>(`${this.uri}/corps/getusuario?ent=`+this.service.getUser().entidad.entidad);
  // }

  constructor(
    private http: HttpClient,
    private service: LoginService,
    private log: LogServiceService
  ) { }

}
