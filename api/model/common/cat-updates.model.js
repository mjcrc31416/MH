const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CatUpdates = new Schema({
  typeCat: {
    type: String
  },
  edos: {
    type: Date
  },
});

module.exports = mongoose.model('cat-updates', CatUpdates);
