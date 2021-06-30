// Business.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let DocLogInfo = new Schema({
  idUsuario: {
    type: Schema.ObjectId
  },
  fecha: {
    type: Date
  },
  tipoModificacion: {
    type: String
  }
});

module.exports = mongoose.model('doc-log-info', DocLogInfo);
