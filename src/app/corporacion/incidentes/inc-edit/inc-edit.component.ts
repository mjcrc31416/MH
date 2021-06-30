import { Component, OnInit } from '@angular/core';
import {SnackSrvService} from '../../../services/snack-srv.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {IncidenteEvents, IncService} from '../inc.service';
import {ActionBarItemModel, barActions} from '../../../shared/action-bar2/action-bar-model';
import * as _ from 'lodash';

@Component({
  selector: 'app-inc-edit',
  templateUrl: './inc-edit.component.html',
  styleUrls: ['./inc-edit.component.scss']
})
export class IncEditComponent implements OnInit {
  // Action Bar Events ====================================================================
  orgData = null;
  isSavingData = false;
  titlesList = ['Incidentes', 'Edición'];
  showActionList = [1, 4];

  onActionClicked(item: ActionBarItemModel) {
    if (item.id === barActions.save) {
      this.attemptSave();
    }

    if (item.id === barActions.exit) {
      this.router.navigate(['incidente-cons']);
    }

    if (item.id === barActions.send) {
      if (!this.isSavingData) {
        // this.atttemptApprove();
      }
    }
  }

  // FORMULARIO ======================================================================
  form = this.fb.group({
    incidente: ['', Validators.required],
    cve: ['', Validators.required],
    nomCort: ['', Validators.required],
    descripcion: ['', Validators.required],
  });


  private subs: Subscription = new Subscription();

  constructor(
    private snackSrv: SnackSrvService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private incSrv: IncService
  ) {
    this.subs.add(
      this.incSrv.eventSource$.subscribe((data) => {
          this.dispatchEvents(data);
        }
      ));
  }

  ngOnInit() {
    const tempProm = this.route.paramMap.subscribe( (params: ParamMap) => {
      console.log(params);
      const id = params.get('id');

      if (id && id !== '0') {
        this.incSrv.getById(id);
      } else {
        // Es un nuevo elemento de captura
        // this.ctrlSrv.newEvent();
        // this.newItemDefaults();
      }
    });
  }

  attemptSave() {
    console.log('attemptSave');
    if (!this.isSavingData) {
      if (this.form.valid) {
        this.isSavingData = true;

        try {
          console.log('Is valid!');
          const data = this.form.getRawValue();
          console.log(data);

          if (!_.isNil(this.orgData) && !_.isNil(this.orgData._id)) {
            data._id = this.orgData._id;
          }
          this.incSrv.upsertIncidente(data);
        } catch (e) {
          this.isSavingData = false;
        }

      } else {
        this.snackSrv.showMsg('Faltan campos obligatorios');
      }
    }//endIf
  }

  // SERVICE EVENTS =======================================================================
  dispatchEvents(data) {
    console.log('dispatchEvents');
    // Evento
    if (data.event === IncidenteEvents.Upsert) {
      this.isSavingData = false;
      this.orgData = data.data;
      console.log(data);
    }//endIf

    if (data.event === IncidenteEvents.GetById) {
      console.log(data);
      this.orgData = data.data[0];
      this.form.patchValue(this.orgData);
      console.log(data);
    }//endIf
  }
}
