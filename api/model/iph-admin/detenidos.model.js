// DETENIDOS

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DatosPersonales = require('../individuo/datpers.model');
const ComCat = require('../common/com-cat.model');
const Personal = require('../corporacion/personal.model');
const Direccion = require('../common/direcciones.model');
const DocInfoMin = require('../common/doc-inf-min.model');
const MediaFiliacion = require('../corporacion/dactiloscopia.model');
const Certificado = require('../corporacion/certificado.model');
const Registro = require('../corporacion/registro.model');

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
    domicilio: {
      type: Direccion.schema
    },
    descripcion: {
      type: String
    },
    lesVis: {
      type: ComCat.schema
    },
    tienePad: {
      type: ComCat.schema
    },
    padecimiento: {
      type: String
    },
    esGpoVul: {
      type: ComCat.schema
    },
    grupoVulne: {
      type: String
    },
    esDelOrg: {
      type: ComCat.schema
    },
    fechaDetencion: {
      type: Date
    },
    descLugarTraslado: {
      type: String
    },
    imgs: [{
      type: Object
    }],
  },
  primresp: {
    type: Personal.schema
  },
  docInfo: {
    type: DocInfoMin.schema
  },
  ultimaMod: {
    type: Date
  },
  idLocal: {
    type: String
  },
  mediafiliacion: {
    registro: { type: MediaFiliacion.schema },
    estatus: {
      cve: {type: String},
      nom: {type: String},
    },
    ultimaMod: {
      type: Date
    },
  },
  certificado: {
    registro: { type: Certificado.schema },
    estatus: {
      cve: {type: String},
      nom: {type: String},
    },
    ultimaMod: {
      type: Date
    },
  },
  objetos: {
    registro: { type: Registro.schema },
  },

});

module.exports = mongoose.model('detenidos', MyModel);
