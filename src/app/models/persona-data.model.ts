

export class PersonaDataModel {
  [x: string]: any;
  _id: string;
  
    nombre: string;
    appat: string;
    apmat: Object;
    fecnac: Date;
    sexo: string;
    estadoCivil: string;
    escolaridad: string;
    depco: string;
    rfc: string;
    curp: string;

    no_empleado:string;
    tipo_nomina:Object;
    Cod_puesto: string;
    Nom_puesto: string;


    constructor() {
      this._id = null,
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

    this.no_empleado='',
    this.tipo_nomina='',
    this.Cod_puesto='',
    this.Nom_puesto=''

    }
  }
  