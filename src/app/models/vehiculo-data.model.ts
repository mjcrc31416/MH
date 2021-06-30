

export class VehiculoDataModel {
  [x: string]: any;
  _id?: string;
  
    placa: string;
    numEco: string;
    tipoVehi: Object;
    marca: Object;
    uso: Object;
    numSerie: Object;
    numMotor: Object;
    modelo: string;
    vehiculo: string;
    estatus: Object;
    gps: string;
    corporacion: Object;
    tipo: Object;
    institucion: Object;
    sede: Object;
    municip: Object;

    constructor() {
    this.placa = '',
    this.numEco = '',
    this.tipoVehi = '',
    this.marca = '',
    this.uso = '',
    this.numSerie = '',
    this.numMotor = '',
    this.modelo = '',
    this.vehiculo = '',
    this.estatus = '',
    this.gps = '',
    this.corporacion = {},
    this.tipo = {},
    this.institucion = {},
    this.sede = {},
    this.municip = {}
    }
  }
  