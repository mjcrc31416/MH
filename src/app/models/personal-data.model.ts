
import { EmpleadoModel } from './empleado.model';
import {PersonaModel} from './persona.model';

export class PersonalDataModel {
  [x: string]: any;
  _id?: string;

    no_empleado:string;
    tipo_nomina:Object;
    Cod_puesto: string;
    Nom_puesto: string;

    datPer?: PersonaModel;

    constructor() {

      this.no_empleado='',
      this.tipo_nomina='',
      this.Cod_puesto='',
      this.Nom_puesto='',

      this.datPer = new PersonaModel()
    }
  }
  