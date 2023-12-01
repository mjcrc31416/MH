import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {LogServiceService} from '../../shared/log-service.service';
import { LoginService } from '../../services/login.service';


export enum PersonalEvents {
  CorpCatalog = 1,
  UpsertPersonal = 2,
  GetById = 3,
  GetPersonal = 4,
}

@Injectable({
  providedIn: 'root'
})
export class PersonalService {


  // MAIN OBSERVABLE ===========================================================
  private eventSource = new Subject<any>();
  public eventSource$ = this.eventSource.asObservable();

  uri = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
    private log: LogServiceService,
    private service: LoginService,
  ) { }

  public async getAllCatalog(id) {
    let retVal: any = {};
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/corps/corps/getById/${id}`).toPromise();
      retVal.corp = response;
      retVal.sexos = [
        {
          cve: 0, nom: 'NO ESPECIFICADO'
        },
        {
          cve: 1, nom: 'MUJER'
        },
        {
          cve: 2, nom: 'HOMBRE'
        },
      ];
      retVal.estadoCiviles = [
        {
          cve: 0, nom: 'NO ESPECIFICADO'
        },
        {
          cve: 1, nom: 'SOLTERA'
        },
        {
          cve: 2, nom: 'CASADA'
        },
        {
          cve: 3, nom: 'OTRO'
        },
      ];
      retVal.grupoSangres = [
        {
          cve: 0, nom: 'NO ESPECIFICADO'
        },
        {
          cve: 1, nom: 'A'
        },
        {
          cve: 2, nom: 'B'
        },
        {
          cve: 3, nom: 'O'
        },
        {
          cve: 4, nom: 'AB'
        },
      ];
      retVal.factorRHs = [
        {
          cve: 0, nom: 'NO ESPECIFICADO'
        },
        {
          cve: 1, nom: 'RH POSITIVO'
        },
        {
          cve: 2, nom: 'RH NEGATIVO'
        },
      ];
      // estadoCivil
      // grupoSangre
      // factorRH
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
      event: PersonalEvents.CorpCatalog,
      data: retVal
    });
    return retVal;
  }

  public async getCorporacion(id) {
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/corps/corps/getById/${id}`).toPromise();
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
      event: PersonalEvents.CorpCatalog,
      data: response
    });
    return response;
  }

  public async upsertPersonal(data) {
    let response = null;
    console.log(response);
    console.log('RESPUESTA SERVICIO');
    try {
      response = await this.http.post(`${this.uri}/corps/personal/upse`, data).toPromise();
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
      event: PersonalEvents.UpsertPersonal,
      data: response
    });
    return response;
  }

  public async personalGetById(id) {
    let response = null;
    try {
      response = await this.http.post(`${this.uri}/corps/personal/getById/${id}`, null).toPromise();
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
      event: PersonalEvents.GetById,
      data: response
    });
    return response;
  }

  public async getPersonal(tipo) {
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
    this.eventSource.next({
            event: PersonalEvents.GetPersonal,
            data: response
          });
          console.log(response);
    return response;
    
  }

  getPersona() {
    return this.http.get<any>(`${this.uri}/corps/getPersona`);
  }

  // public async getPersonal() {
  //   let response = null;
  //   try {
  //     response = await this.http.get(`${this.uri}/corps/getPersona?ent=`+this.service.getUser().entidad.entidad).toPromise();
  //   } catch (e) {
  //     this.log.show('Error');
  //   }
  //   this.eventSource.next({
  //           event: PersonalEvents.GetPersonal,
  //           data: response
  //         });
  //   return response;
  // }

  public async grid1RemoveRow(id) {
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/corps/remove/${id}`).toPromise();
    } catch (e) {
      this.log.show('Error');
    }
    return response;
  }

  uploadFile(formData) {
    let urlApi = 'http://localhost:4390/api/subir';
    return this.http.post(urlApi, formData);

  }

}
