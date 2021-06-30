import {AfterContentInit, AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DentencionFormComponent} from '../dentencion-form/dentencion-form.component';
import * as moment from 'moment'
import * as _ from 'lodash';
import {FormUtilsService} from '../../../shared/form-utils.service';
import {IphadEvents, IphadService} from '../iphad.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-dlg-detenido',
  templateUrl: './dlg-detenido.component.html',
  styleUrls: ['./dlg-detenido.component.scss']
})
export class DlgDetenidoComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {

  // FIELDS ====================================================================
  @ViewChild('detencion', {static: false}) public detencion: DentencionFormComponent;
  data;
  private subs: Subscription = new Subscription();
  paramDetenidoData;

  // COMPONENTS ================================================================
  constructor(
    private iphadSrv: IphadService,
    private formUtils: FormUtilsService,
    public dialogRef: MatDialogRef<DlgDetenidoComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.data = data;
    this.subs.add(
      this.iphadSrv.eventSource$.subscribe((data) => {
          this.dispatchEvents(data);
        }
      ));
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  ngOnInit() {
    console.log('ON INIT');
    console.log(this.detencion);
  }

  ngAfterContentInit(): void {
    console.log('AFTER CONTENT INIT');
    console.log(this.detencion);
  }

  ngAfterViewInit(): void {
    console.log('AFTER VIEW INIT');
    console.log(this.detencion);
    console.log(this.data);

    setTimeout(() => {
      // this.setData(this.data);
      this.initDetenidoData(this.data);
    },600);
  }

  // DATA METHODS ==================================================================
  onAgregar() {
    console.log('OnAgregar');
    const tmpData = this.getPreparedData();
    console.log(tmpData);
    if (!_.isNil(tmpData)) {
      this.dialogRef.close(tmpData);
    }
  }

  getPreparedData() {
    let retVal = null;
    const tmpDetencion = this.detencion.form.getRawValue();
    const tmpDomicilio = this.detencion.domicilio.form.getRawValue();
    tmpDetencion.domicilio = tmpDomicilio;
    tmpDetencion.localId = (this.data.detenido && this.data.detenido._id) ? this.data.detenido._id : this.detencion.localId;
    const fechaObj = this.detencion.timeInput.getData();
    fechaObj.fecha = tmpDetencion.fechaDetencion;
    tmpDetencion.fechaDetencion = this.formUtils.getDateFromDateTime(fechaObj);

    retVal = {
      serverLoaded: (this.paramDetenidoData && this.paramDetenidoData.serverLoaded) ? this.paramDetenidoData.serverLoaded : false,
      intervencion: tmpDetencion,
      localId: this.paramDetenidoData.localId,
      primresp: this.detencion.primresp
    };

    if (this.data.detenido && this.data.detenido._id) {
      retVal._id = this.data.detenido._id;
    }

    return retVal;
  }

  initDetenidoData(detData) {
    // tmpDet.serverLoaded
    let tmpDet = _.get(detData, 'detenido', null);
    if (!_.isNil(tmpDet)) {
      if (_.get(tmpDet, 'serverLoaded', false)) {
        // Datos ya son del servidor
        this.setDetenidoData(tmpDet);
      } else {
        tmpDet.serverLoaded = false;
        // si tiene id, buscar en el sevidor
        if (!_.isNil(_.get(tmpDet, '_id', null))) {
          this.iphadSrv.getDetenidoDataById(tmpDet._id);
        } else {
          this.setDetenidoData(tmpDet);
        }
      }
      this.paramDetenidoData = tmpDet;
    } else {
      // nuevo!!
      // this.setDetenidoData(null);
      this.setFecha(this.formUtils.getDateAndTimeObj(new Date()));
      this.paramDetenidoData = {
        localId: this.formUtils.getNewId()
      };
    }
  }

  // setData(detData) {
  //   if (detData) {
  //     if (detData.detenido) {
  //       const tmpDet = detData.detenido;
  //
  //       if (tmpDet._id) {
  //         // Obtener datos completos del servidor
  //
  //       } else {
  //
  //       }
  //
  //       this.detencion.form.patchValue(detData.detenido.intervencion);
  //       this.detencion.domicilio.form.patchValue(detData.detenido.intervencion.domicilio);
  //       this.detencion.localId = (this.data.detenido && this.data.detenido._id) ? this.data.detenido._id : this.detencion.localId;
  //       this.setFecha(this.formUtils.getDateAndTimeObj(detData.detenido.intervencion.fechaDetencion));
  //       this.detencion.timeInput.setNewData();
  //       this.detencion.primresp = detData.detenido.primresp;
  //       this.detencion.gridPrimerResp.setDataSource(this.detencion.primresp);
  //       this.detencion.setCatalogValues();
  //       this.detencion.setLocalIdPrimerResp();
  //     } else {
  //       this.setFecha(detData.fecha);
  //     }
  //   }
  // }// end setData;

  setDetenidoData(tmpDet) {
    if (!_.isNil(tmpDet)) {
      this.detencion.form.patchValue(tmpDet.intervencion);
      this.detencion.domicilio.form.patchValue(tmpDet.intervencion.domicilio);
      this.setFecha(this.formUtils.getDateAndTimeObj(tmpDet.intervencion.fechaDetencion));
      this.detencion.timeInput.setNewData();
      this.detencion.primresp = tmpDet.primresp;
      this.detencion.gridPrimerResp.setDataSource(this.detencion.primresp);
      this.detencion.setCatalogValues();
      this.detencion.setLocalIdPrimerResp();
      this.paramDetenidoData = tmpDet;
    }
    // else {
    //   this.setFecha(this.formUtils.getDateAndTimeObj(new Date()));
    // }
    // tmpDet = (_.isNil(tmpDet)) ? {} : tmpDet;
    // tmpDet.localId = _.get(tmpDet, 'localId', this.formUtils.getNewId());
    // this.paramDetenidoData = tmpDet;
  }

  setFecha(fecha) {
    this.detencion.hora =  fecha.hora;
    this.detencion.minutos = fecha.minutos;
    this.detencion.form.get('fechaDetencion').patchValue(moment(fecha.fecha, 'DD/MM/YYYY'));
  }// end setFecha

  // SERVICE EVENTS =======================================================================
  dispatchEvents(data) {
    if (data.event === IphadEvents.GetDetenidoDato) {
      console.log('GetDetenidoDato =======');
      console.log(data);
      const tmpDat = data.data[0];
      tmpDat.serverLoaded = true;
      // this.paramDetenidoData = tmpDat;
      this.setDetenidoData(tmpDat);
    }//endIf
  }//end dispatchEvenst
}
