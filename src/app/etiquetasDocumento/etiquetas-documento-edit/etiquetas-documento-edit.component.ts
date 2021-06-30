import { Component, OnInit, ViewChild } from '@angular/core';
import {ActionBarItemModel, barActions} from '../../shared/action-bar2/action-bar-model';
import {FormBuilder, Validators} from '@angular/forms';
import {SnackSrvService} from '../../services/snack-srv.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ActionBar2Component} from '../../shared/action-bar2/action-bar2.component';
import {EtiquetasDocumentoService, EtiquetasEvents} from '../etiquetas-documento.service';
import {switchMap} from 'rxjs/operators';
import {FormUtilsService} from '../../shared/form-utils.service';
import {TimeInputComponent} from '../../shared/time-input/time-input.component';
import { MatDialog } from '@angular/material';
import { EventoFactory } from 'src/app/modelFactories/evento-factory';
import * as _ from 'lodash';

@Component({
  selector: 'app-etiquetas-documento-edit',
  templateUrl: './etiquetas-documento-edit.component.html',
  styleUrls: ['./etiquetas-documento-edit.component.scss']
})
export class EtiquetasDocumentoEditComponent implements OnInit {


  orgData;
  SNACKBAR_STD_DURATION = 3500;
  _id;

  form = this.fb.group({
    nombre: ['', Validators.required],
  });

  constructor(
    private snackSrv: SnackSrvService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private etqSrv: EtiquetasDocumentoService,
    private eventoFct: EventoFactory,
    private formUtils: FormUtilsService,
  ) { 
    this.subs.add(
      this.etqSrv.eventSource$.subscribe((data) => {
        this.dispatchEvents(data);
        }
      ));
  }

  @ViewChild('actionBar2Comp', {static: false}) public  actionBar2: ActionBar2Component;
  @ViewChild('timeComp', {static: false}) public  timeComp: TimeInputComponent;
  private subs: Subscription = new Subscription();
  eventDocumentList = [];
  titlesList = ['Etiquetas', 'Edición'];
  showActionList = [1, 4];
  isSavingData = false;
  mostrarPanel = true;
  isEdit = false;

  ngOnInit() {
    const tempProm = this.route.paramMap.subscribe( (params: ParamMap) => {
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
    });
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  // Action Bar Events ====================================================================

  onActionClicked(item: ActionBarItemModel) {
    if (item.id === barActions.finish) {
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

  //ACTION BAR
  onExit() {
    this.router.navigate(['etiquetasdoc-cons']);
  }

  attemptSave() {
    console.log('attemptSave');
    if (!this.isSavingData) {
      if (this.form.valid) {
        console.log('Is valid!');
        const eventoData = this.form.getRawValue();
        console.log(eventoData);

        if (!_.isNil(this._id)) {
          eventoData._id = this._id;
        }

        // this.etqSrv.getById(eventoData);
        this.etqSrv.upsertEtiquetas(eventoData);
      } else {
        this.snackSrv.showMsg('Faltan campos obligatorios');
      }

      this.isSavingData = false;
    }//endIf
  }

  // SERVICE EVENTS =======================================================================
  dispatchEvents(data) {
    console.log('dispatchEvents');
    // Evento

    if (data.event === EtiquetasEvents.GetByIdDone) {
      console.log(data);
      if (data.data) {
        const response = data.data;
        console.log(response);

        this.form.patchValue(response);

        if (this._id) {
          this.etqSrv.getById(this._id);
        }
        
      }
      // this.form.patchValue(data.data);
      return;
    }//endIf

    if (data.event === EtiquetasEvents.UpsertEtiquetas) {
      console.log(data);
      try {
        console.log(data);
        if (data.data) {
          this._id = data.data._id;
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.isSavingData = false;
      }

      if (data.data) {
        this._id = data.data._id;
        this.snackSrv.showMsg('Información guardada correctamente');
      }

      this.isSavingData = false;
    }

  }


}
