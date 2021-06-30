// ENTIDAD FEDERATIVA

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mcpios = require('./mcpio.model');

// Define collection and schema for Business
let EntidadFederativa = new Schema({
  entCve: {
    type: String
  },
  entNomOfi: {
    type: String
  },
  entNomCor: {
    type: String
  },
  mcpios:[
    {
      type: Mcpios.schema
    }
  ],
  mcpio: {
    type: Mcpios.schema
  }
});

module.exports = mongoose.model('entfeds', EntidadFederativa);
