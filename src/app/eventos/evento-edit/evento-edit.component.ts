
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { REPORTA } from '../../cnsp/mock-reporta';
import { COORDINADORA } from '../../cnsp/mock-coordinadora';
import { ENTIDADES } from '../../cnsp/mock-entidades';
import { INCIDENTE } from '../../cnsp/mock-incidente';
import { ATIENDE } from '../../cnsp/mock-atiende';
import { MUNICIPIO } from '../../cnsp/mock-municipio';
import { TORRE } from '../../cnsp/mock-torre';
import { FormBuilder, Validators } from '@angular/forms';
import { SnackSrvService } from '../../services/snack-srv.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ActionBarItemModel, barActions } from '../../shared/action-bar2/action-bar-model';
import { ConvertNumberService } from '../../services/convert-number.service';
import { ActionBar2Component } from '../../shared/action-bar2/action-bar2.component';
import { EventoEvents, EventoService } from '../evento.service';
import * as _ from 'lodash';
import { GmdirComponent } from '../../shared/gmdir/gmdir.component';
import { EventoFactory } from '../../modelFactories/evento-factory';
import { TimeInputComponent } from '../../shared/time-input/time-input.component';
import { FormUtilsService } from '../../shared/form-utils.service';
import { NgForm } from '@angular/forms';
import { DlgAsignarComponent } from '../dlg-asignar/dlg-asignar.component';
import levenshtein from 'fast-levenshtein';
import { EventoDataModel } from '../../models/evento.data.model';


@Component({
  selector: 'app-evento-edit',
  templateUrl: './evento-edit.component.html',
  styleUrls: ['./evento-edit.component.scss']
})
export class EventoEditComponent implements OnInit, OnDestroy {
  @ViewChild('groupForm', { static: false }) public form: NgForm;
  public id: string;

  catalogo = [];
  tipos = [];
  sedes = [];
  municipios = [];
  instituciones = [];
  tincidente;
  stincidente;
  incidente;

  // private subs: Subscription = new Subscription();

  // Constructor and Events ===============================================================
  constructor(
    private snackSrv: SnackSrvService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private convertNumSrv: ConvertNumberService,
    private eventoSrv: EventoService,
    private eventoFct: EventoFactory,
    private formUtils: FormUtilsService,
  ) {
    // this.subs.add(
    //   this.eventoSrv.eventSource$.subscribe((data) => {
    //       this.dispatchEvents(data);
    //     }
    //   ));
  }
  @ViewChild('actionBar2Comp', { static: false }) public actionBar2: ActionBar2Component;
  @ViewChild('timeComp', { static: false }) public timeComp: TimeInputComponent;
  private subs: Subscription = new Subscription();
  eventDocumentList = [];
  titlesList = ['Eventos de Seguridad', 'Edición'];
  showActionList = [1, 4, 5];
  isSavingData = false;
  mostrarPanel = true;
  isEdit = false;
  orgData = null;

  // MOCK CATALOGOS ======================================================================
  reporta = REPORTA;
  entidades = ENTIDADES;
  entidadesFederativas = [];
  atiende = ATIENDE;
  //incidente = INCIDENTE;
  coordinadora = COORDINADORA;
  municipio = MUNICIPIO;
  torre = TORRE;

  evento: EventoDataModel = new EventoDataModel();


  // FORM ================================================================================
  _id = null;

  // Action Bar Events ====================================================================

  onActionClicked(item: ActionBarItemModel) {
    if (item.id === barActions.show) {
      // this.toogleMostar();
    }

    if (item.id === barActions.save) {
      this.attemptSave();
      // if (!this.isSavingData) {
      //   this.isSavingData = true;
      //
      // }
    }

    if (item.id === barActions.exit) {
      // if (!this.isSavingData) {
      //   // this.atttemptApprove();
      // }
      console.log('action exit');
      this.onExit();
    }

    if (item.id === barActions.send) {
      this.showDlgAsignar(null);
    }
  }

  showDlgAsignar(data) {
    console.log(this.orgData);

    const eventoData = {
      data: this.form.form.getRawValue(),
      asig: this.evento.asignacionPrimResp
    };
    // && eventoData.estatus.cve === 1
    // if (!_.isNil(this.evento._id) && this.evento._id !== '0') {
    //   eventoData._id = this.evento._id;
    // }
    if (!_.isNil(this.evento._id) && this.evento._id !== '0') {
      eventoData.data._id = this.evento._id;
      const dialogRef = this.dialog.open(DlgAsignarComponent, {
        panelClass: 'custom-dlg-panel',
        disableClose: true,
        data: eventoData,
      });

      dialogRef.afterClosed().subscribe(result => {

        console.log('The dialog was closed');
      });
    } else {
      this.snackSrv.showMsg('Guarde la información antes de asignar el evento');
    }
  }

