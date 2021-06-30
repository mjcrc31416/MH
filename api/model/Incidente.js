// Business.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Incidente = new Schema({
  id: {
    type: String
  },
  descripcion: {
    type: String
  },
});

module.exports = mongoose.model('incidente', Incidente);
