import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {StdGrid2Component} from '../../../shared/std-grid2/std-grid2.component';
import {MatDialog} from '@angular/material';
import {DlgDetenidoComponent} from '../dlg-detenido/dlg-detenido.component';
import {DlgPrVehiculoComponent} from '../dlg-pr-vehiculo/dlg-pr-vehiculo.component';
import {DlgPrPrimerrespComponent} from '../dlg-pr-primerresp/dlg-pr-primerresp.component';
import {FormBuilder} from '@angular/forms';
import {GmdirComponent} from '../../../shared/gmdir/gmdir.component';
import {Subscription} from 'rxjs';
import {IphadEvents, IphadService} from '../iphad.service';
import * as moment from 'moment';
import {FormUtilsService} from '../../../shared/form-utils.service';
import {TimeInputComponent} from '../../../shared/time-input/time-input.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-iphadm-form',
  templateUrl: './iphadm-form.component.html',
  styleUrls: ['./iphadm-form.component.scss']
})
export class IphadmFormComponent implements OnInit, OnDestroy {
  entidad;
  entidadesFederativas = [];

  // GRID DE DETENIDOS ==============================================
  @ViewChild('gridDetenidos', {static: false}) public  gridDetenidos: StdGrid2Component;
  @ViewChild('timeInput', {static: false}) public  timeInput: TimeInputComponent;
  @ViewChild('grid2', {static: false}) public  grid2: StdGrid2Component;

  grid1ColConfig = {
    edit: true,
    remove: true
  };
  grid1SourceData = [];
  grid1ColDefs = [
    {headerName: 'Nombre', field: 'intervencion.datPer.nombre'},
    {headerName: 'Ap. Paterno', field: 'intervencion.datPer.appat'},
    {headerName: 'Ap. Materno', field: 'intervencion.datPer.apmat'},
    {headerName: 'Sexo', field: 'intervencion.datPer.sexo.nom'},
    {headerName: 'Nacionalidad', field: 'intervencion.datPer.nacionalidad.nom'},
  ];
  grid1EditRow($event) {
    console.log($event);
    this.dlgDetenido($event.data);
  }
  grid1RemoveRow($event) {
    console.log($event);
    const resp = confirm('¿Desea eleminar el elemento?');
    if (resp) {
      const tmpRemoved = _.remove(this.detenidos, (item, index) => {
        if (this.detenidoCompareId(item, $event.data)) {
          this.delDetenidos.push(item);
        }
        return this.detenidoCompareId(item, $event.data);
      });
      this.gridDetenidos.setDataSource(this.detenidos);
    }
  }


  grid2ColConfig = {
    edit: true,
    remove: true
  };
  grid2SourceData = [];
  grid2ColDefs = [
    {headerName: 'Placa', field: 'placa'},
    {headerName: 'Marca', field: 'marca.nom'},
    {headerName: 'Modelo', field: 'modelo'},
    {headerName: 'uso', field: 'uso.nom'},
  ];
  grid2EditRow($event) {
    console.log($event);
    // this.dlgDetenido($event.data);

    this.showDlgVehiculo($event.data);
  }
  grid2RemoveRow($event) {
    console.log($event);
    const resp = confirm('¿Desea eleminar el elemento?');
    if (resp) {
      const tmpRemoved = _.remove(this.lstVehis, (item, index) => {
        // if (this.detenidoCompareId(item, $event.data)) {
        //   this.delDetenidos.push(item);
        // }
        return this.detenidoCompareId(item, $event.data);
      });
      this.setGridVehiData(this.lstVehis);
    }
  }

  // FORM DATA ========================================================
  form = this.fb.group({
    conocimiento: this.fb.group({
      tipoConocimiento: this.fb.group({
        nom: [{value: '', disabled: true}]
      }),
      otro: [{value: '', disabled: true}],
      folio911: [{value: '', disabled: true}],
      folioInterno: [{value: '', disabled: true}],
      folioIph: [''],
    }),
    intervencion: this.fb.group({
      ubicacion: this.fb.group({
        entidad: this.fb.group({
          nomOf: [{value: '', disabled: true}],
        }),
        municipio: this.fb.group({
          nomOf: [{value: '', disabled: true}],
        }),
        cp: [{value: '', disabled: true}],
        colonia: [{value: '', disabled: true}],
        calle: [{value: '', disabled: true}],
        numero: [{value: '', disabled: true}],
        numInt: [{value: '', disabled: true}],
        referencias: [{value: '', disabled: true}],
        entreCalle: [{value: '', disabled: true}],
        entreCalle2: [{value: '', disabled: true}],
        lat: [{value: '', disabled: true}],
        long: [{value: '', disabled: true}],
        fecha: [{value: '', disabled: true}],
        hora: [{value: '', disabled: true}],
        minutos: [{value: '', disabled: true}],
      })
    }),
    narrativa: this.fb.group({
      narrativa: [{value: '', disabled: true}],
    }),
    detenidos: [{value: '', disabled: true}],
    vehiculos: [{value: '', disabled: true}],
  });
  detenidos = [];
  lstVehis = [];
  delDetenidos = [];
  delVehiculos = [];



