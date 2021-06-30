import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { SnackSrvService } from '../../services/snack-srv.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ActionBarItemModel, barActions } from '../../shared/action-bar2/action-bar-model';
import { ConvertNumberService } from '../../services/convert-number.service';
import { ActionBar2Component } from '../../shared/action-bar2/action-bar2.component';
import { DactilEvents, DactiloscopiaService } from '../dactiloscopia.service';
import * as _ from 'lodash';
import { GmdirComponent } from '../../shared/gmdir/gmdir.component';
import { EventoFactory } from '../../modelFactories/evento-factory';
import { TEVENTO } from '../dactiloscopia-edit/mock-tevento';
import { COMPLEXION } from '../dactiloscopia-edit/mock-complexion';
import { COLPIEL } from '../dactiloscopia-edit/mock-colpiel';
import { CANCABELLO } from '../dactiloscopia-edit/mock-cancabello';
import { COLCABELLO } from '../dactiloscopia-edit/mock-colcabello';
import { FORMCABELLO } from './mock-formcabello';
import { TIPCARA } from '../dactiloscopia-edit/mock-tipcara';
import { ALTFRENTE } from '../dactiloscopia-edit/mock-altfrente';
import { ANCFRENTE } from '../dactiloscopia-edit/mock-ancfrente';
import { COLOJOS } from '../dactiloscopia-edit/mock-colojos';
import { FORMOJOS } from '../dactiloscopia-edit/mock-formojos';
import { TAMOJOS } from '../dactiloscopia-edit/mock-tamojos';
import { FORNARIZ } from '../dactiloscopia-edit/mock-fornariz';
import { TAMNRIZ } from '../dactiloscopia-edit/mock-tamnriz';
import { FORLABIOS } from '../dactiloscopia-edit/mock-forlabios';
import { TAMLABIOS } from '../dactiloscopia-edit/mock-tamlabios';
import { MENTON } from '../dactiloscopia-edit/mock-menton';
import { FORMENTON } from '../dactiloscopia-edit/mock-formenton';
import { INCLINACION } from '../dactiloscopia-edit/mock-inclinacion';
import { FORMOREJAS } from '../dactiloscopia-edit/mock-formorejas';
import { TAMOREJAS } from '../dactiloscopia-edit/mock-tamorejas';
import { SEXO } from '../dactiloscopia-edit/mock-sexo';
import { NACIONALIDAD } from '../dactiloscopia-edit/mock-nacionalidad';
import { FormUtilsService } from '../../shared/form-utils.service';
import * as moment from 'moment';
import { EDOCIVIL } from './mock-edocivil';
import { ESCOLARIDAD } from './mock-escolaridad';
import { OCUPACION } from './mock-ocupacion';
import { replace } from 'lodash';
import { ENTIDADES } from './mock-entidades';
import { ENTIDAD } from './mock-entidad';
import { MUNICIPIO } from './mock-municipio';

const newLocal = new Date();
@Component({
  selector: 'app-dactiloscopia-edit',
  templateUrl: './dactiloscopia-edit.component.html',
  styleUrls: ['./dactiloscopia-edit.component.scss']
})
export class DactiloscopiaEditComponent implements OnInit, OnDestroy {
  ultimaMod; folioInterno;
  entidadesFederativas = [];
  municipio = MUNICIPIO;
  entidad = ENTIDADES;
  tevento = TEVENTO;
  sexo = SEXO;
  nacionalidad = NACIONALIDAD;
  edocivil = EDOCIVIL;
  escolaridad = ESCOLARIDAD;
  ocupacion = OCUPACION;
  complexion = COMPLEXION;
  colpiel = COLPIEL;
  cancabello = CANCABELLO;
  colcabello = COLCABELLO;
  formcabello = FORMCABELLO;
  tipcara = TIPCARA;
  altfrente = ALTFRENTE;
  ancfrente = ANCFRENTE;
  colojos = COLOJOS;
  formojos = FORMOJOS;
  tamojos = TAMOJOS;
  fornariz = FORNARIZ;
  tamnriz = TAMNRIZ;
  forlabios = FORLABIOS;
  tamlabios = TAMLABIOS;
  menton = MENTON;
  formenton = FORMENTON;
  inclinacion = INCLINACION;
  formorejas = FORMOREJAS;
  tamorejas = TAMOREJAS;
  lugnacimiento = ENTIDADES;

  // Atributos ======================================================================
  _id = null;
  cnspForm = this.fb.group({
    mediafiliacion: this.fb.group({
      registro: this.fb.group({
        folioInterno: [{ value: '', disabled: true },],
        // folio: ['', Validators.required],
        // tevento: ['', Validators.required],
        datPer: this.fb.group({
          appat: ['', Validators.required],
          apmat: ['', Validators.required],
          nombre: ['', Validators.required],
          // alias: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')] ],
          sexo: ['', Validators.required],
          nacionalidad: ['', Validators.required],
          fecnac: ['', Validators.required],
          // sueldo: ['', Validators.required],
        }),
        domicilio: this.fb.group({
          calle: ['', Validators.required],
          numero: ['', Validators.required],
          numInt: ['', Validators.required],
          colonia: ['', Validators.required],
          cp: ['', Validators.required],
          entidad: ['', Validators.required],
          municipio: ['', Validators.required],
        }),
        asunto: [{ value: '', disabled: true }],
        edad: [{ value: '', disabled: true }],
        lugnacimiento: ['', Validators.required],
        escolaridad: ['', Validators.required],
        ocupacion: ['', Validators.required],
        edocivil: ['', Validators.required],
        // nompadre: [''],
        // dompadre: [''],
        // nommadre: [''],
        // dommadre: [''],
        // nomconyugue: [''],
        complexion: [''],
        colpiel: [''],
        cancabello: [''],
        colcabello: [''],
        formcabello: [''],
        tipcara: [''],
        altfrente: [''],
        ancfrente: [''],
        colojos: [''],
        formojos: [''],
        tamojos: [''],
        fornariz: [''],
        tamnriz: [''],
        forlabios: [''],
        tamlabios: [''],
        menton: [''],
        formenton: [''],
        inclinacion: [''],
        formorejas: [''],
        tamorejas: [''],
      }),
      estatus: this.fb.group({
        cve: [{ value: '', disabled: true }],
        nom: [{ value: '', disabled: true }],
      }),
    }),
    ultimaMod: this.fb.group({
      ultimaMod: [{ value: null, disabled: false }],
    }),
  });
  estatus; 
  fecnac: any;
  fecha: any;
  edad: any;
  mes: any; 
  dia: any; 
  año: any; 
  alias: any;

  // Constructor and Events ===============================================================
  constructor(
    private snackSrv: SnackSrvService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private convertNumSrv: ConvertNumberService,
    private dactiloscopiaSrv: DactiloscopiaService,
    private eventoFct: EventoFactory,
    private formUtils: FormUtilsService
  ) {
    console.log(this.cnspForm);
    this.subs.add(
      this.dactiloscopiaSrv.eventSource$.subscribe((data) => {
        this.dispatchEvents(data);
      }
      ));
  }

  @ViewChild('actionBar2Comp', { static: false }) public actionBar2: ActionBar2Component;
  private subs: Subscription = new Subscription();
  eventDocumentList = [];
  orgData = null;
  titlesList = ['Registro Mediafiliación', 'Edición'];
  showActionList = [10, 1, 4];
  isSavingData = false;
  mostrarPanel = true;
  isEdit = false;

  // Action Bar Events ====================================================================

