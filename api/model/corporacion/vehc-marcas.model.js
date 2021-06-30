// VEHICULOS MARCAS

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let NewModel = new Schema({
  cve: {
    type: String
  },
  nom: {
    type: String
  },
});

module.exports = mongoose.model('vehc-marcas', NewModel);
