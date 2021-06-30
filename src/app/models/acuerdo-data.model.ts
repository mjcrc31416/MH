import {InstitucionDataModel} from './institucion-data.model';
import {AccionDataModel} from './accion-data.model';

export interface AcuerdoDataModel {
  _id?: string;
  tmid?: string; // Time Id

  numAcuerdo: string;
  estatus: any;
  titulo: string;
  descipcion: string;
  observacion?: string;
  isActive: boolean;

  responsableList?: InstitucionDataModel[];
  accionesList?: AccionDataModel[];

}
