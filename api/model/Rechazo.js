// Business.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define collection and schema for Business
let Rechazo = new Schema({
  motivo: {
    type: String
  },
  fecha: {
    type: Date
  }
});

module.exports = mongoose.model('rechazo', Rechazo);
