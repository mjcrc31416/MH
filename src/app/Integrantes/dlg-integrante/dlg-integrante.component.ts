import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ListadosEditComponent } from '../listados/listados-edit/listados-edit.component';
import { IntegranteService } from '../../services/integrante.service';
import { ValueGetterParams } from 'ag-grid-community/dist/lib/entities/colDef';

@Component({
  selector: 'app-dlg-integrante',
  templateUrl: './dlg-integrante.component.html',
  styleUrls: ['./dlg-integrante.component.scss']
})
export class DlgIntegranteComponent implements OnInit, AfterViewInit {
  data: any;
  form: any;

  constructor(
    public dialogRef: MatDialogRef<DlgIntegranteComponent>,
    private listaSrv: IntegranteService,
  ) {
    this.listaSrv.getAll().subscribe(
      (data: any) => {
        this.rowData = data;
      }
    );
  }

  get listForm() {
    return this.listaComp.form;
  }
  @ViewChild(ListadosEditComponent, { static: false })
  private listaComp: ListadosEditComponent;

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
    { headerName: 'Nombre', field: 'nomIntegrante', width: 200 },
    { headerName: 'Cargo', field: 'cargo', width: 300 },
    { headerName: 'Sector', field: 'sector.sector', width: 300 },
    { headerName: 'Etiquetas Generales', field: 'inst.inst', width: 300 },
    { headerName: 'Entidad Federativa', field: 'entidad.entidad', width: 300 },
    { headerName: 'Domicilio', field: 'domicilio', width: 300 },
    { headerName: 'Correo', field: 'correo', width: 300 },
    { headerName: 'Teléfonos', field: 'tel', width: 300 },
    { headerName: 'Secretari@ particular y/o Privad@', field: 'secre', width: 300 },
    { headerName: 'Atendido por parte de la Institución', field: 'atendido', width: 300 }
  ];

  ngOnInit() {

  }

  _getIdValue(args: ValueGetterParams): any {
    return (Number(args.node.id)) + 1;
  }

  ngAfterViewInit() {
  }

  onAgregar() {
    if (this.listForm) {

      this.listaSrv.add(this.listForm.value).subscribe({
        complete: () => {
          console.log('ok');
          this.dialogRef.close([this.listForm.value]);
        }
      });

    }
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
    // this.gridColumnApi = params.columnApi;
    //
    // this.http
    //   .get(
    //     "https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json"
    //   )
    //   .subscribe(data => {
    //     this.rowData = data;
    //   });
  }
}

function isFirstColumn(params) {
  let displayedColumns = params.columnApi.getAllDisplayedColumns();
  let thisIsFirstColumn = displayedColumns[0] === params.column;
  return thisIsFirstColumn;
}

