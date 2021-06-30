import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {EtiquetasEvents, EtiquetasDocumentoService} from '../etiquetas-documento.service';
import {Subscription} from 'rxjs';
import * as _ from 'lodash'; 
import { StdGrid2Component } from 'src/app/shared/std-grid2/std-grid2.component';
import { EtiquetasDocumentoEditComponent } from '../etiquetas-documento-edit/etiquetas-documento-edit.component';
import {MatDialog} from '@angular/material';
import * as moment from 'moment';
import { ValueGetterParams } from 'ag-grid-community/dist/lib/entities/colDef';

@Component({
  selector: 'app-etiquetas-documento-cons',
  templateUrl: './etiquetas-documento-cons.component.html',
  styleUrls: ['./etiquetas-documento-cons.component.scss']
})
export class EtiquetasDocumentoConsComponent implements OnInit, OnDestroy {

  refreshActive = false;
  columnDefs = [
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
        return '<span><i style="font-size:9pt" class="material-icons" >delete</i></span>';
      }
    },
    { headerName: 'ID', valueGetter: (args) => this._getIdValue(args), width: 50, checkboxSelection: true },
    {headerName: 'Nombre Etiqueta', field: 'nombre', width: 150}
  ];

    // Grid Acciones ================================================
    @ViewChild('grid1', {static: false}) public  grid1: StdGrid2Component;
    grid1ColConfig = {
      edit: true,
      remove: true,
    };
    grid1SourceData = [];
    grid1ColDefs = [
      { headerName: 'ID', valueGetter: (args) => this._getIdValue(args), width: 50 },
      {headerName: 'Nombre Etiqueta', field: 'nombre', width: 150}
    ];
  
  public rowData: Array<any>;
  gridApi: any;
  api: any;
  gridOptions: any;

  private subs: Subscription = new Subscription();

  constructor( 
    private router: Router,
    public dialog: MatDialog,
    private etqSrv: EtiquetasDocumentoService,
    )
  {
    this.subs.add(
      this.etqSrv.eventSource$.subscribe((data) => {
          this.dispatchEvents(data);
        }
      ));
      
  }
  
  _getIdValue(args: ValueGetterParams): any {
    return (Number(args.node.id)) + 1;
  }

  ngOnInit() {
    this.etqSrv.getEtiquetas();
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  setData(data) {
    this.grid1.setDataSource(data.data);
  }

  onNuevo() {
    this.router.navigate(['etiquetasdoc-edit','0']);
  }

  onActualizar() {
    if (!this.refreshActive) {
      this.refreshActive = true;
      this.etqSrv.getEtiquetas().then(
        (data) => {
          this.grid1SourceData = data;
          this.refreshActive = false;
        }
      );
    }
  }

  grid1RemoveRow(data) {
    const newSourceData = this.grid1.removeFromGrid(data.data);
    const res = confirm('¿Está seguro de eliminar el elemento seleccionado?');

    this.grid1SourceData = newSourceData;

    this.etqSrv.grid1RemoveRow(data.data._id).then((data) => {
      console.log(data);
    });
  }

  grid1EditRow(data) {
    console.log(data);
    this.router.navigate(['/etiquetasdoc-edit', data.data._id]);
    this.etqSrv.getEtiquetas();
  }


  afterGetRejectedList(data) {
    this.grid1.setNewData(data);
  }
  
  // SERVICE EVENTS =======================================================================
  dispatchEvents(data) {
    console.log('dispatchEvents');
    //   Evento para el catáogo de Reportas
    if (data.event === EtiquetasEvents.GetEtiquetas) {
      console.log(data);
      //this.rowData = data.data;
      this.grid1.setDataSource(data.data);
    }
  }

}
