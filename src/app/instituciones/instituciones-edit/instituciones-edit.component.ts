import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-instituciones-edit',
  templateUrl: './instituciones-edit.component.html',
  styleUrls: ['./instituciones-edit.component.scss']
})
export class InstitucionesEditComponent implements OnInit {

  form = this.fb.group({
    inst: ['', Validators.required],
    abr: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}
