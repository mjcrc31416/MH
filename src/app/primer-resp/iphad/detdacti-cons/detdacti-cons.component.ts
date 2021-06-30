import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {Router} from '@angular/router';
import {IphadEvents, IphadService} from '../iphad.service';
import {Subscription} from 'rxjs';
import * as _ from 'lodash'; 
import { StdGrid2Component } from 'src/app/shared/std-grid2/std-grid2.component';
import { DactiloscopiaEditComponent } from '../../../dactiloscopia/dactiloscopia-edit/dactiloscopia-edit.component';
import {MatDialog} from '@angular/material';
import * as moment from 'moment';
import {StdGridComponent} from '../../../shared/std-grid/std-grid.component';
import { LoginService } from '../../../services/login.service';


@Component({
  selector: 'app-detdacti-cons',
  templateUrl: './detdacti-cons.component.html',
  styleUrls: ['./detdacti-cons.component.scss']
})


export class DetdactiConsComponent implements OnInit {
  @ViewChild(StdGridComponent, {static: false})
  private stdGrid: StdGridComponent;

  SNACKBAR_STD_DURATION = 3500;
  refreshActive = false;

  // Std Grid fields -----------------------------------------
  sourceData = [];
  colDefs = [
    {headerName: 'Folio Interno', field: 'folioInterno', width: 200, filter: true},
    {headerName: 'Incidente', field: 'incidente', width: 300},
    {headerName: 'Nombre del Detenido', field: 'nombre'},
    {headerName: 'Apellido Paterno', field: 'appat'},
    {headerName: 'Apellido Materno', field: 'apmat'},
    {headerName: 'Sexo', field: 'sexo'},
    {headerName: 'Fecha de Nacimiento', field: 'fecnac' },
    {headerName: 'Nacionalidad', field: 'nacionalidad'}
  ];
  stdColConfig = {
    edit: true  
  };
  tipo: any;
  
  constructor( 
    private router: Router,
    public dialog: MatDialog,
    private iphadSrv: IphadService,
    private service: LoginService
    )
  {
      
  }

  ngOnInit() {
    this.tipo = this.service.getUser().tipo.cve
    console.log(this.tipo);
    this.iphadSrv.getDetdactil(this.tipo).then( (data: any) => {
      this.stdGrid.setNewData(data);
      console.log(data);
    });

  }

  onActualizar() {

    if (!this.refreshActive) {
      this.iphadSrv.getDetdactil(this.tipo).then( (data) => {
        this.stdGrid.setNewData(data);
      });
    }

  }



  onEditRow(data) {
    this.router.navigate(['/dactiloscopia-edit', data._id]);
  }

}
