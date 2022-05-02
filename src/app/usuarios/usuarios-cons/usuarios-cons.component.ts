import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {UsuariosService} from '../usuarios.service';
import {StdGridComponent} from '../../shared/std-grid/std-grid.component';
import {MatSnackBar} from '@angular/material';
import * as moment from 'moment';
import * as _ from 'lodash';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-usuarios-cons',
  templateUrl: './usuarios-cons.component.html',
  styleUrls: ['./usuarios-cons.component.scss']
})
export class UsuariosConsComponent implements OnInit {
  @ViewChild(StdGridComponent, {static: false})
  private stdGrid: StdGridComponent;

  SNACKBAR_STD_DURATION = 3500;
  refreshActive = false;

  // Std Grid fields -----------------------------------------
  sourceData = [];
  colDefs = [
    {headerName: 'Correo', field: 'correo', width: 200, filter: true},
    {
    headerName: 'Nombre', field: 'nombreCompleto', with: 250,
    cellRenderer: (params) => {
      if (params.value) {
        return params.value
      } else {
        return params.data.nombre
      }
    }
  },
    //{headerName: 'Nombre', field: 'nombreCompleto', with: 150},
    // {headerName: 'Nombre', field: 'nombre',with: 150},
    {headerName: 'Tipo de Usuario', field: 'tusuario', width: 200},
    {headerName: 'Institución', field: 'institucion', width: 350},
    {headerName: 'Sede', field: 'sede', width: 250}
  ];
  stdColConfig = {
    edit: true,
    remove: true
  };
  tipo: any;

  constructor(
    private router: Router,
    private usrSrv: UsuariosService,
    private service: LoginService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.tipo = this.service.getUser().tipo.cve;
    console.log(this.tipo);
    this.usrSrv.getAll(this.tipo).then( (data: any) => {
      this.stdGrid.setNewData(data);
      console.log(data);
    });
  }

  // Std Grid events -----------------------------------------
  onEditRow(data) {
    this.router.navigate(['/users-edit', data._id]);
  }

  onRemoveRow(data) {
    const res = confirm('¿Está seguro de elimiar al usuario?');
    if (res) {
      this.usrSrv.grid1RemoveRow(data._id).then((data: any) => {
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
    this.router.navigate(['/users-edit', '0' ]);
  }

  onActualizar() {
    if (!this.refreshActive) {
      this.usrSrv.getAll(this.tipo).then( (data) => {
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

}
