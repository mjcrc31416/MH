// CORPORACIONES
// CATALOGO DE USUARIOS


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DocInfMin = require('../common/doc-inf-min.model');

// Define collection and schema for Business
let Unidades = new Schema({
  cve: {
    type: String
  },
  nomOfi: {
    type: String
  },
  nomCor: {
    type: String
  },

  docInfo: {
    type: DocInfMin.schema
  }
});

module.exports = mongoose.model('unis', Unidades);
