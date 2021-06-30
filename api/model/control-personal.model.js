// ELEMENTOS

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Personales = new Schema({
  nombre: {
    type: String
  },
  appat: {
    type: String
  },
  apmat: {
    type: String
  },
  fecnac: {
    type: String
  },

  test: {
    type: String
  },

  test2: {
    type: String
  },
});

module.exports = mongoose.model('personales', Personales);
