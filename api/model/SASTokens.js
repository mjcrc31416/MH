// Business.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let SASTokens = new Schema({
  token: {
    type: String
  },
  uri: {
    type: String
  },
  startDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  docest: {
    type: Boolean
  }
});

module.exports = mongoose.model('SASTokens', SASTokens);
