import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-direccion-form',
  templateUrl: './direccion-form.component.html',
  styleUrls: ['./direccion-form.component.scss']
})
export class DireccionFormComponent implements OnInit {
// FORM DATA ================================================================
  form = this.fb.group({
    entidad: [''],
    municipio: [''],
    cp: [''],
    colonia: [''],
    calle: [''],
    numero: [''],
    numInt: [''],
    referencias: [''],
    lat: [''],
    long: [''],
  });

// COMPONENT FUNCTIONS ======================================================
  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
  }

}
