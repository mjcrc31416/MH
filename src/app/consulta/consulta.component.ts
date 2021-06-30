import { Component, OnInit } from '@angular/core';
import { CheckboxSelectionComponent, PostConstruct } from 'ag-grid-community';
import { ConferenciasService } from '../services/conferencias.service';
import { ValueGetterParams } from 'ag-grid-community/dist/lib/entities/colDef';
import * as moment from 'moment';
import { ExcelService } from '../services/excel.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { title } from 'process';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})

export class ConsultaComponent implements OnInit {

  columnDefs = [
    { headerName: 'ID', valueGetter: (args) => this._getIdValue(args), width: 50, checkboxSelection: true },
    { headerName: 'Tipo de Sesión', field: 'tipoSesion.tipoSesion', filter: true, sortable: true, width: 150 },
    { headerName: 'Número de Sesión', field: 'numSesion', filter: true, sortable: true, width: 150 },
    { headerName: 'Lugar Sede', field: 'sede.entidad', filter: true, sortable: true, width: 250 },
    {
      // tslint:disable-next-line: max-line-length
      headerName: 'Fecha y Sede', field: 'fechaSesion', width: 150 },
    {
      headerName: 'Nº Acuerdo', field: 'acuerdos.numAcuerdo', sortable: true, filter: true, width: 200 },
    { headerName: 'Acuerdo', field: 'acuerdos.titulo', sortable: true, filter: true, width: 200 },
    { headerName: 'Descripción', field: 'acuerdos.descipcion', sortable: true, filter: true, width: 300 },
    { headerName: 'Estatus', field: 'acuerdos.estatus.estatus', sortable: true, filter: true, width: 200 }
  ];


  public rowData: Array<any>;
  gridApi: any;
  api: any;
  gridOptions: any;

  // tslint:disable-next-line: no-shadowed-variable
  constructor(private ConferenciasService: ConferenciasService,
              private excelService: ExcelService ) {
  }

  ngOnInit() {
   this.empresas();
  }

  empresas() {
    this.ConferenciasService.getEmpresas().subscribe(response => {
      this.rowData = response;
    });
  }

  _getIdValue(args: ValueGetterParams): any {
    return (Number(args.node.id)) + 1;
  }

  generatePdf() {
    const datas = new Array();
    const title = [{ text: 'Sesión', italics: true, color: 'black'},
      { text: 'Fecha', italics: true, color: 'black'},
      { text: 'Acuerdo', italics: true, color: 'black'},
      { text: 'Acciones', italics: true, color: 'black'},
      { text: 'Observaciones', italics: true, color: 'black'},
      { text: 'Entidad', italics: true, color: 'black'}];

    datas.push(title);

    this.gridApi.forEachNode(function printNode(node) {
      /*acuerdo.concat(
        [{ text: node.data.tipoSesion.tipoSesion, italics: true, color: 'black' },
        { text: node.data.acuerdos.descipcion, italics: true, color: 'black' },
        { text: node.data.sede.entidad, italics: true, color: 'black' },
        { text: node.data.fechaSesion, italics: true, color: 'black' },
        { text: node.data.acuerdos.numAcuerdo, italics: true, color: 'black' },
        { text: node.data.acuerdos.estatus.estatus, italics: true, color: 'black' }]
      );*/
        const data = [{ text: node.data.tipoSesion.tipoSesion, italics: true, color: 'black' },
        { text: node.data.acuerdos.descipcion, italics: true, color: 'black' },
        { text: node.data.sede.entidad, italics: true, color: 'black' },
        { text: node.data.fechaSesion, italics: true, color: 'black' },
        { text: node.data.acuerdos.numAcuerdo, italics: true, color: 'black' },
        { text: node.data.acuerdos.estatus.estatus, italics: true, color: 'black' }];

        datas.push(data);
    });

    console.log(datas);

    const documentDefinition = {

      pageSize: 'LEGAL',
      pageOrientation: 'landscape',

      content: [
        'Dirección General de Coordinación y Operaciones',

        {
          bold: true,
          ul: [
            'Sistema de Acuerdos'
          ]
        },
        {},
        {
          style: 'tableExample',
          table: {
            widths: [50, 50, 150, 150, 150, 100 ],
            body: datas
          }
        },
      ]
     };

    pdfMake.createPdf(documentDefinition).open();
  }

  exportAsXLSX() {
    const acuerdo = [];

    this.gridApi.forEachNode(function printNode(node, index) {
      console.log(acuerdo);
      acuerdo.push({
        Tipo_de_Sesión: node.data.tipoSesion.tipoSesion, Fecha_Sesion: node.data.fechaSesion,
        Sede: node.data.sede.entidad, Número_de_Acuerdo: node.data.acuerdos.numAcuerdo,
        Acuerdo: node.data.acuerdos.titulo, Descripción: node.data.acuerdos.descipcion,
        Estatus: node.data.acuerdos.estatus.estatus
       });
    });
    this.excelService.exportAsExcelFile(acuerdo, 'Acuerdo');

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.gridColumnApi = params.columnApi;
  }

}
