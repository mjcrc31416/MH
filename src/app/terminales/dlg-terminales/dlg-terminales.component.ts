import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { IntegranteService } from '../../services/integrante.service';
import { ValueGetterParams } from 'ag-grid-community/dist/lib/entities/colDef';
import * as moment from 'moment';
import * as _ from 'lodash';
import { LoginService } from '../../services/login.service';


@Component({
  selector: 'app-dlg-terminales',
  templateUrl: './dlg-terminales.component.html',
  styleUrls: ['./dlg-terminales.component.scss']
})
export class DlgTerminalesComponent implements OnInit, AfterViewInit {
  data: any;
  form: any;
  tipo: any;

  constructor(
    public dialogRef: MatDialogRef<DlgTerminalesComponent>,
    private listaSrv: IntegranteService,
    private service: LoginService
  ) {

    this.tipo = this.service.getUser().tipo.cve
    console.log(this.tipo);
    this.listaSrv.getAllo(this.tipo).then( (data: any) => {
    this.rowData = data;
      console.log(data);
    });

    // this.listaSrv.getAllo().subscribe(
    //   (data: any) => {
    //     this.rowData = data;
    //   }
    // );
    dialogRef.disableClose = true;

  }


  public rowData: Array<any>;
  gridApi;

  rowSelection = 'multiple';
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
    { headerName: 'Correo', field: 'correo', width: 300 },
    { headerName: 'Nombre', field: 'policia.datPer.nombre', width: 200 },
    { headerName: 'appat', field: 'policia.datPer.appat', width: 200 },
    { headerName: 'apmat', field: 'policia.datPer.apmat', width: 200 },
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
    console.log('XXX  ');
    console.log(this.gridApi);
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