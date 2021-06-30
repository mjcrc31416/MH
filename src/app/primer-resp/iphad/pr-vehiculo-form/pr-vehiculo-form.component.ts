import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {IphadService} from '../iphad.service';
import {FormUtilsService} from '../../../shared/form-utils.service';
import {StdGridComponent} from '../../../shared/std-grid/std-grid.component';
import {TimeInputComponent} from '../../../shared/time-input/time-input.component';

@Component({
  selector: 'app-pr-vehiculo-form',
  templateUrl: './pr-vehiculo-form.component.html',
  styleUrls: ['./pr-vehiculo-form.component.scss']
})
export class PrVehiculoFormComponent implements OnInit {

  vehcTipos = [{
    cve: 1,
    nom: 'TERRESTRE'
  }, {
    cve: 2,
    nom: 'OTRO'
  }];

  procedencias = [{
    cve: 1,
    nom: 'NACIONAL'
  }, {
    cve: 2,
    nom: 'EXTRANJERO'
  }];

  marcas = [{
    cve: 1,
    nom: 'FORD'
  }, {
    cve: 2,
    nom: 'CHEVROLET'
  }];

  usos = [{
    cve: 1,
    nom: 'PARTICULAR'
  }, {
    cve: 2,
    nom: 'TRANSPORTE PUBLICO'
  },
    {
      cve: 3,
      nom: 'CARGA'
    },
  ];

  // FIELDS =======================================================
  form = this.fb.group({
    placa: ['', Validators.required],
    numEco: [''],
    tipoVehi: [''],
    marca: [''],
    modelo: [''],
    vehiculo: [''],
    uso: [''],
    numSerie: [''],
    numMotor: [''],
    fechaDetencion: [''],
    procedencia: [''],
    color: [''],
    observaciones: [''],
    destino: [''],
  });
  orgData = null;
  @ViewChild('timeComp', {static: false}) public  timeComp: TimeInputComponent;

  // COMPONENT ====================================================
  constructor(
    private fb: FormBuilder,
    private iphadSrv: IphadService,
    public formUtils: FormUtilsService,
  ) { }

  ngOnInit() {
  }

  setFormData(data) {
    console.log('setFormData >>>>>>>>>>>>>>>>>>>>');
    console.log(data);
    this.orgData = data;
    // Poner fecha actual
    let tmpTimeObj = this.formUtils.getDateAndTimeObj(new Date());
    this.timeComp.hora = tmpTimeObj.hora;
    this.timeComp.minutos = tmpTimeObj.minutos;
    this.timeComp.setNewData();
    this.form.get('fechaDetencion').patchValue(new Date());

    if (data) {
      this.form.patchValue(data);
    }

    this.setCatalogs();
    console.log('setFormData <<<<<<<<<<<<<<<<<<<<<<<<<<<');
  }

  getFormData() {
    const data = this.form.getRawValue();

    if (this.orgData && this.orgData.localId) {
      data.localId = this.orgData.localId;
    } else {
      data.localId = this.formUtils.getNewId();
    }



    if (this.orgData && this.orgData._id) {
      data._id = this.orgData._id;
    }

    return data;
  }

  setCatalogs() {

    let tmp = this.form.getRawValue();

    // tipo vehiculos
    let data = this.formUtils.findComboValue(this.vehcTipos, tmp.tipoVehi, 'cve', 'cve');
    this.form.get('tipoVehi').patchValue(data);

    // procedencias
    data = this.formUtils.findComboValue(this.procedencias, tmp.procedencia, 'cve', 'cve');
    this.form.get('procedencia').patchValue(data);

    // procedencias
    data = this.formUtils.findComboValue(this.marcas, tmp.marca, 'cve', 'cve');
    this.form.get('marca').patchValue(data);

    // usos
    data = this.formUtils.findComboValue(this.usos, tmp.uso, 'cve', 'cve');
    this.form.get('uso').patchValue(data);

    // usos
    data = this.formUtils.findComboValue(this.usos, tmp.uso, 'cve', 'cve');
    this.form.get('uso').patchValue(data);
  }


}
