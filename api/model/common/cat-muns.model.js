const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CatMuns = new Schema({
  cve: {
    type: String
  },
  nomOf: {
    type: String
  },
  nomCor: {
    type: String
  },
});

module.exports = mongoose.model('cat-muns', CatMuns);
