// Business.js
const Documentos = require('../model/Documentos');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DocInfo = require('../model/DocInfo');
const DocLogInfo = require('../model/DocLogInfo');

// Define collection and schema for Business
let Acciones = new Schema({
  accion: {
    type: String
  },
  descripcion: {
    type: String
  },
  fechaAcuerdo: {
    type: Date
  },
  cons: {
    type: Number
  },
  files: [
    {
      type: Documentos.schema
    }
  ],
  docInfo: {
    type: DocInfo.schema
  },
  docLogList: [{
    type: DocLogInfo.schema
  }]
});

module.exports = mongoose.model('acciones', Acciones);
