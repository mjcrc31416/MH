import {AfterContentInit, AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-std-grid',
  templateUrl: './std-grid.component.html',
  styleUrls: ['./std-grid.component.scss']
})
export class StdGridComponent implements OnInit, AfterContentInit {

  @Input() sourceData;
  @Input() userColDefs;
  @Input() stdColConfig;

  @Output() editRow = new EventEmitter<any>();
  @Output() removeRow = new EventEmitter<any>();

  gridApi;

  columnDefs = [];
  rowData = [];
  stdCols = [
    {
      headerName: "",
      field: "edit-icon",
      width: 40,
      cellRenderer: (params) => {
        return '<span><i style="font-size:9pt" class="material-icons">edit</i></span>';
      }
    },
    {
      headerName: "",
      field: "del-icon",
      width: 40,
      cellRenderer: (params) => {
        return '<span style="text-align: center; margin: 0px; padding: 0px;"><i style="font-size:9pt; text-align: center;" class="material-icons">delete</i></span>';
      }
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit(): void {
    let tempColDefs = [];

    if (this.stdColConfig.edit) {
      tempColDefs.push(this.stdCols[0]);
    }
    if (this.stdColConfig.remove) {
      tempColDefs.push(this.stdCols[1]);
    }

    tempColDefs = tempColDefs.concat(this.userColDefs);
    this.columnDefs = tempColDefs;

    this.rowData = this.sourceData;
  }

  // Remove from grid
  public removeFromGrid(data) {
    this.gridApi.updateRowData( {remove: [data] });

    const newDataSource = this.getRowsFromApi();
    this.sourceData = newDataSource;
    return newDataSource;
  }

  // Get rows from grid api
  public getRowsFromApi() {
    let rows = [];
    this.gridApi.forEachNode(row => {
      rows.push(row.data);
    });
    return rows;
  }

  // Sets whole new data source
  public setDataSource(dataSourceArray) {
    this.rowData = dataSourceArray;
    this.gridApi.setRowData(this.rowData);
  }

  // Sets new data on grid
  public setNewData(data): void {
    this.rowData = data;
  }

  // Get all rows from grid
  public getRows(): any[] {
    let rows = [];

    return rows;
  }

  onGridCellClicked(params) {
    if (params.column.colId === 'del-icon') {
      // console.log(params);
      // this.acuerdosGridApi.updateRowData( {remove: [params.data] });
      this.removeRow.emit(params.data);
    }
    if (params.column.colId === 'edit-icon') {
      this.editRow.emit(params.data);
      // console.log(params);
      //
      // const dialogRef = this.dialog.open(DlgAcuerdoComponent, {
      //   width: '800px',
      //   data: params.data
      // });
      //
      // dialogRef.afterClosed().subscribe(result => {
      //   if (result) {
      //     params.node.setData(result);
      //     //this.acuerdosGridApi.updateRowData({add: [result]});
      //   }
      //   console.log('The dialog was closed');
      // });
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

}
