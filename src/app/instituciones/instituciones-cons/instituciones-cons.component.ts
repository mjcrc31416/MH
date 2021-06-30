import { Component, OnInit } from '@angular/core';
import {InstitucionesService} from '../../services/instituciones.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-instituciones-cons',
  templateUrl: './instituciones-cons.component.html',
  styleUrls: ['./instituciones-cons.component.scss']
})
export class InstitucionesConsComponent implements OnInit {

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
        return '<span style="text-align: center; margin: 0px; padding: 0px;"><i style="font-size:9pt; text-align: center;" class="material-icons">delete</i></span>';
      }
    },
    {headerName: 'Institución', field: 'inst', width: 450},
    {headerName: 'Siglas', field: 'abr', width: 200}
  ];
  rowData = [];
  refreshActive = false;

  constructor(
    private instSrv: InstitucionesService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.instSrv.getAll().subscribe(data => {
      this.rowData = data;
    });
  }

  onGridCellClicked(params) {
    if (params.column.colId === 'del-icon') {
      console.log(params);
      const res = confirm('¿Está seguro de eliminar el elemento seleccionado?');
      console.log(res);

      if (res) {
        this.instSrv.removeById(params.data._id).subscribe( () => {
          this.instSrv.getAll().subscribe(data => {
            this.rowData = data;
          });
        });
      }

    }
    if (params.column.colId === 'edit-icon') {
      console.log(params);
      const id = params.data._id;
      this.router.navigate(['/instituciones-edit',id]);
    }
  }

  onNuevo() {
    this.router.navigate(['instituciones-edit','0']);
  }

  onActualizar() {
    if (!this.refreshActive) {
      this.refreshActive = true;
      this.instSrv.getAll().subscribe(
        (data) => {
          this.rowData = data;
          this.refreshActive = false;
        }
      );
    }
  }

}
