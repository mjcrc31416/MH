
export class EmpleadoModel {
  _id?: string;

  no_empleado:string;
  tipo_nomina:Object;
  Cod_puesto: string;
  Nom_puesto: string;

  constructor() {

    this.no_empleado='',
    this.tipo_nomina='',
    this.Cod_puesto='',
    this.Nom_puesto=''

  }

}
