// TIPO CORP

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let TipoCorp = new Schema({
  cve: {
    type: String
  },
  tipCor: {
    type: String
  },
  ord: {
    type: Number
  }
});

module.exports = mongoose.model('cat-corp-tipos', TipoCorp);
