import { Component, OnInit, ViewChild } from '@angular/core';
import {ActionBarItemModel, barActions} from '../../shared/action-bar2/action-bar-model';
import {FormBuilder, Validators} from '@angular/forms';
import {SnackSrvService} from '../../services/snack-srv.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {CertifEvents, CertificadoService} from '../certificado.service';
import {ActionBar2Component} from '../../shared/action-bar2/action-bar2.component';
import * as _ from 'lodash';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material';
import { NumberSequence } from 'ag-grid-community';
import {EventoFactory} from '../../modelFactories/evento-factory';
import { CERTIFICADO } from '../certificado-edit/mock-certificados';
import { PRACTICA } from '../certificado-edit/mock-practica';
import { ALIENTO } from '../certificado-edit/mock-aliento';
import { GRADO } from '../certificado-edit/mock-grado';
import { INTOXICACION } from '../certificado-edit/mock-intoxicacion';
import { MARCHA } from '../certificado-edit/mock-marcha';
import { ROMBERG } from '../certificado-edit/mock-romberg';
import { TOXICOMANIA } from '../certificado-edit/mock-toxicomania';
import { TABAQUISMO } from '../certificado-edit/mock-tabaquismo';
import { ALCOHOLISMO } from '../certificado-edit/mock-alcoholismo';
import { ALERGIAS } from '../certificado-edit/mock-alergias';
import { ENFERMEDADES } from '../certificado-edit/mock-enfermedades';
import { OROFARINGE } from '../certificado-edit/mock-orofaringe';
import { CARDIO } from '../certificado-edit/mock-cardio';
import { ABDOMEN } from '../certificado-edit/mock-abdomen';
import { GENITALES } from '../certificado-edit/mock-genitales';
import { ALTERACIONES } from '../certificado-edit/mock-alteraciones';
import { EXTREMIDADES } from '../certificado-edit/mock-extremidades';
import { LESIONES } from '../certificado-edit/mock-lesiones';
import { PERFORACIONES } from '../certificado-edit/mock-perforaciones';
import { SEXO } from '../certificado-edit/mock-sexo';
import {FormUtilsService} from '../../shared/form-utils.service';
import {TimeInputComponent} from '../../shared/time-input/time-input.component';
import * as moment from 'moment';

@Component({
  selector: 'app-certificado-edit',
  templateUrl: './certificado-edit.component.html',
  styleUrls: ['./certificado-edit.component.scss']
})
export class CertificadoEditComponent implements OnInit {

  sexo = SEXO;
  tcertificado = CERTIFICADO;
  practica = PRACTICA;
  aliento = ALIENTO;
  grado = GRADO;
  intetil = INTOXICACION;
  marcha = MARCHA;
  romberg = ROMBERG;
  toxicomania = TOXICOMANIA;
  tabaquismo = TABAQUISMO;
  alcoholismo = ALCOHOLISMO;
  alergias = ALERGIAS;
  enfermedades = ENFERMEDADES;
  orofaringe = OROFARINGE;
  cardiopul = CARDIO;
  abdomen = ABDOMEN;
  genitales = GENITALES;
  alteraciones = ALTERACIONES;
  extremidades = EXTREMIDADES;
  lesiones = LESIONES;
  perforaciones = PERFORACIONES;

