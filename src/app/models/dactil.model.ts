
export class DactilModel {
  _id?: string;

  nombre: string;
  appat: string;
  apmat: string;
  fecnac: Date;
  edad: Number;
  sexo: Object;
  nacionalidad: Object;
  lugnacimiento: Object;
  escolaridad: Object;
  ocupacion: Object;
  estadoCivil: Object;


  constructor() {

    this.nombre = '',  
    this.appat = '',  
    this.apmat = '',  
    this.fecnac = null,  
    this.edad = null,
    this.sexo = '',
    this.estadoCivil = '',
    this.nacionalidad = '',
    this.lugnacimiento = '',
    this.escolaridad = '',
    this.ocupacion = ''

  }

}
