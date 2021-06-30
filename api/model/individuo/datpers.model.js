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
  cuip: {
    type: String
  },
  sexo: {
    type: Object
  },
  estadoCivil: {
    type: Object
  },
  grupoSangre: {
    type: Object
  },
  factorRH: {
    type: Object
  },
  nacionalidad: {
    type: Object
  },
  alias: {
    type: String
  },
  entidadNacimiento: {
    type: Object
  },
  coordinadora: { //si
    type: Object
  },
});

module.exports = mongoose.model('darpers', DatosPersonales);
