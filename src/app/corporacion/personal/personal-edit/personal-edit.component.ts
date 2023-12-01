import {ViewChild, Component, OnDestroy, OnInit} from '@angular/core';
import {ActionBarItemModel, barActions} from '../../../shared/action-bar2/action-bar-model';
import {FormBuilder, Validators} from '@angular/forms';
import {SnackSrvService} from '../../../services/snack-srv.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import { PersonalService} from '../personal.service';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material';
import {Subscription} from 'rxjs';
import {FormUtilsService} from '../../../shared/form-utils.service';
import { SEXO } from '../personal-edit/mock-sexo';
import { ESTADOCIVILES } from '../personal-edit/mock-estadoCiviles';
import { GRUPOSANGRE } from '../personal-edit/mock-gruposangre';
import { FACTOR } from '../personal-edit/mock-factor';
import { ESCOLARIDAD } from '../personal-edit/mock-escolaridad';
import { DEPECO } from '../personal-edit/mock-depeco';
import { GRADO } from './mock-gradoS';
import { NgForm } from '@angular/forms';
import { PersonalDataModel } from '../../../models/personal-data.model';
import { TIPO_NOMINA } from './mock-tiponomina';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-personal-edit',
  templateUrl: './personal-edit.component.html',
  styleUrls: ['./personal-edit.component.scss']
})
export class PersonalEditComponent implements OnInit, OnDestroy {
  @ViewChild('groupForm', { static: false }) public form: NgForm;
  
  public id: string;

  uploadedFiles: Array <File>;

  entidadesFederativas = [];
  catalogo = [];
  tipos = [];
  sedes = [];
  municipios = [];
  instituciones= [];

  personal: PersonalDataModel = new PersonalDataModel();

  sexo = SEXO;
  estadoCivil = ESTADOCIVILES;
  grupoSangre = GRUPOSANGRE;
  factorRH = FACTOR;
  escolaridad = ESCOLARIDAD;
  tipo_nomina=TIPO_NOMINA;
  depeco = DEPECO;
  grado = GRADO;

  // Action Bar Events ====================================================================
  orgData = null;
  titlesList = ['Personal', 'Edición'];
  showActionList = [1, 4];

  onActionClicked(item: ActionBarItemModel) {
    if (item.id === barActions.show) {
      // this.toogleMostar();
    }

    if (item.id === barActions.save) {
      this.attemptSave();
    }

    if (item.id === barActions.exit) {
      // if (!this.isSavingData) {
      //   // this.atttemptApprove();
      // }
      console.log('action exit');
      this.onExit();
    }

    if (item.id === barActions.send) {
      if (!this.isSavingData) {
        // this.atttemptApprove();
      }
    }
  }

  onExit() {
    this.router.navigate(['personal-cons']);
  }

  async attemptSave() { 
    console.log('attemptSave');
    if (!this.isSavingData) {
      if (this.form.form.valid) {
        this.isSavingData = true;

        try {
          console.log('Is valid!');
          const data = this.form.form.getRawValue();
          console.log(data);
          console.log('Is data!');

          if (!_.isNil(this.personal._id)) {
            data._id = this.personal._id;
          }

          console.log(data);
          console.log('Datos');

          console.log('Corporacion *****************************************************');
          const resp = await this.personalSrv.upsertPersonal(this.personal);
          console.log(resp);
          console.log('Respuesta');
          this.personal._id = resp._id;
          
          this.snackSrv.showMsg('Información guardada correctamente');
        } catch (e) {
          console.log('personal-edit.component.ts -> attemptSave ####################################');
          console.log(e);
        } finally {
          this.isSavingData = false;
        }

      } else {
        this.snackSrv.showMsg('Faltan campos obligatorios');
      }
    }//endIf
  }

  sexos = [];
  estadoCiviles = [];
  grupoSangres = [];
  factorRHs = [];
  isSavingData = false;

  SNACKBAR_STD_DURATION = 3500;

  private subs: Subscription = new Subscription();

  constructor(
    private snackSrv: SnackSrvService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private personalSrv: PersonalService,
    private formUtils: FormUtilsService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) { }

  ngOnInit() {

    this.route.params.subscribe(routeParams => {
      this.id = routeParams['id'];
    })

    if (this.id != '0') {
      this.personalSrv.personalGetById(this.id).then(response => {
        if(response) { console.log(response);  console.log('Chugoooo');
          this.personal._id = response[0]._id;
          this.personal.datPer.nombre = response[0].datPer.nombre;
          this.personal.datPer.appat = response[0].datPer.appat;
          this.personal.datPer.apmat = response[0].datPer.apmat;
          this.personal.datPer.fecnac = response[0].datPer.fecnac;
          this.personal.datPer.sexo = response[0].datPer.sexo;
          this.personal.datPer.estadoCivil = response[0].datPer.estadoCivil;
          this.personal.datPer.rfc = response[0].datPer.rfc;
          this.personal.datPer.curp = response[0].datPer.curp;
          this.personal.datPer.escolaridad = response[0].datPer.escolaridad;
          this.personal.datPer.depeco = response[0].datPer.depeco;
          this.personal.no_empleado = response[0].no_empleado;
          this.personal.tipo_nomina = response[0].tipo_nomina;
          this.personal.Cod_puesto = response[0].Cod_puesto;
          this.personal.Nom_puesto = response[0].Nom_puesto;

          this.initWithServerData();
        }
      })
    } else {
      this.initWithServerData();
    }
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  findComboValue(listData, setObjData, attributeName) {
try {
  for (let data of listData) {
    if (data[attributeName] === setObjData[attributeName]) {
      return data;
      break;
    }
  }
} catch (error) {
  return null;
}

  }

  // Snackbar methods ------------------------------------
  showMsg(msg: string) {
    this.snackBar.open(msg, 'cerrar', {
      duration: this.SNACKBAR_STD_DURATION
    });
  }

  async initWithServerData () {
    // Obtener los catalogos

  }

  compareWithForRol(c1, c2) {
    return (c1 && c2) ? c1.cve === c2.cve : false;
  }

  compareWithTipos(d1, d2) {
    return (d1 && d2) ? d1.cve === d2.cve : false;
  }

  compareWithEntidadesFederativas(d1, d2) {
    return (d1 && d2) ? d1.cve === d2.cve : false;
  }

  compareWithBid(d1, d2) {
    return (d1 && d2) ? d1.bid === d2.bid : false;
  }

  compareWithId(d1, d2) {
    return (d1 && d2) ? d1._id === d2._id : false;
  }


    //adjuntar y enviar archivos a servidor
    onFileChange(e) {
      this.uploadedFiles = e.target.files;
      console.log(this.uploadedFiles);
      console.log('Cuando ya se sube el archivo');
  
      let formData = new FormData();
      for (let i = 0; i < this.uploadedFiles.length; i++) {
        formData.append("uploads", this.uploadedFiles[i], this.uploadedFiles[i].name)
      }
  
      //Call Service
      this.personalSrv.uploadFile(formData).subscribe((res) => {
      console.log('Response:', res);
    })
    }

}
