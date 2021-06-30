import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { LoginService, User } from '../services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public user: User;

  constructor(
    private service: LoginService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
    ) {
      this.user = new User('', '');
  }

  public errorMsg = '';

  public logueo = true;

  // TRAE LOS DATOS DEL USUARIO CUANDO SE LOGUEA
  login() {
    this.service.log(this.user).subscribe(
      (data: any) => {
        console.log(this.user);
        console.log(data);
        if (data.message) {
          this.errorMsg = 'Usuario o Contraseña Incorrecta';
        }
        else {
          this.service.login(data);
          console.log(this.user.correo);
          this.router.navigate(['/evento-cons']);
          return true;
        }
      }
    );
    /*if (!this.
      .getByCorreo(this.user)) {
      this.errorMsg = 'Usuario o Contraseña Incorrecta';
    } else if (this.logueo) {
      console.log('Puedes Pasar');
      this.router.navigate(['/cnsp-consulta']);
      return true;
    } else {
      console.error('No puedes Pasar');
      return false;
    }*/
  }

  ngOnInit() {

    this.service.checkCredentials();

  }

  logout() {
    this.service.logout();
  }


}
