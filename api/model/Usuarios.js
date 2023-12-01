// Business.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
  tusuario: {
    type: Object
  },
  vincular: {
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
