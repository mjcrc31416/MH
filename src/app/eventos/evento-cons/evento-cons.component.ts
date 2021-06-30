import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import {EventoEvents, EventoService} from '../evento.service';
import {Subscription} from 'rxjs';
import * as _ from 'lodash';
import { StdGrid2Component } from 'src/app/shared/std-grid2/std-grid2.component';
import {StdGridComponent} from '../../shared/std-grid/std-grid.component';
import {MatSnackBar} from '@angular/material';
import {MatDialog} from '@angular/material';
import * as moment from 'moment';
import { LoginService } from '../../services/login.service';


@Component({
  selector: 'app-evento-cons',
  templateUrl: './evento-cons.component.html',
  styleUrls: ['./evento-cons.component.scss']
})
export class EventoConsComponent implements OnInit {
  @ViewChild(StdGridComponent, {static: false})
  private stdGrid: StdGridComponent;

  SNACKBAR_STD_DURATION = 3500;
  refreshActive = false;

  // Std Grid fields -----------------------------------------
  sourceData = [];
  colDefs = [
    {headerName: 'Folio Interno', field: 'folioInterno', width: 200, filter: true },
    {headerName: 'Fecha del evento', width: 125 , field: 'fecha', cellRenderer: (data) => {
        if (!_.isNil(data) && !_.isNil(data.value)) {
          const ret: string = moment(data.value).format('DD/MM/YYYY HH:mm');
          return ret;
        } else {
          return '';
        }
      }
    },
    {headerName: 'Tipo de Incidente', field: 'tincidente.nom', width: 200, filter: true},
    {headerName: 'Estatus', field: 'estatus.nom'},
    {headerName: 'Asignado', width: 125 , field: 'fechaAsignacion', cellRenderer: (data) => {
        if (!_.isNil(data) && !_.isNil(data.value)) {
          const ret: string = moment(data.value).format('DD/MM/YYYY HH:mm');
          return ret;
        } else {
          return '';
        }
      }
    },
    {headerName: 'Municipio', field: 'ubicacionEvento.municipio.nomOf'},
    {headerName: 'Colonia', field: 'ubicacionEvento.colonia'},
    {headerName: 'Calle', field: 'ubicacionEvento.calle'},
    {headerName: 'Número', field: 'ubicacionEvento.numero'},
  ];
  stdColConfig = {
    edit: true,
    remove: true
  };
  tipo: any;
  
  constructor( 
    private router: Router,
    public dialog: MatDialog,
    private service: LoginService,
    private eventoSrv: EventoService,
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
    this.eventoSrv.getEventos(this.tipo).then( (data: any) => {
      this.stdGrid.setNewData(data);
      console.log(data);
    });

    // this.terminalSrv.getTerminal();
  }

  onEditRow(data) {
    this.router.navigate(['/evento-edit', data._id]);
  }

