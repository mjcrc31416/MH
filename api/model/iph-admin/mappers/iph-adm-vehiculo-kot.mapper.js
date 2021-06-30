

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
const mongoose = require('mongoose');
const IphAdmVehiculoKotMapper = {}

IphAdmVehiculoKotMapper.localToServer = function(localData) {
    return {
        idLocal: localData.id,
        fechaRetencion: localData.fechaRetencion,
        tipoVehiculo: {
            cve: localData.tipoVehiculo.cve,
            nom: localData.tipoVehiculo.nom,
        },
        otroTipoVehiculo: localData.otroTipoVehiculo,
        procedencia: {
            cve: localData.procedencia.cve,
            nom: localData.procedencia.nom,
        },
        marca: localData.marca,
        uso: {
            cve: localData.uso.cve,
            nom: localData.uso.nom,
        },
        submarca: localData.submarca,
        modelo: localData.modelo,
        color: localData.color,
        placa: localData.placa,
        noSerie: localData.noSerie,
        observaciones: localData.observaciones,
        destino: localData.destino,
        // TODO: Integrar el dato de los primeros respondientes
        // primerRespondientes: localData.primerRespondientes,
        ultimaMod: localData.ultimaMod,
        _id: (!mongoose.Types.ObjectId.isValid(localData._id)) ? mongoose.Types.ObjectId() : mongoose.Types.ObjectId(localData._id),//localData._id,
    };
}

IphAdmVehiculoKotMapper.serverToLocal = function(serverData) {
    return {
        id: serverData.idLocal,
        _id: serverData._id,
        fechaRetencion: serverData.fechaRetencion,
        otroTipoVehiculo: serverData.otroTipoVehiculo,
        marca: serverData.marca,
        submarca: serverData.submarca,
        modelo: serverData.modelo,
        color: serverData.color,
        placa: serverData.placa,
        noSerie: serverData.noSerie,
        observaciones: serverData.observaciones,
        destino: serverData.destino,
        ultimaMod: serverData.ultimaMod,

        tipoVehiculo: {
            id: 0,
            cve: serverData.tipoVehiculo.cve,
            nom: serverData.tipoVehiculo.nom,
        }, //ServerData.tipoVehiculo,
        procedencia: {
            id: 0,
            cve: serverData.procedencia.cve,
            nom: serverData.procedencia.nom,
        }, //ServerData.procedencia,
        uso: {
            id: 0,
            cve: serverData.uso.cve,
            nom: serverData.uso.nom,
        },//ServerData.uso,
    };
}


module.exports.IphAdmVehiculoKotMapper = IphAdmVehiculoKotMapper;
