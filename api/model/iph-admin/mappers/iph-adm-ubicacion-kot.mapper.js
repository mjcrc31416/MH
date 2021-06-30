

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
const mongoose = require('mongoose');
const IphAdmUbicacionKotMapper = {}

IphAdmUbicacionKotMapper.localToServer = function(localData) {
    return {
        _id: (!mongoose.Types.ObjectId.isValid(localData._id)) ? mongoose.Types.ObjectId() : mongoose.Types.ObjectId(localData._id),
        idLocal: localData.id,

        lat: localData.lat,
        long: localData.lon,
        cp: localData.cp,
        colonia: localData.colonia,
        calle: localData.calle,
        numero: localData.numero,
        numInt: localData.numInt,
        referencias: localData.referencias,
        entreCalle: localData.entreCalle,
        entreCalle2: localData.entreCalle2,
        ultimaMod: localData.ultimaMod,
        entidad: {
            cve: localData.entidadMunicipio.entidad.id,
            nomOf: localData.entidadMunicipio.entidad.entidad,
            nomCor: localData.entidadMunicipio.entidad.municipio,
        },
        municipio: {
            cve: localData.entidadMunicipio.municipio.id,
            nomOf: localData.entidadMunicipio.municipio.entidad,
            nomCor: localData.entidadMunicipio.municipio.municipio,
        },
    };
}

IphAdmUbicacionKotMapper.serverToLocal = function(serverData) {
    let entMunIds = IphAdmUbicacionKotMapper.getEntMunIds(serverData.entidad.cve, serverData.municipio.cve);

    return {
        id: serverData.idLocal,
        _id: serverData._id,
        cp: serverData.cp,
        colonia: serverData.colonia,
        calle: serverData.calle,
        numero: serverData.numero,
        numInt: serverData.numInt,
        referencias: serverData.referencias,
        entreCalle: serverData.entreCalle,
        entreCalle2: serverData.entreCalle2,
        lat: serverData.lat,
        lon: serverData.long,
        ultimaMod: serverData.ultimaMod,

        entidadMunicipio: {
            id: entMunIds.entMun,
            entidad: {
                id: entMunIds.ent,
                cve: serverData.entidad.cve,
                entidad: serverData.entidad.nomOf,
                abr: serverData.entidad.nomCor,
            },
            municipio: {
                id: entMunIds.mun,
                cve: serverData.municipio.cve,
                nomOf: serverData.municipio.nomOf,
                nomCor: serverData.municipio.nomCor,
            },
        },
    };
}

IphAdmUbicacionKotMapper.getEntMunIds = function (idEnt, idMun) {
    let tmpEnt = Number(idEnt);
    let tmpMun = Number(idMun);


    let tmp = {
        ent: tmpEnt,
        mun: tmpMun,
        entMun: tmpMun,//Number(tmpEnt.toString() + ("000" + tmpMun.toString()).substring(tmpMun.length-3, tmpMun.length))
    };
    console.log(tmp);

    return tmp;
}


module.exports.IphAdmUbicacionKotMapper = IphAdmUbicacionKotMapper;