  onRemoveRow(data) {
    const res = confirm('¿Está seguro de elimiar al usuario?');
    if (res) {
      this.eventoSrv.grid1RemoveRow(data._id).then((data: any) => {
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
      this.router.navigate(['/evento-edit', '0' ]);
    }
  
    onActualizar() {
      if (!this.refreshActive) {
        this.eventoSrv.getEventos(this.tipo).then( (data) => {
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






  // tipo: any;
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
  //   {headerName: 'Folio Interno', field: 'folioInterno', width: 250},
  //   {headerName: 'Fecha', field: 'fecha', cellRenderer: (data) => {
  //     return moment(data.fecha).format('DD/MM/YYYY')
  // }, width: 150},
  //   {headerName: 'Tipo de Incidente', field: 'tincidente'},
  //   {headerName: 'Reporta', field: 'nombre'},
  //   {headerName: 'Atiende', field: 'atiende'},
  //   {headerName: 'Coordinadora', field: 'coordinadora'},
  //   {headerName: 'Municipio', field: 'municipio'},
  //   {headerName: 'Torre', field: 'torre'}
  // ];

  //   // Grid Acciones ================================================
  //   @ViewChild('grid1', {static: false}) public  grid1: StdGrid2Component;
  //   grid1ColConfig = {
  //     edit: true,
  //     remove: true,
  //   };
  //   grid1SourceData = [];
  //   grid1ColDefs = [
  //     {headerName: 'Folio Interno', field: 'folioInterno', width: 150 },
  //     {headerName: 'Fecha del evento', width: 125 , field: 'fecha', cellRenderer: (data) => {
  //         if (!_.isNil(data) && !_.isNil(data.value)) {
  //           const ret: string = moment(data.value).format('DD/MM/YYYY HH:mm');
  //           return ret;
  //         } else {
  //           return '';
  //         }
  //       }
  //     },
  //     {headerName: 'Tipo de Incidente', field: 'tincidente'},
  //     {headerName: 'Estatus', field: 'estatus'},
  //     {headerName: 'Asignado', width: 125 , field: 'fechaAsignacion', cellRenderer: (data) => {
  //         if (!_.isNil(data) && !_.isNil(data.value)) {
  //           const ret: string = moment(data.value).format('DD/MM/YYYY HH:mm');
  //           return ret;
  //         } else {
  //           return '';
  //         }
  //       }
  //     },
  //     {headerName: 'Municipio', field: 'municipio'},
  //     {headerName: 'Colonia', field: 'colonia'},
  //     {headerName: 'Calle', field: 'calle'},
  //     {headerName: 'Número', field: 'numero'},
  //   ];

  // public rowData: Array<any>;
  // gridApi: any;
  // api: any;
  // gridOptions: any;

  // private subs: Subscription = new Subscription();

  // constructor(
  //   private router: Router,
  //   public dialog: MatDialog,
  //   private service: LoginService,
  //   private eventoSrv: EventoService
  //   )
  // {
  //   // this.subs.add(
  //   //   this.eventoSrv.eventSource$.subscribe((data) => {
  //   //       this.dispatchEvents(data);
  //   //     }
  //   //   ));

  // }

  // setData(data) {
  //   this.grid1.setDataSource(data.data);
  // }

  // onNuevo() {
  //   this.router.navigate(['evento-edit', '0']);
  // }

  // ngOnInit() {
  //   this.tipo = this.service.getUser().tipo.cve
  //   console.log(this.tipo);
  //   this.eventoSrv.getEvento(this.tipo).then( (data: any) => {
  //     this.grid1.setNewData(data);
  //     console.log(data);
  //   });

  //   // this.eventoSrv.getEventos().then( (data) => {
  //   //   this.rowData = data;
  //   // });
  // }

  // onActualizar() {
  //   if (!this.refreshActive) {
  //     this.eventoSrv.getEvento(this.tipo).then( (data) => {
  //       this.grid1.setNewData(data);
  //     });
  //   }

  //   // if (!this.refreshActive) {
  //   //   this.refreshActive = true;
  //   //   this.eventoSrv.getEventos().then( (data) => {
  //   //       this.rowData = data;
  //   //       this.refreshActive = false;
  //   //     }
  //   //   );
  //   // }
  // }

  // grid1RemoveRow(data) {
  //   const res = confirm('¿Está seguro de eliminar el elemento seleccionado?');

  //   if(res) {
  //   const newSourceData = this.grid1.removeFromGrid(data.data);
  //   this.grid1SourceData = newSourceData;

  //   this.eventoSrv.grid1RemoveRow(data.data._id).then((data) => {
  //     console.log(data);
  //   });
  // }else {
  //   console.log(data);
  // }
  // }

  // grid1EditRow(data) {
  //   console.log(data);
  //   this.router.navigate(['/evento-edit', data.data._id]);
  //   this.eventoSrv.getEventos();
  // }

  // afterGetRejectedList(data) {
  //   this.grid1.setNewData(data);
  // }

  // SERVICE EVENTS =======================================================================
  // dispatchEvents(data) {
  //   console.log('dispatchEvents');
    
  //   //   Evento para el catáogo de Reportas
  //   if (data.event === EventoEvents.GetEventos) {
  //     console.log(data);
  //     //this.rowData = data.data;
  //     this.grid1.setDataSource(data.data);
  //   }
  // }

}
