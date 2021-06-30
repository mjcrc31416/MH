import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import {VehiculosEvents, VehiculosService} from '../vehiculos.service';
import {Subscription} from 'rxjs';
import * as _ from 'lodash'; 
import {MatSnackBar} from '@angular/material';
import {StdGridComponent} from '../../../shared/std-grid/std-grid.component';
import { LoginService } from '../../../services/login.service';
import {MatDialog} from '@angular/material';
import { TerminalService } from 'src/app/terminales/terminal.service';


@Component({
  selector: 'app-vehiculos-cons',
  templateUrl: './vehiculos-cons.component.html',
  styleUrls: ['./vehiculos-cons.component.scss']
})
export class VehiculosConsComponent implements OnInit {

  @ViewChild(StdGridComponent, {static: false})
  private stdGrid: StdGridComponent;

  SNACKBAR_STD_DURATION = 3500;
  refreshActive = false;

  // Std Grid fields -----------------------------------------
  sourceData = [];
  colDefs = [
    {headerName: 'Vehículo', field: 'vehiculo', width: 200, filter: true},
    {headerName: 'Tipo de Vehículo', field: 'tipoVehi', width: 200, filter: true},
    {headerName: 'Marca', field: 'marca', width: 200, filter: true},
    {headerName: 'Número de Placa', field: 'placa'},
    {headerName: 'Número de Serie', field: 'numSerie'}
  ];
  stdColConfig = {
    edit: true,
    remove: true
  };
  tipo: any;

  constructor(
    private router: Router,
    private vehiSrv: VehiculosService,
    private service: LoginService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.tipo = this.service.getUser().tipo.cve;
    console.log(this.tipo);
    this.vehiSrv.getVehiculos(this.tipo).then( (data: any) => {
      this.stdGrid.setNewData(data);
      console.log(data);
    });
  }

    // Std Grid events -----------------------------------------
    onEditRow(data) {
      this.router.navigate(['/vehiculos', data._id]);
    }

    onRemoveRow(data) {
      const res = confirm('¿Está seguro de elimiar al usuario?');
      if (res) {
        this.vehiSrv.grid1RemoveRow(data._id).then((data: any) => {
          console.log(data);
          this.showMsg('Se ha eliminado el elemento');
          this.onActualizar();
        });
      } else {
        console.log(data);
      }
    }

  //     grid1RemoveRow(data) {
  //   const newSourceData = this.stdGrid.removeFromGrid(data.data);
  //   const res = confirm('¿Está seguro de eliminar el elemento seleccionado?');

  //   this.sourceData = newSourceData;

  //   this.vehiSrv.grid1RemoveRow(data.data._id).then((data) => {
  //     console.log(data);
  //   });
  // }

  // Action bar events --------------------------------------
  onNuevo() {
    this.router.navigate(['/vehiculos', '0' ]);
  }

  onActualizar() {
    if (!this.refreshActive) {
      this.vehiSrv.getVehiculos(this.tipo).then( (data) => {
        this.stdGrid.setNewData(data);
      });
    }
  }

  // Snackbar methods ------------------------------------
  showMsg(msg: string) {
    this.snackBar.open(msg, 'cerrar',{
      duration: this.SNACKBAR_STD_DURATION
    });
  }

  // refreshActive = false;
  // columnDefs = [
  //   {
  //     headerName: "",
  //     field: "edit-icon",
  //     width: 40,
  //     cellRenderer: (params) => {
  //       return '<span><i style="font-size:9pt" class="material-icons">edit</i></span>';
  //     }
  //   },
  //   {
  //     headerName: "",
  //     field: "del-icon",
  //     width: 40,
  //     cellRenderer: (params) => {
  //       return '<span><i style="font-size:9pt" class="material-icons" >delete</i></span>';
  //     }
  //   },
  //   {headerName: 'Vehículo', field: 'vehiculo'},
  //   {headerName: 'Tipo de Vehículo', field: 'tipoVehi'},
  //   {headerName: 'Marca', field: 'marca'},
  //   {headerName: 'Número de Placa', field: 'placa'},
  //   {headerName: 'Número de Serie', field: 'numSerie'}
  // ];

  //   // Grid Acciones ================================================
  //   @ViewChild('grid1', {static: false}) public  grid1: StdGrid2Component;
  //   grid1ColConfig = {
  //     edit: true,
  //     remove: true,
  //   };
  //   grid1SourceData = [];
  //   grid1ColDefs = [
  //     {headerName: 'Vehículo', field: 'vehiculo'},
  //     {headerName: 'Tipo de Vehículo', field: 'tipoVehi'},
  //     {headerName: 'Marca', field: 'marca'},
  //     {headerName: 'Número de Placa', field: 'placa'},
  //     {headerName: 'Número de Serie', field: 'numSerie'}
  //   ];
  
  // public rowData: Array<any>;
  // gridApi: any;
  // api: any;
  // gridOptions: any;

  // private subs: Subscription = new Subscription();
  
  // constructor( 
  //   private router: Router,
  //   public dialog: MatDialog,
  //   private vehiSrv: VehiculosService,
  //   )
  // {
  //   this.subs.add(
  //     this.vehiSrv.eventSource$.subscribe((data) => {
  //         this.dispatchEvents(data);
  //       }
  //     ));
      
  // }

  // ngOnInit() {
  //   this.vehiSrv.getVehiculos();
  // }

  // setData(data) {
  //   this.grid1.setDataSource(data.data);
  // }

  // onNuevo() {
  //   this.router.navigate(['vehiculos', '0']);
  // }

  // onActualizar() {
  //   if (!this.refreshActive) {
  //     this.refreshActive = true;
  //     this.vehiSrv.getVehiculos().then(
  //       (data) => {
  //         this.grid1SourceData = data;
  //         this.refreshActive = false;
  //       }
  //     );
  //   }
  // }

  // grid1RemoveRow(data) {
  //   const newSourceData = this.grid1.removeFromGrid(data.data);
  //   const res = confirm('¿Está seguro de eliminar el elemento seleccionado?');

  //   this.grid1SourceData = newSourceData;

  //   this.vehiSrv.grid1RemoveRow(data.data._id).then((data) => {
  //     console.log(data);
  //   });
  // }

  // grid1EditRow(data) {
  //   console.log(data);
  //   this.router.navigate(['/vehiculos', data.data._id]);
  //   this.vehiSrv.getVehiculos();
  // }


  // afterGetRejectedList(data) {
  //   this.grid1.setNewData(data);
  // }
  
  // // SERVICE EVENTS =======================================================================
  // dispatchEvents(data) {
  //   console.log('dispatchEvents');
  //   //   Evento para el catáogo de Reportas
  //   if (data.event === VehiculosEvents.GetVehiculos) {
  //     console.log(data);
  //     //this.rowData = data.data;
  //     this.grid1.setDataSource(data.data);
  //   }
  // }

}
