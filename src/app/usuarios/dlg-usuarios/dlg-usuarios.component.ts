import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { IntegranteService } from '../../services/integrante.service';
import { ValueGetterParams } from 'ag-grid-community/dist/lib/entities/colDef';
import * as moment from 'moment';
import * as _ from 'lodash';
import { LoginService } from '../../services/login.service';


@Component({
  selector: 'app-dlg-usuarios',
  templateUrl: './dlg-usuarios.component.html',
  styleUrls: ['./dlg-usuarios.component.scss']
})
export class DlgUsuariosComponent implements OnInit, AfterViewInit {
  data: any;
  form: any;
  tipo: any;

  constructor(
    public dialogRef: MatDialogRef<DlgUsuariosComponent>,
    private listaSrv: IntegranteService,
    private service: LoginService
  ) {

    this.tipo = this.service.getUser().tipo.cve
    console.log(this.tipo);
    this.listaSrv.getAlli(this.tipo).then( (data: any) => {
    this.rowData = data;
      console.log(data);
    });
    // this.listaSrv.getAlli().subscribe(
    //   (data: any) => {
    //     this.rowData = data;
    //   }
    // );
    dialogRef.disableClose = true;

  }


  public rowData: Array<any>;
  gridApi;

  defaultColDef = {
    sortable: true,
    filter: true,
    headerCheckboxSelection: isFirstColumn,
    checkboxSelection: isFirstColumn,
  };
  columnDefs = [
    {
      headerName: 'Id', checkboxSelection: true,
      field: '', valueGetter: (args) => this._getIdValue(args),
      width: 70
    },
    { headerName: 'Nombre', field: 'datPer.nombre', width: 200 },
    { headerName: 'Apellido Paterno', field: 'datPer.appat', width: 300 },
    { headerName: 'Apellido Materno', field: 'datPer.apmat', width: 300 },
    { headerName: 'sexo', field: 'datPer.sexo.sexo', width: 150 },
    { headerName: 'Fecha de Nacimiento', field: 'datPer.fecnac', cellRenderer: (data) => {
      if (!_.isNil(data) && !_.isNil(data.value)) {
        const ret: string = moment(data.value).format('DD/MM/YYYY');
        return ret;
      } else {
        return '';
      }
    }, width: 150 }
  ];

  ngOnInit() {

  }

  _getIdValue(args: ValueGetterParams): any {
    return (Number(args.node.id)) + 1;
  }

  ngAfterViewInit() {
  }



  onSelectedValues() {
    const arr = this.gridApi.getSelectedRows();
    if (arr.length > 0) {
      this.dialogRef.close(arr);
    } else {
      this.dialogRef.close();
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }
}

function isFirstColumn(params) {
  let displayedColumns = params.columnApi.getAllDisplayedColumns();
  let thisIsFirstColumn = displayedColumns[0] === params.column;
  return thisIsFirstColumn;
}