import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ENTIDADES } from '../mock-entidades';
import { ETIQUETAS } from '../mock-etiquetas-generales';
import { SECTORES } from '../mock-sectores';

@Component({
  selector: 'app-listados-edit',
  templateUrl: './listados-edit.component.html',
  styleUrls: ['./listados-edit.component.scss']
})


export class ListadosEditComponent implements OnInit {

  entidades = ENTIDADES;
  inst = ETIQUETAS;
  sector = SECTORES;
  form: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      nomIntegrante: ['', Validators.required],
      cargo: ['', Validators.required],
      sector: ['', Validators.required],
      inst: ['', Validators.required],
      entidad: ['', Validators.required],
      domicilio: ['', Validators.required],
      correo: ['', Validators.required],
      tel: ['', Validators.required],
      secre: ['', Validators.required],
      atendido: ['', Validators.required]

    });

  }

  setUpData(data) {
    this.form.patchValue({
      nomIntegrante: data.nomIntegrante,
      cargo: data.cargo,
      sector: data.sector,
      inst: data.inst,
      entidad: data.entidad,
      domicilio: data.domicilio,
      correo: data.correo,
      tel: data.tel,
      secre: data.secre,
      atendido: data.atendido
    });

    // Establecer selected data
    for (let item of this.entidades) {
      if (item.bid === data.entidad.bid) {
        this.form.patchValue({
          entidad: item
        });
      }
    }

    for (let item of this.inst) {
      if (item.bid === data.inst.bid) {
        this.form.patchValue({
          inst: item
        });
      }
    }

    for (let item of this.sector) {
      if (item.bid === data.sector.bid) {
        this.form.patchValue({
          sector: item
        });
      }
    }
  }
}
