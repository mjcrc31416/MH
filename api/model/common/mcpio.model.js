// MUNICIPIO

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Municipio = new Schema({
  mncpioCve: {
    type: String
  },
  mncpioNomOfi: {
    type: String
  },
  mncpioNomCor: {
      type: String
  }
});

module.exports = mongoose.model('mcpios', Municipio);
