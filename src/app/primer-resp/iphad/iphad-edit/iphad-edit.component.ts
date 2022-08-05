import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActionBarItemModel, barActions} from '../../../shared/action-bar2/action-bar-model';
import {ActionBar2Component} from '../../../shared/action-bar2/action-bar2.component';
import {VehiculosEvents} from '../../../corporacion/vehiculos/vehiculos.service';
import {IphadEvents, IphadService} from '../iphad.service';
import {Subscription} from 'rxjs';
import {EventoFormComponent} from '../evento-form/evento-form.component';
import * as _ from 'lodash';
import {IphadmFormComponent} from '../iphadm-form/iphadm-form.component';
import {SnackSrvService} from '../../../services/snack-srv.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {FormUtilsService} from '../../../shared/form-utils.service';
import {IphadPuestaComponent} from '../iphad-puesta/iphad-puesta.component';

@Component({
  selector: 'app-iphad-edit',
  templateUrl: './iphad-edit.component.html',
  styleUrls: ['./iphad-edit.component.scss']
})
export class IphadEditComponent implements OnInit, AfterViewInit {
  // Action Bar Events ====================================================================
  titlesList = ['IPH Justicia Cívica', 'Consulta'];
  // showActionList = [9, 4];
  showActionList = [4];
  entidad;

  onActionClicked(item: ActionBarItemModel) {
    if (item.id === barActions.report) {
      const folioInterno = this.preIphServerData.conocimiento.folioInterno;
      console.log(folioInterno);
      const urlReporte = this.iphadSrv.getURLReporteIpha(folioInterno);
      if (urlReporte) {
        window.open(urlReporte);
      } else {
        alert("Error al obtener el reporte");
      }

    }

    if (item.id === barActions.save) {
      this.attemptSave();
    }

    if (item.id === barActions.exit) {
      // this.exitComponent();
      this.router.navigate(['preiph-cons']);
    }

    if (item.id === barActions.send) {
      // if (!this.isSavingData) {
      //   // this.atttemptApprove();
      // }
    }
  }

  // PROPIEDADES =========================================================================
  private isNewDoc = true;
  private subs: Subscription = new Subscription();
  preIphServerData = null;
  idEvent = null;
  idPreIph = null;

  @ViewChild('actionBar2Comp', {static: false}) public  actionBar2: ActionBar2Component;
  @ViewChild('evento', {static: false}) public  evento: EventoFormComponent;
  @ViewChild('preiph', {static: false}) public  preiph: IphadmFormComponent;
  @ViewChild('puesta', {static: false}) public  puesta: IphadPuestaComponent;

  // CLASS CONG METHODS ==================================================================
  constructor(
    private iphadSrv: IphadService,
    private snackSrv: SnackSrvService,
    private route: ActivatedRoute,
    private router: Router,
    private fus:FormUtilsService
  ) {
    this.subs.add(
      this.iphadSrv.eventSource$.subscribe((data) => {
          this.dispatchEvents(data);
        }
      ));
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const tempProm = this.route.paramMap.subscribe( (params: ParamMap) => {
        console.log(params);
        this.idEvent = params.get('idEvent');
        this.idPreIph = params.get('idPreIph');

        if (this.idEvent && this.idEvent !== '0') {
          this.idPreIph = (!this.idPreIph) ? '0' : this.idPreIph;
          this.iphadSrv.getPreIphInitial(this.idEvent, this.idPreIph);
        } else {
          // TODO: Hacer redirect por que no se puede continuar sin id evento
        }

        this.initWithServerData(this.idPreIph);

      });
      // this.iphadSrv.getPreIphInitial('5dfd3f1519bf35582f940b00');
    }, 600);
  }


  async initWithServerData(idIPHA) {
    const iphaData = await this.iphadSrv.getIphaData(idIPHA);
    this.preIphServerData = iphaData;
    let eventoData = await this.iphadSrv.getEventoData(iphaData.idEvento);
    if (eventoData != null) {
      eventoData = eventoData[0];
    }
    console.log("= = = = = = = = = = = = = = = = = = ==");
    console.log(iphaData);
    console.log(eventoData);

    // Establecer datos en el formulario
    this.evento.form.patchValue(eventoData);
    this.preiph.setIPHADataFromServer(iphaData);
    this.puesta.setDataFromServer(iphaData);
  }

  // SERVICE EVENTS =======================================================================
  dispatchEvents(data) {
    if (data.event === IphadEvents.GetInitialData) {
      const tmpdat = data.data;
      const tmpPreIphSrvData = (tmpdat.preIph && tmpdat.preIph[0]) ? tmpdat.preIph[0] : null;
      const tmpEventoSrvData = (tmpdat.evento && tmpdat.evento[0]) ? tmpdat.evento[0] : null;
      console.log(tmpdat);
      this.preIphServerData = tmpPreIphSrvData;



      // Poner datos al evento
      if (tmpEventoSrvData) {
        this.evento.form.patchValue(tmpEventoSrvData);
        this.evento.timeInput.setByDateTimeObj(
          this.fus.getDateAndTimeObj(tmpEventoSrvData.fecha)
        );
        this.evento.timeInput.disableAll();
      }

      // Poner datos al pre iph
      // this.preiph.setDataFromServer(tmpPreIphSrvData, tmpEventoSrvData);

      // Si es nuevo documento
      // if (this.isNewDoc) {
      //   this.setDataForNewDoc(tmpdat.evento[0]);
      // }
      return;
    }//endIf

    if (data.event === IphadEvents.UpsertDone) {
      const srvData = data.data;
      this.idPreIph = srvData._id;
      this.snackSrv.showMsg('Guardado exitosamente');
      return;
    }//endIf

  }//end dispatchEvenst

  // DATA METHODS ==========================================================================
  // setDataForNewDoc(tmpdat) {
  //   const eventoData = this.evento.form.getRawValue();
  //   if (!_.isNil(eventoData._id)) {
  //     // Si es llamda de emergencia
  //     this.preiph.form.get('lugarInter').patchValue(eventoData.ubicacionEvento);
  //     this.preiph.form.get('conocimiento').get('cveEmer911').patchValue(eventoData._id);
  //     this.preiph.setTipoConocimiento(1); // Establecer que es una llamada de emergencia
  //   }
  // }//end setDataForNewDoc

  attemptSave() {
    console.log('INICIO: attemptSave');
    const tmpData = this.preiph.getPreparedData();
    if (this.idPreIph && this.idPreIph !== '0') {
      tmpData._id = this.idPreIph;
    }
    if (this.idEvent) {
      tmpData.idEvento = this.idEvent;
    }

    try {
      const data = this.puesta.form.getRawValue();
      tmpData.puesta = data;
    } catch (e) {
      console.log(e);
    }

    console.log(tmpData);
    this.iphadSrv.upsePreIph(tmpData);
    console.log('FIN: attemptSave');
  }
}
