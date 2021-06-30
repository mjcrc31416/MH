
import {PersonaModel} from './persona.model';

export class PersonalDataModel {
  [x: string]: any;
    _id?: string;
  
    cve: string;
    corporacion: Object;
    grado: string;
    tipo: Object;
    institucion: Object;
    sede: Object;
    municip: Object;
  
    datPer?: PersonaModel;

    constructor() {
      this.cve = '',
      this.corporacion = {},
      this.grado = '',
      this.tipo = {},
      this.institucion = {},
      this.sede = {},
      this.municip = {}, 
      this.datPer = new PersonaModel()  
    }
  }
  