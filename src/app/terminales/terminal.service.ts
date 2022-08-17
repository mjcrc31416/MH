import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
//import {LogServiceService} from '../shared/log-service.service';
import {LogServiceService} from '../shared/log-service.service';
import { LoginService } from '../services/login.service';



// @Injectable({
//   providedIn: 'root'
// })

export enum TerminalEvents {
  UpsertDone = 1,
  GetTerminal = 2,
  GetByIdDone = 3,
  GetTerminalPIN = 4,
}

@Injectable({
  providedIn: 'root'
})
export class TerminalService {


  // MAIN OBSERVABLE ===========================================================
  private eventSource = new Subject<any>();
  public eventSource$ = this.eventSource.asObservable();

  uri = environment.APIEndpoint;
  data: any;
  dataSavedSource: any;

  constructor(
    private http: HttpClient,
    private log: LogServiceService,
    private service: LoginService,
  ) { }

  public async upseTermi(data) {
    let retVal: any = {};
    let response = null;
    try {
      response = await this.http.post(`${this.uri}/corps/terminal/upse`, data).toPromise();
      retVal = response;
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
      event: TerminalEvents.UpsertDone,
      data: retVal
    });
    return retVal;
  }

  public async getTerminalPIN(data) {
    let retVal: any = {};
    let response = null;
    try {
      response = await this.http.post(`${this.uri}/corps/terminalPIN/getTerminalPin`, data).toPromise();
      retVal = response;
    } catch (e) {
      this.log.show('Error');
    }
    // this.eventSource.next({
    //   event: TerminalEvents.GetTerminalPIN,
    //   data: retVal
    // });
    return retVal;
  }

  public async getTerminal(tipo, pageIndex, pageSize) {
    let response = null;
    console.log(response);
    
    try {
      if (tipo == '02') {
        return this.http.get(`${this.uri}/corps/getTerminal?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve+'&mun='+this.service.getUser().municip.cve+'&pageIndex='+pageIndex+'&pageSize='+pageSize).toPromise();
      } else if (tipo !== '02') {
        return this.http.get(`${this.uri}/corps/getTerminal?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve+'&pageIndex='+pageIndex+'&pageSize='+pageSize).toPromise();
      }
        
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
            event: TerminalEvents.GetTerminal,
            data: response
          });
          console.log(response);
    return response;
    
  }

  // public async getTerminal(tipo) {
  //   let response = null;
  //   console.log(response);

  //   try {
  //     if (tipo == '02') {
  //       return this.http.get(`${this.uri}/corps/getTerminal?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve+'&mun='+this.service.getUser().municipio.cve).toPromise();
  //     } else if (tipo !== '02') {
  //       return this.http.get(`${this.uri}/corps/getTerminal?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve).toPromise();
  //     }
      
  //     // response = await this.http.get(`${this.uri}/corps/getTerminal?ent=`+this.service.getUser().entidad.entidad).toPromise();
  //   } catch (e) {
  //     this.log.show('Error');
  //   }
  //   this.eventSource.next({
  //           event: TerminalEvents.GetTerminal,
  //           data: response
  //         });
  //   return response;
  // }

  public async getById(id) {
    let retVal: any = {};
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/corps/termi/getById/${id}`).toPromise();
      retVal = response[0];
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
      event: TerminalEvents.GetByIdDone,
      data: retVal
    });
    return retVal;
  }


  public async grid1RemoveRow(id) {
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/corps/rem/${id}`).toPromise();
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