  // Atributos ======================================================================
  _id = null;
  form = this.fb.group({
    certificado: this.fb.group({
      registro: this.fb.group({
    folioInterno: [{value: '', disabled: true},],
    // fopers: [''],
    datPer: this.fb.group({
      appat: [{ value: '', disabled: true }],
      apmat: [{ value: '', disabled: true }],
      nombre: [{ value: '', disabled: true }],
      alias:[{ value: '', disabled: true }],
      sexo: this.fb.group({
        nom: [{ value: '', disabled: true }],
      }),
      nacionalidad: this.fb.group({
        nom: [{ value: '', disabled: true }],
      }),
      entidadNacimiento: this.fb.group({
        nomOf: [{ value: '', disabled: true }],
      }),
      fecnac: [{ value: '', disabled: true }],
    }),
  domicilio: this.fb.group({
    calle: [{ value: '', disabled: true }],
    numero: [{ value: '', disabled: true }],
    numInt: [{ value: '', disabled: true }],
    colonia: [{ value: '', disabled: true }],
    cp: [{ value: '', disabled: true }],
    entidad: this.fb.group({
      nomOf: [{ value: '', disabled: true }],
    }),
    municipio: this.fb.group({
      nomOf: [{ value: '', disabled: true }],
    }),
  }),
    edad: [{ value: '', disabled: true }],
    escolaridad: [{ value: '', disabled: true }],
    ocupacion: [{ value: '', disabled: true }],
    tcertificado: ['', Validators.required],
    fecer: [''],
    practica: ['', Validators.required],
    aliento: ['', Validators.required],
    grado: ['', Validators.required],
    otros: [''],
    intetil: ['', Validators.required],
    pupilas: ['', Validators.required],
    marcha: ['', Validators.required],
    lenguaje: [''],
    estado: [''],
    actitud: [''],
    toxicomania: ['', Validators.required],
    toxi: [''],
    alcoholismo: ['', Validators.required],
    alergias: ['', Validators.required],
    alerg: [''],
    enfermedades: [''],
    enfcro: [''],
    parterial: ['', Validators.required],
    fcardiaca: ['', Validators.required],
    frespiratoria: ['', Validators.required],
    temperatura: ['', Validators.required],
    rpupilares: [''],
    tatuajes: [''],
    perforaciones: ['', Validators.required],
    perfo: [''],
    observaciones: [''],
    orofaringe: ['', Validators.required],
    orofa: [''],
    cardiopul: ['', Validators.required],
    cardio: [''],
    abdomen: ['', Validators.required],
    abdo: [''],
    genitales: ['', Validators.required],
    alteraciones: ['', Validators.required],
    alter: [''],
    extremidades: ['', Validators.required],
    extre: [''],
    lesiones: ['', Validators.required],
    lesi: [''],
    ncertifica: ['', Validators.required],
    cedula: ['', Validators.required],
    feter: [''],
  }),
  estatus: this.fb.group({
    cve: [{ value: '', disabled: true }],
    nom: [{ value: '', disabled: true }],
  }),
}),
ultimaMod: this.fb.group({
  ultimaMod: [{ value: null, disabled: false }],
}),
});
  estatus: string;
  edad: any;
  
    // Constructor and Events ===============================================================
    constructor(
      private snackSrv: SnackSrvService,
      private route: ActivatedRoute,
      private fb: FormBuilder,
      public dialog: MatDialog,
      private router: Router,
      private certificadoSrv: CertificadoService,
      private eventoFct: EventoFactory,
      private formUtils: FormUtilsService,
    ) {
      this.subs.add(
        this.certificadoSrv.eventSource$.subscribe((data) => {
          this.dispatchEvents(data);
          }
        ));
    }
  /*constructor(
    private snackSrv: SnackSrvService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private certificadoSrv: CertificadoService,
    private eventoFct: EventoFactory
  ) {
    this.subs.add(
      this.certificadoSrv.eventSource$.subscribe((data) => {
        this.dispatchEvents(data);
        }
      ));
  }*/
  
  @ViewChild('actionBar2Comp', {static: false}) public  actionBar2: ActionBar2Component;
  @ViewChild('timeComp', {static: false}) public  timeComp: TimeInputComponent;
  private subs: Subscription = new Subscription();
  eventDocumentList = [];
  orgData = null;
  titlesList = ['Certificado Médico', 'Edición'];
  showActionList = [1, 4, 10];
  isSavingData = false;
  mostrarPanel = true;
  isEdit = false;

  // Action Bar Events ====================================================================

  onActionClicked(item: ActionBarItemModel) {
    if (item.id === barActions.finish) {
      // this.toogleMostar();
      this.attemptFinish(event);
    }

    if (item.id === barActions.save) {
      this.attemptSave();
    }

    if (item.id === barActions.exit) {
      // if (!this.isSavingData) {
      //   // this.atttemptApprove();
      // }
      console.log('action exit');
      this.onExit();
    }

    if (item.id === barActions.send) {
      if (!this.isSavingData) {
        // this.atttemptApprove();
      }
    }
  }

  onExit() {
    this.router.navigate(['detenidos-cons']);
  }


