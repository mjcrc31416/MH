// ELEMENTOS

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Equipo = new Schema({
  imei: {
    type: String
  },
  deviceid: {
    type: String
  },
  fcmtoken: {
    type: String
  },
  pin: {
    type: String
  },
  marca: {
    type: String
  }
});

module.exports = mongoose.model('equipos', Equipo);
