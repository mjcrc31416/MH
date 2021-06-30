// DETENIDOS

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MediafilCatModel = new Schema({
  complexion: [{
    cve: {type: String},
    nom: {type: String},
  }],
  colorpiel: [{
    cve: {type: String},
    nom: {type: String},
  }],

  cantidadcabello: [{
    cve: {type: String},
    nom: {type: String},
  }],
  colorcabello: [{
    cve: {type: String},
    nom: {type: String},
  }],
  formacabello: [{
    cve: {type: String},
    nom: {type: String},
  }],
  tipocara: [{
    cve: {type: String},
    nom: {type: String},
  }],
  alturafrente: [{
    cve: {type: String},
    nom: {type: String},
  }],
  anchofrente: [{
    cve: {type: String},
    nom: {type: String},
  }],
  colorojos: [{
    cve: {type: String},
    nom: {type: String},
  }],
  formaojos:[{
    cve: {type: String},
    nom: {type: String},
  }],
  tamanoojos: [{
    cve: {type: String},
    nom: {type: String},
  }],
  formanariz: [{
    cve: {type: String},
    nom: {type: String},
  }],
  tamanonariz:[{
    cve: {type: String},
    nom: {type: String},
  }],
  formalabios: {
    tipos: [{
      cve: {type: String},
      nom: {type: String},
    }],
  },
  tamanolabios: {
    tipos: [{
      cve: {type: String},
      nom: {type: String},
    }],
  },
  tipomenton: {
    tipos: [{
      cve: {type: String},
      nom: {type: String},
    }],
  },
  formamenton: {
    tipos: [{
      cve: {type: String},
      nom: {type: String},
    }],
  },
  inclinacion: {
    tipos: [{
      cve: {type: String},
      nom: {type: String},
    }],
  },
  formaorejas: {
    tipos: [{
      cve: {type: String},
      nom: {type: String},
    }],
  },
  tamanoorejas: {
    tipos: [{
      cve: {type: String},
      nom: {type: String},
    }],
  },

  ultimaMod: {type: Date},

});

module.exports = mongoose.model('mediafilcats', MediafilCatModel);
