import {DocInfoDataModel} from './doc-info-data.model';

export class TerminalDataModel {
  _id?: string;

  nombres: string;
  uuid: string;
  token: string;
  marca: string;
  noInventario: string;
  noAleatorio: string;
  fechagenpin: Date;
  fechagenpinmax: string;
  registroActivo: Boolean;
  usuarios: Object;
  tipo: Object;
  institucion: Object;
  sede: Object;
  municip: Object;

  constructor() {
    this.nombres = '',
    this.uuid = '',
    this.token = '',
    this.marca = '',
    this.noInventario = '',
    this.noAleatorio = '',
    this.fechagenpin = null,
    this.fechagenpinmax = '',
    this._id = null,
    this.registroActivo = true,
    this.usuarios = null,
    this.tipo = {},
    this.institucion = {},
    this.sede = {},
    this.municip = {}

  }

}
