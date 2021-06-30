import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
//import {LogServiceService} from '../shared/log-service.service';
import {LogServiceService} from '../shared/log-service.service';
import { Router } from '@angular/router';
import {EventoFactory} from '../modelFactories/evento-factory';


export class User {
  constructor(
    public correo: string,
    public pwd: string) {}

}

export enum UsuarioEvents {
  GetUsuarios = 1
}

@Injectable({
  providedIn: 'root'
})

export class LoginService {

    // MAIN OBSERVABLE ===========================================================
    private eventSource = new Subject<any>();
    public eventSource$ = this.eventSource.asObservable();
  
    uri = environment.APIEndpoint;
  
  add(data) {
    return this.http.post(`${this.uri}/usuarios/add`, data);
    // .subscribe(res => console.log('Done'));
  }

  getAll() {
    return this.http.get<any>(`${this.uri}/usuarios/getall`);
  }

  constructor(
    // tslint:disable-next-line: variable-name
    private http: HttpClient,
    private router: Router,
    private loge: LogServiceService,
    private eventoFactory: EventoFactory
    ) { }

  logout() {
    localStorage.removeItem('login');
    this.router.navigate(['login']);
  }

  login(user) {
    // tslint:disable-next-line: prefer-const
    // const authenticatedUser = users.find(u => u.correo === correo.correo);
    // if (authenticatedUser && authenticatedUser.pwd === correo.pwd) {
    //   sessionStorage.setItem('login', 'true');
    //   this.router.navigate(['cnsp-consulta']);
    //   return true;
    // }
    // return false;
    // CONVERTIR EL OBJETO PARA PODER USARLO EN EL SESSIONSTORAGE
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('login', 'true');
  }

  //DEVOLVER EL JSON A UN OBJETO 
  getUser() {
    if(sessionStorage.getItem('user')) {
      return JSON.parse(sessionStorage.getItem('user'));
    } else {
      return null;
    }
  }

  removeStorage() {
    sessionStorage.setItem('login', null);
  }

  isLogged() {
    let res = false;
    const login = sessionStorage.getItem('login');
    if (login === 'true') {
      res = true;
    }
    return res;
  }

  checkCredentials() {
    if (localStorage.getItem('correo') === null) {
      // this.router.navigate(['']);
    }
  }

  log(data) {
    return this.http.post(`${this.uri}/usuarios/login`, data);  
  }


}
