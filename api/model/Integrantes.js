// Business.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Integrantes = new Schema({
  nomIntegrante: {
    type: Object
  },
  cargo: {
    type: String
  },
  sector: {
    type: Object
  },
  inst: {
    type: Object
  },
  entidad: {
    type: Object
  },
  domicilio: {
    type: Object
  },
  correo: {
    type: Object
  },
  tel: {
    type: Object
  },
  secre: {
    type: Object
  },
  atendido: {
    type: Object
  }
});

module.exports = mongoose.model('integrantes', Integrantes);
