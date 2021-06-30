// INFORMACION MINIMA DEL DOCUMENTO

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let DocInfMin = new Schema({
  fecCrea: {
    type: Date
  },
  fecUltMod: {
    type: Date
  },
  isActive: {
    type: Boolean
  },
  idUsrCrea: {
    type: Schema.ObjectId
  },
  idUsrUltMod: {
    type: Schema.ObjectId
  },

});

module.exports = mongoose.model('doc-inf-mins', DocInfMin);
