import {ViewChild, Component, OnDestroy, OnInit} from '@angular/core';
import {ActionBarItemModel, barActions} from '../../../shared/action-bar2/action-bar-model';
import {FormBuilder, Validators} from '@angular/forms';
import {SnackSrvService} from '../../../services/snack-srv.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {PersonalEvents, PersonalService} from '../personal.service';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material';
import {Subscription} from 'rxjs';
import { NumberSequence } from 'ag-grid-community';
import {FormUtilsService} from '../../../shared/form-utils.service';
import { SEXO } from '../personal-edit/mock-sexo';
import { ESTADOCIVILES } from '../personal-edit/mock-estadoCiviles';
import { GRUPOSANGRE } from '../personal-edit/mock-gruposangre';
import { FACTOR } from '../personal-edit/mock-factor';
import { CORPORACION } from '../personal-edit/mock-corporacion';
import { UNIDAD } from '../personal-edit/mock-unidad';
import { GRADO } from './mock-gradoS';
import {COORDINADORA} from '../../../cnsp/mock-coordinadora';
import { NgForm } from '@angular/forms';
import { PersonalDataModel } from '../../../models/personal-data.model';


@Component({
  selector: 'app-personal-edit',
  templateUrl: './personal-edit.component.html',
  styleUrls: ['./personal-edit.component.scss']
})
export class PersonalEditComponent implements OnInit, OnDestroy {
  @ViewChild('groupForm', { static: false }) public form: NgForm;
  
  public id: string;

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
  // coordinadora = COORDINADORA;
  // // corporacion = CORPORACION;
  // unidad = UNIDAD;
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

          if (!_.isNil(this.personal._id)) {
            data._id = this.personal._id;
          }

          console.log('Corporacion *****************************************************');
          const resp = await this.personalSrv.upsertPersonal(this.personal);
          this.personal._id = resp._id;
          
          this.snackSrv.showMsg('Información guardada correctamente');
        } catch (e) {
          console.log('terminal-edit.component.ts -> attemptSave ####################################');
          console.log(e);
        } finally {
          this.isSavingData = false;
        }

      } else {
        this.snackSrv.showMsg('Faltan campos obligatorios');
      }
    }//endIf
  }

  // Atributos ======================================================================
  // form = this.fb.group({
  //   datPer: this.fb.group({
  //     nombre: ['', Validators.required],
  //     appat: ['', Validators.required],
  //     apmat: ['', Validators.required],
  //     fecnac: ['', Validators.required],
  //     rfc: ['', Validators.required],
  //     curp: ['', Validators.required],
  //     cuip: ['', Validators.required],
  //     sexo: ['', Validators.required],
  //     estadoCivil: ['', Validators.required],
  //     grupoSangre: ['', Validators.required],
  //     factorRH: ['', Validators.required],
  //   }), 
  //   institucion: this.fb.group({
  //     tipo: ['', Validators.required],
  //     sede: ['', Validators.required],
  //     institucion: ['', Validators.required],
  //   }),
  //   cve: ['', Validators.required],
  // });

  // grupoSanguineo = [
  //   {
  //     nombre: 'test'
  //   }
  // ];

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
    private snackBar: MatSnackBar
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
          this.personal.datPer.cuip = response[0].datPer.cuip;
          this.personal.datPer.grupoSangre = response[0].datPer.grupoSangre;
          this.personal.datPer.factorRH = response[0].datPer.factorRH;
          this.personal.cve = response[0].cve;
          this.personal.corporacion = response[0].corporacion;
          this.personal.grado = response[0].grado;
          this.personal.tipo = response[0].tipo;
          this.personal.institucion = response[0].institucion;
          this.personal.sede = response[0].sede;
          this.personal.municip = response[0].municip;

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
    const getCatResp = await this.personalSrv.getCatalogs();
    this.catalogo = getCatResp;

    this.catalogo.forEach(item => {
      this.tipos.push({cve:item.cve, tipo: item.tipo});
    })

    if (this.personal.tipo && this.personal.institucion && this.personal.sede) {
      this.onSelectionChange(this.personal.tipo, 'T', 'R');
      this.onSelectionChange(this.personal.institucion, 'I', 'R');
      this.onSelectionChange(this.personal.sede, 'S', 'R');
    }
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

  onSelectionChange(value, type, mode) {
    if (type == 'T') {
      let tipo = this.catalogo.find(item => item.cve == value.cve);

      if (tipo) {
        if (mode == 'UI') {
          this.personal.institucion = {};
          this.personal.sede = {};
          this.personal.municip = {};
        }

        this.instituciones = [];
        this.sedes = [];
        this.municipios = [];

        tipo.institucion.forEach(item => {
          this.instituciones.push({cve: item.cve, institucion: item.institucion})
        })
      }
    } else if (type == 'I') {
      let tipo = this.catalogo.find(item => item.cve == this.personal.tipo['cve']);

      if (tipo) {
        let institucion = tipo.institucion.find(item => item.cve == value.cve);
        
        if (institucion) {
          if (mode == 'UI') {
            this.personal.sede = {};
          }
          
          this.sedes = [];

          institucion.sede.forEach(item => {
            this.sedes.push({cve: item.cve, sede: item.sede})
          })
        }
      }
    } else if (type == 'S' && this.personal.tipo['cve']=='02') {
      let tipo = this.catalogo.find(item => item.cve == this.personal.tipo['cve']);

      if (tipo) {
        let institucion = tipo.institucion.find(item => item.cve == this.personal.institucion['cve']);
        
        if (institucion) {
          let sede = institucion.sede.find(item => item.cve == this.personal.sede['cve']);
        
          if (sede) {
            if (mode == 'UI') {
              this.personal.municip = {};
            }

            this.municipios = [];
    
            sede.municip.forEach(item => {
              this.municipios.push({cve: item.cve, municip: item.municip})
            })
          }
        }
      }
    }
  

  }

}
