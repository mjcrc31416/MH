// Business.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let reporta = new Schema({
  nombre: {
    type: String
  }
});

module.exports = mongoose.model('reportaEvento', reporta);
