import {IDireccionModel} from './idireccion.model';


export class JuezDataModel {
  [x: string]: any;
  _id?: string;

  incidente: any;
  texto: any;
  fecha: Date;
  folio911: String;
  folioInterno: String;
  tincidente: Object;
  stincidente: Object;
  ultimaActualizacion: Date;
  fechaAsignacion: Date;
  asignacionPrimResp: Object;
  strFecha: String;
  denunciante: string;
  appat: String;
  apmat: String;
  nombre: String;
  sexo: Object;
  edad: number;
  
  ubicacionEvento?: IDireccionModel;


  constructor() {

    this.incidente = ''
    this.texto = '',
    this.fecha = null,
    this.folio911 = '',
    this.folioInterno = '',
    this.tincidente = '',
    this.stincidente = '',
    this.denunciante = '',
    this.ultimaActualizacion = null,
    this.fechaAsignacion = null,
    this.asignacionPrimResp = '',
    this.strFecha = '',
    this.appat = '',
    this.apmat = '',
    this.nombre = '',
    this.denunciante = '',
    this.sexo = '',
    this.edad = null,
    this.ubicacionEvento = new IDireccionModel()

  }

}
