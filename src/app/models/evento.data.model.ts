import {IDireccionModel} from './idireccion.model';


export class EventoDataModel {
  [x: string]: any;
  _id?: string;

  reporta: any;
  atiende: any;
  coordinadora: any;
  incidente: any;
  torre: any;
  texto: string;
  fecha: Date;
  folio911: String;
  folioInterno: String;
  tincidente: Object;
  stincidente: Object;
  numCons: Number;
  estatus: Object;
  ultimaActualizacion: Date;
  fechaAsignacion: Date;
  asignacionPrimResp: Object;
  strFecha: String;
  tipo: Object;
  institucion: Object;
  sede: Object;
  municip: Object;
  nincidente?: string;
  denunciante: string;
  
  ubicacionEvento?: IDireccionModel;


  constructor() {

    this.reporta = '',
    this.atiende = '',
    this.coordinadora = '',
    this.incidente = '',
    this.torre = '',
    this.texto = '',
    this.fecha = null,
    this.folio911 = '',
    this.folioInterno = '',
    this.tincidente = '',
    this.stincidente = '',
    this.numCons = null,
    this.estatus = '',
    this.denunciante = '',
    this.ultimaActualizacion = null,
    this.fechaAsignacion = null,
    this.asignacionPrimResp = '',
    this.strFecha = '',
    this.tipo = {},
    this.institucion = {},
    this.sede = {},
    this.municip = {}
    this.ubicacionEvento = new IDireccionModel()

  }

}
