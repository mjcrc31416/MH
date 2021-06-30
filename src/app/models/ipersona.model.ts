


export class IPersonaModel {
  _id?: string;

  nombre: string;
  appat: string;
  fecnac: Date;
  sexo: string;
  estadoCivil: string;

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
