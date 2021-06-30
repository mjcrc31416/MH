// VEHICULOS ESTATUS

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let NewModel = new Schema({
  cve: {
    type: Number
  },
  nom: {
    type: String
  },
});

module.exports = mongoose.model('vehc-ests', NewModel);
