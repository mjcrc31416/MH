import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActionBarItemModel, barActions} from '../../../shared/action-bar2/action-bar-model';
import {FormBuilder, Validators} from '@angular/forms';
import {SnackSrvService} from '../../../services/snack-srv.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {VehiculosEvents, VehiculosService} from '../vehiculos.service';
import * as _ from 'lodash';
import {Subscription} from 'rxjs';
import {FormUtilsService} from '../../../shared/form-utils.service';
import {COORDINADORA} from '../../../cnsp/mock-coordinadora';
import { NgForm } from '@angular/forms';
import {VehiculoDataModel} from '../../../models/vehiculo-data.model';

@Component({
  selector: 'app-vehiculos-edit',
  templateUrl: './vehiculos-edit.component.html',
  styleUrls: ['./vehiculos-edit.component.scss']
})
export class VehiculosEditComponent implements OnInit, OnDestroy {
  @ViewChild('groupForm', { static: false }) public form: NgForm;

  public id: string;
  tipoVehi;marca;uso;

  coordinadora = COORDINADORA;

  entidadesFederativas = [];
  catalogo = [];
  tipos = [];
  sedes = [];
  municipios = [];
  instituciones= [];

  vehiculo: VehiculoDataModel = new VehiculoDataModel();

// Action Bar Events ====================================================================
  titlesList = ['Alta de Vehiculos', 'Edición'];
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
    this.router.navigate(['vehiculos-cons']);
  }

  attemptSave() {
    console.log('attemptSave');
    if (!this.isSavingData) {
      if (this.form.valid) {
        console.log('Is valid!');
        const data = this.form.form.getRawValue();
        console.log(data);

        if (!_.isNil(this.vehiculo._id)) {
          data._id = this.vehiculo._id;
        }

        this.vehiSrv.upseVehi(this.vehiculo);
        console.log(this.vehiculo);
        this.snackSrv.showMsg('Información guardada correctamente');
      } else {
        this.snackSrv.showMsg('Faltan campos obligatorios');
      }

      this.isSavingData = false;
    }//endIf
  }

  // Atributos ======================================================================
  // form = this.fb.group({
  //   coordinadora: ['', Validators.required],
  //   placa: ['', Validators.required],
  //   numEco: ['', Validators.required],
  //   tipoVehi: ['', Validators.required],
  //   marca: ['', Validators.required],
  //   uso: ['', Validators.required],
  //   numSerie: ['', Validators.required],
  //   numMotor: ['', Validators.required],
  //   modelo: ['', Validators.required],
  //   vehiculo: ['', Validators.required],
  //   estatus: ['', Validators.required],
  //   gps: ['', Validators.required],
  //   // corporacion: ['', Validators.required],
  // });

  // Listas para catalogos
  tips = [];
  marcas = [];
  usos = [];
  estatus = [];
  gpss = ['SI', 'NO'];

  // Atributos originales
  _id;
  isSavingData = false;


  private subs: Subscription = new Subscription();

  constructor(
    private snackSrv: SnackSrvService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private vehiSrv: VehiculosService,
    private formUtils: FormUtilsService,
  ) {
    // this.subs.add(
    //   this.vehiSrv.eventSource$.subscribe((data) => {
    //       this.dispatchEvents(data);
    //     }
    //   ));
  }

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      this.id = routeParams['id'];
    })

    if (this.id != '0') { 
      this.vehiSrv.getById(this.id).then(response => {
        if(response) { console.log(response);
          console.log('response111');

          this.vehiculo._id = response._id;
          this.vehiculo.placa = response.placa;
          this.vehiculo.numEco = response.numEco;
          this.vehiculo.tipoVehi = response.tipoVehi;
          this.vehiculo.marca = response.marca;
          this.vehiculo.uso = response.uso;
          this.vehiculo.numSerie = response.numSerie;
          this.vehiculo.numMotor = response.numMotor;
          this.vehiculo.modelo = response.modelo;
          this.vehiculo.vehiculo = response.vehiculo;
          this.vehiculo.estatus = response.estatus;
          this.vehiculo.gps = response.gps;
          this.vehiculo.tipo = response.tipo;
          this.vehiculo.institucion = response.institucion;
          this.vehiculo.sede = response.sede;
          this.vehiculo.municip = response.municip;

          this.initWithServerData();
        }
      })
    } else {
      this.initWithServerData();
    }



    
    // const tempProm = this.route.paramMap.subscribe( (params: ParamMap) => {
    //   console.log(params);
    //   const id = params.get('id');

    //   if (id && id !== '0') {
    //     this._id = id;
    //   }
    // });

    // this.vehiSrv.getAllCatalog();

    // this.vehiSrv.getAllCatalog('5dfd07748a890cafc369be8b');
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // AUXILIAR EVENTS ======================================================================
  prepareSetData(data) {
    data.tipo = this.findComboValue(this.tips, data.vehiculo.tipo, 'cve');
    data.marcas = this.findComboValue(this.marcas, data.vehiculo.marca, 'cve');
    data.usos = this.findComboValue(this.usos, data.vehiculo.uso, 'cve');
    data.estatus = this.findComboValue(this.estatus, data.vehiculo.estatus, 'cve');
    return data;
  }

  findComboValue(listData, setObjData, attributeName) {
    for (let data of listData) {
      if (data[attributeName] === setObjData[attributeName]) {
        return data;
        break;
      }
    }
  }

  async initWithServerData () {
    // Obtener los catalogos

    const getCatResp = await this.vehiSrv.getCatalogs();
    this.catalogo = getCatResp;

    this.catalogo.forEach(item => {
      this.tipos.push({cve:item.cve, tipo: item.tipo});
    })

    if (this.vehiculo.tipo && this.vehiculo.institucion && this.vehiculo.sede) {
      this.onSelectionChange(this.vehiculo.tipo, 'T', 'R');
      this.onSelectionChange(this.vehiculo.institucion, 'I', 'R');
      this.onSelectionChange(this.vehiculo.sede, 'S', 'R');
    }

    const tmpdat = await this.vehiSrv.getAllCatalog();

    this.usos = tmpdat.vehcUsos;
     this.marcas = tmpdat.vehcMarcas;
     this.estatus = tmpdat.vehcEstatus;
     this.tips = tmpdat.vehcTipos;

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
          this.vehiculo.institucion = {};
          this.vehiculo.sede = {};
          this.vehiculo.municip = {};
        }

        this.instituciones = [];
        this.sedes = [];
        this.municipios = [];

        tipo.institucion.forEach(item => {
          this.instituciones.push({cve: item.cve, institucion: item.institucion})
        })
      }
    } else if (type == 'I') {
      let tipo = this.catalogo.find(item => item.cve == this.vehiculo.tipo['cve']);

      if (tipo) {
        let institucion = tipo.institucion.find(item => item.cve == value.cve);
        
        if (institucion) {
          if (mode == 'UI') {
            this.vehiculo.sede = {};
          }
          
          this.sedes = [];

          institucion.sede.forEach(item => {
            this.sedes.push({cve: item.cve, sede: item.sede})
          })
        }
      }
    } else if (type == 'S' && this.vehiculo.tipo['cve']=='02') {
      let tipo = this.catalogo.find(item => item.cve == this.vehiculo.tipo['cve']);

      if (tipo) {
        let institucion = tipo.institucion.find(item => item.cve == this.vehiculo.institucion['cve']);
        
        if (institucion) {
          let sede = institucion.sede.find(item => item.cve == this.vehiculo.sede['cve']);
        
          if (sede) {
            if (mode == 'UI') {
              this.vehiculo.municip = {};
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

  // SERVICE EVENTS =======================================================================
  /*dispatchEvents(data) {

    if (data.event === VehiculosEvents.GetCatalogs) {
      console.log(data);
      if (data.data) {
        const tmpdat = data.data;
        console.log(data);

       this.usos = tmpdat.vehcUsos;
        this.marcas = tmpdat.vehcMarcas;
        this.estatus = tmpdat.vehcEstatus;
        this.tipos = tmpdat.vehcTipos;
        this.tipoVehi = data.data.tipos;

      }

      if (this._id) {
        this.vehiSrv.getById(this._id);
      }
      return;
    }//endIf

    //
    if (data.event === VehiculosEvents.UpsertDone) {
      console.log(data);
      if (data.data) {
        this._id = data.data._id;
        this.snackSrv.showMsg('Información guardada correctamente');
      }
      return;
    }//endIf
    //
    if (data.event === VehiculosEvents.GetByIdDone) {
      console.log(data);
      if (data.data) {
        const response = data.data;
        console.log(response);

        this.form.patchValue(response);

        let tmpForm = this.form.getRawValue();
        
        console.log(this.tipos);
        console.log('tipos');
        const dat01 = this.formUtils.findComboValue(this.tipos, tmpForm.tipoVehi, 'nom', 'nom');
        console.log(dat01);
        console.log('dat01');
        this.form.get('tipoVehi').patchValue(dat01);

        console.log(this.marcas);
        console.log('marcas');
        const dat02 = this.formUtils.findComboValue(this.marcas, tmpForm.marca, 'nom', 'nom');
        console.log(dat02);
        console.log('dat02');
        this.form.get('marca').patchValue(dat02);

        console.log(this.usos);
        console.log('usos');
        const dat03 = this.formUtils.findComboValue(this.usos, tmpForm.uso, 'nom', 'nom');
        console.log(dat03);
        console.log('dat03');
        this.form.get('uso').patchValue(dat03);

        console.log(this.estatus);
        console.log('estatus');
        const dat04 = this.formUtils.findComboValue(this.estatus, tmpForm.estatus, 'nom', 'nom');
        console.log(dat04);
        console.log('dat04');
        this.form.get('estatus').patchValue(dat04);

        console.log(this.coordinadora);
        const dat05 = this.formUtils.findComboValue(this.coordinadora, tmpForm.coordinadora, 'bid', 'bid');
        console.log(dat05);
        console.log('dat05');
        this.form.get('coordinadora').patchValue(dat05);
        
      }
      // this.form.patchValue(data.data);
      return;
    }//endIf
  }

  setForm(data) {
    this.form.get('coordinadora').patchValue(data.coordinadora);

    this.coordinadora.forEach((item) => {
      // console.log(item);
      if (data.coordinadora && item.bid === data.coordinadora.bid) {
        this.form.get('coordinadora').patchValue(item);
        return false;
      }
    });


  }  */

}
