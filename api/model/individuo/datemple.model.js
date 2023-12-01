// DATOS PERSONALES

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let DatosEmpleado = new Schema({

  No_empleado: {
    type: String
  },
  Tipo_nomina: {
    type: String
  },
  Cod_puesto: {
    type: String
  },
  Nom_puesto: {
    type: String
  }
});

module.exports = mongoose.model('datemp', DatosEmpleado);
