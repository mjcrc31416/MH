


export class IPersonaModel {
  _id?: string;

  nombre: string;
  appat: string;
  fecnac: Date;
  sexo: string;
  estadoCivil: string;
  escolaridad: string;
  depco: string;

  apmat?: string;
  rfc?: string;
  curp?: string;
  cuip?: string;
  grupoSangre?: string;
  factorRH?: string;

  constructor() {

    this.nombre = '',  
    this.appat = '',  
    this.apmat = '',  
    this.fecnac = new Date,  
    this.sexo = '',
    this.estadoCivil = '',
    this.escolaridad = '',
    this.depco = '',
    this.rfc = '',
    this.curp = '',
    this.cuip = '',
    this.grupoSangre = '',
    this.factorRH = ''

  }

}
