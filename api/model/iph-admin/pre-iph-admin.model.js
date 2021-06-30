// PRE IPH ADMIN

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DetenidoRes = require('./detenido-res.model');
const Direccion = require('../common/direcciones.model');


// Define collection and schema for Business
let NewModel = new Schema({
  idEvento: {
    type: Schema.ObjectId
  },
  idLocal: {
    type: String
  },

  conocimiento: {
    tipoConocimiento: {
      type: Object
    },
    conocimientoOtro: {
      type: String
    },
    folio911 : {
      type: String
    },
    folioInterno : {
      type: String
    },
    folioIph : {
      type: String
    },
    ultimaMod: {type: Date},
    arribo: {type: Date}
  },
  /*
    lugarInter: {
      entidad: {
        type: String
      },
      municipio: {
        type: String
      },
      cp: {
        type: String
      },
      colonia: {
        type: String
      },
      calle: {
        type: String
      },
      numero: {
        type: String
      },
      numInt: {
        type: String
      },
      referencias: {
        type: String
      },
      entreCalle: {
        type: String
      },
      entreCalle2: {
        type: String
      },
      lat: {
        type: String
      },
      long: {
        type: String
      },
      fecha: {
        type: Date
      },
    },
  */
  intervencion: {
    ubicacion: {type: Direccion.schema},
    referencias: {type: String},
    lat: {type: String},
    long: {type: String},
    ultimaMod: {type: Date},
  },

  narrativa: {
    narrativa: {type: String},
    ultimaMod: {type: Date},
  },

  /*
  narrativa: {
    type: String
  },
  */
  detenidos: [{
    type: DetenidoRes.schema
  }],

  vehiculos: [{
    fechaRetencion: {type: Date},
    tipoVehiculo: {type: Object},
    otroTipoVehiculo: {type: String},
    procedencia: {type: Object},
    marca: {type: String},
    uso: {type: Object},
    submarca: {type: String},
    modelo: {type: String},
    color: {type: String},
    placa: {type: String},
    noSerie: {type: String},
    observaciones: {type: String},
    destino: {type: String},
    primerRespondientes: {type: Object},
    ultimaMod: {type: Date},
    _id: {type: Schema.ObjectId},
    idLocal: {
      type: Number
    },
  }],

  puestaDisposicion:{
    puestaDisp: {type: Date},
    noExp: {type: String},
    unidadArribo: {type: String},
    isUnidadArribo: {type: Boolean},
    primerResp: {type: Object},
    adscripcion: {type: Object},
    autoridadRecibe: {type: String},
    adscripcionRecibe: {type: String},
    cargoRecibe: {type: String},
    ultimaMod: {type: Date},
    idLocal: {
      type: Number
    },
  },

  estatus: {
    cve: {type: Number},
    nom: {type: String},
    idLocal: {
      type: Number
    },
  },

  ultimaMod: {type: Date},

  primerosRespondientes: {
    type: [Object]
  }
});

module.exports = mongoose.model('pre-iphs', NewModel);
