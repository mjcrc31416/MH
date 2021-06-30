// DATOS PERSONALES

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DatosPersonales = require('../individuo/datpers.model');
const Direccion = require('../common/direcciones.model');

// Define collection and schema for Business
let Certificado = new Schema({
  folioInterno: {
    type: String
  },
  fopers: {
    type: String
  },
  nombre: {
    type: String
  },
  appat: {
    type: String
  },
  apmat: {
    type: String
  },
  edad: {
    type: String
  },
  sexo: {
    type: Object
  },
  nacionalidad: {
    type: Object
  },
  entidadNacimiento: {
    type: Object
  },
  lugproc: {
    type: String
  },
  ocupacion: {
    type: String
  },
  tcertificado: {
    type: Object
  },
  fecer: {
    type: Date
  },
  practica: {
    type: Object
  },
  aliento: {
    type: Object
  },
  grado: {
    type: Object
  },
  otros: {
    type: String
  },
  intetil: {
    type: Object
  },
  pupilas: {
    type: String
  },
  marcha: {
    type: Object
  },
  lenguaje: {
    type: String
  },
  estado: {
    type: String
  },
  actitud: {
    type: String
  },
  toxicomania: {
    type: Object
  },
  toxi: {
    type: String
  },
  marcha: {
    type: Object
  },
  alcoholismo: {
    type: Object
  },
  alergias: {
    type: Object
  },
  alerg: {
    type: String
  },
  enfermedades: {
    type: Object
  },
  enfcro: {
    type: String
  },
  parterial: {
    type: String
  },
  fcardiaca: {
    type: String
  },
  frespiratoria: {
    type: String
  },
  temperatura: {
    type: String
  },
  rpupilares: {
    type: String
  },
  orofaringe: {
    type: Object
  },
  orofa: {
    type: String
  },
  cardiopul: {
    type: Object
  },
  cardio: {
    type: String
  },
  abdomen: {
    type: Object
  },
  abdo: {
    type: String
  },
  genitales: {
    type: Object
  },
  alteraciones: {
    type: Object
  },
  alter: {
    type: String
  },
  extremidades: {
    type: Object
  },
  extre: {
    type: String
  },
  lesiones: {
    type: Object
  },
  lesi: {
    type: String
  },
  tatuajes: {
    type: String
  },
  perforaciones: {
    type: Object
  },
  perfo: {
    type: String
  },
  observaciones: {
    type: String
  },
  ncertifica: {
    type: String
  },
  cedula: {
    type: String
  },
  feter: {
    type: Date
  },
  datPer: {
    type: DatosPersonales.schema
  },
  domicilio: {
    type: Direccion.schema
  },

});

module.exports = mongoose.model('certificados', Certificado);
