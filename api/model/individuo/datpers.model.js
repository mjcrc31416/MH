// DATOS PERSONALES

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let DatosPersonales = new Schema({
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
  rfc: {
    type: String
  },
  curp: {
    type: String
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
  depeco: {
    type: Object
  },
});

module.exports = mongoose.model('darpers', DatosPersonales);
