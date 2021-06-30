


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let UsuarioAsignaciones = new Schema({
    idUsr: {type: Schema.ObjectId},
    asigs: [{
        idEvt: {type: Schema.ObjectId},
        fa: {type: Date},
        fclick: {type: Date},
        idTerClick: {type: Schema.ObjectId}
    }],
    ruta:[{
        fe: {type: Date},
        lat: {type: Number},
        lon: {type: Number},
        idTer: {type: Schema.ObjectId}
    }]
});

module.exports = mongoose.model('usuario-asignaciones', UsuarioAsignaciones);
