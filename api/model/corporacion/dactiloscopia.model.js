// DATOS PERSONALES

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DatosPersonales = require('../individuo/datpers.model');
const Direccion = require('../common/direcciones.model');

// Define collection and schema for Business
let Dactiloscopia = new Schema({
  evento: {
    type: String
  },
  folioInterno: {
    type: String
  },
  tevento: {
    type: Object
  },
  asunto: {
    type: String
  },
  appat: {
    type: String
  },
  apmat: {
    type: String
  },
  nombre: {
    type: String
  },
  alias: {
    type: String
  },
  edad: {
    type: String
  },
  sexo: {
    cve: {type: String},
    nom: {type: String}
  },
  edocivil: {
    cve: {type: String},
    nom: {type: String}
  },
  nacionalidad: {
    cve: {type: String},
    nom: {type: String}
  },
  lugnacimiento: {
    cve: {type: String},
    nom: {type: String}
  },
  escolaridad: {
    cve: {type: String},
    nom: {type: String}
  },
  ocupacion: {
    cve: {type: String},
    nom: {type: String}
  },
  sueldo: {
    type: String
  },
  calle: {
    type: String
  },
  numero: {
    type: String
  },
  numInt:
  {
    type: String
  },
  colonia: {
    type: String
  },
  cp: {
    type: String
  },
  municipio: {
    type: String
  },
  entidad: {
    type: String
  },
  fecnac: {
    type: String
  },
  complexion: {
    cve: {type: String},
    nom: {type: String}
  },
  colpiel: {
    cve: {type: String},
    nom: {type: String}
  },
  cancabello: {
    cve: {type: String},
    nom: {type: String}
  },
  colcabello: {
    cve: {type: String},
    nom: {type: String}
  },
  formcabello: {
    cve: {type: String},
    nom: {type: String}
  },
  tipcara: {
    cve: {type: String},
    nom: {type: String}
  },
  altfrente: {
    cve: {type: String},
    nom: {type: String}
  },
  ancfrente: {
    cve: {type: String},
    nom: {type: String}
  },
  colojos: {
    cve: {type: String},
    nom: {type: String}
  },
  formojos: {
    cve: {type: String},
    nom: {type: String}
  },
  tamojos: {
    cve: {type: String},
    nom: {type: String}
  },
  fornariz: {
    cve: {type: String},
    nom: {type: String}
  },
  tamnriz: {
    cve: {type: String},
    nom: {type: String}
  },
  forlabios: {
    cve: {type: String},
    nom: {type: String}
  },
  tamlabios: {
    cve: {type: String},
    nom: {type: String}
  },
  menton: {
    cve: {type: String},
    nom: {type: String}
  },
  formenton: {
    cve: {type: String},
    nom: {type: String}
  },
  inclinacion: {
    cve: {type: String},
    nom: {type: String}
  },
  formorejas: {
    cve: {type: String},
    nom: {type: String}
  },
  tamorejas: {
    cve: {type: String},
    nom: {type: String}
  },
  nompadre: {
    cve: {type: String},
    nom: {type: String}
  },
  dompadre: {
    cve: {type: String},
    nom: {type: String}
  },
  nommadre: {
    cve: {type: String},
    nom: {type: String}
  },
  dommadre: {
    cve: {type: String},
    nom: {type: String}
  },
  nomconyugue: {
    cve: {type: String},
    nom: {type: String}
  },
  datPer: {
    type: DatosPersonales.schema
  },
  domicilio: {
    type: Direccion.schema
  },
  imgFrente: {
    filename: {type: String},
    isLoaded: {type: Boolean},
  },
  imgPerIzq: {
    filename: {type: String},
    isLoaded: {type: Boolean},
  },
  imgPerDer: {
    filename: {type: String},
    isLoaded: {type: Boolean},
  },
});

module.exports = mongoose.model('dactiloscopias', Dactiloscopia);
