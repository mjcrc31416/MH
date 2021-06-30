import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {LogServiceService} from '../../shared/log-service.service';
import * as moment from 'moment';
import {EventoService} from '../../eventos/evento.service';
import { LoginService } from '../../services/login.service';

export enum IphadEvents {
  GetInitialData = 1,
  UpsertDone = 2,
  GetPersonal = 3,
  GetDetenidoDato = 4,
  GetDetenido = 5,
  GetDetdactil = 6,
  GetDetregistro = 7,
}

@Injectable({
  providedIn: 'root'
})
export class IphadService {
  // MAIN OBSERVABLE ===========================================================
  private eventSource = new Subject<any>();
  public eventSource$ = this.eventSource.asObservable();
  uri = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
    private log: LogServiceService,
    private eventoSrv: EventoService,
    private service: LoginService
  ) { }

  public async getEventoData(idEvento) {
    let data = this.eventoSrv.getEventoById(idEvento);
    return data;
  }

  public async getIphaData(idPreIph) {
    let retVal: any = {};
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/mov/iphaGetById/${idPreIph}`).toPromise();
      retVal = response;
    } catch (e) {
      this.log.show('Error');
    }
    return retVal;
  }

  public async getReporteIpha(folioInterno) {
    let retVal: any = {};
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/mov/getfile/${folioInterno}.pdf`).toPromise();
      retVal = response;
    } catch (e) {
      this.log.show('Error');
    }
    return retVal;
  }

  public getURLReporteIpha(folioInterno) {
    try {
      return `${this.uri}/mov/getfile/${folioInterno}.pdf`;
    } catch (e) {
      this.log.show('Error');
    }
    return null;
  }

  public async getPreIphInitial(idEvent, idPreIph) {
    let retVal: any = {};
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/iphadm/preiph/getByIdEv/${idEvent}/${idPreIph}`).toPromise();
      retVal = response;
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
      event: IphadEvents.GetInitialData,
      data: retVal
    });
    return retVal;
  }

  public async upsePreIph(data) {
    let retVal: any = {};
    let response = null;
    try {
      response = await this.http.post(`${this.uri}/iphadm/preiph/upse`, data).toPromise();
      retVal = response;
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
      event: IphadEvents.UpsertDone,
      data: retVal
    });
    return retVal;
  }

  public async getDetenidoDataById(id) {
    let retVal: any = {};
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/iphadm/preiph/getDet/${id}`).toPromise();
      retVal = response;
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
      event: IphadEvents.GetDetenidoDato,
      data: retVal
    });
    return retVal;
  }

  // public async getPersonal(tipo) {
  //   let response = null;
  //   console.log(response);
    
  //   try {
  //     if (tipo == '02') {
  //       return this.http.get(`${this.uri}/corps/personal/getConsDet?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve+'&mun='+this.service.getUser().municip.cve).toPromise();
  //     } else if (tipo !== '02') {
  //       return this.http.get(`${this.uri}/corps/personal/getConsDet?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve).toPromise();
  //     }
        
  //   } catch (e) {
  //     this.log.show('Error');
  //   }
  //   this.eventSource.next({
  //           event: IphadEvents.GetPersonal,
  //           data: response
  //         });
  //         console.log(response);
  //   return response;
    
  // }

  public async getPersonal(tipo) {
    let response = null;
    
    try {
      if (tipo == '02') {
        return this.http.get(`${this.uri}/corps/personal/getConsDet?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve+'&mun='+this.service.getUser().municip.cve).toPromise();
      } else if (tipo !== '02') {
        return this.http.get(`${this.uri}/corps/personal/getConsDet?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve).toPromise();
      }
        
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
            event: IphadEvents.GetPersonal,
            data: response
          });
    return response;
    
  }

  // getPersonal(tipo) {

  //   let response = null;
  //   console.log(response);
    
  //   try {
  //     if (tipo == '02') {
  //       return this.http.get(`${this.uri}/corps/personal/getConsDet?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve+'&mun='+this.service.getUser().municip.cve).toPromise();
  //     } else if (tipo !== '02') {
  //       return this.http.get(`${this.uri}/corps/personal/getConsDet?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve).toPromise();
  //     }
        
  //   } catch (e) {
  //     this.log.show('Error');
  //   }
  //   // return this.http.get<any>(`${this.uri}/corps/getPersona?ent=`+this.service.getUser().entidad.entidad);
  // }

  // public async getPersonal() {
  //   let retVal: any = {};
  //   let response = null;
  //   try {
  //     response = await this.http.get(`${this.uri}/corps/personal/getConsDet?ent=`+this.service.getUser().entidad.entidad).toPromise();
  //     retVal = response;
  //   } catch (e) {
  //     this.log.show('Error');
  //   }
  //   this.eventSource.next({
  //     event: IphadEvents.GetPersonal,
  //     data: retVal
  //   });
  //   return retVal;
  // }

  convertDateToDateAndTimeStr(objDate) {
    return {
      fecha: moment(objDate).format('DD/MM/YYYY'),
      hora: moment(objDate).format('HH'),
      minutos: moment(objDate).format('mm'),
    };
  }

  getNewId() {
    return moment(new Date()).format('YYYYMMDDHHmmssSSS');
  }

  // Funcion grid
  public async getDetenidos(tipo) {
    let response = null;
    try {
      if (tipo == '02') {
        return this.http.get(`${this.uri}/iphadm/getdetenido?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve+'&mun='+this.service.getUser().municip.cve).toPromise();
      } else if (tipo !== '02') {
        return this.http.get(`${this.uri}/iphadm/getdetenido?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve).toPromise();
      }
      // response = await this.http.get(`${this.uri}/iphadm/getdetenido?ent=`+this.service.getUser().entidad.entidad).toPromise();
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
      event: IphadEvents.GetDetenido,
      data: response
    });
    return response;
  }

  public async getDetdactil(tipo) {
    let response = null;
    console.log(response);
    
    try {
      if (tipo == '02') {
        return this.http.get(`${this.uri}/iphadm/getdetdacti?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve+'&mun='+this.service.getUser().municip.cve).toPromise();
      } else if (tipo !== '02') {
        return this.http.get(`${this.uri}/iphadm/getdetdacti?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve).toPromise();
      }
        
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
            event: IphadEvents.GetDetdactil,
            data: response
          });
          console.log(response);
    return response;
    
  }

  public async getDetregistros(tipo) {
    let response = null;
    try {
      if (tipo == '02') {
        return this.http.get(`${this.uri}/iphadm/getdetregistro?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve+'&mun='+this.service.getUser().municip.cve).toPromise();
      } else if (tipo !== '02') {
        return this.http.get(`${this.uri}/iphadm/getdetregistro?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve).toPromise();
      }
      // response = await this.http.get(`${this.uri}/iphadm/getdetregistro?ent=`+this.service.getUser().entidad.entidad).toPromise();
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
      event: IphadEvents.GetDetregistro,
      data: response
    });
    return response;
  }

  // Funcion grid
  public async getDetenidoById(idDetenido:string) {
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/mov/detorgbyid/${idDetenido}`).toPromise();
    } catch (e) {
      this.log.show('Error');
    }
    return response;
  }
}
