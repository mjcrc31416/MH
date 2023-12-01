import { Component, OnInit, Input, EventEmitter, Output, NgModule } from '@angular/core';
import { LoginService, User } from '../services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-login',
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  
  
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
          this.router.navigate(['/personal-cons']);
          return true;
        }
      }
    );
  }

  

  ngOnInit() {

    this.service.checkCredentials();
  
  }

  logout() {
    this.service.logout();
  }

  
}



