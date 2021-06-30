import {ViewChild, Component, OnDestroy, OnInit} from '@angular/core';
import {ActionBarItemModel, barActions} from '../../shared/action-bar2/action-bar-model';
import {FormBuilder, Validators} from '@angular/forms';
import {SnackSrvService} from '../../services/snack-srv.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import * as _ from 'lodash';
import {Subscription} from 'rxjs';
import {FormUtilsService} from '../../shared/form-utils.service';
import { TerminalService, TerminalEvents } from '../terminal.service';
import * as moment from 'moment';
import {StdGrid2Component} from '../../shared/std-grid2/std-grid2.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import { DlgTerminalesComponent } from '../dlg-terminales/dlg-terminales.component';
import { TerminalDataModel } from 'src/app/models/terminal-data.model';
import { IntegranteService } from '../../services/integrante.service';
import { NgForm } from '@angular/forms';
import {COORDINADORA} from '../../cnsp/mock-coordinadora';


@Component({
  selector: 'app-terminal-edit',
  templateUrl: './terminal-edit.component.html',
  styleUrls: ['./terminal-edit.component.scss']
})
export class TerminalEditComponent implements OnInit, OnDestroy {
  @ViewChild('groupForm', { static: false }) public form: NgForm;
  noAleatorio;
  fechagenpin;
  fechagenpinmax;
  coordinadora = COORDINADORA;
  public id: string;
  public usuario;
  entidadesFederativas = [];
  catalogo = [];
  tipos = [];
  sedes = [];
  municipios = [];
  instituciones= [];

  terminal: TerminalDataModel = new TerminalDataModel();

  SNACKBAR_STD_DURATION = 3500;

  // Action Bar Events ====================================================================
  orgData = null;
  titlesList = ['Terminales', 'Edición'];
  showActionList = [8, 1, 4];

