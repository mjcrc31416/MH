// PERSONAL

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DatPers = require('../individuo/datpers.model');
const DatEmps = require('../individuo/datemple.model');

// Define collection and schema for Business
let NewModel = new Schema({

  No_empleado: {
    type: String
  },
  Tipo_nomina: {
    type: String
  },
  Cod_puesto: {
    type: String
  },
  Nom_puesto: {
    type: String
  },
  imgUrl: {
    type: String
  },
  datPer: {
    type: DatPers.schema
  }
});

module.exports = mongoose.model('persons', NewModel);
