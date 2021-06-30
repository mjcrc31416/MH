const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mcpios = require('./cat-muns.model');

// Define collection and schema for Business
let CatEntMuns = new Schema({
  cve: {
    type: String
  },
  nomOf: {
    type: String
  },
  nomCor: {
    type: String
  },
  municipios: [
    {type: mcpios.schema}
  ]
});

module.exports = mongoose.model('cat-ent-muns', CatEntMuns);
