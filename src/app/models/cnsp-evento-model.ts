import * as _ from 'lodash';


export class CnspEventoModel {
  
  _id: string = '';
  tipoSesion: TipoSesionModel = null;
  numSesion: number = 0;
  txSesion: string = '';
  fechaSesion: Date = new Date();
  sede: EntidadFederativaModel = null;
  integrantes: Array<any> = [];
  invitados: Array<any> = [];
  acuerdos: Array<any> = [];
  rechazos: Array<any> = [];
  documentos: Array<string> = [];
  documentosList: Array<any> = [];
  docActive: boolean = true;
  estatusAprobacion: AprobacionEstatusModel = null;

  constructor(data: any) {
    console.log('CONSTRUCTOR CNSP MODEL -----------------------');
    console.log(data);
    Object.keys(this).forEach(key => {
      if (_.isString(this[key])) {
        this[key] = _.get(data, key, this[key]);
      } else

      if (_.isDate(this[key])) {
        this[key] = _.get(data, key, new Date());
      } else

      if (_.isArray(this[key])) {
        console.log(data[key]);
        this[key] = _.get(data, key, []);
      } else

      if (_.isNumber(this[key])) {
        this[key] = _.get(data, key, this[key]);
      } else

      if (_.isObject(this[key])) {
        this[key] = _.get(data, key, this[key]);
      } else {
        this[key] = _.get(data, key, this[key]);
      }
    });
    console.log(this);
    console.log('CONSTRUCTOR CNSP MODEL -----------------------');
  }
}

export interface TipoSesionModel {
  // bid = 0;
  // tipoSesion = '';
  bid: number;
  tipoSesion: string;
}

export class EntidadFederativaModel {
  bid = 0;
  entidad = '';
  abr = '';
}

export interface AprobacionEstatusModel {
  // bid = 0;
  // tipoSesion = '';
  _id?: string;
  bnid: number;
  estatus: string;
}

