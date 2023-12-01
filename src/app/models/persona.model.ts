
export class PersonaModel {
  _id?: string;

  nombre: string;
  appat: string;
  fecnac: Date;
  sexo: Object;
  estadoCivil: Object;
  escolaridad: Object;
  depeco: Object;
  apmat?: string;
  rfc?: string;
  curp?: string;

  constructor() {

    this.nombre = '',  
    this.appat = '',  
    this.apmat = '',  
    this.fecnac = null,  
    this.sexo = '',
    this.rfc = '',
    this.curp = '',
    this.estadoCivil = '',
    this.escolaridad = '',
    this.depeco = ''
  }

}
