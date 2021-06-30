// ELEMENTOS

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Elementos = new Schema({
  nombres: {
    type: String
  },
  appat: {
    type: String
  },
  apmat: {
    type: String
  },
  fecNac: {
    type: Date
  },
  institucion: {
    type: Object
  },
  cargoGrado: {
    type: String
  },
  email: {
    type: String
  },
  usuario: {
    type: String
  },
  tel: {
    type: String
  },
  cup: {
    type: String
  },
  cuip: {
    type: String
  },
  rfc: {
    type: String
  },
  curp: {
    type: String
  },
  pwd: {
    type: String
  }
});

module.exports = mongoose.model('elementos', Elementos);
