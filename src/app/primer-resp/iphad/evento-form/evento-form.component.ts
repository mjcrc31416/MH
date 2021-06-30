import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {TimeInputComponent} from '../../../shared/time-input/time-input.component';

@Component({
  selector: 'app-evento-form',
  templateUrl: './evento-form.component.html',
  styleUrls: ['./evento-form.component.scss']
})
export class EventoFormComponent implements OnInit {

  // mockTest = {
  //   incidente: {
  //     bid: 1,
  //     incidente: 'sdfsadfasdf'
  //   },
  //   ubicacionEvento: {
  //     _id:'5dfd3f1519bf35582f940b02',
  //     lat:'25.833567514506072',
  //     long:'-100.30811129780272',
  //     municipio:'General Escobedo',
  //     cp:'11456',
  //     colonia:'Andrés Caballero Moreno Agropecuaria',
  //     calle:'Nuevo Leon 100',
  //     numero:'15',
  //     numInt:'4',
  //     referencias:'Esta un a gasolineria y un oxxo',
  //     entreCalle:'General Escobedo',
  //     entreCalle2:'Nuevo León 100',
  //     entidad: ''
  //   },
  //   texto: 'sdfsadfasdfasdfasdfasdfasdf',
  //   fecha: 'asdfasdfasfsadfasdf',
  //   nincidente: '',
  //   fechaTxt: '',
  //   hora: '',
  //   minuto: '',
  //
  // };

  form = this.fb.group({
    _id: [{value: null, disabled: true}],
    atiende: this.fb.group({
      atiende: [{value: '', disabled: true}],
    }),
    coordinadora: this.fb.group({
      coordinadora: [{value: '', disabled: true}],
    }),
    denunciante: [{value: '', disabled: true}],
    estatus: this.fb.group({
      nom: [{value: '', disabled: true}],
    }),
    fecha: [{value: '', disabled: true}],
    fechaAsignacion: [{value: '', disabled: true}],
    folio911: [{value: '', disabled: true}],
    folioInterno: [{value: '', disabled: true}],

    reporta: this.fb.group({
      nombre: [{value: '', disabled: true}],
    }),

    stincidente: this.fb.group({
      nom: [{value: '', disabled: true}],
    }),
    tincidente: this.fb.group({
      nom: [{value: '', disabled: true}],
    }),
    incidente: this.fb.group({
      nom: [{value: '', disabled: true}],
    }),

    torre: this.fb.group({
      torre: [{value: '', disabled: true}],
    }),
    ubicacionEvento: this.fb.group({
      entidad: this.fb.group({
        nomOf: [{value: '', disabled: true}]
      }),
      municipio: this.fb.group({
        nomOf: [{value: '', disabled: true}]
      }),
      cp: [{value: '', disabled: true}],
      colonia: [{value: '', disabled: true}],
      calle: [{value: '', disabled: true}],
      numero: [{value: '', disabled: true}],
      numInt: [{value: '', disabled: true}],
      referencias: [{value: '', disabled: true}],
      entreCalle: [{value: '', disabled: true}],
      entreCalle2: [{value: '', disabled: true}],
      lat: [{value: '', disabled: true}],
      long: [{value: '', disabled: true}],
    }),

    aceptado: this.fb.group({
      fechaArribo: [{value: '', disabled: true}],
    }),
    arribo: this.fb.group({
      fechaArribo: [{value: '', disabled: true}],
    }),


    // texto: [{value: '', disabled: true}],
    // folio911: [{value: '', disabled: true}],
    // fecha: [{value: '', disabled: true}],

  });

  //entidad: [{value: '', disabled: true}],

// {"_id":"5dfd3f1519bf35582f940b00","__v":0,
//   "atiende":{"bid":1,"atiende":"SECRETARÍA DE SEGURIDAD CIUDADANA Y JUSTICIA CIVICA"},
//   "coordinadora":{"bid":1,"coordinadora":"NUEVO LEÓN"},
//   "denunciante":"ANONIMO","fecha":"2019-12-20T21:35:17.266Z",
//   "incidente":{"bid":1,"incidente":"ABUSO DE CONFIANZA"},
//   "municipio":{"bid":1,"municipio":"GENERAL ESCOBEDO"},
//   "reporta":{"_id":"5dfbca5695049c34ebeba4ba","nombre":"c4","test":"asdfasdfasdf","test2":"asdfasdfasdfasdfasdf"},
//   "texto":"ABUSO DE CONFIANZA POR PARTE DE TERCEROS","torre":{"bid":1,"torre":"C4 ESCOBEDO"},
//   "ubicacionEvento":{"_id":"5dfd3f1519bf35582f940b02","lat":"25.833567514506072","long":"-100.30811129780272","municipio":"General Escobedo","cp":"11456","colonia":"Andrés Caballero Moreno Agropecuaria","calle":"Nuevo Leon 100","numero":"15","numInt":"4","referencias":"Esta un a gasolineria y un oxxo","entreCalle":"General Escobedo","entreCalle2":"Nuevo León 100"}}

  @ViewChild('timeComp', {static: false}) public  timeInput: TimeInputComponent;
  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    // this.form.patchValue(this.mockTest);
  }

}
