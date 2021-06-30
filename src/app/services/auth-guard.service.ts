import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import * as _ from 'lodash';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('canActivate');
    console.log(sessionStorage.getItem('login'));

    let ses = sessionStorage.getItem('login');
    let isLogged = (_.isNil(ses) || ses === 'null') ? false : true;

    console.log(isLogged);
    if (isLogged) {
      return true;
    } else {
      console.log('else');
      this.router.navigate(['/login']);
      return false;
    }

    // if (sessionStorage.getItem('login')) {
    //   return true;
    // } else {
    //   console.log('else');
    //   this.router.navigate(['/login']);
    //   return false;
    // }
  }
}
