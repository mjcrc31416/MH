const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mcpios = require('./cat-muns.model');

// Define collection and schema for Business
let CatInst = new Schema({
  cve: {
    type: String
  },
  nomOf: {
    type: String
  },
  siglas: {
    type: String
  },
  tipo: {
    type: Object
  },
  institucion: {
    type: Object
  },
  sede: {
    type: Object
  },
  municipio: {
    type: Object
  }
});

module.exports = mongoose.model('cat-instituciones', CatInst);
