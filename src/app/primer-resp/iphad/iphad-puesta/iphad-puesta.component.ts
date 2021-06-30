import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {TimeInputComponent} from '../../../shared/time-input/time-input.component';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-iphad-puesta',
  templateUrl: './iphad-puesta.component.html',
  styleUrls: ['./iphad-puesta.component.scss'],
  providers: [ DatePipe ]
})
export class IphadPuestaComponent implements OnInit {
  @ViewChild('timeInput', {static: false}) public  timeInput: TimeInputComponent;

  form = this.fb.group({
    puestaDisposicion: this.fb.group({
      puestaDisp: [{value: '', disabled: true}],
      noExp: [{value: '', disabled: true}],
      unidadArribo: [{value: '', disabled: true}],
      isUnidadArribo: [{value: '', disabled: true}],
      // adscripcion: ['', Validators.required],
      // primerResp: this.fb.group({
      //   nombre: ['', Validators.required],
      //   appat: ['', Validators.required],
      //   apmat: ['', Validators.required],
      //   grado: ['', Validators.required],
      //   corporacion: ['', Validators.required],
      //   institucion: ['', Validators.required],
      //   entidad: ['', Validators.required],
      //   municipio: ['', Validators.required],
      //   unidadArribo: ['', Validators.required],
      // }),
      adscripcionRecibe: [{value: '', disabled: true}],
      autoridadRecibe: [{value: '', disabled: true}],
      cargoRecibe: [{value: '', disabled: true}],
    }),
  });

  instituciones = [
    {
      cve:6,
      nom: 'POLICIA MUNICIPAL'
    }
  ];

  constructor(
    private fb: FormBuilder,
  ) { }


  public setDataFromServer(ipha) {
    console.log(ipha);
    if (ipha) {
      this.form.patchValue(ipha);
    }
  }

  ngOnInit() {
  }

}
