// CORPORACIONES

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tipoCorp = require('./cat-tipo-corp.model');
const DocInfMin = require('../common/doc-inf-min.model');
const Unidades = require('../corporacion/unidad.model');
const Grados = require('../corporacion/grados.model');

// Define collection and schema for Business
let Corporaciones = new Schema({
  nomOfi: {
    type: String
  },
  nomCor: {
    type: String
  },
  siglas: {
    type: String
  },
  cve: {
    type: String
  },
  tipCorp: {
    type: tipoCorp.schema
  },
  unis: [
    {
      type: Unidades.schema
    }
  ],
  grados: [
    {
      type: Grados.schema
    }
  ],
  instPolicial: {
    cve: {type: String},
    nom: {type: String},
  },
  gobierno: {
    cve: {type: String},
    nom: {type: String},
  },
  entidadMunicipio: {
    entidad: {
      cve: {
        type: String
      },
      nomOf: {
        type: String
      },
      nomCor: {
        type: String
      },
    },
    municipio: {
      cve: {
        type: String
      },
      nomOf: {
        type: String
      },
      nomCor: {
        type: String
      },
    }
  },

  docInfo: {
    type: DocInfMin.schema
  }
});

module.exports = mongoose.model('corps', Corporaciones);
