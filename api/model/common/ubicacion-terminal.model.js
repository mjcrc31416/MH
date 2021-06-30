
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
  Geolocation ubicacion;
  DateTime fecha;
  String idUsr;
  String idTerminal;
 */
// Define collection and schema for Business
let UbicacionTerminal = new Schema({
  ubicacion: {
    lat: {type: Number},
    long: {type: Number}
  },
  fecha: {
    type: Date
  },
  idUsr: {
    type: Schema.ObjectId
  },
  idTerminal: {
    type: Schema.ObjectId
  },
});

module.exports = mongoose.model('ubicacion-terminales', UbicacionTerminal);
