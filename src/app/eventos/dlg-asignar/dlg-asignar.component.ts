import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { StdGrid2Component } from '../../shared/std-grid2/std-grid2.component';
import { ValueGetterParams } from 'ag-grid-community';
import { IphadEvents, IphadService } from '../../primer-resp/iphad/iphad.service';
import { FormUtilsService } from '../../shared/form-utils.service';
import { SnackSrvService } from '../../services/snack-srv.service';
import { EventoEvents, EventoService } from '../evento.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-dlg-asignar',
  templateUrl: './dlg-asignar.component.html',
  styleUrls: ['./dlg-asignar.component.scss']
})
export class DlgAsignarComponent implements OnInit, OnDestroy, AfterViewInit {

  // FIELDS ====================================================================
  @ViewChild('gridPersonal', { static: false }) public gridPersonal: StdGrid2Component;
  grid1ColConfig = {
    edit: false,
    remove: false,
    filter: true
  };
  grid1SourceData = [];
  grid1ColDefs = [
    {
      headerName: 'Id',
      checkboxSelection: true,
      field: '', valueGetter: (args) => this._getIdValue(args),
      width: 70
    },
    { headerName: 'Usuario', field: 'correo', filter: true },
    { headerName: 'Terminal', field: 'terminal.nombres', filter: true },
    { headerName: 'Nombre', field: 'policia.datPer.nombre', filter: true },
    { headerName: 'Apellido Paterno', field: 'policia.datPer.appat' },
    { headerName: 'Apellido Materno', field: 'policia.datPer.apmat' },
    { headerName: 'Sexo', field: 'policia.datPer.sexo.nom' },
    {
      headerName: 'Fecha de Nacimiento', field: 'policia.datPer.fecnac', cellRenderer: (data) => {
        if (!_.isNil(data) && !_.isNil(data.value)) {
          const ret: string = moment(data.value).format('DD/MM/YYYY');
          return ret;
        } else {
          return '';
        }
      }
    }
  ];
  grid1EditRow($event) {
    console.log($event);

    // this.dlgDetenido($event.data);
  }
  asig;
  orgData = null;
  isSavingData = false;
  tipo: any;

  private subs: Subscription = new Subscription();

  _getIdValue(args: ValueGetterParams): any {
    return (Number(args.node.id)) + 1;
  }

  constructor(
    public dialogRef: MatDialogRef<DlgAsignarComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private iphadSrv: IphadService,
    private fus: FormUtilsService,
    private snackSrv: SnackSrvService,
    private evenSrv: EventoService,
    private service: LoginService
  ) {
    console.log(data);
    this.orgData = data.data;
    this.asig = data.asig;
    this.tipo = this.service.getUser().tipo.cve
    this.iphadSrv.getPersonal(this.tipo).then((data: any) => {

      this.gridPersonal.setDataSource(data);

      setTimeout( ()=> {
        this.gridPersonal.selectRows(this.asig);
      }, 1000);
    });
  }

  ngOnInit() {
    // this.route.params.subscribe(routeParams => {
    //   this.id = routeParams['id'];
    // })

    // if (this.id != '0') {
    //   this.eventoSrv.getEventoById(this.id).then(response => {
    //     if(response) {
    //       this.evento._id = response[0]._id;
    //       this.evento.reporta = response[0].reporta;
    //       this.evento.atiende = response[0].atiende;
    //       this.evento.coordinadora = response[0].coordinadora;
    //       this.evento.incidente = response[0].incidente;
    //       this.evento.torre = response[0].torre;
    //       this.evento.texto = response[0].texto;
    //       this.evento.fecha = response[0].fecha;
    //       this.evento.folio911 = response[0].folio911;
    //       this.evento.folioInterno = response[0].folioInterno;
    //       this.evento.tincidente = response[0].tincidente;
    //       this.evento.stincidente = response[0].stincidente;
    //       this.evento.numCons = response[0].numCons;
    //       this.evento.estatus = response[0].estatus;
    //       this.evento.ultimaActualizacion = response[0].ultimaActualizacion;
    //       this.evento.fechaAsignacion = response[0].fechaAsignacion;
    //       this.evento.asignacionPrimResp = response[0].asignacionPrimResp;
    //       this.evento.strFecha = response[0].strFecha;
    //       this.evento.nincidente = response[0].nincidente;
    //       this.evento.denunciante = response[0].denunciante;
    //       this.evento.ubicacionEvento.entidad = response[0].ubicacionEvento.entidad;
    //       this.evento.ubicacionEvento.municipio = response[0].ubicacionEvento.municipio;
    //       this.evento.ubicacionEvento.lat = response[0].ubicacionEvento.lat;
    //       this.evento.ubicacionEvento.long = response[0].ubicacionEvento.long;
    //       this.evento.ubicacionEvento.cp = response[0].ubicacionEvento.cp;
    //       this.evento.ubicacionEvento.colonia = response[0].ubicacionEvento.colonia;
    //       this.evento.ubicacionEvento.calle = response[0].ubicacionEvento.calle;
    //       this.evento.ubicacionEvento.numero = response[0].ubicacionEvento.numero;
    //       this.evento.ubicacionEvento.numInt = response[0].ubicacionEvento.numInt;
    //       this.evento.ubicacionEvento.referencias = response[0].ubicacionEvento.referencias;
    //       this.evento.ubicacionEvento.entreCalle = response[0].ubicacionEvento.entreCalle;
    //       this.evento.ubicacionEvento.entreCalle2 = response[0].ubicacionEvento.entreCalle2;
    //       this.evento.tipo = response[0].tipo;
    //       this.evento.institucion = response[0].institucion;
    //       this.evento.sede = response[0].sede;
    //       this.evento.municip = response[0].municip;

    //       if(response[0].asignacionPrimResp.length > 0) {
    //         this.evento.asignacionPrimResp = response[0]._id;
    //         this.evento.asignacionPrimResp = response[0].asignacionPrimResp[0].correo;

    //         this.gridPersonal.setDataSource(this.evento);
    //       }

    //       console.log('Recuperadosss');
    //       console.log(response);
    //     }
    //   })

  }


  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
  }

  onAsignar() {
    this.attemptAsignar();
  }

  async attemptAsignar() {
    console.log('attemptAsignar');
    if (!this.isSavingData) {
      this.isSavingData = true;
      const lstSelPersonal = this.gridPersonal.gridApi.getSelectedRows();

      if (!this.fus.isNullAndEmpty(lstSelPersonal)) {
        console.log('lstSelPersonal');
        try {
          let resp = await this.evenSrv.upsertAsignarEven({
            _id: this.orgData._id,
            lstPersonal: lstSelPersonal
          });
          await this.evenSrv.sendNotifications({ idEvento: this.orgData._id });
          this.snackSrv.showMsg('Evento asignado correctamente');
        } catch (e) {
          console.log(e);
          this.isSavingData = false;
        } finally {
          this.isSavingData = false;
        }

      } else {
        this.isSavingData = false;
        this.snackSrv.showMsg('Para asignar el evento, tienen que elegir por lo menos un elemento');
      }
    }
  }

  setData(data) {
    this.gridPersonal.setDataSource(data.data);
  }

}
