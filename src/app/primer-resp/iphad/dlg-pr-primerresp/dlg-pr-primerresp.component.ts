import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {StdGrid2Component} from '../../../shared/std-grid2/std-grid2.component';
import {TimeInputComponent} from '../../../shared/time-input/time-input.component';
import {IphadEvents, IphadService} from '../iphad.service';
import {Subscription} from 'rxjs';
import {ValueGetterParams} from 'ag-grid-community';
import {MatDialogRef} from '@angular/material';
import {FormBuilder, Validators} from '@angular/forms';
import {SnackSrvService} from '../../../services/snack-srv.service';
import {FormUtilsService} from '../../../shared/form-utils.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-dlg-pr-primerresp',
  templateUrl: './dlg-pr-primerresp.component.html',
  styleUrls: ['./dlg-pr-primerresp.component.scss']
})
export class DlgPrPrimerrespComponent implements OnInit, OnDestroy, AfterViewInit {

  // GRID DE DETENIDOS ==============================================
  @ViewChild('gridPrimerResp', {static: false}) public  gridPrimerResp: StdGrid2Component;
  grid1ColConfig = {
    edit: false,
    remove: false
  };
  grid1SourceData = [];
  grid1ColDefs = [
    {
      headerName: 'Id',
      checkboxSelection: true,
      field: '', valueGetter: (args) => this._getIdValue(args),
      width: 70
    },
    {headerName: 'Nombre', field: 'nomComp'},
    {headerName: 'Sexo', field: 'nom.nom'},
    {headerName: 'Nacionalidad', field: 'grado.nom'},
  ];
  grid1EditRow($event) {
    console.log($event);
    // this.dlgDetenido($event.data);
  }

  private subs: Subscription = new Subscription();

  form = this.fb.group({
    nombre: ['', Validators.required],
    appat: ['', Validators.required],
    apmat: ['', Validators.required],
  });

  dumbList = ['sdfsadf','asdfasdf'];
  defIndex = 0;
  currentIndex = this.defIndex;
  tipo: any;

  // COMPONENTE ================================================
  constructor(
    private iphadSrv: IphadService,
    public dialogRef: MatDialogRef<DlgPrPrimerrespComponent>,
    private fb: FormBuilder,
    private snackSrv: SnackSrvService,
    private formUtils: FormUtilsService,
    private service: LoginService
  ) {
    this.subs.add(
      this.iphadSrv.eventSource$.subscribe((data) => {
          this.dispatchEvents(data);
        }
      ));
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngAfterViewInit(): void {
    setTimeout( () => {
      this.tipo = this.service.getUser().tipo.cve
      console.log(this.tipo);
      this.iphadSrv.getPersonal(this.tipo).then( (data: any) => {
      this.gridPrimerResp = data;
        console.log(data);
      });
      // this.iphadSrv.getPersonal();
    },500);
  }

  _getIdValue(args: ValueGetterParams): any {
    return (Number(args.node.id)) + 1;
  }

  onAgregar() {
    const tmp = this.gridPrimerResp.gridApi.getSelectedRows();
    console.log(tmp);
    console.log(this.currentIndex);

    if (this.currentIndex === 0) {
      // Busqueda
      const selectedRows = this.gridPrimerResp.gridApi.getSelectedRows();
      console.log(selectedRows);
      if (selectedRows && selectedRows.length > 0) {
        this.dialogRef.close(this.setLocalIdToArray(selectedRows));
      }
    } else {
      // Nuevo
      if (this.form.valid) {
        const formData = this.form.getRawValue();
        formData.localId = this.formUtils.getNewId();
        formData.nomComp = formData.nombre + '' + formData.appat + formData.apmat;
        console.log(formData);
        this.dialogRef.close([formData]);
      } else {
        // Campos obligatorios
        this.snackSrv.showMsg('Llene toda la información obligatoria');
      }
    }
  }

  onSelectedIndexChange($event) {
    console.log('onSelectedIndexChange ========================================');
    console.log($event);
    this.currentIndex = $event;
  }

  setLocalIdToArray(arr) {
    for (const item of arr) {
      item.localId = (item._id) ? item._id : item.localId;
    }
    return arr;
  }

  // SERVICE EVENTS =======================================================================
  dispatchEvents(data) {
    if (data.event === IphadEvents.GetPersonal) {
      const tmp = data.data;
      this.gridPrimerResp.setDataSource(tmp);
    }//endIf
  }//end dispatchEvenst
}
