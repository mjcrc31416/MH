// Business.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Instituciones = require('../model/Instituciones');
const Acciones = require('../model/Acciones');

// Define collection and schema for Business
let Acuerdos = new Schema({
  numAcuerdo: {
    type: Number
  },
  numRmAcuerdo: {
    type: String
  },
  titulo: {
    type: String
  },
  descipcion: {
    type: String
  },
  observacion: {
    type: String
  },
  estatus: {
    type: Object
  },
  isActive: {
    type: Boolean
  },
  responsableList: [Instituciones.schema],
  accionesList: [Acciones.schema]
});

module.exports = mongoose.model('acuerdos', Acuerdos);
