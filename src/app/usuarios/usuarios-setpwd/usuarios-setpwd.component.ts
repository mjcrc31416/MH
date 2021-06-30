import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-usuarios-setpwd',
  templateUrl: './usuarios-setpwd.component.html',
  styleUrls: ['./usuarios-setpwd.component.scss']
})
export class UsuariosSetpwdComponent implements OnInit {

  form = this.fb.group({
    pwd1: ['', Validators.required],
    pwd2: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private _bottomSheetRef: MatBottomSheetRef<UsuariosSetpwdComponent>
  ) { }

  ngOnInit() {
  }

  exit(event) {
    console.log('exit');
    this._bottomSheetRef.dismiss(null);
  }

  setPwd() {
    console.log('pwd');
    if (this.form.valid) {
      if ( this.form.get('pwd1').value === this.form.get('pwd2').value) {
        this._bottomSheetRef.dismiss(this.form.get('pwd1').value);
      }
    }

  }

}
