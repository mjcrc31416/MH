import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {StdGridComponent} from '../../../shared/std-grid/std-grid.component';
import {PrVehiculoFormComponent} from '../pr-vehiculo-form/pr-vehiculo-form.component';

@Component({
  selector: 'app-dlg-pr-vehiculo',
  templateUrl: './dlg-pr-vehiculo.component.html',
  styleUrls: ['./dlg-pr-vehiculo.component.scss']
})
export class DlgPrVehiculoComponent implements OnInit, AfterViewInit {

  paramData;
  @ViewChild('vehiComp', {static: false}) public  vehiComp: PrVehiculoFormComponent;
  constructor(
    public dialogRef: MatDialogRef<DlgPrVehiculoComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.paramData = data;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    setTimeout( () => {
      this.initChildForm(this.paramData);
    }, 600);
  }

  initChildForm(data) {
    this.vehiComp.setFormData(data);
  }

  onAgregar() {
    const data = this.vehiComp.getFormData();
    this.dialogRef.close(data);
  }


}
