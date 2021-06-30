import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {IphadService} from '../iphad.service';
import {StdGridComponent} from '../../../shared/std-grid/std-grid.component';
import {DireccionFormComponent} from '../direccion-form/direccion-form.component';
import {TimeInputComponent} from '../../../shared/time-input/time-input.component';
import {StdGrid2Component} from '../../../shared/std-grid2/std-grid2.component';
import {MatDialog} from '@angular/material';
import {DlgDetenidoComponent} from '../dlg-detenido/dlg-detenido.component';
import {DlgPrPrimerrespComponent} from '../dlg-pr-primerresp/dlg-pr-primerresp.component';
import * as _ from 'lodash';
import {FormUtilsService} from '../../../shared/form-utils.service';


@Component({
  selector: 'app-dentencion-form',
  templateUrl: './dentencion-form.component.html',
  styleUrls: ['./dentencion-form.component.scss']
})
export class DentencionFormComponent implements OnInit, AfterViewInit {

  nacionalidad = [{
    cve: 1,
    nom: 'MEXICANA'
  }, {
    cve: 2,
    nom: 'EXTRANJERA'
  }];

  sexos = [{
    cve: 1,
    nom: 'MUJER'
  }, {
    cve: 2,
    nom: 'HOMBRE'
  }];

  // =============================================================
  // FIELDS ======================================================
  public hora;
  public minutos;
  localId;
  primresp = [];

  // FORM DATA ========================================================
  form = this.fb.group({
    descripcion: [''],
    lesVis: [{cve:'', nom:''}],
    tienePad: [{cve:'', nom:''}],
    padecimiento: [''],
    esGpoVul: [{cve:'', nom:''}],
    grupoVulne: [''],
    esDelOrg: [{cve:'', nom:''}],
    fechaDetencion: [''],

    datPer: this.fb.group({
      nombre: [''],
      appat: [''],
      apmat: [''],
      sexo: [''],
      fecnac: [''],
      nacionalidad: [''],
      alias: [''],
    }),

    domicilio: this.fb.group({
      entidad: [{value: ''}],
      municipio: [{value: ''}],
      cp: [{value: ''}],
      colonia: [{value: ''}],
      calle: [{value: ''}],
      numero: [{value: ''}],
      numInt: [{value: ''}],
      referencias: [{value: ''}],
      entreCalle: [{value: ''}],
      entreCalle2: [{value: ''}],
      lat: [{value: ''}],
      long: [{value: ''}],
    }),
  });

  // GRID DE DETENIDOS ==============================================
  @ViewChild('gridPrimerResp', {static: false}) public  gridPrimerResp: StdGrid2Component;
  grid1ColConfig = {
    edit: false,
    remove: true
  };
  grid1SourceData = [];
  grid1ColDefs = [
    {headerName: 'Nombre', field: 'datPer.nombre'},
    {headerName: 'Apellido Pat.', field: 'datPer.appat'},
    {headerName: 'Apellido Pat.', field: 'datPer.apmat'},
    {headerName: 'Grado', field: 'grado.nom'},
  ];
  grid1EditRow($event) {
    console.log($event);
    // this.dlgDetenido($event.data);
  }
  grid1DeleteRow($event) {
    console.log($event);
    let resp = confirm('¿Desea eleminar el elemento?');
    if (resp) {
      _.remove(this.primresp, (item, index) => {
        return this.comparePrimRespId(item, $event.data);
      });
      this.gridPrimerResp.setDataSource(this.primresp);
    }
  }

  // COMPONENT FUNCTIONS ======================================================
  @ViewChild('domicilio', {static: false}) public  domicilio: DireccionFormComponent;
  @ViewChild('timeInput', {static: false}) public  timeInput: TimeInputComponent;
  constructor(
    private fb: FormBuilder,
    private iphadSrv: IphadService,
    public dialog: MatDialog,
    private formUtils: FormUtilsService,
  ) { }

  ngOnInit() {
    this.localId = this.iphadSrv.getNewId();

  }

  ngAfterViewInit(): void {
    setTimeout( () => {
      if (this.primresp) {
        this.gridPrimerResp.setDataSource(this.primresp);
      }
    }, 500);
  }


  onShowDlgPrimerResp($event) {
    const dialogRef = this.dialog.open(DlgPrPrimerrespComponent, {
      panelClass: 'custom-dlg-panel',
      disableClose: true,
      data: null,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('onShowDlgPrimerResp.afterClosed() =========================');
      console.log(this.primresp);
      console.log(result);

      let newList = _.unionBy(this.primresp, result, 'localId');
      console.log(newList);

      this.primresp = newList;
      this.gridPrimerResp.setDataSource(this.primresp);

      console.log('The dialog was closed');
    });
  }

  comparePrimRespId(item1, item2) {
    const id01 = (item1._id) ? item1._id : item1.localId;
    const id02 = (item2._id) ? item2._id : item2.localId;

    if (id01 === id02) {
      return true;
    } else {
      return false;
    }
  }

  setCatalogValues() {
    console.log("setCatalogValues ==============================");
    const formData = this.form.getRawValue();
    console.log(formData);

    //catalogo
    let par02 = formData.datPer.sexo;
    let tmp01 = this.formUtils.findComboValue(this.sexos, par02, 'cve', 'cve' );
    this.form.get('datPer').get('sexo').patchValue(tmp01);
    console.log(tmp01);

    par02 = formData.datPer.nacionalidad;
    tmp01 = this.formUtils.findComboValue(this.nacionalidad, par02, 'cve', 'cve' );
    this.form.get('datPer').get('nacionalidad').patchValue(tmp01);
    console.log(tmp01);
  }

  setLocalIdPrimerResp() {
    if (this.primresp) {
      if (this.primresp.length > 0) {
        for (let item of this.primresp) {
          if (item._id) {
            item.localId = item._id;
          }
        }
      }
    }
  }// end setLocalIdPrimerResp

}