  onActionClicked(item: ActionBarItemModel) {
    if (item.id === barActions.finish) {
      // this.toogleMostar();
      this.attemptFinish(event);
    }

    if (item.id === barActions.save) {
      if (!this.isSavingData) {
        this.isSavingData = true;
        this.attemptSave();
      }
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
    this.router.navigate(['detdacti-cons']);
  }

  ngOnInit() {
    const tempProm = this.route.paramMap.subscribe((params: ParamMap) => {
      console.log(params);
      const id = params.get('id');

      if (id && id !== '0') {
        // Obtener del servidor
        // this.ctrlSrv.getEventById(id);
        // this.eventoSrv.getEventoById(id);
        // this.isEdit = true;
        this._id = id;
      } else {
        // Es un nuevo elemento de captura
        // this.ctrlSrv.newEvent();
        // this.newItemDefaults();
      }
      if (this._id) {
        this.dactiloscopiaSrv.getById(this._id);
      }

    });

    if (this._id) {
      this.dactiloscopiaSrv.getAllCatalog(this._id);
    }

    this.initWithServerData();
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

   attemptFinish($event) {
    console.log('attempFinish');
    console.log($event);

    const event = this.cnspForm.getRawValue();
    console.log(event);

    if (!_.isNil(this._id)) {
      event._id = this._id;
    }

    const estatus = $event.value;
    console.log(estatus);

    this.dactiloscopiaSrv.upsertDactiloscopia(event);
    this._id = event._id;

      const confirmacion = confirm('¿Desea Finalizar el registro?');
      if (confirmacion) {
        this.cnspForm.get('mediafiliacion').disable();
        this.snackSrv.showMsg('El Registro ha sido Concluido');
      }
  }

  Edad() {
    var fecnac = moment(this.cnspForm.get('mediafiliacion').get('registro').get('datPer').get('fecnac').value).format('YYYY/MM/DD');
    // var fecnac = new Date(response.detenido.intervencion.datPer.fecnac).toISOString().slice(0,10);  
    var fecha = moment(fecha).format('YYYY/MM/DD');

    var years = moment().diff(fecnac, 'years');
    console.log(years);
    console.log(this.cnspForm);
    //this.cnspForm.get('mediafiliacion').get('registro').get('datPer').get('edad').setValue(years);


  }

  // COMPONENT BEHAVIOR ===================================================================

  attemptSave() {
    console.log('attemptSave');
    if (this.cnspForm.valid) {
      console.log('Is valid!');
      const eventoData = this.cnspForm.getRawValue();
      console.log(eventoData);

      if (!_.isNil(this._id)) {
        eventoData._id = this._id;
      }
      this.dactiloscopiaSrv.getById(eventoData);
      this.dactiloscopiaSrv.upsertDactiloscopia(eventoData);
    } else {
      this.snackSrv.showMsg('Faltan campos obligatorios');
      this.isSavingData = false;
    }
  }

  // SERVICE EVENTS =======================================================================
  dispatchEvents(data) {
    console.log('dispatchEvents');
    //   Evento para el catáogo de Reportas

    if (data.event === DactilEvents.DacCatalog) {
      console.log(data);
      if (data.data) {
        const response = data.data;
        console.log('dispatchEvents 1');
        console.log(response.detenido);
        console.log(response.preIph);
        console.log(response.estatus);
        console.log('dispatchEvents 2');
        //this.sexo = response[0].sexo;

        this.cnspForm.get('mediafiliacion').get('registro').patchValue(response.detenido.intervencion);
        this.cnspForm.get('mediafiliacion').get('registro').patchValue(response.preIph[0]);
        this.cnspForm.get('mediafiliacion').get('estatus').patchValue(response.estatus);

        console.log(response.detenido);
        console.log(response.preIph);
        console.log(response.estatus);
        console.log('dispatchEvents 3');
      }
    }

    if (data.event === DactilEvents.UpsertDactiloscopia) {
      console.log(data);
      if (!_.isNil(data)) {
        this.snackSrv.showMsg('Información guardada correctamente!');
        this._id = data.data._id;
      }

      this.isSavingData = false;
    }

    if (data.event === DactilEvents.GetByIdDone) {
      console.log('GetByIdDone');

      if (data.data) {
        const response = data.data;
        console.log(response);

        console.log('GetByIdDone 1');

        if (_.isNil(response.mediafiliacion)) {
          console.log('GetByIdDone 1.5');
          response.mediafiliacion = {
            registro: {
              folioInterno: response.folioInterno,
              appat: response.appat,
              apmat: response.apmat,
              nombre: response.nombre,
              alias: response.alias,
              fecnac: response.fecnac,
              sexo: response.sexo,
              nacionalidad: response.nacionalidad,
              calle: response.calle,
              numero: response.numero,
              numInt: response.numInt,
              colonia: response.colonia,
              cp: response.cp,
              entidad: response.entidad,
              municipio: response.municipio,
              asunto: null,
              edad: response.fecnac,
              complexion: null,
              colpiel: null,
              cancabello: null,
              colcabello: null,
              formcabello: null,
              tipcara: null,
              altfrente: null,
              ancfrente: null,
              colojos: null,
              formojos: null,
              tamojos: null,
              fornariz: null,
              tamnriz: null,
              forlabios: null,
              tamlabios: null,
              menton: null,
              formenton: null,
              inclinacion: null,
              tamorejas: null,
            },
            estatus: {
              cve: 1,
              nom: 'EN PROCESO'
            }
          }
        } else if (_.isNil(response.mediafiliacion.estatus)) {
          response.mediafiliacion.estatus = { cve: 1, nom: 'EN PROCESO' }
        } else if (response.mediafiliacion.estatus.nom === 'EN PROCESO') {
          response.mediafiliacion.estatus = { cve: 2, nom: 'FINALIZADO' }
          // this.cnspForm.get('mediafiliacion').disable();
        }


        // var alias = response.alias;
        // alias = alias.replace(/[aiou], ""/gi,'e');
        // console.log(alias);

        this.cnspForm.patchValue(response)
        console.log(response);

       console.log('GetByIdDone 2');

        // LLENADO DE LA INFO QUE ES CATALOGO
        let tmpForm = this.cnspForm.getRawValue();

        console.log(this.complexion);
        const dat01 = this.formUtils.findComboValue(this.complexion, tmpForm.mediafiliacion.registro.complexion, 'nom', 'nom');
        console.log(dat01);
        this.cnspForm.get('mediafiliacion').get('registro').get('complexion').patchValue(dat01);

        console.log(this.colpiel);
        const dat02 = this.formUtils.findComboValue(this.colpiel, tmpForm.mediafiliacion.registro.colpiel, 'nom', 'nom');
        console.log(dat02);
        this.cnspForm.get('mediafiliacion').get('registro').get('colpiel').patchValue(dat02);

        console.log(this.cancabello);
        const dat03 = this.formUtils.findComboValue(this.cancabello, tmpForm.mediafiliacion.registro.cancabello, 'nom', 'nom');
        console.log(dat03);
        this.cnspForm.get('mediafiliacion').get('registro').get('cancabello').patchValue(dat03);

        console.log(this.colcabello);
        const dat04 = this.formUtils.findComboValue(this.colcabello, tmpForm.mediafiliacion.registro.colcabello, 'nom', 'nom');
        console.log(dat04);
        this.cnspForm.get('mediafiliacion').get('registro').get('colcabello').patchValue(dat04);

        console.log(this.formcabello);
        const dat05 = this.formUtils.findComboValue(this.formcabello, tmpForm.mediafiliacion.registro.formcabello, 'nom', 'nom');
        console.log(dat05);
        this.cnspForm.get('mediafiliacion').get('registro').get('formcabello').patchValue(dat05);

        console.log(this.tipcara);
        const dat06 = this.formUtils.findComboValue(this.tipcara, tmpForm.mediafiliacion.registro.tipcara, 'nom', 'nom');
        console.log(dat06);
        this.cnspForm.get('mediafiliacion').get('registro').get('tipcara').patchValue(dat06);

        console.log(this.altfrente);
        const dat07 = this.formUtils.findComboValue(this.altfrente, tmpForm.mediafiliacion.registro.altfrente, 'nom', 'nom');
        console.log(dat07);
        this.cnspForm.get('mediafiliacion').get('registro').get('altfrente').patchValue(dat07);

        console.log(this.ancfrente);
        const dat08 = this.formUtils.findComboValue(this.ancfrente, tmpForm.mediafiliacion.registro.ancfrente, 'nom', 'nom');
        console.log(dat08);
        this.cnspForm.get('mediafiliacion').get('registro').get('ancfrente').patchValue(dat08);

        console.log(this.colojos);
        const dat09 = this.formUtils.findComboValue(this.colojos, tmpForm.mediafiliacion.registro.colojos, 'nom', 'nom');
        console.log(dat09);
        this.cnspForm.get('mediafiliacion').get('registro').get('colojos').patchValue(dat09);

        console.log(this.formojos);
        const dat10 = this.formUtils.findComboValue(this.formojos, tmpForm.mediafiliacion.registro.formojos, 'nom', 'nom');
        console.log(dat10);
        this.cnspForm.get('mediafiliacion').get('registro').get('formojos').patchValue(dat10);

        console.log(this.tamojos);
        const dat11 = this.formUtils.findComboValue(this.tamojos, tmpForm.mediafiliacion.registro.tamojos, 'nom', 'nom');
        console.log(dat11);
        this.cnspForm.get('mediafiliacion').get('registro').get('tamojos').patchValue(dat11);

        console.log(this.fornariz);
        const dat12 = this.formUtils.findComboValue(this.fornariz, tmpForm.mediafiliacion.registro.fornariz, 'nom', 'nom');
        console.log(dat12);
        this.cnspForm.get('mediafiliacion').get('registro').get('fornariz').patchValue(dat12);

        console.log(this.tamnriz);
        const dat13 = this.formUtils.findComboValue(this.tamnriz, tmpForm.mediafiliacion.registro.tamnriz, 'nom', 'nom');
        console.log(dat13);
        this.cnspForm.get('mediafiliacion').get('registro').get('tamnriz').patchValue(dat13);

        console.log(this.forlabios);
        const dat14 = this.formUtils.findComboValue(this.forlabios, tmpForm.mediafiliacion.registro.forlabios, 'nom', 'nom');
        console.log(dat14);
        this.cnspForm.get('mediafiliacion').get('registro').get('forlabios').patchValue(dat14);

        console.log(this.tamlabios);
        const dat15 = this.formUtils.findComboValue(this.tamlabios, tmpForm.mediafiliacion.registro.tamlabios, 'nom', 'nom');
        console.log(dat15);
        this.cnspForm.get('mediafiliacion').get('registro').get('tamlabios').patchValue(dat15);

        console.log(this.menton);
        const dat16 = this.formUtils.findComboValue(this.menton, tmpForm.mediafiliacion.registro.menton, 'nom', 'nom');
        console.log(dat16);
        this.cnspForm.get('mediafiliacion').get('registro').get('menton').patchValue(dat16);

        console.log(this.formenton);
        const dat17 = this.formUtils.findComboValue(this.formenton, tmpForm.mediafiliacion.registro.formenton, 'nom', 'nom');
        console.log(dat17);
        this.cnspForm.get('mediafiliacion').get('registro').get('formenton').patchValue(dat17);

        console.log(this.inclinacion);
        const dat18 = this.formUtils.findComboValue(this.inclinacion, tmpForm.mediafiliacion.registro.inclinacion, 'nom', 'nom');
        console.log(dat18);
        this.cnspForm.get('mediafiliacion').get('registro').get('inclinacion').patchValue(dat18);

        console.log(this.formorejas);
        const dat19 = this.formUtils.findComboValue(this.formorejas, tmpForm.mediafiliacion.registro.formorejas, 'nom', 'nom');
        console.log(dat19);
        this.cnspForm.get('mediafiliacion').get('registro').get('formorejas').patchValue(dat19);

        console.log(this.tamorejas);
        const dat20 = this.formUtils.findComboValue(this.tamorejas, tmpForm.mediafiliacion.registro.tamorejas, 'nom', 'nom');
        console.log(dat20);
        this.cnspForm.get('mediafiliacion').get('registro').get('tamorejas').patchValue(dat20);

        console.log(this.escolaridad);
        const dat21 = this.formUtils.findComboValue(this.escolaridad, tmpForm.mediafiliacion.registro.escolaridad, 'nom', 'nom');
        console.log(dat21);
        this.cnspForm.get('mediafiliacion').get('registro').get('escolaridad').patchValue(dat21);

        console.log(this.ocupacion);
        const dat22 = this.formUtils.findComboValue(this.ocupacion, tmpForm.mediafiliacion.registro.ocupacion, 'nom', 'nom');
        console.log(dat22);
        this.cnspForm.get('mediafiliacion').get('registro').get('ocupacion').patchValue(dat22);

        console.log(this.edocivil);
        const dat23 = this.formUtils.findComboValue(this.edocivil, tmpForm.mediafiliacion.registro.edocivil, 'nom', 'nom');
        console.log(dat23);
        this.cnspForm.get('mediafiliacion').get('registro').get('edocivil').patchValue(dat23);

        console.log(this.nacionalidad);
        const dat24 = this.formUtils.findComboValue(this.nacionalidad, tmpForm.mediafiliacion.registro.datPer.nacionalidad, 'nom', 'nom');
        console.log(dat24);
        this.cnspForm.get('mediafiliacion').get('registro').get('datPer').get('nacionalidad').patchValue(dat24);

        console.log(this.sexo);
        const dat25 = this.formUtils.findComboValue(this.sexo, tmpForm.mediafiliacion.registro.datPer.sexo, 'nom', 'nom');
        console.log(dat25);
        this.cnspForm.get('mediafiliacion').get('registro').get('datPer').get('sexo').patchValue(dat25);

        console.log(this.lugnacimiento);
        const dat26 = this.formUtils.findComboValue(this.lugnacimiento, tmpForm.mediafiliacion.registro.lugnacimiento, 'nom', 'nom');
        console.log(dat26);
        this.cnspForm.get('mediafiliacion').get('registro').get('lugnacimiento').patchValue(dat26);

      }
      this.isSavingData = false;
    }
  }

  // COMPONENT AND USER CONTROL FUNCTIONS =================================================
  setForm(data) {
    this.cnspForm.get('tevento').patchValue(data.tevento);
    this.cnspForm.get('sexo').patchValue(data.sexo);
    this.cnspForm.get('complexion').patchValue(data.complexion);
    this.cnspForm.get('colpiel').patchValue(data.colpiel);
    this.cnspForm.get('cancabello').patchValue(data.cancabello);
    this.cnspForm.get('colcabello').patchValue(data.colcabello);
    this.cnspForm.get('formcabello').patchValue(data.formcabello);
    this.cnspForm.get('tipcara').patchValue(data.tipcara);
    this.cnspForm.get('altfrente').patchValue(data.altfrente);
    this.cnspForm.get('ancfrente').patchValue(data.ancfrente);
    this.cnspForm.get('colojos').patchValue(data.colojos);
    this.cnspForm.get('formojos').patchValue(data.formojos);
    this.cnspForm.get('tamojos').patchValue(data.tamojos);
    this.cnspForm.get('fornariz').patchValue(data.fornariz);
    this.cnspForm.get('tamnriz').patchValue(data.tamnriz);
    this.cnspForm.get('forlabios').patchValue(data.forlabios);
    this.cnspForm.get('tamlabios').patchValue(data.tamlabios);
    this.cnspForm.get('menton').patchValue(data.menton);
    this.cnspForm.get('formenton').patchValue(data.formenton);
    this.cnspForm.get('inclinacion').patchValue(data.inclinacion);
    this.cnspForm.get('formorejas').patchValue(data.formorejas);
    this.cnspForm.get('tamorejas').patchValue(data.tamorejas);
    this.cnspForm.get('estatus').patchValue(data.estatus);
    this.cnspForm.get('nacionalidad').patchValue(data.nacionalidad);
    this.cnspForm.get('edocivil').patchValue(data.edocivil);
    this.cnspForm.get('escolaridad').patchValue(data.escolaridad);
    this.cnspForm.get('ocupacion').patchValue(data.ocupacion);
    this.cnspForm.get('lugnacimiento').patchValue(data.lugnacimiento);
    this.cnspForm.get('entidad').patchValue(data.entidad);
    this.cnspForm.get('municipio').patchValue(data.municipio);


    this.sexo.forEach((item) => {
      // console.log(item);
      if (data.sexo && item.cve === data.sexo.cve) {
        this.cnspForm.get('sexo').patchValue(item);
        return false;
      }
    });
    this.complexion.forEach((item) => {
      // console.log(item);
      if (data.complexion && item.cve === data.complexion.cve) {
        this.cnspForm.get('complexion').patchValue(item);
        return false;
      }
    });
    this.colpiel.forEach((item) => {
      // console.log(item);
      if (data.colpiel && item.cve === data.colpiel.cve) {
        this.cnspForm.get('colpiel').patchValue(item);
        return false;
      }
    });
    this.cancabello.forEach((item) => {
      // console.log(item);
      if (data.cancabello && item.cve === data.cancabello.cve) {
        this.cnspForm.get('cancabello').patchValue(item);
        return false;
      }
    });
    this.colcabello.forEach((item) => {
      // console.log(item);
      if (data.colcabello && item.cve === data.colcabello.cve) {
        this.cnspForm.get('colcabello').patchValue(item);
        return false;
      }
    });
    this.formcabello.forEach((item) => {
      // console.log(item);
      if (data.formcabello && item.cve === data.formcabello.cve) {
        this.cnspForm.get('formcabello').patchValue(item);
        return false;
      }
    });
    this.tipcara.forEach((item) => {
      // console.log(item);
      if (data.tipcara && item.cve === data.tipcara.cve) {
        this.cnspForm.get('tipcara').patchValue(item);
        return false;
      }
    });
    this.altfrente.forEach((item) => {
      // console.log(item);
      if (data.altfrente && item.cve === data.altfrente.cve) {
        this.cnspForm.get('altfrente').patchValue(item);
        return false;
      }
    });
    this.ancfrente.forEach((item) => {
      // console.log(item);
      if (data.ancfrente && item.cve === data.ancfrente.cve) {
        this.cnspForm.get('ancfrente').patchValue(item);
        return false;
      }
    });
    this.colojos.forEach((item) => {
      // console.log(item);
      if (data.colojos && item.cve === data.colojos.cve) {
        this.cnspForm.get('colojos').patchValue(item);
        return false;
      }
    });
    this.formojos.forEach((item) => {
      // console.log(item);
      if (data.formojos && item.cve === data.formojos.cve) {
        this.cnspForm.get('formojos').patchValue(item);
        return false;
      }
    });
    this.tamojos.forEach((item) => {
      // console.log(item);
      if (data.tamojos && item.cve === data.tamojos.cve) {
        this.cnspForm.get('tamojos').patchValue(item);
        return false;
      }
    });
    this.fornariz.forEach((item) => {
      // console.log(item);
      if (data.fornariz && item.cve === data.fornariz.cve) {
        this.cnspForm.get('fornariz').patchValue(item);
        return false;
      }
    });
    this.tamnriz.forEach((item) => {
      // console.log(item);
      if (data.tamnriz && item.cve === data.tamnriz.cve) {
        this.cnspForm.get('tamnriz').patchValue(item);
        return false;
      }
    });
    this.forlabios.forEach((item) => {
      // console.log(item);
      if (data.forlabios && item.cve === data.forlabios.cve) {
        this.cnspForm.get('forlabios').patchValue(item);
        return false;
      }
    });
    this.tamlabios.forEach((item) => {
      // console.log(item);
      if (data.tamlabios && item.cve === data.tamlabios.cve) {
        this.cnspForm.get('tamlabios').patchValue(item);
        return false;
      }
    });
    this.menton.forEach((item) => {
      // console.log(item);
      if (data.menton && item.cve === data.menton.cve) {
        this.cnspForm.get('menton').patchValue(item);
        return false;
      }
    });
    this.formenton.forEach((item) => {
      // console.log(item);
      if (data.formenton && item.cve === data.formenton.cve) {
        this.cnspForm.get('formenton').patchValue(item);
        return false;
      }
    });
    this.inclinacion.forEach((item) => {
      // console.log(item);
      if (data.inclinacion && item.cve === data.inclinacion.cve) {
        this.cnspForm.get('inclinacion').patchValue(item);
        return false;
      }
    });
    this.formorejas.forEach((item) => {
      // console.log(item);
      if (data.formorejas && item.cve === data.formorejas.bid) {
        this.cnspForm.get('formorejas').patchValue(item);
        return false;
      }
    });
    this.tamorejas.forEach((item) => {
      // console.log(item);
      if (data.tamorejas && item.cve === data.tamorejas.cve) {
        this.cnspForm.get('tamorejas').patchValue(item);
        return false;
      }
    });
    this.nacionalidad.forEach((item) => {
      // console.log(item);
      if (data.nacionalidad && item.cve === data.nacionalidad.cve) {
        this.cnspForm.get('nacionalidad').patchValue(item);
        return false;
      }
    });
    this.edocivil.forEach((item) => {
      // console.log(item);
      if (data.edocivil && item.cve === data.edocivil.cve) {
        this.cnspForm.get('edocivil').patchValue(item);
        return false;
      }
    });
    this.escolaridad.forEach((item) => {
      // console.log(item);
      if (data.escolaridad && item.cve === data.escolaridad.cve) {
        this.cnspForm.get('escolaridad').patchValue(item);
        return false;
      }
    });
    this.ocupacion.forEach((item) => {
      // console.log(item);
      if (data.ocupacion && item.cve === data.ocupacion.cve) {
        this.cnspForm.get('ocupacion').patchValue(item);
        return false;
      }
    });
    this.lugnacimiento.forEach((item) => {
      // console.log(item);
      if (data.lugnacimiento && item.cve === data.lugnacimiento.cve) {
        this.cnspForm.get('lugnacimiento').patchValue(item);
        return false;
      }
    });
    this.entidad.forEach((item) => {
      // console.log(item);
      if (data.entidad && item.cve === data.entidad.cve) {
        this.cnspForm.get('lugnacimiento').patchValue(item);
        return false;
      }
    });
    this.municipio.forEach((item) => {
      // console.log(item);
      if (data.municipio && item.cve === data.municipio.cve) {
        this.cnspForm.get('municipio').patchValue(item);
        return false;
      }
    });
    {
      // se supone que es el evento de edicion
    }

    console.log(this.dactiloscopiaSrv);

  }// setForm <<<<

  async initWithServerData () {
    // Obtener los catalogos
    const getCatResp = await this.dactiloscopiaSrv.getCatalogs();
    this.entidadesFederativas = getCatResp;
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

  onSelectionChangeEntidadFederativa($event) {
    console.log($event);
    this.municipio = $event.value.municipios;
  }

}


// import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { Subscription } from 'rxjs';
// import { FormBuilder, Validators } from '@angular/forms';
// import { SnackSrvService } from '../../services/snack-srv.service';
// import { ActivatedRoute, ParamMap, Router } from '@angular/router';
// import { MatDialog } from '@angular/material';
// import { ActionBarItemModel, barActions } from '../../shared/action-bar2/action-bar-model';
// import { ConvertNumberService } from '../../services/convert-number.service';
// import { ActionBar2Component } from '../../shared/action-bar2/action-bar2.component';
// import { DactilEvents, DactiloscopiaService } from '../dactiloscopia.service';
// import * as _ from 'lodash';
// import { GmdirComponent } from '../../shared/gmdir/gmdir.component';
// import { EventoFactory } from '../../modelFactories/evento-factory';
// import { TEVENTO } from '../dactiloscopia-edit/mock-tevento';
// import { COMPLEXION } from '../dactiloscopia-edit/mock-complexion';
// import { COLPIEL } from '../dactiloscopia-edit/mock-colpiel';
// import { CANCABELLO } from '../dactiloscopia-edit/mock-cancabello';
// import { COLCABELLO } from '../dactiloscopia-edit/mock-colcabello';
// import { FORMCABELLO } from './mock-formcabello';
// import { TIPCARA } from '../dactiloscopia-edit/mock-tipcara';
// import { ALTFRENTE } from '../dactiloscopia-edit/mock-altfrente';
// import { ANCFRENTE } from '../dactiloscopia-edit/mock-ancfrente';
// import { COLOJOS } from '../dactiloscopia-edit/mock-colojos';
// import { FORMOJOS } from '../dactiloscopia-edit/mock-formojos';
// import { TAMOJOS } from '../dactiloscopia-edit/mock-tamojos';
// import { FORNARIZ } from '../dactiloscopia-edit/mock-fornariz';
// import { TAMNRIZ } from '../dactiloscopia-edit/mock-tamnriz';
// import { FORLABIOS } from '../dactiloscopia-edit/mock-forlabios';
// import { TAMLABIOS } from '../dactiloscopia-edit/mock-tamlabios';
// import { MENTON } from '../dactiloscopia-edit/mock-menton';
// import { FORMENTON } from '../dactiloscopia-edit/mock-formenton';
// import { INCLINACION } from '../dactiloscopia-edit/mock-inclinacion';
// import { FORMOREJAS } from '../dactiloscopia-edit/mock-formorejas';
// import { TAMOREJAS } from '../dactiloscopia-edit/mock-tamorejas';
// import { SEXO } from '../dactiloscopia-edit/mock-sexo';
// import { NACIONALIDAD } from '../dactiloscopia-edit/mock-nacionalidad';
// import { FormUtilsService } from '../../shared/form-utils.service';
// import * as moment from 'moment';
// import { EDOCIVIL } from './mock-edocivil';
// import { ESCOLARIDAD } from './mock-escolaridad';
// import { OCUPACION } from './mock-ocupacion';
// import { replace } from 'lodash';
// import { ENTIDADES } from './mock-entidades';
// import { ENTIDAD } from './mock-entidad';
// import { MUNICIPIO } from './mock-municipio';

// const newLocal = new Date();
// @Component({
//   selector: 'app-dactiloscopia-edit',
//   templateUrl: './dactiloscopia-edit.component.html',
//   styleUrls: ['./dactiloscopia-edit.component.scss']
// })
// export class DactiloscopiaEditComponent implements OnInit, OnDestroy {
//   ultimaMod; folioInterno;
//   entidadesFederativas = [];
//   municipio;
//   tevento = TEVENTO;
//   sexo = SEXO;
//   nacionalidad = NACIONALIDAD;
//   edocivil = EDOCIVIL;
//   escolaridad = ESCOLARIDAD;
//   ocupacion = OCUPACION;
//   complexion = COMPLEXION;
//   colpiel = COLPIEL;
//   cancabello = CANCABELLO;
//   colcabello = COLCABELLO;
//   formcabello = FORMCABELLO;
//   tipcara = TIPCARA;
//   altfrente = ALTFRENTE;
//   ancfrente = ANCFRENTE;
//   colojos = COLOJOS;
//   formojos = FORMOJOS;
//   tamojos = TAMOJOS;
//   fornariz = FORNARIZ;
//   tamnriz = TAMNRIZ;
//   forlabios = FORLABIOS;
//   tamlabios = TAMLABIOS;
//   menton = MENTON;
//   formenton = FORMENTON;
//   inclinacion = INCLINACION;
//   formorejas = FORMOREJAS;
//   tamorejas = TAMOREJAS;
//   lugnacimiento = ENTIDADES;

//   // Atributos ======================================================================
//   _id = null;
//   cnspForm = this.fb.group({
//     mediafiliacion: this.fb.group({
//       registro: this.fb.group({
//         folioInterno: [{ value: '', disabled: true },],
//         // folio: ['', Validators.required],
//         // tevento: ['', Validators.required],
//         datPer: this.fb.group({
//           appat: ['', Validators.required],
//           apmat: ['', Validators.required],
//           nombre: ['', Validators.required],
//           alias: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')] ],
//           sexo: ['', Validators.required],
//           nacionalidad: ['', Validators.required],
//           fecnac: ['', Validators.required],
//           // sueldo: ['', Validators.required],
//         }),
//         domicilio: this.fb.group({
//           calle: ['', Validators.required],
//           numero: ['', Validators.required],
//           numInt: ['', Validators.required],
//           colonia: ['', Validators.required],
//           cp: ['', Validators.required],
//           entidad: this.fb.group({
//             nomOf: [{ value: '', disabled: true }],
//           }),
//           municipio: this.fb.group({
//             nomOf: [{ value: '', disabled: true }],
//           }),
//         }),
//         asunto: [{ value: '', disabled: true }],
//         edad: [{ value: '', disabled: true }],
//         lugnacimiento: ['', Validators.required],
//         escolaridad: ['', Validators.required],
//         ocupacion: ['', Validators.required],
//         edocivil: ['', Validators.required],
//         // nompadre: [''],
//         // dompadre: [''],
//         // nommadre: [''],
//         // dommadre: [''],
//         // nomconyugue: [''],
//         complexion: [''],
//         colpiel: [''],
//         cancabello: [''],
//         colcabello: [''],
//         formcabello: [''],
//         tipcara: [''],
//         altfrente: [''],
//         ancfrente: [''],
//         colojos: [''],
//         formojos: [''],
//         tamojos: [''],
//         fornariz: [''],
//         tamnriz: [''],
//         forlabios: [''],
//         tamlabios: [''],
//         menton: [''],
//         formenton: [''],
//         inclinacion: [''],
//         formorejas: [''],
//         tamorejas: [''],
//       }),
//       estatus: this.fb.group({
//         cve: [{ value: '', disabled: true }],
//         nom: [{ value: '', disabled: true }],
//       }),
//     }),
//     ultimaMod: this.fb.group({
//       ultimaMod: [{ value: null, disabled: false }],
//     }),
//   });
//   estatus; 
//   fecnac: any;
//   fecha: any;
//   edad: any;
//   mes: any; 
//   dia: any; 
//   año: any; 
//   alias: any;

//   // Constructor and Events ===============================================================
//   constructor(
//     private snackSrv: SnackSrvService,
//     private route: ActivatedRoute,
//     private fb: FormBuilder,
//     public dialog: MatDialog,
//     private router: Router,
//     private convertNumSrv: ConvertNumberService,
//     private dactiloscopiaSrv: DactiloscopiaService,
//     private eventoFct: EventoFactory,
//     private formUtils: FormUtilsService
//   ) {
//     console.log(this.cnspForm);
//     this.subs.add(
//       this.dactiloscopiaSrv.eventSource$.subscribe((data) => {
//         this.dispatchEvents(data);
//       }
//       ));
//   }

//   @ViewChild('actionBar2Comp', { static: false }) public actionBar2: ActionBar2Component;
//   private subs: Subscription = new Subscription();
//   eventDocumentList = [];
//   orgData = null;
//   titlesList = ['Registro Mediafiliación', 'Edición'];
//   showActionList = [10, 1, 4];
//   isSavingData = false;
//   mostrarPanel = true;
//   isEdit = false;

//   // Action Bar Events ====================================================================

//   onActionClicked(item: ActionBarItemModel) {
//     if (item.id === barActions.finish) {
//       // this.toogleMostar();
//       this.attemptFinish(event);
//     }

//     if (item.id === barActions.save) {
//       if (!this.isSavingData) {
//         this.isSavingData = true;
//         this.attemptSave();
//       }
//     }

//     if (item.id === barActions.exit) {
//       // if (!this.isSavingData) {
//       //   // this.atttemptApprove();
//       // }
//       console.log('action exit');
//       this.onExit();
//     }

//     if (item.id === barActions.send) {
//       if (!this.isSavingData) {
//         // this.atttemptApprove();
//       }

//     }
//   }

//   onExit() {
//     this.router.navigate(['detdacti-cons']);
//   }

//   ngOnInit() {
//     const tempProm = this.route.paramMap.subscribe((params: ParamMap) => {
//       console.log(params);
//       const id = params.get('id');

//       if (id && id !== '0') {
//         // Obtener del servidor
//         // this.ctrlSrv.getEventById(id);
//         // this.eventoSrv.getEventoById(id);
//         // this.isEdit = true;
//         this._id = id;
//       } else {
//         // Es un nuevo elemento de captura
//         // this.ctrlSrv.newEvent();
//         // this.newItemDefaults();
//       }
//       if (this._id) {
//         this.dactiloscopiaSrv.getById(this._id);
//       }

//     });

//     if (this._id) {
//       this.dactiloscopiaSrv.getAllCatalog(this._id);
//     }

//     this.initWithServerData();
//   }

//   ngOnDestroy(): void {
//     if (this.subs) {
//       this.subs.unsubscribe();
//     }
//   }

//    attemptFinish($event) {
//     console.log('attempFinish');
//     console.log($event);

//     const event = this.cnspForm.getRawValue();
//     console.log(event);

//     if (!_.isNil(this._id)) {
//       event._id = this._id;
//     }

//     const estatus = $event.value;
//     console.log(estatus);

//     this.dactiloscopiaSrv.upsertDactiloscopia(event);
//     this._id = event._id;

//       const confirmacion = confirm('¿Desea Finalizar el registro?');
//       if (confirmacion) {
//         this.cnspForm.get('mediafiliacion').disable();
//         this.snackSrv.showMsg('El Registro ha sido Concluido');
//       }
//   }

//   Edad() {
//     var fecnac = moment(this.cnspForm.get('mediafiliacion').get('registro').get('datPer').get('fecnac').value).format('YYYY/MM/DD');
//     // var fecnac = new Date(response.detenido.intervencion.datPer.fecnac).toISOString().slice(0,10);  
//     var fecha = moment(fecha).format('YYYY/MM/DD');

//     var years = moment().diff(fecnac, 'years');
//     console.log(years);
//     console.log(this.cnspForm);
//     //this.cnspForm.get('mediafiliacion').get('registro').get('datPer').get('edad').setValue(years);


//   }

//   // COMPONENT BEHAVIOR ===================================================================

//   attemptSave() {
//     console.log('attemptSave');
//     if (this.cnspForm.valid) {
//       console.log('Is valid!');
//       const eventoData = this.cnspForm.getRawValue();
//       console.log(eventoData);

//       if (!_.isNil(this._id)) {
//         eventoData._id = this._id;
//       }
//       this.dactiloscopiaSrv.getById(eventoData);
//       this.dactiloscopiaSrv.upsertDactiloscopia(eventoData);
//     } else {
//       this.snackSrv.showMsg('Faltan campos obligatorios');
//       this.isSavingData = false;
//     }
//   }

//   // SERVICE EVENTS =======================================================================
//   dispatchEvents(data) {
//     console.log('dispatchEvents');
//     //   Evento para el catáogo de Reportas

//     if (data.event === DactilEvents.DacCatalog) {
//       console.log(data);
//       if (data.data) {
//         const response = data.data;
//         console.log('dispatchEvents 1');
//         console.log(response.detenido);
//         console.log(response.preIph);
//         console.log(response.estatus);
//         console.log('dispatchEvents 2');
//         //this.sexo = response[0].sexo;

//         this.cnspForm.get('mediafiliacion').get('registro').patchValue(response.detenido.intervencion);
//         this.cnspForm.get('mediafiliacion').get('registro').patchValue(response.preIph[0]);
//         this.cnspForm.get('mediafiliacion').get('estatus').patchValue(response.estatus);

//         console.log(response.detenido);
//         console.log(response.preIph);
//         console.log(response.estatus);
//         console.log('dispatchEvents 3');
//       }
//     }

//     if (data.event === DactilEvents.UpsertDactiloscopia) {
//       console.log(data);
//       if (!_.isNil(data)) {
//         this.snackSrv.showMsg('Información guardada correctamente!');
//         this._id = data.data._id;
//       }

//       this.isSavingData = false;
//     }

//     if (data.event === DactilEvents.GetByIdDone) {
//       console.log('GetByIdDone');

//       if (data.data) {
//         const response = data.data;
//         console.log(response);

//         console.log('GetByIdDone 1');

//         if (_.isNil(response.mediafiliacion)) {
//           console.log('GetByIdDone 1.5');
//           response.mediafiliacion = {
//             registro: {
//               folioInterno: response.folioInterno,
//               appat: response.appat,
//               apmat: response.apmat,
//               nombre: response.nombre,
//               alias: response.alias,
//               fecnac: response.fecnac,
//               sexo: response.sexo,
//               nacionalidad: response.nacionalidad,
//               calle: response.calle,
//               numero: response.numero,
//               numInt: response.numInt,
//               colonia: response.colonia,
//               cp: response.cp,
//               entidad: response.entidad,
//               municipio: response.municipio,
//               asunto: null,
//               edad: response.fecnac,
//               complexion: null,
//               colpiel: null,
//               cancabello: null,
//               colcabello: null,
//               formcabello: null,
//               tipcara: null,
//               altfrente: null,
//               ancfrente: null,
//               colojos: null,
//               formojos: null,
//               tamojos: null,
//               fornariz: null,
//               tamnriz: null,
//               forlabios: null,
//               tamlabios: null,
//               menton: null,
//               formenton: null,
//               inclinacion: null,
//               tamorejas: null,
//             },
//             estatus: {
//               cve: 1,
//               nom: 'EN PROCESO'
//             }
//           }
//         } else if (_.isNil(response.mediafiliacion.estatus)) {
//           response.mediafiliacion.estatus = { cve: 1, nom: 'EN PROCESO' }
//         } else if (response.mediafiliacion.estatus.nom === 'EN PROCESO') {
//           response.mediafiliacion.estatus = { cve: 2, nom: 'FINALIZADO' }
//           this.cnspForm.get('mediafiliacion').disable();
//         }


//         // var alias = response.alias;
//         // alias = alias.replace(/[aiou], ""/gi,'e');
//         // console.log(alias);

//         this.cnspForm.patchValue(response)
//         console.log(response);

//        console.log('GetByIdDone 2');

//         // LLENADO DE LA INFO QUE ES CATALOGO
//         let tmpForm = this.cnspForm.getRawValue();

//         console.log(this.complexion);
//         const dat01 = this.formUtils.findComboValue(this.complexion, tmpForm.mediafiliacion.registro.complexion, 'nom', 'nom');
//         console.log(dat01);
//         this.cnspForm.get('mediafiliacion').get('registro').get('complexion').patchValue(dat01);

//         console.log(this.colpiel);
//         const dat02 = this.formUtils.findComboValue(this.colpiel, tmpForm.mediafiliacion.registro.colpiel, 'nom', 'nom');
//         console.log(dat02);
//         this.cnspForm.get('mediafiliacion').get('registro').get('colpiel').patchValue(dat02);

//         console.log(this.cancabello);
//         const dat03 = this.formUtils.findComboValue(this.cancabello, tmpForm.mediafiliacion.registro.cancabello, 'nom', 'nom');
//         console.log(dat03);
//         this.cnspForm.get('mediafiliacion').get('registro').get('cancabello').patchValue(dat03);

//         console.log(this.colcabello);
//         const dat04 = this.formUtils.findComboValue(this.colcabello, tmpForm.mediafiliacion.registro.colcabello, 'nom', 'nom');
//         console.log(dat04);
//         this.cnspForm.get('mediafiliacion').get('registro').get('colcabello').patchValue(dat04);

//         console.log(this.formcabello);
//         const dat05 = this.formUtils.findComboValue(this.formcabello, tmpForm.mediafiliacion.registro.formcabello, 'nom', 'nom');
//         console.log(dat05);
//         this.cnspForm.get('mediafiliacion').get('registro').get('formcabello').patchValue(dat05);

//         console.log(this.tipcara);
//         const dat06 = this.formUtils.findComboValue(this.tipcara, tmpForm.mediafiliacion.registro.tipcara, 'nom', 'nom');
//         console.log(dat06);
//         this.cnspForm.get('mediafiliacion').get('registro').get('tipcara').patchValue(dat06);

//         console.log(this.altfrente);
//         const dat07 = this.formUtils.findComboValue(this.altfrente, tmpForm.mediafiliacion.registro.altfrente, 'nom', 'nom');
//         console.log(dat07);
//         this.cnspForm.get('mediafiliacion').get('registro').get('altfrente').patchValue(dat07);

//         console.log(this.ancfrente);
//         const dat08 = this.formUtils.findComboValue(this.ancfrente, tmpForm.mediafiliacion.registro.ancfrente, 'nom', 'nom');
//         console.log(dat08);
//         this.cnspForm.get('mediafiliacion').get('registro').get('ancfrente').patchValue(dat08);

//         console.log(this.colojos);
//         const dat09 = this.formUtils.findComboValue(this.colojos, tmpForm.mediafiliacion.registro.colojos, 'nom', 'nom');
//         console.log(dat09);
//         this.cnspForm.get('mediafiliacion').get('registro').get('colojos').patchValue(dat09);

//         console.log(this.formojos);
//         const dat10 = this.formUtils.findComboValue(this.formojos, tmpForm.mediafiliacion.registro.formojos, 'nom', 'nom');
//         console.log(dat10);
//         this.cnspForm.get('mediafiliacion').get('registro').get('formojos').patchValue(dat10);

//         console.log(this.tamojos);
//         const dat11 = this.formUtils.findComboValue(this.tamojos, tmpForm.mediafiliacion.registro.tamojos, 'nom', 'nom');
//         console.log(dat11);
//         this.cnspForm.get('mediafiliacion').get('registro').get('tamojos').patchValue(dat11);

//         console.log(this.fornariz);
//         const dat12 = this.formUtils.findComboValue(this.fornariz, tmpForm.mediafiliacion.registro.fornariz, 'nom', 'nom');
//         console.log(dat12);
//         this.cnspForm.get('mediafiliacion').get('registro').get('fornariz').patchValue(dat12);

//         console.log(this.tamnriz);
//         const dat13 = this.formUtils.findComboValue(this.tamnriz, tmpForm.mediafiliacion.registro.tamnriz, 'nom', 'nom');
//         console.log(dat13);
//         this.cnspForm.get('mediafiliacion').get('registro').get('tamnriz').patchValue(dat13);

//         console.log(this.forlabios);
//         const dat14 = this.formUtils.findComboValue(this.forlabios, tmpForm.mediafiliacion.registro.forlabios, 'nom', 'nom');
//         console.log(dat14);
//         this.cnspForm.get('mediafiliacion').get('registro').get('forlabios').patchValue(dat14);

//         console.log(this.tamlabios);
//         const dat15 = this.formUtils.findComboValue(this.tamlabios, tmpForm.mediafiliacion.registro.tamlabios, 'nom', 'nom');
//         console.log(dat15);
//         this.cnspForm.get('mediafiliacion').get('registro').get('tamlabios').patchValue(dat15);

//         console.log(this.menton);
//         const dat16 = this.formUtils.findComboValue(this.menton, tmpForm.mediafiliacion.registro.menton, 'nom', 'nom');
//         console.log(dat16);
//         this.cnspForm.get('mediafiliacion').get('registro').get('menton').patchValue(dat16);

//         console.log(this.formenton);
//         const dat17 = this.formUtils.findComboValue(this.formenton, tmpForm.mediafiliacion.registro.formenton, 'nom', 'nom');
//         console.log(dat17);
//         this.cnspForm.get('mediafiliacion').get('registro').get('formenton').patchValue(dat17);

//         console.log(this.inclinacion);
//         const dat18 = this.formUtils.findComboValue(this.inclinacion, tmpForm.mediafiliacion.registro.inclinacion, 'nom', 'nom');
//         console.log(dat18);
//         this.cnspForm.get('mediafiliacion').get('registro').get('inclinacion').patchValue(dat18);

//         console.log(this.formorejas);
//         const dat19 = this.formUtils.findComboValue(this.formorejas, tmpForm.mediafiliacion.registro.formorejas, 'nom', 'nom');
//         console.log(dat19);
//         this.cnspForm.get('mediafiliacion').get('registro').get('formorejas').patchValue(dat19);

//         console.log(this.tamorejas);
//         const dat20 = this.formUtils.findComboValue(this.tamorejas, tmpForm.mediafiliacion.registro.tamorejas, 'nom', 'nom');
//         console.log(dat20);
//         this.cnspForm.get('mediafiliacion').get('registro').get('tamorejas').patchValue(dat20);

//         console.log(this.escolaridad);
//         const dat21 = this.formUtils.findComboValue(this.escolaridad, tmpForm.mediafiliacion.registro.escolaridad, 'nom', 'nom');
//         console.log(dat21);
//         this.cnspForm.get('mediafiliacion').get('registro').get('escolaridad').patchValue(dat21);

//         console.log(this.ocupacion);
//         const dat22 = this.formUtils.findComboValue(this.ocupacion, tmpForm.mediafiliacion.registro.ocupacion, 'nom', 'nom');
//         console.log(dat22);
//         this.cnspForm.get('mediafiliacion').get('registro').get('ocupacion').patchValue(dat22);

//         console.log(this.edocivil);
//         const dat23 = this.formUtils.findComboValue(this.edocivil, tmpForm.mediafiliacion.registro.edocivil, 'nom', 'nom');
//         console.log(dat23);
//         this.cnspForm.get('mediafiliacion').get('registro').get('edocivil').patchValue(dat23);

//         console.log(this.nacionalidad);
//         const dat24 = this.formUtils.findComboValue(this.nacionalidad, tmpForm.mediafiliacion.registro.datPer.nacionalidad, 'nom', 'nom');
//         console.log(dat24);
//         this.cnspForm.get('mediafiliacion').get('registro').get('datPer').get('nacionalidad').patchValue(dat24);

//         console.log(this.sexo);
//         const dat25 = this.formUtils.findComboValue(this.sexo, tmpForm.mediafiliacion.registro.datPer.sexo, 'nom', 'nom');
//         console.log(dat25);
//         this.cnspForm.get('mediafiliacion').get('registro').get('datPer').get('sexo').patchValue(dat25);

//         console.log(this.lugnacimiento);
//         const dat26 = this.formUtils.findComboValue(this.lugnacimiento, tmpForm.mediafiliacion.registro.lugnacimiento, 'nom', 'nom');
//         console.log(dat26);
//         this.cnspForm.get('mediafiliacion').get('registro').get('lugnacimiento').patchValue(dat26);

//       }
//       this.isSavingData = false;
//     }
//   }

//   // COMPONENT AND USER CONTROL FUNCTIONS =================================================
//   setForm(data) {
//     this.cnspForm.get('tevento').patchValue(data.tevento);
//     this.cnspForm.get('sexo').patchValue(data.sexo);
//     this.cnspForm.get('complexion').patchValue(data.complexion);
//     this.cnspForm.get('colpiel').patchValue(data.colpiel);
//     this.cnspForm.get('cancabello').patchValue(data.cancabello);
//     this.cnspForm.get('colcabello').patchValue(data.colcabello);
//     this.cnspForm.get('formcabello').patchValue(data.formcabello);
//     this.cnspForm.get('tipcara').patchValue(data.tipcara);
//     this.cnspForm.get('altfrente').patchValue(data.altfrente);
//     this.cnspForm.get('ancfrente').patchValue(data.ancfrente);
//     this.cnspForm.get('colojos').patchValue(data.colojos);
//     this.cnspForm.get('formojos').patchValue(data.formojos);
//     this.cnspForm.get('tamojos').patchValue(data.tamojos);
//     this.cnspForm.get('fornariz').patchValue(data.fornariz);
//     this.cnspForm.get('tamnriz').patchValue(data.tamnriz);
//     this.cnspForm.get('forlabios').patchValue(data.forlabios);
//     this.cnspForm.get('tamlabios').patchValue(data.tamlabios);
//     this.cnspForm.get('menton').patchValue(data.menton);
//     this.cnspForm.get('formenton').patchValue(data.formenton);
//     this.cnspForm.get('inclinacion').patchValue(data.inclinacion);
//     this.cnspForm.get('formorejas').patchValue(data.formorejas);
//     this.cnspForm.get('tamorejas').patchValue(data.tamorejas);
//     this.cnspForm.get('estatus').patchValue(data.estatus);
//     this.cnspForm.get('nacionalidad').patchValue(data.nacionalidad);
//     this.cnspForm.get('edocivil').patchValue(data.edocivil);
//     this.cnspForm.get('escolaridad').patchValue(data.escolaridad);
//     this.cnspForm.get('ocupacion').patchValue(data.ocupacion);
//     this.cnspForm.get('lugnacimiento').patchValue(data.lugnacimiento);


//     this.sexo.forEach((item) => {
//       // console.log(item);
//       if (data.sexo && item.cve === data.sexo.cve) {
//         this.cnspForm.get('sexo').patchValue(item);
//         return false;
//       }
//     });
//     this.complexion.forEach((item) => {
//       // console.log(item);
//       if (data.complexion && item.cve === data.complexion.cve) {
//         this.cnspForm.get('complexion').patchValue(item);
//         return false;
//       }
//     });
//     this.colpiel.forEach((item) => {
//       // console.log(item);
//       if (data.colpiel && item.cve === data.colpiel.cve) {
//         this.cnspForm.get('colpiel').patchValue(item);
//         return false;
//       }
//     });
//     this.cancabello.forEach((item) => {
//       // console.log(item);
//       if (data.cancabello && item.cve === data.cancabello.cve) {
//         this.cnspForm.get('cancabello').patchValue(item);
//         return false;
//       }
//     });
//     this.colcabello.forEach((item) => {
//       // console.log(item);
//       if (data.colcabello && item.cve === data.colcabello.cve) {
//         this.cnspForm.get('colcabello').patchValue(item);
//         return false;
//       }
//     });
//     this.formcabello.forEach((item) => {
//       // console.log(item);
//       if (data.formcabello && item.cve === data.formcabello.cve) {
//         this.cnspForm.get('formcabello').patchValue(item);
//         return false;
//       }
//     });
//     this.tipcara.forEach((item) => {
//       // console.log(item);
//       if (data.tipcara && item.cve === data.tipcara.cve) {
//         this.cnspForm.get('tipcara').patchValue(item);
//         return false;
//       }
//     });
//     this.altfrente.forEach((item) => {
//       // console.log(item);
//       if (data.altfrente && item.cve === data.altfrente.cve) {
//         this.cnspForm.get('altfrente').patchValue(item);
//         return false;
//       }
//     });
//     this.ancfrente.forEach((item) => {
//       // console.log(item);
//       if (data.ancfrente && item.cve === data.ancfrente.cve) {
//         this.cnspForm.get('ancfrente').patchValue(item);
//         return false;
//       }
//     });
//     this.colojos.forEach((item) => {
//       // console.log(item);
//       if (data.colojos && item.cve === data.colojos.cve) {
//         this.cnspForm.get('colojos').patchValue(item);
//         return false;
//       }
//     });
//     this.formojos.forEach((item) => {
//       // console.log(item);
//       if (data.formojos && item.cve === data.formojos.cve) {
//         this.cnspForm.get('formojos').patchValue(item);
//         return false;
//       }
//     });
//     this.tamojos.forEach((item) => {
//       // console.log(item);
//       if (data.tamojos && item.cve === data.tamojos.cve) {
//         this.cnspForm.get('tamojos').patchValue(item);
//         return false;
//       }
//     });
//     this.fornariz.forEach((item) => {
//       // console.log(item);
//       if (data.fornariz && item.cve === data.fornariz.cve) {
//         this.cnspForm.get('fornariz').patchValue(item);
//         return false;
//       }
//     });
//     this.tamnriz.forEach((item) => {
//       // console.log(item);
//       if (data.tamnriz && item.cve === data.tamnriz.cve) {
//         this.cnspForm.get('tamnriz').patchValue(item);
//         return false;
//       }
//     });
//     this.forlabios.forEach((item) => {
//       // console.log(item);
//       if (data.forlabios && item.cve === data.forlabios.cve) {
//         this.cnspForm.get('forlabios').patchValue(item);
//         return false;
//       }
//     });
//     this.tamlabios.forEach((item) => {
//       // console.log(item);
//       if (data.tamlabios && item.cve === data.tamlabios.cve) {
//         this.cnspForm.get('tamlabios').patchValue(item);
//         return false;
//       }
//     });
//     this.menton.forEach((item) => {
//       // console.log(item);
//       if (data.menton && item.cve === data.menton.cve) {
//         this.cnspForm.get('menton').patchValue(item);
//         return false;
//       }
//     });
//     this.formenton.forEach((item) => {
//       // console.log(item);
//       if (data.formenton && item.cve === data.formenton.cve) {
//         this.cnspForm.get('formenton').patchValue(item);
//         return false;
//       }
//     });
//     this.inclinacion.forEach((item) => {
//       // console.log(item);
//       if (data.inclinacion && item.cve === data.inclinacion.cve) {
//         this.cnspForm.get('inclinacion').patchValue(item);
//         return false;
//       }
//     });
//     this.formorejas.forEach((item) => {
//       // console.log(item);
//       if (data.formorejas && item.cve === data.formorejas.bid) {
//         this.cnspForm.get('formorejas').patchValue(item);
//         return false;
//       }
//     });
//     this.tamorejas.forEach((item) => {
//       // console.log(item);
//       if (data.tamorejas && item.cve === data.tamorejas.cve) {
//         this.cnspForm.get('tamorejas').patchValue(item);
//         return false;
//       }
//     });
//     this.nacionalidad.forEach((item) => {
//       // console.log(item);
//       if (data.nacionalidad && item.cve === data.nacionalidad.cve) {
//         this.cnspForm.get('nacionalidad').patchValue(item);
//         return false;
//       }
//     });
//     this.edocivil.forEach((item) => {
//       // console.log(item);
//       if (data.edocivil && item.cve === data.edocivil.cve) {
//         this.cnspForm.get('edocivil').patchValue(item);
//         return false;
//       }
//     });
//     this.escolaridad.forEach((item) => {
//       // console.log(item);
//       if (data.escolaridad && item.cve === data.escolaridad.cve) {
//         this.cnspForm.get('escolaridad').patchValue(item);
//         return false;
//       }
//     });
//     this.ocupacion.forEach((item) => {
//       // console.log(item);
//       if (data.ocupacion && item.cve === data.ocupacion.cve) {
//         this.cnspForm.get('ocupacion').patchValue(item);
//         return false;
//       }
//     });
//     this.lugnacimiento.forEach((item) => {
//       // console.log(item);
//       if (data.lugnacimiento && item.cve === data.lugnacimiento.cve) {
//         this.cnspForm.get('lugnacimiento').patchValue(item);
//         return false;
//       }
//     });
//     // this.entidad.forEach((item) => {
//     //   // console.log(item);
//     //   if (data.entidad && item.cve === data.entidad.cve) {
//     //     this.cnspForm.get('lugnacimiento').patchValue(item);
//     //     return false;
//     //   }
//     // });
//     // this.municipio.forEach((item) => {
//     //   // console.log(item);
//     //   if (data.municipio && item.cve === data.municipio.cve) {
//     //     this.cnspForm.get('municipio').patchValue(item);
//     //     return false;
//     //   }
//     // });
//     {
//       // se supone que es el evento de edicion
//     }

//     console.log(this.dactiloscopiaSrv);

//   }// setForm <<<<

//   async initWithServerData () {
//     // Obtener los catalogos
//     const getCatResp = await this.dactiloscopiaSrv.getCatalogs();
//     this.entidadesFederativas = getCatResp;
//   }

//   compareWithEntidadesFederativas(d1, d2) {
//     return (d1 && d2) ? d1.cve === d2.cve : false;
//   }

//   compareWithBid(d1, d2) {
//     return (d1 && d2) ? d1.bid === d2.bid : false;
//   }

//   compareWithId(d1, d2) {
//     return (d1 && d2) ? d1._id === d2._id : false;
//   }

//   onSelectionChangeEntidadFederativa($event) {
//     console.log($event);
//     this.municipio = $event.value.municipios;
//   }

// }