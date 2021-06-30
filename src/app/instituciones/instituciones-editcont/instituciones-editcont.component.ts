import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {InstitucionesEditComponent} from '../instituciones-edit/instituciones-edit.component';
import {InstitucionesService} from '../../services/instituciones.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-instituciones-editcont',
  templateUrl: './instituciones-editcont.component.html',
  styleUrls: ['./instituciones-editcont.component.scss']
})
export class InstitucionesEditcontComponent implements OnInit {
  @ViewChild(InstitucionesEditComponent, {static: false})
  private instComp: InstitucionesEditComponent;

  SNACKBAR_STD_DURATION = 3500;
  orgData;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private instSrv: InstitucionesService
  ) { }

  ngOnInit() {
    const data$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.instSrv.getById(params.get('id')))
    );

    data$.subscribe((data) => {
      console.log('ngOnInit');
      console.log(data);
      if (data) {
        this.orgData = data;
        this.instComp.form.setValue({
          inst: data.inst,
          abr: data.abr
        });
      }
    });
  }

  //ACTION BAR
  onExit() {
    this.router.navigate(['instituciones-cons']);
  }

  onSave() {
    if (this.instComp.form.valid) {

      let data = this.instComp.form.value;

      if (this.orgData && this.orgData.hasOwnProperty('_id')) {
        data._id = this.orgData._id;
      }

      this.instSrv.add(data).subscribe( {
        complete: () => {
          this._snackBar.open('Información guardada correctamente','',{
            duration: this.SNACKBAR_STD_DURATION - 500
          });
        }
      });

    } else {
      this._snackBar.open('Valide la información capturada','',{
        duration: this.SNACKBAR_STD_DURATION
      });
    }
  }
}
