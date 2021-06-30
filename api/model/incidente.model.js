// ELEMENTOS

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Incidente = new Schema({
  cve: {
    type: String
  },
  nom: {
    type: Object
  },
});

module.exports = mongoose.model('incidentes3', Incidente);
