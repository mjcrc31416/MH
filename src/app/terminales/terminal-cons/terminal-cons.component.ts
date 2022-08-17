import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import { TerminalService, TerminalEvents } from '../terminal.service';
import {Subscription} from 'rxjs';
import * as _ from 'lodash'; 
import {StdGridComponent} from '../../shared/std-grid/std-grid.component';
import {MatSnackBar} from '@angular/material';
import {MatDialog} from '@angular/material';
import { LoginService } from '../../services/login.service';


@Component({
  selector: 'app-terminal-cons',
  templateUrl: './terminal-cons.component.html',
  styleUrls: ['./terminal-cons.component.scss']
})
export class TerminalConsComponent implements OnInit {
  @ViewChild(StdGridComponent, {static: false})
  private stdGrid: StdGridComponent;

  SNACKBAR_STD_DURATION = 3500;
  refreshActive = false;
  total: any = 0;

  // Std Grid fields -----------------------------------------
  sourceData = [];
  colDefs = [
    {headerName: 'Nombre', field: 'nombres', width: 200, filter: true},
    {headerName: 'Marca', field: 'marca'},
    {headerName: 'Número de Inventario', field: 'noInventario'}
  ];
  stdColConfig = {
    edit: true,
    remove: true
  };
  tipo: any;
  
  constructor( 
    private router: Router,
    public dialog: MatDialog,
    private terminalSrv: TerminalService,
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

    this.consult(0,25)
    
    // this.tipo = this.service.getUser().tipo.cve
    // console.log(this.tipo);
    // this.terminalSrv.getTerminal(this.tipo).then( (data: any) => {
    //   this.stdGrid.setNewData(data);
    //   console.log(data);
    // });

    // this.terminalSrv.getTerminal();
  }

  consult(pageIndex, PageSize) {
    this.terminalSrv.getTerminal(this.tipo,pageIndex,PageSize).then( (data: any) => {
      this.stdGrid.setNewData(data.data);
      this.total=data.total
    });

  }

  changePage(event) {
    this.consult(event.pageIndex, event.pageSize)
  }

  onEditRow(data) {
    this.router.navigate(['/terminal', data._id]);
  }


  onRemoveRow(data) {
    const res = confirm('¿Está seguro de elimiar al usuario?');
    if (res) {
      this.terminalSrv.grid1RemoveRow(data._id).then((data: any) => {
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
      this.router.navigate(['/terminal', '0' ]);
    }
  
    onActualizar() {

      if (!this.refreshActive) {
        this.terminalSrv.getTerminal(this.tipo,0, 25).then( (data) => {
          this.stdGrid.setNewData(data);
        });
      }
      // if (!this.refreshActive) {
      //   this.terminalSrv.getTerminal(this.tipo).then( (data) => {
      //     this.stdGrid.setNewData(data);
      //   });
      // }
    }

  
  // SERVICE EVENTS =======================================================================
  // dispatchEvents(data) {
  //   console.log('dispatchEvents');
  //   //   Evento para el catáogo de Reportas
  //   if (data.event === TerminalEvents.GetTerminal) {
  //     console.log(data);
  //     //this.rowData = data.data;
  //     this.stdGrid.setDataSource(data.data);
  //   }
  // }


  // Snackbar methods ------------------------------------
  showMsg(msg: string) {
    this.snackBar.open(msg, 'cerrar',{
      duration: this.SNACKBAR_STD_DURATION
    });
  }

}
