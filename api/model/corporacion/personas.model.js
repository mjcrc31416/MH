// CORPORACIONES
// CATALOGO DE USUARIOS


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Personas = new Schema({
    nombre: {
    type: String
  },
  appat: {
    type: String
  },
  apmat: {
    type: String
  },
  fecnac: {
    type: Date
  },
  sexo: {
    type: Object
  },
  estadoCivil: {
    type: Object
  },
  escolaridad: {
    type: Object
  },
  depco: {
    type: Object
  },
  rfc: {
    type: String
  },
  curp: {
    type: String
  },

  no_empleado: {
    type: String
  },
  tipo_nomina: {
    type: String
  },
  Cod_puesto: {
    type: String
  },
  Nom_puesto: {
    type: String
  }
});

module.exports = mongoose.model('personas', Personas);
