// ELEMENTOS

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Reporta = require('../model/reporta.model');
const Incidente = require('../model/incidente.model');
const Direccion = require('../model/common/direcciones.model');

// Define collection and schema for Business
let Eventos = new Schema({
  strFecha: { // nno
    type: String
  },
  numCons: { // SI
    type: Number
  },
  nincidente: { // SI
    type: String
  },
  reporta: { //si
    type: Reporta.schema
  },
  atiende: { //si
    type: Object
  },
  tincidente: { //si
    type: Incidente.schema
  },
  stincidente: { //si
    type: Incidente.schema
  },
  incidente: { //si
    type: Incidente.schema
  },
  coordinadora: { //si
    type: Object
  },
  municipio: { //no
    type: Object
  },
  torre: { //si
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
  denunciante: { //si
    type: String
  },
  texto: { //si
    type: String
  },
  fecha: { //si
    type: Date
  },
  lat: { //si **
    type: String
  },
  long: { //si **
    type: String
  },
  folio911: { //si
    type: String
  },
  folioInterno: { //si
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
  ubicacionEvento: { // SI
    type: Direccion.schema
  },
  estatus: { //NO
    type: Object
  },
  asignacionPrimResp:[ { //NO
    type: Object
  }],
  fechaAsignacion: { // SI
    type: Date
  },
  ultimaActualizacion: { //SI
    type: Date
  },
  localUpdateTS: { //NO
    type: Date
  },
  arribo: {
    fechaArribo: {type: Date},
    geolocation: {type: Object},
    idUsr: {type: String},
    idTerminal: {type: String},
  },
  aceptado: {
    fechaArribo: {type: Date},
    geolocation: {type: Object},
    idUsr: {type: String},
    idTerminal: {type: String},
  }
});

module.exports = mongoose.model('eventos', Eventos);
