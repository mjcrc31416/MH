// ELEMENTOS

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Reporta = new Schema({
  nombre: {
    type: String
  },
  test: {
    type: String
  },
  test2: {
    type: String
  },
});

module.exports = mongoose.model('instreportes', Reporta);