  onActionClicked(item: ActionBarItemModel) {
    if (item.id === barActions.show) {

    this.attemptPin();

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
    this.router.navigate(['terminal-cons']);
  }

      // COMPONENT BEHAVIOR ===================================================================

      async attemptPin() {

        if (!this.isSavingData) {
          if (this.terminal) {
            this.isSavingData = true;
            try {
              const data = this.form.form.getRawValue();

              if (!_.isNil(this.terminal._id)) {
                data._id = this.terminal._id;
              }

              const resp = await this.terminalSrv.upseTermi(this.terminal);
              this.terminal._id = resp._id;

              const respPIN  = await this.terminalSrv.getTerminalPIN(resp);
              console.log('Respuesta de generar PIN ::::::::');
              console.log(respPIN);
              this.terminal.noAleatorio = respPIN.noAleatorio;

              let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds

              let datePIN = new Date(Date.now() - tzoffset);
              datePIN = new Date(datePIN.setMinutes(datePIN.getMinutes() + 10));

              let localISOTime = datePIN.toISOString(); // => '2015-01-26T06:40:36.181'

              this.terminal.fechagenpinmax = localISOTime;

              moment(this.terminal.fechagenpinmax).format("DD/MM/YYYY HH:mm")

              // this.form.patchValue(respPIN);

              this.snackSrv.showMsg('PIN Generado correctamente');
            } catch (e) {
              console.log('terminal-edit.component.ts -> attemptPin ####################################');
              console.log(e);
              this.snackSrv.showMsg('Error al guardar información al servidor. Valide su conexión a internet e intentelo de nuevo.');
            } finally {
              this.isSavingData = false;
            }
          } else {
            this.snackSrv.showMsg('Llene la  información obligatoria.');
          }

        }
      }

  // Snackbar methods ------------------------------------
  showMsg(msg: string) {
    this.snackBar.open(msg, 'cerrar', {
      duration: this.SNACKBAR_STD_DURATION
    });
  }

      async attemptSave() {
        console.log('attemptSave');
        if (!this.isSavingData) { console.log(this.isSavingData);
          if (this.terminal) {
            this.isSavingData = true;
            try {
              //const data = this.form.form.getRawValue();

              // if (!_.isNil(this._id)) {
              //   data._id = this._id;
              // }
              if (!this.terminal._id) {
                delete this.terminal._id;
              }

              const resp = await this.terminalSrv.upseTermi(this.terminal);
              this.terminal._id = resp._id;
              console.log(resp);

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
        }
      }

      // Grid Acciones Integrantes=======================================================================
  @ViewChild('gridIntes', { static: false }) public gridIntes: StdGrid2Component;
  gridIntesColConfig = {
    edit: false,
    remove: true
  };
  gridIntesColDefs = [
    { headerName: 'Correo', field: 'correo', width: 300 },
    { headerName: 'Nombre', field: 'policia.datPer.nombre', width: 200 },
    { headerName: 'appat', field: 'policia.datPer.appat', width: 200 },
    { headerName: 'apmat', field: 'policia.datPer.apmat', width: 200 },
  ];


    gridIntesEditRow(data) {
      const rowData = data.data;
      console.log(rowData);
  
  
      const dialogRef = this.dialog.open(DlgTerminalesComponent, {
        panelClass: 'custom-dlg-panel',
        // data: params.data
        data: {
          integrantes: rowData,
          evento: this.terminalSrv.data,
          readMode: false
        }
  
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.gridIntes.updateRow(result);
          console.log(result);
        }
        console.log('The dialog was closed');
      });
  
    }

    gridIntesRemoveRow(data) {
      const res = confirm('¿Desea eliminar al Usuario?');
      if (res) {
        this.gridIntes.removeFromGrid(data.data);
        // this.form.get('usuarios').patchValue(this.gridIntes.getRowsFromApi());
      }

    }

    // newIntegrante() {
    //   const dialogRef = this.dialog.open(DlgTerminalesComponent, {
    //     panelClass: 'custom-dlg-panel',
    //     data: {
    //       integrantes: null,
    //       evento: this.terminalSrv.data,
    //       readMode: false
    //     }
    //   });
    //   // Agregar info a integrantes
    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log(result);

    //     if (result) {
    //       this.terminal.usuarios = result[0];
    //       this.gridIntes.setDataSource([this.terminal.usuarios]);
    //     }
    //   });
    // }

    newIntegrante() {
      const dialogRef = this.dialog.open(DlgTerminalesComponent, {
        panelClass: 'custom-dlg-panel',
        data: {
          integrantes: null,
          evento: this.terminalSrv.data,
          readMode: false
        }
      });
      // Agregar info a integrantes
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);

        if (result) {
          let data = [];

          result.forEach(element => {
            data.push(element);
          });        
  
          console.log(result);
          this.terminal.usuarios = result[0];
          console.log('xxx');
          console.log(data);
          this.gridIntes.setDataSource(data);
          console.log(result);
        }
      });
    }

  _id;
  isSavingData = false;

  private subs: Subscription = new Subscription();

  constructor(
    private snackSrv: SnackSrvService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private terminalSrv: TerminalService,
    private formUtils: FormUtilsService,
    public dialog: MatDialog,
    private intsrv: IntegranteService,
  ) {
    // this.subs.add(
    //   this.terminalSrv.eventSource$.subscribe((data) => {
    //       this.dispatchEvents(data);
    //       // this.generatePin(data);
    //     }
    //   ));
  }

  ngOnInit() { 

    this.route.params.subscribe(routeParams => {
      this.id = routeParams['id'];
    })
    if (this.id != '0') {
      this.terminalSrv.getById(this.id).then(response => {
        if(response) { console.log(response);
          console.log('Response11');
          this.terminal._id = response._id;
          this.terminal.nombres = response.nombres;
          this.terminal.uuid = response.uuid;
          this.terminal.token = response.token;
          this.terminal.marca = response.marca;
          this.terminal.noInventario = response.noInventario;
          this.terminal.noAleatorio = response.noAleatorio;
          this.terminal.fechagenpin = response.fechagenpin;
          this.terminal.fechagenpinmax = response.fechagenpinmax;
          this.terminal.registroActivo = response.registroActivo;
          this.terminal.usuarios = response.usuarios.length > 0 ? response.usuarios[0]:null;
          this.terminal.tipo = response.tipo;
          this.terminal.institucion = response.institucion;
          this.terminal.sede = response.sede;
          this.terminal.municip = response.municip;

          if(response.usuarios.length > 0) {
            this.usuario = response.usuarios;

            this.gridIntes.setDataSource(this.usuario);
          }

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
    //   if (this._id) {
    //     this.terminalSrv.getById(this._id);
    //   }

    //   let data

    //   this.terminal = {
    //     nombres: '',
    //     uuid: '',
    //     token: '',
    //     marca: '',
    //     noInventario: '',
    //     noAleatorio: '',
    //     coordinadora: '',
    //     fechagenpin: null,
    //     fechagenpinmax: null,
    //     registroActivo: null,
    //     _id: null,
    //     policia: null,
    //   };

    //   if (data) {
    //     this.form.setValue({
    //       nombres: data.nombres,
    //       uuid: data.uuid,
    //       token: data.token,
    //       marca: data.marca,
    //       noInventario: data.noInventario,
    //       noAleatorio: data.noAleatorio,
    //       coordinadora: data.coordinadora,
    //       fechagenpin: data.fechagenpin,
    //       fechagenpinmax: data.fechagenpinmaxç,
    //       registroActivo: data.registroActivo,

    //     });
    //     this.terminal = data;
    //     if (this.terminal != null && this.terminal.policia != null){
    //       this.gridIntes.setDataSource([this.terminal.policia]);
    //     }
    //   }

    // });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  findComboValue(listData, setObjData, attributeName) {
    for (let data of listData) {
      if (data[attributeName] === setObjData[attributeName]) {
        return data;
        break;
      }
    }
  }

  fechaMaxPin(date) {
    //const data = this.form.form.getRawValue();

    if (this.terminal && this.terminal.fechagenpinmax) {
      const fecha = this.terminal.fechagenpinmax;
      return moment(fecha).format("DD/MM/YYYY HH:mm");
      
      // return moment(fecha, "DD/MM/YYYY HH:mm").toDate();

    }

    // const data = this.form.getRawValue();

    // if (data && data.fechagenpinmax) {
    //   const fecha = data.fechagenpinmax;
    //   return moment(fecha).format("DD/MM/YYYY HH:mm");
    // }

    return null;
  }

  // SERVICE EVENTS =======================================================================
//   dispatchEvents(data) {
//     console.log('dispatchEvents');
//     if (data.event === TerminalEvents.UpsertDone) {
//       console.log(data);
//       if (data.data) {
//         this._id = data.data._id;
//         this.snackSrv.showMsg('Información guardada correctamente');
//       }
//       return;
//     }//endIf
//     if (data.event === TerminalEvents.GetTerminalPIN) {
//       console.log(data);
//       if (data.data) {

//       const response = data.data;
//       console.log(response);

//     this.noAleatorio = response.noAleatorio;
//     console.log(response.noAleatorio);
//     this.fechagenpin = response.fechagenpin;
//     console.log(response.fechagenpin);
//     this.fechagenpinmax = response.fechagenpinmax;
//     console.log(response.fechagenpinmax);

//     // this.form.get('noAleatorio').patchValue(response.noAleatorio);
//     // this.form.get('fechagenpin').patchValue(response.fechagenpin);
//     // this.form.get('fechagenpinmax').patchValue(response.fechagenpinmax);

//       }
//       return;
//     }

//     if (data.event === TerminalEvents.GetByIdDone) {
//       console.log(data);
//       if (data.data) {
//         const response = data.data;
//         console.log(response);

//         // this.form.patchValue(response);
//         // this.gridIntes.setDataSource(response.usuarios);
//         // let tmpForm = this.form.getRawValue();

//       //   console.log(data);
//       //   console.log(tmpForm);
//       //   console.log(this.coordinadora);
//       //   const dat01 = this.formUtils.findComboValue(this.coordinadora, tmpForm.coordinadora, 'bid', 'bid');
//       //   console.log(dat01);
//       //   console.log('dat08');
//       //   this.form.get('coordinadora').patchValue(dat01);

//       // }
//       // this.form.patchValue(data.data);
//       return;
//     }//endIf

//  }

// //  setForm(data) {
// //   this.form.get('coordinadora').patchValue(data.coordinadora);

// //   this.coordinadora.forEach((item) => {
// //     // console.log(item);
// //     if (data.coordinadora && item.bid === data.coordinadora.bid) {
// //       this.form.get('coordinadora').patchValue(item);
// //       return false;
// //     }
// //   });
// //  {
// //     // se supone que es el evento de edicion
// //   }

// // }
//   }

  async initWithServerData () {
    // Obtener los catalogos
    const getCatResp = await this.terminalSrv.getCatalogs();
    this.catalogo = getCatResp;

    this.catalogo.forEach(item => {
      this.tipos.push({cve:item.cve, tipo: item.tipo});
    })

    if (this.terminal.tipo && this.terminal.institucion && this.terminal.sede) {
      this.onSelectionChange(this.terminal.tipo, 'T', 'R');
      this.onSelectionChange(this.terminal.institucion, 'I', 'R');
      this.onSelectionChange(this.terminal.sede, 'S', 'R');
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
          this.terminal.institucion = {};
          this.terminal.sede = {};
          this.terminal.municip = {};
        }

        this.instituciones = [];
        this.sedes = [];
        this.municipios = [];

        tipo.institucion.forEach(item => {
          this.instituciones.push({cve: item.cve, institucion: item.institucion})
        })
      }
    } else if (type == 'I') {
      let tipo = this.catalogo.find(item => item.cve == this.terminal.tipo['cve']);

      if (tipo) {
        let institucion = tipo.institucion.find(item => item.cve == value.cve);

        if (institucion) {
          if (mode == 'UI') {
            this.terminal.sede = {};
          }

          this.sedes = [];

          institucion.sede.forEach(item => {
            this.sedes.push({cve: item.cve, sede: item.sede})
          })
        }
      }
    } else if (type == 'S' && this.terminal.tipo['cve']=='02') {
      let tipo = this.catalogo.find(item => item.cve == this.terminal.tipo['cve']);

      if (tipo) {
        let institucion = tipo.institucion.find(item => item.cve == this.terminal.institucion['cve']);

        if (institucion) {
          let sede = institucion.sede.find(item => item.cve == this.terminal.sede['cve']);

          if (sede) {
            if (mode == 'UI') {
              this.terminal.municip = {};
            }

            this.municipios = [];

            sede.municip.forEach(item => {
              this.municipios.push({cve: item.cve, municip: item.municip})
            })
          }
        }
      }
    }

    /*this.tipo = $event.tipo;
    this.institucion = $event.institucion;
    this.sede = $event.sede;*/
    // const tipos = $event.value.tipo;
    // this.institucion = tipos;
    // this.sede = tipos;

  }



}
