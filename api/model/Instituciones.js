const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Instituciones = new Schema({
  cve: {
    type: String
  },
  nom: {
    type: Object
  },
});

module.exports = mongoose.model('cat', Instituciones);