// Business.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Documentos = new Schema({
  nombre: {
    type: String
  },
  tipo: {
    type: String
  },
  etiquetas: [{type: Schema.ObjectId}],
  estdoc: {
    type: Boolean
  },
  isActive: {
    type: Boolean
  }
});

module.exports = mongoose.model('documentos', Documentos);
