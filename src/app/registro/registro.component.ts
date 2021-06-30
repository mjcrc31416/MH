import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { SnackSrvService } from '../services/snack-srv.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ActionBarItemModel, barActions } from '../shared/action-bar2/action-bar-model';
import { ConvertNumberService } from '../services/convert-number.service';
import { ActionBar2Component } from '../shared/action-bar2/action-bar2.component';
import * as _ from 'lodash';
import { RegistroEvents, RegistroService } from '../registro/registro.service';
import { GmdirComponent } from '../shared/gmdir/gmdir.component';
import { EventoFactory } from '../modelFactories/evento-factory';
import { FormUtilsService } from '../shared/form-utils.service';
import * as moment from 'moment';
import { replace } from 'lodash';
import { CELULAR } from './mock-celular';
import { CARTERA } from './mock-cartera';
import { RELOJ } from './mock-reloj';

const newLocal = new Date();
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit, OnDestroy {

  celular = CELULAR;
  cartera = CARTERA;
  reloj = RELOJ;

  // Atributos ======================================================================
  _id = null;
  cnspForm = this.fb.group({
    objetos: this.fb.group({
      registro: this.fb.group({
        folioInterno: [{ value: '', disabled: true },],
        datPer: this.fb.group({
          appat: [{ value: '', disabled: true }],
          apmat: [{ value: '', disabled: true }],
          nombre: [{ value: '', disabled: true }],
        }),
        domicilio: this.fb.group({
          calle: [{ value: '', disabled: true }],
          numero: [{ value: '', disabled: true }],
          numInt: [{ value: '', disabled: true }],
          colonia: [{ value: '', disabled: true }],
          cp: [{ value: '', disabled: true }],
          entidad: this.fb.group({
            nomOf: [{ value: '', disabled: true }],
          }),
          municipio: this.fb.group({
            nomOf: [{ value: '', disabled: true }],
          }),
        }),
        celular: [''],
        descel: [''],
        cartera: [''],
        descart: [''],
        reloj: [''],
        desreloj: [''],
        observaciones: [''],
      }),
    }),
  });

  // Constructor and Events ===============================================================
  constructor(
    private snackSrv: SnackSrvService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private convertNumSrv: ConvertNumberService,
    private registroSrv: RegistroService,
    private eventoFct: EventoFactory,
    private formUtils: FormUtilsService
  ) {
    console.log(this.cnspForm);
    this.subs.add(
      this.registroSrv.eventSource$.subscribe((data) => {
        this.dispatchEvents(data);
      }
      ));
  }

  @ViewChild('actionBar2Comp', { static: false }) public actionBar2: ActionBar2Component;
  private subs: Subscription = new Subscription();
  eventDocumentList = [];
  orgData = null;
  titlesList = ['Registro Objetos Personales', 'Edición'];
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
    this.router.navigate(['detregistro-cons']);
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
          this.registroSrv.getById(this._id);
        }
  
      });

    if (this._id) {
      this.registroSrv.getAllCatalog(this._id);
    }
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

    this.registroSrv.upsertRegistro(event);
    this._id = event._id;

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
      this.registroSrv.getById(eventoData);
      this.registroSrv.upsertRegistro(eventoData);
    } else {
      this.snackSrv.showMsg('Faltan campos obligatorios');
      this.isSavingData = false;
    }
  }

//   SERVICE EVENTS =======================================================================
  dispatchEvents(data) {
    console.log('dispatchEvents');
    //   Evento para el catáogo de Reportas

    if (data.event === RegistroEvents.DacCatalog) {
      console.log(data);
      if (data.data) {
        const response = data.data;
        console.log('dispatchEvents 1');
        console.log(response.detenido);
        console.log(response.preIph);
        console.log('dispatchEvents 2');
        //this.sexo = response[0].sexo;

        this.cnspForm.get('objetos').get('registro').patchValue(response.detenido.intervencion);
        this.cnspForm.get('objetos').get('registro').patchValue(response.preIph[0]);

        console.log(response.detenido);
        console.log(response.preIph);
        console.log('dispatchEvents 3');
      }
    }

    if (data.event === RegistroEvents.UpsertRegistro) {
        console.log(data);
        if (!_.isNil(data)) {
          this.snackSrv.showMsg('Información guardada correctamente!');
          this._id = data.data._id;
        }
  
        this.isSavingData = false;
      }

      if (data.event === RegistroEvents.GetByIdDone) {
        console.log('GetByIdDone');
  
        if (data.data) {
          const response = data.data;
          console.log(response);
  
          console.log('GetByIdDone 1');
  
          if (_.isNil(response.objetos)) {
            console.log('GetByIdDone 1.5');
            response.objetos = {
              registro: {
                folioInterno: response.folioInterno,
                appat: response.appat,
                apmat: response.apmat,
                nombre: response.nombre,
                calle: response.calle,
                numero: response.numero,
                numInt: response.numInt,
                colonia: response.colonia,
                cp: response.cp,
                entidad: response.entidad,
                municipio: response.municipio,
                celular: null,
                descel: null,
                cartera: null,
                descart: null,
                reloj: null,
                desreloj: null,
                observaciones: null,
              },
            }
          } 
  
          this.cnspForm.patchValue(response)
          console.log(response);
  
         console.log('GetByIdDone 2');
  
          // LLENADO DE LA INFO QUE ES CATALOGO
          let tmpForm = this.cnspForm.getRawValue();
  
          console.log(this.celular);
          const dat01 = this.formUtils.findComboValue(this.celular, tmpForm.objetos.registro.celular, 'nom', 'nom');
          console.log(dat01);
          this.cnspForm.get('objetos').get('registro').get('celular').patchValue(dat01);
  
          console.log(this.cartera);
          const dat02 = this.formUtils.findComboValue(this.cartera, tmpForm.objetos.registro.cartera, 'nom', 'nom');
          console.log(dat02);
          this.cnspForm.get('objetos').get('registro').get('cartera').patchValue(dat02);
  
          console.log(this.reloj);
          const dat03 = this.formUtils.findComboValue(this.reloj, tmpForm.objetos.registro.reloj, 'nom', 'nom');
          console.log(dat03);
          this.cnspForm.get('objetos').get('registro').get('reloj').patchValue(dat03);

        }
        this.isSavingData = false;
      }
  }

  // COMPONENT AND USER CONTROL FUNCTIONS =================================================
  setForm(data) {
    this.cnspForm.get('celular').patchValue(data.celular);
    this.cnspForm.get('cartera').patchValue(data.cartera);
    this.cnspForm.get('reloj').patchValue(data.reloj);

    this.celular.forEach((item) => {
      // console.log(item);
      if (data.celular && item.cve === data.celular.cve) {
        this.cnspForm.get('celular').patchValue(item);
        return false;
      }
    });
    this.cartera.forEach((item) => {
        // console.log(item);
        if (data.cartera && item.cve === data.cartera.cve) {
          this.cnspForm.get('cartera').patchValue(item);
          return false;
        }
      });
      this.reloj.forEach((item) => {
        // console.log(item);
        if (data.reloj && item.cve === data.reloj.cve) {
          this.cnspForm.get('reloj').patchValue(item);
          return false;
        }
      });
    {
      // se supone que es el evento de edicion
    }

  }// setForm <<<<


}