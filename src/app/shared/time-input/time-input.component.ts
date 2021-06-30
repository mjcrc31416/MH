import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss']
})
export class TimeInputComponent implements OnInit, OnChanges {

  @Input() hora: string;
  @Input() minutos: string;

  form = this.fb.group({
    hora: [this.hora, [Validators.required]],
    minutos: [this.minutos, Validators.required],
  });
  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.setNewData();
  }

  ngOnChanges(changes: any): void {
    console.log(changes);
    this.setNewData();
  }

  setNewData() {
    this.form.get('hora').patchValue(this.hora);
    this.form.get('minutos').patchValue(this.minutos);
  }

  setByDateTimeObj(dateTimeObj) {
    this.hora = dateTimeObj.hora;
    this.minutos = dateTimeObj.minutos;
    this.form.get('hora').patchValue(this.hora);
    this.form.get('minutos').patchValue(this.minutos);
  }

  disableAll() {
    this.form.get('hora').disable();
    this.form.get('minutos').disable();
  }

  getData() {
    return this.form.getRawValue();
  }


  hourVal($event) {
    console.log($event);
  }

  validateHour(val) {
    console.log(val);
  }

}
