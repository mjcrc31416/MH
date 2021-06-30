import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

public logueo = true;

  login() {
    if (this.logueo) {
      console.log('Puedes Pasar');
      return true;
    } else {
      console.error('No puedes Pasar');
      return false;
    }
}

}
