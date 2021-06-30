import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy  {
  title = 'app-acuerdos';
  mobileQuery: MediaQueryList;



  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public loginSrv: LoginService, private service: LoginService, private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);


  }

  public errorMsg = '';

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  showMenu() {
    const url: string = window.location.href;

    if (url.indexOf('/login') >= 0) {
      return false;
    } else {
      return true;
    }
  }

  getLogin() {
    let user = this.loginSrv.login('user');
  }

  getUser() {
    if(this.loginSrv.getUser()) {
      return this.loginSrv.getUser().correo;
    } else {
      return '';
    }
  }

  loggout() {
    const confirmacion = confirm('¿Desea cerrar sesión?');
    if (confirmacion) {
      this.loginSrv.removeStorage();
      this.router.navigate(['login']);
    }
  }

}