  onExit() {
    this.router.navigate(['evento-cons']);
  }

  ngOnInit() {

    this.route.params.subscribe(routeParams => {
      this.id = routeParams['id'];
    })

    if (this.id != '0') {
      this.eventoSrv.getEventoById(this.id).then(response => {
        if (response) {
          this.evento._id = response[0]._id;
          this.evento.reporta = response[0].reporta;
          this.evento.atiende = response[0].atiende;
          this.evento.coordinadora = response[0].coordinadora;
          this.evento.incidente = response[0].incidente;
          this.evento.torre = response[0].torre;
          this.evento.texto = response[0].texto;
          this.evento.fecha = response[0].fecha;
          this.evento.folio911 = response[0].folio911;
          this.evento.folioInterno = response[0].folioInterno;
          this.evento.tincidente = response[0].tincidente;
          this.evento.stincidente = response[0].stincidente;
          this.evento.numCons = response[0].numCons;
          this.evento.estatus = response[0].estatus;
          this.evento.ultimaActualizacion = response[0].ultimaActualizacion;
          this.evento.fechaAsignacion = response[0].fechaAsignacion;
          this.evento.asignacionPrimResp = response[0].asignacionPrimResp;
          this.evento.strFecha = response[0].strFecha;
          this.evento.nincidente = response[0].nincidente;
          this.evento.denunciante = response[0].denunciante;
          this.evento.ubicacionEvento.entidad = response[0].ubicacionEvento.entidad;
          this.evento.ubicacionEvento.municipio = response[0].ubicacionEvento.municipio;
          this.evento.ubicacionEvento.lat = response[0].ubicacionEvento.lat;
          this.evento.ubicacionEvento.long = response[0].ubicacionEvento.long;
          this.evento.ubicacionEvento.cp = response[0].ubicacionEvento.cp;
          this.evento.ubicacionEvento.colonia = response[0].ubicacionEvento.colonia;
          this.evento.ubicacionEvento.calle = response[0].ubicacionEvento.calle;
          this.evento.ubicacionEvento.numero = response[0].ubicacionEvento.numero;
          this.evento.ubicacionEvento.numInt = response[0].ubicacionEvento.numInt;
          this.evento.ubicacionEvento.referencias = response[0].ubicacionEvento.referencias;
          this.evento.ubicacionEvento.entreCalle = response[0].ubicacionEvento.entreCalle;
          this.evento.ubicacionEvento.entreCalle2 = response[0].ubicacionEvento.entreCalle2;
          this.evento.tipo = response[0].tipo;
          this.evento.institucion = response[0].institucion;
          this.evento.sede = response[0].sede;
          this.evento.municip = response[0].municip;

          if (response[0].asignacionPrimResp.length > 0) {
            this.evento.asignacionPrimResp = response[0].asignacionPrimResp;
          }

          console.log('Recuperadosss');
          console.log(response);
        }
      })
    }

    const tempProm = this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id'); //OBTIENE ID Q SE MANDA

      if (id && id !== '0') {
        this.isEdit = true;
        this._id = id;
      } else {
        // Es un nuevo elemento de captura
        // this.ctrlSrv.newEvent();
        this.newItemDefaults();
      }

      this.initWithServerData();
    });

    this.subs.add(tempProm);
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  // COMPONENT AND USER CONTROL FUNCTIONS =================================================
  setForm(data) {


  }// setForm <<<<

  // COMPONENT BEHAVIOR ===================================================================

  async attemptSave() {
    console.log('attemptSave');
    if (this.form.form.valid && !this.isSavingData) {
      this.isSavingData = true;
      try {
        console.log('Is valid!');
        // Datos por defecto
        // this.cnspForm.get('ultimaActualizacion').patchValue(new Date());
        this.evento.ultimaActualizacion = new Date;

        const eventoData = this.form.form.getRawValue();
        eventoData.strFecha = this.formUtils.getStrFechaCort(eventoData.fecha);
        this.evento.strFecha = eventoData.strFecha;
        // this.cnspForm.get('strFecha').patchValue(eventoData.strFecha);

        if (!_.isNil(this.evento._id) && this.evento._id !== '0') {
          eventoData._id = this.evento._id;
        } else {
          // Poner estatus por defecto
          eventoData.estatus = { cve: 1, nom: 'REGISTRADO' };
        }

        const resp = await this.eventoSrv.upsertEvento2(this.evento);
        this.evento._id = resp._id;
        this.evento._id = resp;

        // const resp = await this.eventoSrv.upsertEvento2(eventoData);
        // this._id = resp._id;
        // this.cnspForm.patchValue(resp);

        this.snackSrv.showMsg('Información guardada correctamente');
      } catch (e) {
        this.isSavingData = false;
        this.snackSrv.showMsg('Error al guardar información');
      }
    } else {
      this.snackSrv.showMsg('Faltan campos obligatorios');
    }
  }

  // SERVICE EVENTS =======================================================================

  setFullDate(fechaObj) {
    console.log('setFullDate =========================');
    console.log(fechaObj);
    this.form.form.get('fecha').patchValue(fechaObj.fechaObj);
    this.timeComp.setByDateTimeObj(fechaObj);
  }


  onElegirGDir() {
    const dlgRef = this.dialog.open(GmdirComponent, {
      width: '800px',
      height: '620px',
    });

    dlgRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('1');
        // this.cnspForm.get('ubicacionEvento').get('calle').patchValue( (result.calle) ? result.calle.long_name : '');
        // this.cnspForm.get('ubicacionEvento').get('colonia').patchValue( (result.colonia) ? result.colonia.long_name : '');
        // this.cnspForm.get('ubicacionEvento').get('cp').patchValue( (result.codigoPostal) ? result.codigoPostal.long_name : '');
        // this.cnspForm.get('ubicacionEvento').get('numero').patchValue( (result.numcalle) ? result.numcalle.long_name : '');
        // this.cnspForm.get('ubicacionEvento').get('lat').patchValue( (result.lat) ? result.lat : '');
        // this.cnspForm.get('ubicacionEvento').get('long').patchValue( (result.long) ? result.long : '');
        this.evento.ubicacionEvento.calle = (result.calle ? result.calle.long_name : '');
        this.evento.ubicacionEvento.colonia = (result.colonia ? result.colonia.long_name : '');
        this.evento.ubicacionEvento.cp = (result.codigoPostal ? result.codigoPostal.long_name : '');
        this.evento.ubicacionEvento.numero = (result.numcalle ? result.numcalle.long_name : '');
        this.evento.ubicacionEvento.lat = (result.lat ? result.lat : '');
        this.evento.ubicacionEvento.long = (result.long ? result.long : '');


        if (!_.isNil(result.entidad)) {
          // Buscar en el catalogo de entidades
          const e2 = result.entidad.long_name.toUpperCase();
          const entidadFoudnd = this.seachEntidadOrMunByLeven(e2, this.entidadesFederativas);

          if (!_.isNil(entidadFoudnd)) {
            this.evento.ubicacionEvento.entidad = entidadFoudnd;
            //this.cnspForm.get('ubicacionEvento').get('entidad').patchValue(entidadFoudnd);
            this.municipio = entidadFoudnd.municipios;

            if (!_.isNil(result.municipio)) {
              // Buscar en el catalogo de entidades
              const e2 = result.municipio.long_name.toUpperCase();
              const munFound = this.seachEntidadOrMunByLeven(e2, this.municipio);

              if (!_.isNil(munFound)) {
                this.evento.ubicacionEvento.municipio = munFound;
                // this.cnspForm.get('ubicacionEvento').get('municipio').patchValue(munFound);
              }
            }
          }
        }
      }

    });
  }

  seachEntidadOrMunByLeven(stringEntidadOrMun, listEntidadOrMun) {
    const e2 = stringEntidadOrMun.toUpperCase();
    for (const item of listEntidadOrMun) {
      const e1 = item.nomOf.toUpperCase();
      const distancie = levenshtein.get(e1, e2);
      if (distancie <= 1) {
        return item;
        break;
      }
    }
    return null;
  }

  newItemDefaults() {
    // // Fecha
    this.evento.fecha = new Date();

    // this.form.form.get('fecha').patchValue(new Date());

    this.evento.atiende = this.evento.atiende[0];
    //Asignar primer elemtento de la lista de atiende
    // this.form.form.get('atiende').patchValue(this.atiende[0]);

    //Asignar primer elemtento de la lista de atiende
    // this.form.form.get('coordinadora').patchValue(this.coordinadora[0]);

    // Torre
    this.evento.torre = this.evento.torre[0];
    // this.form.form.get('torre').patchValue(this.torre[0]);

    // Fecha
    setTimeout(() => {
      this.setFullDate(this.formUtils.getDateAndTimeObj(new Date()));
    }, 500);

  }

  // FUNCION PARA SELECCIONAR ELEMENTOS
  onChgTIncidente($event) {
    const tipos = $event.value.tipos;
    this.stincidente = tipos;
  }

  onChgSTIncidente($event) {
    const subtipos = $event.value.subtipos;
    this.incidente = subtipos;
  }

  async initWithServerData() {
    // Obtener los catalogos
    const getCatResp = await this.eventoSrv.getCatalogs();
    this.entidadesFederativas = getCatResp;

    const getCat = await this.eventoSrv.getCatalogos();
    this.catalogo = getCat;

    this.catalogo.forEach(item => {
      this.tipos.push({ cve: item.cve, tipo: item.tipo });
    })

    if (this.evento.tipo && this.evento.institucion && this.evento.sede) {
      this.onSelectionChange(this.evento.tipo, 'T', 'R');
      this.onSelectionChange(this.evento.institucion, 'I', 'R');
      this.onSelectionChange(this.evento.sede, 'S', 'R');
    }

    // Obtener datos del servidor del evento
    const reporta = await this.eventoSrv.getReporta();
    this.reporta = reporta;

    // Obtener incidendes
    const incidentes = await this.eventoSrv.getIncidente(null);
    this.tincidente = incidentes;

    if (!_.isNil(this._id) && this._id !== '0') {
      // Obtener información del evento
      const eventoServerData = await this.eventoSrv.getEventoById(this._id);
      const eventoItem = eventoServerData[0];
      console.log('initWithServerData *****************');

      // Cargar opciones - municipios
      for (const item of this.entidadesFederativas) {
        if (eventoItem.ubicacionEvento.entidad.cve === item.cve) {
          this.municipio = item.municipios;
          break;
        }
      }

      // Cargar sub opciones de incidente
      for (const item of this.tincidente) {
        if (item.cve === eventoItem.tincidente.cve) {
          this.stincidente = item.tipos;

          for (const item2 of this.stincidente) {
            if (item2.cve === eventoItem.stincidente.cve) {
              this.incidente = item2.subtipos;
              break;
            }
          }

          break;
        }
      }

      eventoItem.fecha = (eventoItem.fecha) ? new Date(eventoItem.fecha) : null;
      eventoItem.ultimaActualizacion = (eventoItem.ultimaActualizacion) ? new Date(eventoItem.ultimaActualizacion) : null;
      eventoItem.fechaAsignacion = (eventoItem.fechaAsignacion) ? new Date(eventoItem.fechaAsignacion) : null;

      // this.cnspForm.patchValue(eventoItem);
      this.setFullDate(this.formUtils.getDateAndTimeObj(eventoItem.fecha));
    }
  }

  compareWithEntidadesFederativas(d1, d2) {
    return (d1 && d2) ? d1.cve === d2.cve : false;
  }

  compareWithBid(d1, d2) {
    return (d1 && d2) ? d1.bid === d2.bid : false;
  }

  compareWithTipos(d1, d2) {
    return (d1 && d2) ? d1.cve === d2.cve : false;
  }

  compareWithId(d1, d2) {
    return (d1 && d2) ? d1._id === d2._id : false;
  }

  onSelectionChangeEntidadFederativa($event) {
    this.municipio = $event.value.municipios;
  }

  onSelectionChange(value, type, mode) {
    if (type == 'T') {
      let tipo = this.catalogo.find(item => item.cve == value.cve);

      if (tipo) {
        if (mode == 'UI') {
          this.evento.institucion = {};
          this.evento.sede = {};
          this.evento.municip = {};
        }

        this.instituciones = [];
        this.sedes = [];
        this.municipios = [];

        tipo.institucion.forEach(item => {
          this.instituciones.push({ cve: item.cve, institucion: item.institucion })
        })
      }
    } else if (type == 'I') {
      let tipo = this.catalogo.find(item => item.cve == this.evento.tipo['cve']);

      if (tipo) {
        let institucion = tipo.institucion.find(item => item.cve == value.cve);

        if (institucion) {
          if (mode == 'UI') {
            this.evento.sede = {};
          }

          this.sedes = [];

          institucion.sede.forEach(item => {
            this.sedes.push({ cve: item.cve, sede: item.sede, torre: item.torre })
          })
        }
      }
    } else if (type == 'S' && this.evento.tipo['cve'] == '02') {
      let tipo = this.catalogo.find(item => item.cve == this.evento.tipo['cve']);

      if (tipo) {
        let institucion = tipo.institucion.find(item => item.cve == this.evento.institucion['cve']);

        if (institucion) {
          let sede = institucion.sede.find(item => item.cve == this.evento.sede['cve']);

          if (sede) {
            if (mode == 'UI') {
              this.evento.municip = {};
            }

            this.municipios = [];

            sede.municip.forEach(item => {
              this.municipios.push({ cve: item.cve, municip: item.municip, torre: item.torre })
            })
          }
        }
      }
    }


  }


}
