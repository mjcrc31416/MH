
import {DactilModel} from './dactil.model';

export class PersonalDataModel {
  [x: string]: any;
    _id?: string;

    folioInterno: string;
    status: string;
    cve: string;
    corporacion: Object;
    grado: string;
    tipo: Object;
    institucion: Object;
    sede: Object;
    municip: Object;
  
    datPer?: DactilModel;

    constructor() {
      this.cve = '',
      this.corporacion = {},
      this.grado = '',
      this.tipo = {},
      this.institucion = {},
      this.sede = {},
      this.municip = {}, 
      this.datPer = new DactilModel()  
    }
  }
  