  // DIALOG DETENIDOS ==============================================
  dlgDetenido(detData) {
    console.log('dlgDetenido ==============================================');
    console.log(detData);
    //const fechaData = this.iphadSrv.convertDateToDateAndTimeStr(this.eventoServerData.fecha);
    const fechaDate = this.form.get('lugarInter').get('fecha').value;
    let tmpFechaObj = this.timeInput.getData();
    tmpFechaObj.fecha = moment(fechaDate).format(this.formUtils.stdDateFormat);

    const dialogRef = this.dialog.open(DlgDetenidoComponent, {
      panelClass: 'custom-dlg-panel',
      disableClose: true,
      data: {
        fecha: tmpFechaObj,
        detenido: detData,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('dialogRef.afterClosed() =========================');

      if (result) {
        console.log(result);
        console.log(this.detenidos);

        this.detenidos = (_.isNil(this.detenidos)) ? [] : this.detenidos;

        if (this.detenidos.length === 0 ) {
          this.detenidos.push(result);
        } else {
          let index = 0;
          let inserted = false;
          for (const item of this.detenidos) {
            //if (item.localId === result.localId) {
            if (this.detenidoCompareId(item, result)) {
              this.detenidos.splice(index,1, result);
              inserted = true;
              break;
            }
            index++;
          }

          if (!inserted) {
            this.detenidos.push(result);
          }
        }

        this.gridDetenidos.setDataSource(this.detenidos);
      }
      console.log('The dialog was closed');
    });
  }

  showDlgVehiculo(parmData) {
    const dialogRef = this.dialog.open(DlgPrVehiculoComponent, {
      panelClass: 'custom-dlg-panel',
      disableClose: true,
      data: parmData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      let foundItem;
      if (result) {
        const tmpDat = result;
        let isFound = false;

        let lstNewVehi = [];
        _.each(this.lstVehis, (item) => {
          if (this.detenidoCompareId(item, tmpDat)) {
            lstNewVehi.push(tmpDat);
            isFound = true;
          } else {
            lstNewVehi.push(item);
          }

          return true;
        });
        console.log(foundItem);

        // if (isFound) {
        //   foundItem = tmpDat;
        // } else {
        //   this.lstVehis.push(tmpDat);
        // }
        if (!isFound) {
          lstNewVehi.push(tmpDat);
        }

        this.lstVehis = lstNewVehi;

        this.setGridVehiData(this.lstVehis);

      }
      console.log('The dialog was closed');
    });
  }

  showDlgPrimerResp() {
    const dialogRef = this.dialog.open(DlgPrPrimerrespComponent, {
      panelClass: 'custom-dlg-panel',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        const newFile = {
          nombre: result.file[0].name,
          tipo: result.file[0].type,
          fileSize: result.file[0].size,
          obj: result.file[0],
          etiquetas: result.tags,
          etiquetasList: result.tags,
          load: true, // Ocasiona que se cargue el archivo al servidor
          guid: result.guid,
          isActive: true,
          estdoc: false
        };

        // this.files.push(newFile);
        console.log('cargarDocumento - DLG response');
        console.log(newFile);
      }
      console.log('The dialog was closed');
    });
  }

  showDlgGMaps() {
    const formData = this.form.getRawValue();
    const dialogRef = this.dialog.open(GmdirComponent, {
      panelClass: 'custom-dlg-panel',
      disableClose: true,
      data: {lat: formData.lugarInter.lat, long: formData.lugarInter.long},
    });

    dialogRef.afterClosed().subscribe( result => {
      if (result) {
        // this.cnspForm.get('calle').patchValue( (result.calle) ? result.calle.long_name : '');
        // this.cnspForm.get('colonia').patchValue( (result.colonia) ? result.colonia.long_name : '');
        // this.cnspForm.get('municipioemer').patchValue( (result.municipio) ? result.municipio.long_name : '');
        // this.cnspForm.get('cp').patchValue( (result.codigoPostal) ? result.codigoPostal.long_name : '');
        // this.cnspForm.get('numext').patchValue( (result.numcalle) ? result.numcalle.long_name : '');
        // this.cnspForm.get('lat').patchValue( (result.lat) ? result.lat : '');
        // this.cnspForm.get('long').patchValue( (result.long) ? result.long : '');
        this.setNewDir(result);
      }
    });
  }

