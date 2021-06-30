// TIPO CORP

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DocInfMin = require('../common/doc-inf-min.model');

// Define collection and schema for Business
let Grados = new Schema({
  cveGrado: {
    type: String
  },
  nom: {
    type: String
  },
  ord: {
    type: Number
  },

  docInfo: {
    type: DocInfMin.schema
  }
});

module.exports = mongoose.model('grados', Grados);
