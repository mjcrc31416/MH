// Business.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let DocInfo = new Schema({
  creacion: {
    type: Date
  },
  ultimaModificacion: {
    type: Date
  },
  idUltimoUsuarioMod: {
    type: Schema.ObjectId
  },
  idUsuarioCreador: {
    type: Schema.ObjectId
  },
  isActive: {
    type: Boolean
  }
});

module.exports = mongoose.model('docinfo', DocInfo);
