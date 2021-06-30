// ELEMENTOS

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Terminal = new Schema({
  nombres: {
    type: String
  },
  uuid: {
    type: String
  },
  token: {
    type: String
  },
  marca: {
    type: String
  },
  noInventario: {
    type: String
  },
  noAleatorio: {
    type: String
  },
  fechagenpin: {
    type: Date
  },
  fechagenpinmax: {
    type: Date
  },
  registroActivo: {
    type: Boolean,
    default: true
  },
  fechaRegistro: {
    type: Date
  },
  coordinadora: { //si
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
  usuarios: [{
    _id: {type: Schema.ObjectId},
    correo: {type: String},
    nombre: {type: String},
    policia: {
      _id: {type: Schema.ObjectId},
      datPer: {
        sexo: {type: Object},
        nombre: {type: String},
        appat: {type: String},
        apmat: {type: String},
      }
    },

  }]
});

module.exports = mongoose.model('terminales', Terminal);
