// CORPORACIONES
// CATALOGO DE USUARIOS


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DocInfMin = require('../common/doc-inf-min.model');

// Define collection and schema for Business
let NewModel = new Schema({
  coordinadora: {
    type: Object
  },
  placa: {
    type: String
  },
  numEco: {
    type: String
  },
  tipoVehi: {
    type: Object
  },
  marca: {
    type: Object
  },
  modelo: {
    type: String
  },
  vehiculo: {
    type: String
  },
  uso: {
    type: Object
  },
  numSerie: {
    type: Object
  },
  numMotor: {
    type: Object
  },
  estatus: {
    type: Object
  },
  gps: {
    type: String
  },
  tipo: { //si
    type: Object
  },
  institucion: { //si
    type: Object
  },
  sede: { //si
    type: Object
  },
  municip: { //si
    type: Object
  },
  corporacion: {
    _id: {
      type: Schema.ObjectId
    },
    nomOfi: {
      type: String
    },
    nomCor: {
      type: String
    },
    siglas: {
      type: String
    },
    cve: {
      type: String
    },
    unidad: {
      type: Object
    }
  },

  docInfo: {
    type: DocInfMin.schema
  }
});

module.exports = mongoose.model('vehiculos', NewModel);