  // PROPIEDADES =========================================================================
  private subs: Subscription = new Subscription();
  eventoServerData = null;
  className = 'IphadmFormComponent';
  fecha;
  hora;
  minutos;
  preIphServerData = null;
  orgEventoData = null;
  orgPreIphSrvDat = null;

  dumbList = ['LLAMADA DE EMERGENCIA', 'FLAGRANCIA', 'QUEJA', 'OTRO'];
  conocimientoHechos = [{
    cve: 1,
    nom: 'LLAMADA DE EMERGENCIA'
  }, {
    cve: 2,
    nom: 'FLAGRANCIA'
  }, {
    cve: 3,
    nom: 'QUEJA'
  }, {
    cve: 4,
    nom: 'OTRO'
  }];

  // COMPONENT ================================================================
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private iphadSrv: IphadService,
    public formUtils: FormUtilsService,
  ) {
    // this.subs.add(
    //   this.iphadSrv.eventSource$.subscribe((data) => {
    //       this.dispatchEvents(data);
    //     }
    //   ));
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // EVENTOS BOTONES / ACCIONES ====================================
  onShowDlgDetenidos($event) {
    this.dlgDetenido(null);
  }
  onShowDlgVehiculo($event) {
    // this.showDlgVehiculo();
    this.showDlgVehiculo(null);
  }
  onTipoConChanged($event) {
    console.log('onTipoConChanged');
    console.log($event);
    const tipoCon = $event.value;
    console.log(tipoCon);

    if (tipoCon.cve === 4) {
      this.form.get('conocimiento').get('otro').enable();
    } else {
      this.form.get('conocimiento').get('otro').disable();
    }
  }

  // DATA METHODS ==========================================================================
  public setTipoConocimiento(cve) {
    for (const item of this.conocimientoHechos) {
      if (item.cve === cve) {
        this.form.get('conocimiento').get('tipoConocimiento').patchValue(item);
        console.log(item);
        break;
      }
    }// end for
  }

  public disableForEmergencia() {
    this.form.get('conocimiento').get('');
  }

  public setNewDir(result) {
    this.form.get('lugarInter').get('nomOf').patchValue( (result.entidad) ? result.entidad.long_name : '');
    this.form.get('lugarInter').get('calle').patchValue( (result.calle) ? result.calle.long_name : '');
    this.form.get('lugarInter').get('colonia').patchValue( (result.colonia) ? result.colonia.long_name : '');
    this.form.get('lugarInter').get('municipio').patchValue( (result.municipio) ? result.municipio.long_name : '');
    this.form.get('lugarInter').get('cp').patchValue( (result.codigoPostal) ? result.codigoPostal.long_name : '');
    this.form.get('lugarInter').get('numero').patchValue( (result.numcalle) ? result.numcalle.long_name : '');
    this.form.get('lugarInter').get('numInt').patchValue( '');
    this.form.get('lugarInter').get('lat').patchValue( (result.lat) ? result.lat : '');
    this.form.get('lugarInter').get('long').patchValue( (result.long) ? result.long : '');
  }

  getPreparedData() {
    console.log('getPreparedData ============================');

    const tmpPreIph = this.form.getRawValue();
    console.log(tmpPreIph);
    const tmpDateTime = this.timeInput.getData();
    console.log(tmpDateTime);

    tmpPreIph.detenidos = this.detenidos;
    tmpPreIph.lugarInter.fecha = this.formUtils.getDateFromDateTime({
      fecha: moment(tmpPreIph.lugarInter.fecha).format('DD/MM/YYYY'),
      hora: tmpDateTime.hora,
      minutos: tmpDateTime.minutos
    });
    tmpPreIph.delDetenidos = this.delDetenidos;
    tmpPreIph.vehiculos = this.lstVehis;

    tmpPreIph.idEvento = this.orgPreIphSrvDat.idEvento;

    // if (!_.isNil(this.orgPreIphSrvDat) && !_.isNil(this.orgPreIphSrvDat._id)) {
    //   tmpPreIph._id = this.orgPreIphSrvDat._id;
    // }

    if ( !_.isNil( _.get(this.orgPreIphSrvDat, '_id', null)  ) ) {
      tmpPreIph._id = this.orgPreIphSrvDat._id;
    }

    // if (!_.isNil()) {
    //
    // }

    console.log(tmpPreIph);
    return tmpPreIph;
  }

  public setIPHADataFromServer (iphaData) {
    this.form.patchValue(iphaData);
  }

  setDataFromServer(preIphSrvDat, eventoSrvDat) {
    console.log('setDataFromServer >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    this.orgEventoData = eventoSrvDat;
    this.orgPreIphSrvDat = preIphSrvDat;

    // Establecer información del servidor del preIph
    if (preIphSrvDat) {
      console.log(preIphSrvDat);
      this.form.patchValue(preIphSrvDat);
      this.detenidos = preIphSrvDat.detenidos;
      this.gridDetenidos.setDataSource(this.detenidos);

      const fechaObj = this.formUtils.getDateAndTimeObj(preIphSrvDat.lugarInter.fecha);
      this.hora = fechaObj.hora;
      this.minutos = fechaObj.minutos;
      this.timeInput.setNewData();
      this.form.get('lugarInter').get('fecha').patchValue(this.formUtils.getDateFromStdFormat(fechaObj.fecha));
      console.log(this.formUtils.getDateFromDateTime(fechaObj));

      this.setCatalogValues();

      this.lstVehis = preIphSrvDat.vehiculos;
      this.setGridVehiData(this.lstVehis);
    } else {
      if (!_.isNil(eventoSrvDat)) {
        const fechaObj = this.formUtils.getDateAndTimeObj(new Date());
        // PONER DATOS POR DEFECTO
        let tmp = {
          conocimiento: {
            folio911: eventoSrvDat.folio911,
            folioInterno: eventoSrvDat.folioInterno,
          },
          lugarInter: eventoSrvDat.ubicacionEvento
        };
        tmp.lugarInter.fecha = fechaObj.fechaObj;
        this.timeInput.setByDateTimeObj(fechaObj);
        this.form.patchValue(tmp);
        // this.form.get('lugarInter').patchValue(eventoSrvDat.ubicacionEvento);
        // this.form.get('conocimiento').get('folio911').patchValue(eventoSrvDat._id);
        this.setTipoConocimiento(1); // Establecer que es una llamada de emergencia
      }
    }

    if (_.isNil(this.orgPreIphSrvDat)) {
      this.orgPreIphSrvDat = {
        idEvento: this.orgEventoData._id
      };
    }
    console.log('setDataFromServer <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
  }

  setCatalogValues() {
    console.log("setCatalogValues ==============================");
    const formData = this.form.getRawValue();
    console.log(formData);

    //catalogo
    let par02 = formData.conocimiento.tipoConocimiento;
    let tmp01 = this.formUtils.findComboValue(this.conocimientoHechos, par02, 'cve', 'cve' );
    this.form.get('conocimiento').get('tipoConocimiento').patchValue(tmp01);
    console.log(tmp01);
  }

  detenidoCompareId(item1, item2) {
    if (!item1 || !item2) {
      return false;
    }
    const id01 = (item1._id) ? item1._id : item1.localId;
    const id02 = (item2._id) ? item2._id : item2.localId;

    if (id01 === id02) {
      return true;
    } else {
      return false;
    }
  }// end detenidoCompareId

  setGridVehiData(lstVehis) {
    this.grid2.setDataSource(lstVehis);
  }

  // SERVICE EVENTS =======================================================================
  dispatchEvents(data) {
    console.log(this.className + ' dispatchEvents : inicio');
    if (data.event === IphadEvents.GetInitialData) {

      console.log(data);
      if (data.data) {
        const response = data.data;
        console.log(response);
        console.log('response 1');

        this.form.patchValue(response);

        this.entidad = response.entidad;
        console.log(response.entidad);

        this.form.get('entidad').patchValue(response.entidad);

      }
      // const tmpdat = data.data;
      // this.eventoServerData = data.data.evento[0];
      //
      // const tmp01 = this.iphadSrv.convertDateToDateAndTimeStr(this.eventoServerData.fecha);
      // console.log(tmp01);
      // this.hora = tmp01.hora;
      // this.minutos = tmp01.minutos;
      // this.form.get('lugarInter').get('fecha').patchValue(moment(tmp01.fecha, 'DD/MM/YYYY'));
    }//endIf

    if (data.event === IphadEvents.UpsertDone) {
      let tmpData = null;
      if (!_.isNil(data.data)) {
        if (_.isArray(data.data)) {
          tmpData = data.data[0];
        } else {
          tmpData = data.data;
        }

        this.orgPreIphSrvDat = tmpData;
      }
    }//endIf



    console.log(this.className + ' dispatchEvents : fin');
  }//end dispatchEvenst
}
