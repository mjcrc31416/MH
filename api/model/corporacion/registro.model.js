// DATOS PERSONALES

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DatosPersonales = require('../individuo/datpers.model');
const Direccion = require('../common/direcciones.model');

// Define collection and schema for Business
let Registro = new Schema({
  evento: {
    type: String
  },
  appat: {
    type: String
  },
  apmat: {
    type: String
  },
  nombre: {
    type: String
  },
  calle: {
    type: String
  },
  numero: {
    type: String
  },
  numInt:
  {
    type: String
  },
  colonia: {
    type: String
  },
  cp: {
    type: String
  },
  municipio: {
    type: String
  },
  entidad: {
    type: String
  },
  celular: {
    cve: {type: String},
    nom: {type: String}
  },
  descel: {
    type: String
  },
  cartera: {
    cve: {type: String},
    nom: {type: String}
  },
  descart: {
    type: String
  },
  reloj: {
    cve: {type: String},
    nom: {type: String}
  },
  desreloj: {
    type: String
  },
  observaciones: {
    type: String
  },
  datPer: {
    type: DatosPersonales.schema
  },
  domicilio: {
    type: Direccion.schema
  },
});

module.exports = mongoose.model('registros', Registro);
