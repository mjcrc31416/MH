import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { UsuariosService } from '../usuarios.service';
import { MatSnackBar } from '@angular/material';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { UsuariosSetpwdComponent } from '../usuarios-setpwd/usuarios-setpwd.component';
import { DocInfoDataModel } from '../../models/doc-info-data.model';
import { UsuarioDataModel } from '../../models/usuario-data.model';
import * as _ from 'lodash';
import { StdGrid2Component } from 'src/app/shared/std-grid2/std-grid2.component';
import { TUSUARIO } from '../usuarios-edit/mock-tusuario';
import { MatDialog } from '@angular/material';
import { DlgUsuariosComponent } from '../dlg-usuarios/dlg-usuarios.component';
import * as moment from 'moment';
import { VINCULAR } from './mock-vincular';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-usuarios-edit',
  templateUrl: './usuarios-edit.component.html',
  styleUrls: ['./usuarios-edit.component.scss']
})

export class UsuariosEditComponent implements OnInit {
  @ViewChild('groupForm', { static: false }) public form: NgForm;

  public id: string;
  public policias;

  vincular = VINCULAR;
  tusuario = TUSUARIO;
  entidadesFederativas = [];
  catalogo = [];
  tipos = [];
  sedes = [];
  municipios = [];
  instituciones= [];


  docInfo: DocInfoDataModel;
  user: UsuarioDataModel = new UsuarioDataModel();
  orgUser: UsuarioDataModel;


  SNACKBAR_STD_DURATION = 3500;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private usrSrv: UsuariosService,
    private snackBar: MatSnackBar,
    private _bottomSheet: MatBottomSheet,
    public dialog: MatDialog,

  ) { }

  // Grid Acciones Integrantes=======================================================================
  @ViewChild('gridIntes', { static: false }) public gridIntes: StdGrid2Component;
  gridIntesColConfig = {
    edit: false,
    remove: true
  };
  gridIntesColDefs = [
    { headerName: 'Nombre', field: 'nombre', width: 200, filter: true },
    { headerName: 'Apellido Paterno', field: 'appat', width: 300 },
    { headerName: 'Apellido Materno', field: 'apmat', width: 300 },
    { headerName: 'sexo', field: 'sexo.sexo', width: 150 },
    {
      headerName: 'Fecha de Nacimiento', field: 'fecnac', cellRenderer: (data) => {
        if (!_.isNil(data) && !_.isNil(data.value)) {
          const ret: string = moment(data.value).format('DD/MM/YYYY');
          return ret;
        } else {
          return '';
        }
      }, width: 150
    }
  ];

  gridIntesEditRow(data) {
    const rowData = data.data;
    console.log(rowData);


    const dialogRef = this.dialog.open(DlgUsuariosComponent, {
      panelClass: 'custom-dlg-panel',
      // data: params.data
      data: {
        integrantes: rowData,
        evento: this.usrSrv.data,
        readMode: false
      }

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.gridIntes.updateRow(result);
        console.log(result);
      }
      console.log('The dialog was closed');
    });

  }

  gridIntesRemoveRow(data) {
    const res = confirm('¿Desea eliminar al Integrante?');
    if (res) {
      this.gridIntes.removeFromGrid(data.data);
    }

  }

  newIntegrante() {
    const dialogRef = this.dialog.open(DlgUsuariosComponent, {
      panelClass: 'custom-dlg-panel',
      data: {
        integrantes: null,
        evento: this.usrSrv.data,
        readMode: false
      }
    });
    // Agregar info a integrantes
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

      if (result) {
        let data = [];

        result.forEach(element => {
          data.push(element.datPer);
        });        

        console.log(result);
        this.user.policia = result[0];
        this.gridIntes.setDataSource(data);
        console.log(result);
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      this.id = routeParams['id'];
    })

    if (this.id != '0') {
      this.usrSrv.getById(this.id).subscribe(response => {
        if(response.policia == null && response.vincular.vincular == 'ALTA') { 
          this.user._id = response._id;
          this.user.correo = response.correo;
          this.user.pwd = response.pwd;
          this.user.nombre = response.nombre;
          this.user.appat = response.appat;
          this.user.apmat = response.apmat;
          this.user.tusuario = response.tusuario;
          this.user.vincular = response.vincular;
          
        } else if (response) {
          this.user._id = response._id;
          this.user.correo = response.correo;
          this.user.pwd = response.pwd;
          this.user.nombre = response.nombre;
          this.user.appat = response.appat;
          this.user.apmat = response.apmat;
          this.user.tusuario = response.tusuario;
          this.user.vincular = response.vincular;
          this.user.policia = response.policia;

          this.policias = [];

          this.policias.push(response.policia.datPer);

          //this.gridIntes.setDataSource(this.policias);
        }
        this.initWithServerData();
      })
    } else {
      this.initWithServerData();
    }
  }

  // Snackbar methods ------------------------------------
  showMsg(msg: string) {
    this.snackBar.open(msg, 'cerrar', {
      duration: this.SNACKBAR_STD_DURATION
    });
  }

  // Action bar events -----------------------------------
  onExit() {
    this.router.navigate(['/users-cons']);
  }

  onSave() {
    if (this.form.form.valid) {
      this.usrSrv.getCountByMail(this.user.correo).subscribe((response: any) => {
        if (this.id == '0' && response.correo && response.correo > 0) {
          this.showMsg('El correo ya existe. Ingrese un correo distinto');
          return;
        }

        this.usrSrv.upsert(this.user).subscribe((serverData: any) => {
          console.log('serverData ---------');
          console.log(serverData);
          this.user._id = serverData._id;
          this.id = serverData._id;
          this.showMsg('Elemento guardado correctamente');
        });
      });

    } else {
      this.showMsg('Revise los campos obligatorios');
    }
  }

  setupPwd() {
    const ref = this._bottomSheet.open(UsuariosSetpwdComponent);

    ref.afterDismissed().subscribe((data) => {
      if (data) {
        this.user.pwd = data;
      }
    });
  }

  // Logic local functions -----------------------------------
  validateUniqueMail() {
    let res = false;
    const _id = _.get(this.orgUser, '_id', null);
    console.log('validateUniqueMail ----');
    console.log(this.orgUser);
    //console.log(this.formCorreo);
    console.log(_id);

    // If org object is null, the doc is new
    if (!this.orgUser) {
      // If the doc is new, should check if mail was changed
      res = false;
    } else {

    }

    console.log('validateUniqueMail');
    console.log(res);

    return res;
  }

  async initWithServerData () {
    // Obtener los catalogos
    const getCatResp = await this.usrSrv.getCatalogs();
    this.catalogo = getCatResp;

    this.catalogo.forEach(item => {
      this.tipos.push({cve:item.cve, tipo: item.tipo});
    })

  }

  compareWithForRol(c1, c2) {
    return (c1 && c2) ? c1.cve === c2.cve : false;
  }

  compareWithTipos(d1, d2) {
    return (d1 && d2) ? d1.cve === d2.cve : false;
  }

  compareWithEntidadesFederativas(d1, d2) {
    return (d1 && d2) ? d1.cve === d2.cve : false;
  }

  compareWithBid(d1, d2) {
    return (d1 && d2) ? d1.bid === d2.bid : false;
  }

  compareWithId(d1, d2) {
    return (d1 && d2) ? d1._id === d2._id : false;
  }


}
