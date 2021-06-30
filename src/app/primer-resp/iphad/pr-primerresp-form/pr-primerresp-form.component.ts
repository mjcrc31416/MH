import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pr-primerresp-form',
  templateUrl: './pr-primerresp-form.component.html',
  styleUrls: ['./pr-primerresp-form.component.scss']
})
export class PrPrimerrespFormComponent implements OnInit {

  dumbList = [{
    cve: 1,
    nom: 'LLAMADA DE EMERGENCIA'
  }, {
    cve: 2,
    nom: 'FLAGRANCIA'
  }, {
    cve: 3,
    nom: 'QUEJA'
  }, {
    cve: 4,
    nom: 'OTRO'
  }];

  constructor() { }

  ngOnInit() {
  }

}
