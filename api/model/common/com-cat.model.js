// CATALOGO SIMPLE Y COMUN

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let NewModel = new Schema({
  cat: {
    type: String
  },
  cve: {
    type: String,
  },
  nom: {
    type: String,
  }
});

module.exports = mongoose.model('com-catalogos', NewModel);