  attemptFinish($event) {
    console.log('attempFinish');
    console.log($event);

    const event = this.form.getRawValue();
    console.log(event);

    if (!_.isNil(this._id)) {
      event._id = this._id;
    }

    const estatus = $event.value;
    console.log(estatus);

    this.certificadoSrv.upsertcertificado(event);
    this._id = event._id;

      const confirmacion = confirm('¿Desea Finalizar el registro?');
      if (confirmacion) {
        this.form.get('certificado').disable();
        this.snackSrv.showMsg('El Registro ha sido Concluido');
      }
  }
      // COMPONENT BEHAVIOR ===================================================================
   
      attemptSave() {
        console.log('attemptSave');
        if (!this.isSavingData) {
          if (this.form.valid) {
            console.log('Is valid!');
            const eventoData = this.form.getRawValue();
            console.log(eventoData);

            eventoData.fecha = this.formUtils.getDateFromDateTime({
              feter: eventoData.feter,
              hora: this.timeComp.getData().hora,
              minutos: this.timeComp.getData().minutos,
            });
    
            if (!_.isNil(this._id)) {
              eventoData._id = this._id;
            }
    
            this.certificadoSrv.getById(eventoData);
            this.certificadoSrv.upsertcertificado(eventoData);
          } else {
            this.snackSrv.showMsg('Faltan campos obligatorios');
          }
    
          this.isSavingData = false;
        }//endIf
      }

  ngOnInit() {
    const tempProm = this.route.paramMap.subscribe( (params: ParamMap) => {
      console.log(params);
      const id = params.get('id');

      if (id && id !== '0') {
        // Obtener del servidor
        // this.ctrlSrv.getEventById(id);
        // this.eventoSrv.getEventoById(id);
        // this.isEdit = true;
        this._id = id;
      } else {
        // Es un nuevo elemento de captura
        // this.ctrlSrv.newEvent();
        // this.newItemDefaults();
      }
      if (this._id) {
        this.certificadoSrv.getById(this._id);
      }

    });

    if (this._id) {
      this.certificadoSrv.getAllCatalogo(this._id);
    }

  }


