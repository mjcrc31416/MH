


// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
const mongoose = require('mongoose');
const IphAdmPrimerRespondienteKotMapper = {}

IphAdmPrimerRespondienteKotMapper.localToServer = function(localData) {
    return {
        idLocal: localData.id,
        _id: (!mongoose.Types.ObjectId.isValid(localData._id)) ? mongoose.Types.ObjectId() : mongoose.Types.ObjectId(localData._id),//localData._id,localData._id,

        nombre: localData.nombre,
        appat: localData.appat,
        apmat: localData.apmat,
        otraInstitucion: localData.otraInstitucion,
        cargo: localData.cargo,

        tipoInstitucion: {
            id: 0,
            _id: localData.tipoInstitucion._id,
            cve: localData.tipoInstitucion.cve,
            nom: localData.tipoInstitucion.nom,
        }, //localData.tipoInstitucion,
    };
}

IphAdmPrimerRespondienteKotMapper.serverToLocal = function(serverData) {
    return {
        id: serverData.idLocal,
        _id: serverData._id,
        nombre: serverData.nombre,
        appat: serverData.appat,
        apmat: serverData.apmat,
        otraInstitucion: serverData.otraInstitucion,
        cargo: serverData.cargo,
        
        tipoInstitucion: {
            id: 0,
            _id: serverData.tipoInstitucion._id,
            cve: serverData.tipoInstitucion.cve,
            nom: serverData.tipoInstitucion.nom,
        }, //serverData.tipoInstitucion,
    };
}


module.exports.IphAdmPrimerRespondienteKotMapper = IphAdmPrimerRespondienteKotMapper;
