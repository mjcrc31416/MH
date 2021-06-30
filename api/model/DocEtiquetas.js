// Business.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let DocEtiquetas = new Schema({
  nombre: {
    type: String
  },
  lwc_nombre: {
    type: String
  }
});

module.exports = mongoose.model('docetiquetas', DocEtiquetas);
