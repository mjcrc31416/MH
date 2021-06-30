// DETENIDOS

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DatosPersonales = require('../individuo/datpers.model');
const ComCat = require('../common/com-cat.model');
const Personal = require('../corporacion/personal.model');

let MyModel = new Schema({
  idEvento: {
    type: Schema.ObjectId
  },
  idPreIph: {
    type: Schema.ObjectId
  },
  folioRND: {
    type: String
  },
  intervencion: {
    datPer: {
      type: DatosPersonales.schema
    },
    fechaDetencion: {
      type: Date
    }
  },
  idLocal: {
    type: String
  },
});

module.exports = mongoose.model('detenidos-res', MyModel);
