
export class PersonaModel {
  _id?: string;

  nombre: string;
  appat: string;
  fecnac: Date;
  sexo: Object;
  estadoCivil: Object;

  apmat?: string;
  rfc?: string;
  curp?: string;
  cuip?: string;
  grupoSangre?: Object;
  factorRH?: Object;

  constructor() {

    this.nombre = '',  
    this.appat = '',  
    this.apmat = '',  
    this.fecnac = null,  
    this.sexo = '',
    this.estadoCivil = '',
    this.rfc = '',
    this.curp = '',
    this.cuip = '',
    this.grupoSangre = '',
    this.factorRH = ''

  }

}
