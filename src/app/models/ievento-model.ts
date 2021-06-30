import {IDireccionModel} from './idireccion.model';


export interface IEventoModel {
  [x: string]: any;
  _id?: string;

  reporta: any;
  atiende: any;
  coordinadora: any;
  municipio: any;
  incidente: any;
  torre: any;
  texto: any;
  fecha: Date;

  nincidente?: string;
  denunciante?: string;
  ubicacionEvento?: IDireccionModel;


}
