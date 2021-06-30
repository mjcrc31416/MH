//

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let AprobacionEstatus = new Schema({
  estatus: {
    type: String
  },
  bnid: {
    type: Number
  }
});

module.exports = mongoose.model('estatus-aprobacion', AprobacionEstatus);
