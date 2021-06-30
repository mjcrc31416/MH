// INCIDENTES

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let NewModel = new Schema({
  incidente: {
    type: String
  },

  cve: {
    type: String
  },
  nomCort: {
    type: String
  },
  descripcion: {
    type: String
  },

});

module.exports = mongoose.model('incidentes', NewModel);
