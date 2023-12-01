import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import { Location } from '@angular/common';

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
      { headerName: 'ID', valueGetter: (args) => this._getIdValue(args), width: 50 },
      {headerName: 'Nombre', field: 'datPer.nombre', width: 150, filter: true},
      {headerName: 'Apellido Paterno', field: 'datPer.appat', width: 150,},
      {headerName: 'Apellido Materno', field: 'datPer.apmat', width: 150,},
      {headerName: 'Fecha de Nacimiento', field: 'datPer.fecnac', cellRenderer: (data) => {
        if (!_.isNil(data) && !_.isNil(data.value)) {
          const ret: string = moment(data.value).format('DD/MM/YYYY');
          return ret;
        } else {
          return '';
        }
      }, width: 150 },
      {headerName: 'Sexo', field: 'datPer.sexo.sexo', width: 150},
      {headerName: 'RFC', field: 'datPer.rfc', width: 150},
      {headerName: 'CURP', field: 'datPer.curp', width: 180},
      {headerName: 'Escolaridad', field: 'datPer.escolaridad.escolaridad', width: 150},
      {headerName: 'Dep. Ecónomicos', field: 'datPer.depeco.depeco', width: 150},
      {headerName: 'N° Empleado', field: 'No_empleado', width: 150},
      {headerName: 'Tipo Nómina Civil', field: 'Tipo_nomina', width: 150},
      {headerName: 'Cod Puesto', field: 'Cod_puesto', width: 150},
      {headerName: 'Puesto', field: 'Nom_puesto', width: 150}
  ];
  stdColConfig = {
    edit: true,
    remove: true
  };
  subscription: any;
  
  constructor( 
    private router: Router,
    public dialog: MatDialog,
    private personalSrv: PersonalService,
    private service: LoginService,
    private snackBar: MatSnackBar,
    private location: Location,
    )
  {
    // this.subs.add(
    //   this.terminalSrv.eventSource$.subscribe((data) => {
    //       this.dispatchEvents(data);
    //     }
    //   ));
      
  }

   // Este método se ejecutará cada vez que se presione una tecla
   @HostListener('window:keydown', ['$event'])
   handleKeyDown(event: KeyboardEvent): void {
     // Verifica si la tecla presionada es la tecla de retroceso (flecha hacia atrás)
     if (event.key === 'Backspace') {
       // Bloquea la acción predeterminada (retroceder en la historia del navegador)
       event.preventDefault();
       // Opcional: Puedes agregar tu propia lógica aquí, por ejemplo, mostrar un mensaje al usuario
     }
   }

    // Este método se ejecutará cada vez que se intente cambiar de ruta
  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent): void {
    // Bloquea la acción predeterminada (retroceder en la historia del navegador)
    this.location.forward();
    // Opcional: Puedes agregar tu propia lógica aquí, por ejemplo, mostrar un mensaje al usuario
  }


  ngOnInit() {
    

    this.subscription = this.personalSrv.getPersona().subscribe(data => {
      this.stdGrid.setNewData(data);
    });


// this.tipo = this.service.getUser().tipo.cve
    // console.log(this.tipo);
    // this.personalSrv.getPersonal(this.tipo).then( (data: any) => {
    //   this.stdGrid.setNewData(data);
    //   console.log(data);
    // });

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

        this.personalSrv.getPersona().subscribe(
          (data) => {
            this.stdGrid.setNewData(data);
            this.refreshActive = false;
          }
        );

        // this.personalSrv.getPersonal(this.tipo).then( (data) => {
        //   this.stdGrid.setNewData(data);
        // });
      }
    }

    ngOnDestroy(): void {
      // if (this.subs) {
      //   this.subs.unsubscribe();
      // }
      this.subscription.unsubscribe();

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