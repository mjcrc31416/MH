import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackSrvService {
  SNACKBAR_STD_DURATION = 4000;
  MSG_INVALID_FORM = 'Revise el formato de la información y los campos obligatorios';

  constructor(
    private _snackBar: MatSnackBar,
  ) { }

  showMsg(msg) {
    this._snackBar.open(msg,'cerrar',{
      duration: this.SNACKBAR_STD_DURATION
    });
  }

  showGenericInvalidForm() {
    this.showMsg(this.MSG_INVALID_FORM);
  }
}
