// ELEMENTOS

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
    type: String
  },
  rfc: {
    type: String
  },
  curp: {
    type: String
  },
  sexo: {
    type: String
  },
  estadoCivil: {
    type: String
  },
  grupoSangre: {
    type: String
  },
  factorRH: {
    type: String
  },
});

module.exports = mongoose.model('personas', Personas);
