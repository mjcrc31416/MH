import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {EventoEvents, EventoService} from '../../../eventos/evento.service';
import {Subscription} from 'rxjs';
import {StdGridComponent} from '../../../shared/std-grid/std-grid.component';
import * as _ from 'lodash';
import {MatSnackBar} from '@angular/material';
import {MatDialog} from '@angular/material';
import * as moment from 'moment';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-iphad-even-cons',
  templateUrl: './iphad-even-cons.component.html',
  styleUrls: ['./iphad-even-cons.component.scss']
})
export class IphadEvenConsComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(StdGridComponent, {static: false})
  private stdGrid: StdGridComponent;

  private subs: Subscription = new Subscription();

  SNACKBAR_STD_DURATION = 3500;
  refreshActive = false;

  // Std Grid fields -----------------------------------------
  sourceData = [];
  colDefs = [
    {headerName: 'Folio Interno', field: 'folioInterno', width: 200, filter: true, sortable: true },
    {headerName: 'Folio 911', field: 'folio911', width: 150 },
    {headerName: 'Tipo de Incidente', field: 'tincidente', width: 200 },
    {headerName: 'Estatus', field: 'estatus'},
    {headerName: 'Fecha del Evento', width: 200 , field: 'fecha', cellRenderer: (data) => {
      if (!_.isNil(data) && !_.isNil(data.value)) {
        const ret: string = moment(data.value).format('DD/MM/YYYY HH:mm');
        return ret;
      } else {
        return '';
      }
    }
  },
    {headerName: 'Fecha de Asignación', width: 200 , field: 'asignado', cellRenderer: (data) => {
        if (!_.isNil(data) && !_.isNil(data.value)) {
          const ret: string = moment(data.value).format('DD/MM/YYYY HH:mm');
          return ret;
        } else {
          return '';
        }
      }
    },
    {headerName: 'Fecha de Ultima Modificación', width: 200 , field: 'ultimaMod', cellRenderer: (data) => {
      if (!_.isNil(data) && !_.isNil(data.value)) {
        const ret: string = moment(data.value).format('DD/MM/YYYY HH:mm');
        return ret;
      } else {
        return '';
      }
    }
  }
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
      
  }

  ngOnInit() {
    
    this.tipo = this.service.getUser().tipo.cve
    console.log(this.tipo);
    this.eventoSrv.getEvento(this.tipo).then( (data: any) => {
      this.stdGrid.setNewData(data);
      console.log(data);
    });

    // this.terminalSrv.getTerminal();
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    setTimeout( () => {
      this.tipo = this.service.getUser().tipo.cve
      console.log(this.tipo);
      this.eventoSrv.getEvento(this.tipo).then( (data: any) => {
        this.stdGrid.setNewData(data);
        console.log(data);
      });
    }, 500);
  }

  onEditRow(data) {
    this.router.navigate(['/preiph-edit', data._id]);
  }

  onActualizar() {
    if (!this.refreshActive) {
      this.tipo = this.service.getUser().tipo.cve
      console.log(this.tipo);
      this.eventoSrv.getEvento(this.tipo).then( (data: any) => {
        this.stdGrid.setNewData(data);
        console.log(data);
      });
    }
  }


  // // GRID ======================================================
  // @ViewChild('grid1', {static: false}) public  grid1: StdGrid2Component;
  // grid1ColConfig = {
  //   edit: true,
  //   remove: false,
  // };
  // grid1SourceData = [];
  // grid1ColDefs = [
  //   {headerName: 'Folio Interno', field: 'folioInterno', width: 150 },
  //   {headerName: 'Folio 911', field: 'folio911', width: 150 },
  //   {headerName: 'Tipo de Incidente', field: 'tincidente', width: 200 },
  //   {headerName: 'Estatus', field: 'estatus'},
  //   {headerName: 'Fecha del Evento', width: 125 , field: 'fecha', cellRenderer: (data) => {
  //     if (!_.isNil(data) && !_.isNil(data.value)) {
  //       const ret: string = moment(data.value).format('DD/MM/YYYY HH:mm');
  //       return ret;
  //     } else {
  //       return '';
  //     }
  //   }
  // },
  //   {headerName: 'Fecha de Asignación', width: 125 , field: 'asignado', cellRenderer: (data) => {
  //       if (!_.isNil(data) && !_.isNil(data.value)) {
  //         const ret: string = moment(data.value).format('DD/MM/YYYY HH:mm');
  //         return ret;
  //       } else {
  //         return '';
  //       }
  //     }
  //   },
  //   {headerName: 'Fecha de Ultima Modificación', width: 125 , field: 'ultimaMod', cellRenderer: (data) => {
  //     if (!_.isNil(data) && !_.isNil(data.value)) {
  //       const ret: string = moment(data.value).format('DD/MM/YYYY HH:mm');
  //       return ret;
  //     } else {
  //       return '';
  //     }
  //   }
  // },
  // ];

  // tipo: any;
  // // FIELDS ====================================================
  // private subs: Subscription = new Subscription();

  // // COMPONENET ================================================
  // constructor(
  //   private router: Router,
  //   public dialog: MatDialog,
  //   private eventoSrv: EventoService
  // ) {
  //   this.subs.add(
  //     this.eventoSrv.eventSource$.subscribe((data) => {
  //         this.dispatchEvents(data);
  //       }
  //     ));
  // }

  // ngOnInit() {
  // }

  // ngOnDestroy(): void {
  //   if (this.subs) {
  //     this.subs.unsubscribe();
  //   }
  // }

  // ngAfterViewInit(): void {
  //   setTimeout( () => {
  //     this.eventoSrv.getEvento(this.tipo);
  //   }, 500);
  // }

  // grid1EditRow(data) {
  //   this.router.navigate(['preiph-edit', data.data._id]);
  // }

  // onActualizar() {
  //   this.eventoSrv.getEvento(this.tipo);
  // }

  // // SERVICE EVENTS =======================================================================
  // dispatchEvents(data) {
  //   console.log('dispatchEvents');
  //   //   Evento para el catáogo de Reportas
  //   if (data.event === EventoEvents.GetEvento) {
  //     console.log(data);
  //     //this.rowData = data.data;
  //     this.grid1.setDataSource(data.data);
  //   }
  // }

  
}
