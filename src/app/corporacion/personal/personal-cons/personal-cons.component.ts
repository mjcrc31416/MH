import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {PersonalEvents, PersonalService} from '../personal.service';
import {Subscription} from 'rxjs';
import * as _ from 'lodash'; 
import {StdGridComponent} from '../../../shared/std-grid/std-grid.component';
import {MatSnackBar} from '@angular/material';
import {MatDialog} from '@angular/material';
import * as moment from 'moment';
import { LoginService } from '../../../services/login.service';
import { ValueGetterParams } from 'ag-grid-community';

@Component({
  selector: 'app-personal-cons',
  templateUrl: './personal-cons.component.html',
  styleUrls: ['./personal-cons.component.scss']
})
export class PersonalConsComponent implements OnInit, OnDestroy {

  @ViewChild(StdGridComponent, {static: false})
  private stdGrid: StdGridComponent;

  SNACKBAR_STD_DURATION = 3500;
  refreshActive = false;

  tipo: any;

  private subs: Subscription = new Subscription();
  // Std Grid fields -----------------------------------------
  sourceData = [];
  colDefs = [
      { headerName: 'ID', valueGetter: (args) => this._getIdValue(args), width: 100 },
      {headerName: 'Clave Personal', field: 'cve', width: 150, filter: true},
      {headerName: 'Nombre', field: 'datPer.nombre', width: 200, filter: true},
      {headerName: 'Apellido Paterno', field: 'datPer.appat'},
      {headerName: 'Apellido Materno', field: 'datPer.apmat'},
      {headerName: 'CUIP', field: 'datPer.cuip'},
      {headerName: 'Sexo', field: 'datPer.sexo.sexo'},
      {headerName: 'Fecha de Nacimiento', field: 'datPer.fecnac', cellRenderer: (data) => {
        if (!_.isNil(data) && !_.isNil(data.value)) {
          const ret: string = moment(data.value).format('DD/MM/YYYY');
          return ret;
        } else {
          return '';
        }
      } }
  ];
  stdColConfig = {
    edit: true,
    remove: true
  };
  
  constructor( 
    private router: Router,
    public dialog: MatDialog,
    private personalSrv: PersonalService,
    private service: LoginService,
    private snackBar: MatSnackBar
    )
  {
    // this.subs.add(
    //   this.terminalSrv.eventSource$.subscribe((data) => {
    //       this.dispatchEvents(data);
    //     }
    //   ));
      
  }

  ngOnInit() {
    
    this.tipo = this.service.getUser().tipo.cve
    console.log(this.tipo);
    this.personalSrv.getPersonal(this.tipo).then( (data: any) => {
      this.stdGrid.setNewData(data);
      console.log(data);
    });

    // this.terminalSrv.getTerminal();
  }

  onEditRow(data) {
    this.router.navigate(['/personal', data._id]);
  }

    _getIdValue(args: ValueGetterParams): any {
    return (Number(args.node.id)) + 1;
  }

  onRemoveRow(data) {
    const res = confirm('¿Está seguro de elimiar al usuario?');
    if (res) {
      this.personalSrv.grid1RemoveRow(data._id).then((data: any) => {
        console.log(data);
        this.showMsg('Se ha eliminado el elemento');
        this.onActualizar();
      });
    } else {
      console.log(data);
    }
  }

    // Action bar events --------------------------------------
    onNuevo() {
      this.router.navigate(['/personal', '0' ]);
    }
  
    onActualizar() {
      if (!this.refreshActive) {
        this.personalSrv.getPersonal(this.tipo).then( (data) => {
          this.stdGrid.setNewData(data);
        });
      }
    }

    ngOnDestroy(): void {
      if (this.subs) {
        this.subs.unsubscribe();
      }
    }

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
  //   { headerName: 'ID', valueGetter: (args) => this._getIdValue(args), width: 50, checkboxSelection: true },
  //   {headerName: 'Clave Personal', field: 'cve', width: 120},
  //   {headerName: 'Nombre', field: 'datPer.nombre'},
  //   {headerName: 'Apellido Paterno', field: 'datPer.appat'},
  //   {headerName: 'Apellido Materno', field: 'datPer.apmat'},
  //   {headerName: 'CUIP', field: 'datPer.cuip'},
  //   {headerName: 'Sexo', field: 'sexo.nom'},
  //   {headerName: 'Fecha de Nacimiento', field: 'fecnac', cellRenderer: (data) => {
  //     return moment(data.fecnac).format('DD/MM/YYYY') } }
  // ];

  //   // Grid Acciones ================================================
  //   @ViewChild('grid1', {static: false}) public  grid1: StdGrid2Component;
  //   grid1ColConfig = {
  //     edit: true,
  //     remove: true,
  //   };
  //   grid1SourceData = [];
  //   grid1ColDefs = [
  //     { headerName: 'ID', valueGetter: (args) => this._getIdValue(args), width: 50 },
  //     {headerName: 'Clave Personal', field: 'cve', width: 120},
  //     {headerName: 'Nombre', field: 'datPer.nombre'},
  //     {headerName: 'Apellido Paterno', field: 'datPer.appat'},
  //     {headerName: 'Apellido Materno', field: 'datPer.apmat'},
  //     {headerName: 'CUIP', field: 'datPer.cuip'},
  //     {headerName: 'Sexo', field: 'datPer.sexo.nom'},
  //     {headerName: 'Fecha de Nacimiento', field: 'datPer.fecnac', cellRenderer: (data) => {
  //       if (!_.isNil(data) && !_.isNil(data.value)) {
  //         const ret: string = moment(data.value).format('DD/MM/YYYY');
  //         return ret;
  //       } else {
  //         return '';
  //       }
  //     } }
  //   ];
  
  // public rowData: Array<any>;
  // gridApi: any;
  // api: any;
  // gridOptions: any;

  // private subs: Subscription = new Subscription();

  // constructor( 
  //   private router: Router,
  //   public dialog: MatDialog,
  //   private personalSrv: PersonalService 
  //   )
  // {
  //   this.subs.add(
  //     this.personalSrv.eventSource$.subscribe((data) => {
  //         this.dispatchEvents(data);
  //       }
  //     ));
      
  // }
  
  // _getIdValue(args: ValueGetterParams): any {
  //   return (Number(args.node.id)) + 1;
  // }

  // ngOnInit() {
  //   this.personalSrv.getPersonal();
  // }

  // ngOnDestroy(): void {
  //   if (this.subs) {
  //     this.subs.unsubscribe();
  //   }
  // }

  // setData(data) {
  //   this.grid1.setDataSource(data.data);
  // }

  // onNuevo() {
  //   this.router.navigate(['personal', '0']);
  // }

  // onActualizar() {
  //   if (!this.refreshActive) {
  //     this.refreshActive = true;
  //     this.personalSrv.getPersonal().then(
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

  //   this.personalSrv.grid1RemoveRow(data.data._id).then((data) => {
  //     console.log(data);
  //   });
  // }

  // grid1EditRow(data) {
  //   console.log(data);
  //   this.router.navigate(['/personal', data.data._id]);
  //   this.personalSrv.getPersonal();
  // }


  // afterGetRejectedList(data) {
  //   this.grid1.setNewData(data);
  // }
  
  // // SERVICE EVENTS =======================================================================
  // dispatchEvents(data) {
  //   console.log('dispatchEvents');
  //   //   Evento para el catáogo de Reportas
  //   if (data.event === PersonalEvents.GetPersonal) {
  //     console.log(data);
  //     //this.rowData = data.data;
  //     this.grid1.setDataSource(data.data);
  //   }
  // }

}
