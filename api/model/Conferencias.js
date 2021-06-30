// Conferencias

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = require('bson');


// Define collection and schema for Business
let Conferencia = new Schema({
  nincidente: {
    type: Object
  },
  reporta: {
    type: Number
  },
  atiende: {
    type: String
  },
  incidente: {
    type: String
  },
  coordinadora: {
    type: String
  },
  municipio: {
    type: String
  },
  torre: {
    type: String
  },
  texto: {
    type: String
  },
  fecha: {
    type: String
  },
},{
  collection: 'Conferencias',
  strict: false
});

module.exports = mongoose.model('Conferencias', Conferencia);
