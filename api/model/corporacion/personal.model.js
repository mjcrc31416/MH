// PERSONAL

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DatPers = require('../individuo/datpers.model');
const Grados = require('../corporacion/grados.model');
const TipoCorp = require('../corporacion/cat-tipo-corp.model');
const Unidad = require('../corporacion/unidad.model');
const DocInfMin = require('../common/doc-inf-min.model');

// Define collection and schema for Business
let NewModel = new Schema({
  cve: {
    type: String
  },
  datPer: {
    type: DatPers.schema
  },
  grado: {
    type: Object
  },
  tipo: { //si
    type: Object
  },
  institucion: { //si
    type: Object
  },
  sede: { //si
    type: Object
  },
  municip: { //si
    type: Object
  },
  // corporacion: {
  //   corpId: {
  //     type: Schema.ObjectId
  //   },
  //   _id: {
  //     type: Schema.ObjectId
  //   },
  //   nomOfi: {
  //     type: String
  //   },
  //   nomCor: {
  //     type: String
  //   },
  //   siglas: {
  //     type: String
  //   },
  //   cve: {
  //     type: String
  //   },
  //   tipCorp: {
  //     type: TipoCorp.schema
  //   },
  //   unidad:{
  //     type: Unidad.schema
  //   }
  // },

  docInfo: {
    type: DocInfMin.schema
  }

});

module.exports = mongoose.model('persons', NewModel);
