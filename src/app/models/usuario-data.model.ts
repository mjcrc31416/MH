import {DocInfoDataModel} from './doc-info-data.model';

export class UsuarioDataModel {
  _id?: string;

  nombre: string;
  appat: string;
  apmat: string;
  correo: string;
  pwd: string;
  tusuario: Object;
  vincular: Object;
  policia: Object;
  equipo: string;

  docInfo: DocInfoDataModel;

  constructor() {
    this.pwd = '',
    this.nombre = '',
    this.appat = '',
    this.apmat = '',
    this.docInfo = null,
    this.correo = '',
    this.tusuario = '',
    this.vincular = '',
    this.equipo = '',
    this._id = null,
    this.policia = null

  }

}
