// Business.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DocInfo = require('../model/DocInfo');
const Direccion = require('./common/direcciones.model');

// Define collection and schema for Business
let Usuarios = new Schema({
  nombre: {
    type: String
  },
  appat: {
    type: String
  },
  apmat: {
    type: String
  },
  correo: {
    type: String, unique: true, lowercase: true, unique: true
  },
  pwd: {
    type: String
  },
  docInfo: {
    type: DocInfo.schema
  },
  tusuario: {
    type: Object
  },
  vincular: {
    type: Object
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
  idequipo: {
    type: String
  },
  policia: {
    type: Object
  },
  equipo: {
    type: String
  }
});

module.exports = mongoose.model('usuars', Usuarios);
