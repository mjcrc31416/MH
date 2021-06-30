// ELEMENTOS

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Direccion = new Schema({
  entidad: {
    cve: {
      type: String
    },
    nomOf: {
      type: String
    },
    nomCor: {
      type: String
    },
  },
  municipio: {
    cve: {
      type: String
    },
    nomOf: {
      type: String
    },
    nomCor: {
      type: String
    },
  },
  cp: {
    type: String
  },
  colonia: {
    type: String
  },
  calle: {
    type: String
  },
  numero: {
    type: String
  },
  numInt: {
    type: String
  },
  referencias: {
    type: String
  },
  entreCalle: {
    type: String
  },
  entreCalle2: {
    type: String
  },

  lat: {
    type: String
  },
  long: {
    type: String
  },
});

module.exports = mongoose.model('direcciones', Direccion);
