
export class IDireccionModel {
  _id?: string;

  entidad: string;
  municipio: string;
  lat: string;
  long: string;

  cp?: string;
  colonia?: string;
  calle?: string;
  numero?: string;
  numInt?: string;
  referencias?: string;
  entreCalle?: string;
  entreCalle2?: string;

  constructor() {

    this.entidad = '',
    this.municipio = '',
    this.lat = '',
    this.long = '',
    this.cp = '',
    this.colonia = '',
    this.calle = '',
    this.numero = '',
    this.numInt = '',
    this.referencias = '',
    this.entreCalle = '',
    this.entreCalle2 = ''

  }

}
