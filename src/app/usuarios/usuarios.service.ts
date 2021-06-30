import { Injectable } from '@angular/core';
import {of} from 'rxjs';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { LoginService } from '../services/login.service';
import {LogServiceService} from '../shared/log-service.service';

export enum UsuariosEvents {
  GetUsuarios = 1,

}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  uri = environment.APIEndpoint;
  data: any;
  dataSavedSource: any;
  private eventSource = new Subject<any>();
  public eventSource$ = this.eventSource.asObservable();

  constructor(private service: LoginService,
    private log: LogServiceService,
    private http: HttpClient
  ) { }

  getById(id: string) {
    if (id === '0') {
      return of(null);
    } else {
      return this.http.get(`${this.uri}/usuarios/getbyid/${id}`);
    }

  }

  upsert(data) {
    return this.http.post(`${this.uri}/usuarios/upsert`, data);
  }

  // getAll(data) {
  //   console.log('USUARIOS');
  //   console.log(data);
  //   return this.http.get(`${this.uri}/corps/getusuars?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve+'&mun='+this.service.getUser().municipio.cve, data);
  // }

  // public async getAll() {
  //   let response = null;
  //   try {
  //     response = await this.http.get(`${this.uri}/corps/getusuars?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve).toPromise();
  //   } catch (e) {
  //     this.log.show('Error: usuario.servicei -> getCatalogs');
  //   }
  //   return response;
  // }

  // public async getAll() {
  //   let response = null;
  //   console.log(response);
    
  //   try {

  //       response = await this.http.get(`${this.uri}/corps/getusuars?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve).toPromise();

  //   } catch (e) {
  //     this.log.show('Error');
  //   }
  //   this.eventSource.next({
  //           event: UsuariosEvents.GetUsuarios,
  //           data: response
  //         });
  //         console.log(response);
  //   return response;
    
  // }

  public async getAll(tipo) {
    let response = null;
    console.log(response);
    
    try {
      if (tipo == '02') {    console.log('A');
        return this.http.get(`${this.uri}/corps/getusuars?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve+'&mun='+this.service.getUser().municip.cve).toPromise();
      } else if (tipo !== '02') {    console.log('B');
        return this.http.get(`${this.uri}/corps/getusuars?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve).toPromise();
      } else if (tipo !== '02') {    console.log('C');
        return this.http.get(`${this.uri}/corps/getPersona?&tipo=`+this.service.getUser().tipo.cve+'&inst='+this.service.getUser().institucion.cve+'&sede='+this.service.getUser().sede.cve).toPromise();
      }    console.log('D');
        
    } catch (e) {
      this.log.show('Error');
    }
    this.eventSource.next({
            event: UsuariosEvents.GetUsuarios,
            data: response
          });
          console.log(response);
    return response;
    
  }

  public async getAlli(tipo) {
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
            event: UsuariosEvents.GetUsuarios,
            data: response
          });
          console.log(response);
    return response;
    
  }

  getCountByMail(mail) {
    return this.http.post(`${this.uri}/usuarios/countcorreo`,{correo: mail});
  }

  // removeById(id) {
  //   return this.http.post(`${this.uri}/usuarios/remove/${id}`,{});
  // }
  
  saveDocument() {
    console.log('saveDocument =========0000');
    let fn = async () => {
      let response;
      if (this.data._id !== '') {
        response = await this._saveDoc(this.data);
        this.data = response;
      } else {
        response = await this._saveNewDoc(this.data);
        console.log(response);
        this.data._id = response._id;
      }

      // const response2 = await this._getById(this.data._id);
      // this.data = response2;
      this.dataSavedSource.next(this.data);
    };

    fn();
  }
  _saveNewDoc(data: any): any {
    throw new Error("Method not implemented.");
  }
  _saveDoc(data: any): any {
    throw new Error("Method not implemented.");
  }

  public async grid1RemoveRow(id) {
    let response = null;
    try {
      response = await this.http.get(`${this.uri}/corps/removed/${id}`).toPromise();
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