  Edad(data) {
    console.log('Edad');
    console.log(data);
    if (this.form.valid) {
      console.log('Is valid!');
      const eventoData = this.form.getRawValue();
      console.log(eventoData);

      if (!_.isNil(this._id)) {
        eventoData._id = this._id;
      }
      this.certificadoSrv.getById(eventoData);
      this.certificadoSrv.upsertcertificado(eventoData);
    } 

}

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }


  findComboValue(listData, setObjData, attributeName) {
    for (let data of listData) {
      if (data[attributeName] === setObjData[attributeName]) {
        return data;
        break;
      }
    }
  }

  // SERVICE EVENTS =======================================================================
  dispatchEvents(data) {
    console.log('dispatchEvents');
    // Evento
    if (data.event === CertifEvents.DetCatalog) {
      console.log(data);
      if (data.data) {
        const response = data.data;
        console.log('dispatchEvents 1');
        console.log(response.detenido);
        console.log(response.preIph);
        console.log('dispatchEvents 2');
        //this.sexo = response[0].sexo;

        this.form.get('certificado').get('registro').patchValue(response.detenido.intervencion);
        this.form.get('certificado').get('registro').patchValue(response.preIph[0]);


        console.log(response.detenido);
        console.log(response.preIph);
        console.log('dispatchEvents 3');

        console.log('dispatchEvents 4');

        return;
      }
    }

    if (data.event === CertifEvents.UpsertCertificado) {
      console.log(data);
      if (!_.isNil(data)) {
        this.snackSrv.showMsg('Información guardada correctamente!');
        this._id = data.data._id;
      }

      this.isSavingData = false;
    }

    if (data.event === CertifEvents.GetByIdDone) {
      console.log('GetByIdDone');

      if (data.data) {
        const response = data.data;
        console.log(response);
        console.log('GetByIdDone 1');

        if (_.isNil(response.certificado)) {
          console.log('GetByIdDone 1.5');
          response.certificado = {
            registro: {
              folioInterno: response.folioInterno,
              nombre: response.nombre,
              appat: response.appat,
              apmat: response.apmat,
              edad: response.edad,
              sexo: response.sexo,
              entidadNacimiento: response.entidadNacimiento,
              nacionalidad: response.nacionalidad,
              calle: response.calle,
              numero: response.numero,
              numInt: response.numInt,
              colonia: response.colonia,
              entidad: response.entidad,
              municipio: response.municipio,
              fopers: null,
              ocupacion: null,
              escolaridad: null,
              tcertificado: null,
              fecer: null,
              practica: null,
              aliento: null,
              grado: null,
              otros: null,
              intetil: null,
              pupilas: null,
              marcha: null,
              lenguaje: null,
              estado: null,
              actitud: null,
              toxicomania: null,
              toxi: null,
              alcoholismo: null, 
              alergias: null,
              alerg: null,
              enfermedades: null, 
              enfcro: null,
              parterial: null,
              fcardiaca: null,
              frespiratoria: null,
              temperatura: null,
              rpupilares: null,
              tatuajes: null,
              perforaciones: null,
              perfo: null,
              observaciones: null, 
              orofaringe: null,
              orofa: null,
              cardiopul: null,
              cardio: null,
              abdomen: null,
              abdo: null,
              genitales: null,
              alteraciones: null,
              alter: null,
              extremidades: null, 
              extre: null,
              lesiones: null,
              lesi: null,
              ncertifica: null, 
              cedula: null,
              feter: null,
            },
            estatus: {
              cve: 1,
              nom: 'EN PROCESO'
            }
          }
        } else if(_.isNil(response.certificado.estatus)) { 
          response.certificado.estatus = {cve: 1, nom: 'EN PROCESO'}
        } else if(response.certificado.estatus.nom === 'EN PROCESO') { 
          response.certificado.estatus = {cve: 2, nom: 'FINALIZADO'}
        } else {
          this.form.get('certificado').disable();
        }

        this.form.patchValue(response)
        console.log(response);

        console.log('CHUGOOO 33'); 

        console.log('GetByIdDone 2');

        // LLENADO DE LA INFO QUE ES CATALOGO
        let tmpForm = this.form.getRawValue();

        console.log(this.practica);
        
        const dat01 = this.formUtils.findComboValue(this.practica, tmpForm.certificado.registro.practica, 'nom', 'nom');
        console.log(dat01);
        this.form.get('certificado').get('registro').get('practica').patchValue(dat01);

        console.log(this.tcertificado);
        const dat02 = this.formUtils.findComboValue(this.tcertificado, tmpForm.certificado.registro.tcertificado, 'nom', 'nom');
        console.log(dat02);
        this.form.get('certificado').get('registro').get('tcertificado').patchValue(dat02);

        console.log(this.aliento);
        const dat03 = this.formUtils.findComboValue(this.aliento, tmpForm.certificado.registro.aliento, 'nom', 'nom');
        console.log(dat03);
        this.form.get('certificado').get('registro').get('aliento').patchValue(dat03);

        console.log(this.grado);
        const dat04 = this.formUtils.findComboValue(this.grado, tmpForm.certificado.registro.grado, 'nom', 'nom');
        console.log(dat04);
        this.form.get('certificado').get('registro').get('grado').patchValue(dat04);

        console.log(this.intetil);
        const dat05 = this.formUtils.findComboValue(this.intetil, tmpForm.certificado.registro.intetil, 'nom', 'nom');
        console.log(dat05);
        this.form.get('certificado').get('registro').get('intetil').patchValue(dat05);

        console.log(this.marcha);
        const dat06 = this.formUtils.findComboValue(this.marcha, tmpForm.certificado.registro.marcha, 'nom', 'nom');
        console.log(dat06);
        this.form.get('certificado').get('registro').get('marcha').patchValue(dat06);

        console.log(this.toxicomania);
        const dat07 = this.formUtils.findComboValue(this.toxicomania, tmpForm.certificado.registro.toxicomania, 'nom', 'nom');
        console.log(dat07);
        this.form.get('certificado').get('registro').get('toxicomania').patchValue(dat07);

        console.log(this.alcoholismo);
        const dat08 = this.formUtils.findComboValue(this.alcoholismo, tmpForm.certificado.registro.alcoholismo, 'nom', 'nom');
        console.log(dat08);
        this.form.get('certificado').get('registro').get('alcoholismo').patchValue(dat08);

        console.log(this.alergias);
        const dat09 = this.formUtils.findComboValue(this.alergias, tmpForm.certificado.registro.alergias, 'nom', 'nom');
        console.log(dat09);
        this.form.get('certificado').get('registro').get('alergias').patchValue(dat09);

        console.log(this.enfermedades);
        const dat10 = this.formUtils.findComboValue(this.enfermedades, tmpForm.certificado.registro.enfermedades, 'nom', 'nom');
        console.log(dat10);
        this.form.get('certificado').get('registro').get('enfermedades').patchValue(dat10);

        console.log(this.orofaringe);
        const dat11 = this.formUtils.findComboValue(this.orofaringe, tmpForm.certificado.registro.orofaringe, 'nom', 'nom');
        console.log(dat11);
        this.form.get('certificado').get('registro').get('orofaringe').patchValue(dat11);

        console.log(this.cardiopul);
        const dat12 = this.formUtils.findComboValue(this.cardiopul, tmpForm.certificado.registro.cardiopul, 'nom', 'nom');
        console.log(dat12);
        this.form.get('certificado').get('registro').get('cardiopul').patchValue(dat12);

        console.log(this.abdomen);
        const dat13 = this.formUtils.findComboValue(this.abdomen, tmpForm.certificado.registro.abdomen, 'nom', 'nom');
        console.log(dat13);
        this.form.get('certificado').get('registro').get('abdomen').patchValue(dat13);

        console.log(this.genitales);
        const dat14 = this.formUtils.findComboValue(this.genitales, tmpForm.certificado.registro.genitales, 'nom', 'nom');
        console.log(dat14);
        this.form.get('certificado').get('registro').get('genitales').patchValue(dat14);

        console.log(this.alteraciones);
        const dat15 = this.formUtils.findComboValue(this.alteraciones, tmpForm.certificado.registro.alteraciones, 'nom', 'nom');
        console.log(dat15);
        this.form.get('certificado').get('registro').get('alteraciones').patchValue(dat15);

        console.log(this.extremidades);
        const dat16 = this.formUtils.findComboValue(this.extremidades, tmpForm.certificado.registro.extremidades, 'nom', 'nom');
        console.log(dat16);
        this.form.get('certificado').get('registro').get('extremidades').patchValue(dat16);

        console.log(this.lesiones);
        const dat17 = this.formUtils.findComboValue(this.lesiones, tmpForm.certificado.registro.lesiones, 'nom', 'nom');
        console.log(dat17);
        this.form.get('certificado').get('registro').get('lesiones').patchValue(dat17);

        console.log(this.perforaciones);
        const dat18 = this.formUtils.findComboValue(this.perforaciones, tmpForm.certificado.registro.perforaciones, 'nom', 'nom');
        console.log(dat18);
        this.form.get('certificado').get('registro').get('perforaciones').patchValue(dat18);

      }
      this.isSavingData = false;
    }
  }

 // COMPONENT AND USER CONTROL FUNCTIONS =================================================
 setForm(data) {
  this.form.get('sexo').patchValue(data.sexo);
  this.form.get('tcertificado').patchValue(data.tcertificado);
  this.form.get('practica').patchValue(data.practica);
  this.form.get('aliento').patchValue(data.aliento);
  this.form.get('grado').patchValue(data.grado);
  this.form.get('intetil').patchValue(data.intetil);
  this.form.get('marcha').patchValue(data.marcha);
  this.form.get('romberg').patchValue(data.romberg);
  this.form.get('toxicomania').patchValue(data.toxicomania);
  this.form.get('tabaquismo').patchValue(data.tabaquismo);
  this.form.get('alcoholismo').patchValue(data.alcoholismo);
  this.form.get('alergias').patchValue(data.alergias);
  this.form.get('enfermedades').patchValue(data.enfermedades);
  this.form.get('orofaringe').patchValue(data.orofaringe);
  this.form.get('cardiopul').patchValue(data.cardiopul);
  this.form.get('genitales').patchValue(data.genitales);
  this.form.get('alteraciones').patchValue(data.alteraciones);
  this.form.get('abdomen').patchValue(data.abdomen);
  this.form.get('extremidades').patchValue(data.extremidades);
  this.form.get('lesiones').patchValue(data.lesiones);
  this.form.get('perforaciones').patchValue(data.perforaciones);

  this.sexo.forEach((item) => {
    // console.log(item);
    if (data.sexo && item.bid === data.sexo.bid) {
      this.form.get('sexo').patchValue(item);
      return false;
    }
  });
  this.tcertificado.forEach((item) => {
    // console.log(item);
    if (data.tcertificado && item.cve === data.tcertificado.cve) {
      this.form.get('tcertificado').patchValue(item);
      return false;
    }
  });
  this.practica.forEach((item) => {
    // console.log(item);
    if (data.practica.cve) {
      this.form.get('practica').patchValue(item);
      return false;
    }
  });
  this.aliento.forEach((item) => {
    // console.log(item);
    if (data.aliento && item.cve === data.aliento.cve) {
      this.form.get('aliento').patchValue(item);
      return false;
    }
  });
  this.grado.forEach((item) => {
    // console.log(item);
    if (data.grado && item.cve === data.grado.cve) {
      this.form.get('grado').patchValue(item);
      return false;
    }
  });
  this.intetil.forEach((item) => {
    // console.log(item);
    if (data.intetil && item.cve === data.intetil.cve) {
      this.form.get('intetil').patchValue(item);
      return false;
    }
  });
  this.marcha.forEach((item) => {
    // console.log(item);
    if (data.marcha && item.cve === data.marcha.cve) {
      this.form.get('marcha').patchValue(item);
      return false;
    }
  }); 
 this.romberg.forEach((item) => {
    // console.log(item);
    if (data.romberg && item.cve === data.romberg.cve) {
      this.form.get('romberg').patchValue(item);
      return false;
    }
  });
  this.toxicomania.forEach((item) => {
    // console.log(item);
    if (data.toxicomania && item.cve === data.toxicomania.cve) {
      this.form.get('toxicomania').patchValue(item);
      return false;
    }
  });
  this.tabaquismo.forEach((item) => {
    // console.log(item);
    if (data.tabaquismo && item.cve === data.tabaquismo.cve) {
      this.form.get('tabaquismo').patchValue(item);
      return false;
    }
  });
  this.alcoholismo.forEach((item) => {
    // console.log(item);
    if (data.alcoholismo && item.cve === data.alcoholismo.cve) {
      this.form.get('alcoholismo').patchValue(item);
      return false;
    }
  });
  this.alergias.forEach((item) => {
    // console.log(item);
    if (data.alergias && item.cve === data.alergias.cve) {
      this.form.get('alergias').patchValue(item);
      return false;
    }
  });
  this.enfermedades.forEach((item) => {
    // console.log(item);
    if (data.enfermedades && item.cve === data.enfermedades.cve) {
      this.form.get('enfermedades').patchValue(item);
      return false;
    }
  });
  this.orofaringe.forEach((item) => {
    // console.log(item);
    if (data.orofaringe && item.cve === data.orofaringe.cve) {
      this.form.get('orofaringe').patchValue(item);
      return false;
    }
  });
  this.cardiopul.forEach((item) => {
    // console.log(item);
    if (data.cardiopul && item.bid === data.cardiopul.bid) {
      this.form.get('cardiopul').patchValue(item);
      return false;
    }
  });
  this.genitales.forEach((item) => {
    // console.log(item);
    if (data.genitales && item.cve === data.genitales.cve) {
      this.form.get('genitales').patchValue(item);
      return false;
    }
  });
  this.alteraciones.forEach((item) => {
    // console.log(item);
    if (data.alteraciones && item.cve === data.alteraciones.cve) {
      this.form.get('alteraciones').patchValue(item);
      return false;
    }
  });
  this.abdomen.forEach((item) => {
    // console.log(item);
    if (data.abdomen && item.cve === data.abdomen.cve) {
      this.form.get('abdomen').patchValue(item);
      return false;
    }
  });
  this.extremidades.forEach((item) => {
    // console.log(item);
    if (data.extremidades && item.cve === data.extremidades.cve) {
      this.form.get('extremidades').patchValue(item);
      return false;
    }
  });
  this.lesiones.forEach((item) => {
    // console.log(item);
    if (data.lesiones && item.cve === data.lesiones.cve) {
      this.form.get('lesiones').patchValue(item);
      return false;
    }
  });
  this.perforaciones.forEach((item) => {
    // console.log(item);
    if (data.perforaciones && item.cve === data.perforaciones.cve) {
      this.form.get('perforaciones').patchValue(item);
      return false;
    }
  });
 {
    // se supone que es el evento de edicion
  }

  console.log(this.certificadoSrv);

}// setForm <<<<

setFullDate(feterObj) {
  console.log('setFullDate =========================');
  console.log(feterObj);
  this.form.get('certificado').get('registro').get('feter').patchValue(feterObj.feterObj);
  this.timeComp.setByDateTimeObj(feterObj);
}

}
