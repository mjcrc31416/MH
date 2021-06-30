

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
const mongoose = require('mongoose');
const IphAdmDetenidoKotMapper = {};
const IphAdmUbicacionKotMapper = require('../mappers/iph-adm-ubicacion-kot.mapper').IphAdmUbicacionKotMapper;
const _ = require('lodash');


IphAdmDetenidoKotMapper.serverToLocalWithData = function(serverData, localData) {
    //
    let data = {
        id: localData.id,

        _id: serverData._id,
        idEvento: serverData.idEvento,
        // idLocal: serverData.idLocal,
        idPreIph: serverData.idPreIph,

        fechaDetencion: serverData.fechaDetencion,
        ultimaMod: serverData.ultimaMod,
        descripcion: serverData.descripcion,

        datPar: {
            id : localData.id,

            _id: serverData.intervencion.datPer._id,
            nombre: serverData.intervencion.datPer.nombre,
            appat: serverData.intervencion.datPer.appat,
            apmat: serverData.intervencion.datPer.apmat,
            fecnac: serverData.intervencion.datPer.fecnac,
            sexo: {
                id: localData.id,
                _id: serverData.intervencion.datPer.sexo._id,
                cve: serverData.intervencion.datPer.sexo.cve,
                nom: serverData.intervencion.datPer.sexo.nom,
            },
            alias: serverData.intervencion.datPer.alias,
            nacionalidad: {
                cve: serverData.intervencion.datPer.nacionalidad.cve,
                nom: serverData.intervencion.datPer.nacionalidad.nom,
            },
            entidadNacimiento: {
                id: localData.datPar.entidadNacimiento.id,
                cve: serverData.intervencion.datPer.entidadNacimiento.cve,
                entidad: serverData.intervencion.datPer.entidadNacimiento.nomOf,
                abr: serverData.intervencion.datPer.entidadNacimiento.nomCor,
            }
        },

        tieneLesionesVisibles : (serverData.lesVis.cve == "1" ) ? true : false,
        tienePadecimientos    : (serverData.tienePad.cve == "1" ) ? true : false,
        esGrupoVulnerable     : (serverData.esGpoVul.cve == "1" ) ? true : false,

        padecimientos   : serverData.padecimiento,
        grupoVulnerable : serverData.grupoVulne,

        alias : serverData.alias,

        domicilio: {
            id : localData.domicilio.id,
            _id : serverData.domicilio._id,
            cp : serverData.domicilio.cp,
            colonia : serverData.domicilio.colonia,
            calle : serverData.domicilio.calle,
            numero : serverData.domicilio.numero,
            numInt : serverData.domicilio.numInt,
            referencias : serverData.domicilio.referencias,
            entreCalle : serverData.domicilio.entreCalle,
            entreCalle2 : serverData.domicilio.entreCalle2,
            lat : serverData.domicilio.lat,
            lon : serverData.domicilio.long,
            ultimaMod : serverData.domicilio.ultimaMod,
            entidadMunicipio : {
                id: localData.domicilio.entidadMunicipio.id,
                entidad: {
                    id: localData.domicilio.entidadMunicipio.entidad.id,
                    cve: serverData.domicilio.entidad.cve,
                    entidad: serverData.domicilio.entidad.nomOf,
                    abr: serverData.domicilio.entidad.nomCor,
                },
                municipio: {
                    id : localData.domicilio.entidadMunicipio.municipio.id,
                    cve : serverData.domicilio.municipio.cve,
                    nomOf : serverData.domicilio.municipio.nomOf,
                    nomCor : serverData.domicilio.municipio.nomCor,
                }
            }
        },

        // TODO: GUARDAR INFORMACIÓN EN LA BBDD
        pics: localData.pics,
        primerResp: localData.primerResp,
        primerRespPrincipal: localData.primerRespPrincipal,
    };

    return data;
}


IphAdmDetenidoKotMapper.localToServer = function(localData) {
    //
    console.log("IphAdmDetenidoKotMapper.localToServer (1) * * * * *  * * * * *  * * * * * * * *  * * * * *");
    console.log(localData);
    let serverData = {
        // "_id": (!mongoose.Types.ObjectId.isValid(localData._id.toString())) ? mongoose.Types.ObjectId() : mongoose.Types.ObjectId(localData._id.toString()),
        "idEvento": localData.idEvento,
        "idLocal":localData.id,
        "idPreIph": localData.idPreIph,

        "intervencion":{
            "datPer":{
                "_id": (!mongoose.Types.ObjectId.isValid(localData.datPar._id)) ? mongoose.Types.ObjectId() : mongoose.Types.ObjectId(localData.datPar._id),
                "nombre":localData.datPar.nombre,
                "appat" :localData.datPar.appat,
                "apmat" : localData.datPar.apmat,
                "fecnac": localData.datPar.fecnac,
                "sexo": {
                    // "_id": localData.datPar.sexo._id,
                    "cve": localData.datPar.sexo.cve,
                    "nom": localData.datPar.sexo.nom,
                },
                "alias": localData.alias.join(","),
                "aliasArr": localData.alias,
                "nacionalidad": {
                    "cve":localData.datPar.nacionalidad.cve,
                    "nom":localData.datPar.nacionalidad.nom,
                },
                "entidadNacimiento":{
                    "cve": localData.datPar.entidadNacimiento.cve,
                    "nomOf": localData.datPar.entidadNacimiento.entidad,
                    "nomCor": localData.datPar.entidadNacimiento.abr,
                    "municipios":null,
                }
            },
            "domicilio": IphAdmUbicacionKotMapper.localToServer(localData.domicilio),
            "descripcion": localData.descripcion,
            "lesVis":{
                "cve": (localData.tieneLesionesVisibles) ? "1" : "2",
                "nom": (localData.tieneLesionesVisibles) ? "SI" : "NO",
            },
            "tienePad":{
                "cve": (localData.tienePadecimientos) ? "1" : "2",
                "nom": (localData.tienePadecimientos) ? "SI" : "NO",
            },
            "padecimiento": localData.padecimientos,
            "esGpoVul":{
                "cve": (localData.esGrupoVulnerable) ? "1" : "2",
                "nom": (localData.esGrupoVulnerable) ? "SI" : "NO",
            },
            "grupoVulne": localData.grupoVulnerable,
            // "esDelOrg":{
            //   "_id":{
            //     "$oid":"5ee16ed7775fd300452c0883"
            //   },
            //   "cve":"2",
            //   "nom":"NO"
            // },
            "fechaDetencion": localData.fechaDetencion,//,Date(),
            // TODO: Falta descripción del lugar del traslado
            "descLugarTraslado":"",
            "imgs": localData.pics.map((item) => { return {filename: item.compFilePath} }),
            "imgsV2": localData.pics.map((item) => { return {
                _id: (!mongoose.Types.ObjectId.isValid(item._id)) ? mongoose.Types.ObjectId() : mongoose.Types.ObjectId(item._id),
                orgFilePath: item.orgFilePath,
                compFilePath: item.compFilePath,
                isPrincipal: item.isPrincipal,
            } }),

            "primerResp": localData.primerResp,

            "primerRespPrincipal": localData.primerRespPrincipal,
        },
        "ultimaMod": localData.ultimaMod
        // TODO: Añadir lista de primeros respondientes, foto original, foto principal,
    };


    console.log("IphAdmDetenidoKotMapper.localToServer (2) * * * * *  * * * * *  * * * * * * * *  * * * * *");
    console.log(serverData);

    return serverData;
} 


IphAdmDetenidoKotMapper.serverToLocal = function(serverData) {
    console.log("BEGIN IphAdmDetenidoKotMapper.serverToLocal > > > > > > > > > > > > > > > > > > > > ")
    // console.log(serverData)
    console.log("END IphAdmDetenidoKotMapper.serverToLocal < < < < < < < < < < < < < < < < < < < < < <")
    return {
        id: Number(serverData.idLocal),
        _id: serverData._id,
        idEvento: serverData.idEvento,
        idLocal: serverData.idLocal,
        idPreIph: serverData.idPreIph,
        fechaDetencion: serverData.intervencion.fechaDetencion,
        ultimaMod: serverData.intervencion.ultimaMod,
        descripcion: serverData.intervencion.descripcion,
        tieneLesionesVisibles: (serverData.intervencion.lesVis.cve == "1") ? true : false,
        tienePadecimientos: (serverData.intervencion.tienePad.cve == "1") ? true : false,
        esGrupoVulnerable: (serverData.intervencion.esGpoVul.cve == "1") ? true : false,
        padecimientos: serverData.intervencion.padecimiento,
        grupoVulnerable: serverData.intervencion.grupoVulne,

        alias: (_.isNil(serverData.intervencion.datPer.alias)) ? [] : serverData.intervencion.datPer.alias.split(","),
        pics: (_.isNil(serverData.intervencion.imgsV2)) ? [] : serverData.intervencion.imgsV2.map((it) => {
            return { 
                id: 0,
                _id: it._id,
                orgFilePath: it.orgFilePath,
                compFilePath: it.compFilePath,
                localStorePath: "",
                isPrincipal: it.isPrincipal,
            }
        }),

        domicilio: IphAdmUbicacionKotMapper.serverToLocal(serverData.intervencion.domicilio),

        datPar: {
            id: serverData.intervencion.datPer.id,
            _id: serverData.intervencion.datPer._id,
            nombre: serverData.intervencion.datPer.nombre,
            appat: serverData.intervencion.datPer.appat,
            apmat: serverData.intervencion.datPer.apmat,
            fecnac: serverData.intervencion.datPer.fecnac,

            alias: serverData.intervencion.datPer.aliasArr,
            sexo: {
                id: 0,
                _id: "",
                cve: serverData.intervencion.datPer.sexo.cve,
                nom: serverData.intervencion.datPer.sexo.nom,
            },//serverData.intervencion.datPer.sexo,
            nacionalidad: {
                id: 0,
                _id: "",
                cve: serverData.intervencion.datPer.nacionalidad.cve,
                nom: serverData.intervencion.datPer.nacionalidad.nom,
            },//serverData.intervencion.datPer.nacionalidad,
            entidadNacimiento: {
                id: 0,
                cve: serverData.intervencion.datPer.cve,
                entidad: serverData.intervencion.datPer.nomOf,
                abr: serverData.intervencion.datPer.nomCor,
            },//serverData.intervencion.datPer.entidadNacimiento,
        },

        primerResp: serverData.intervencion.primerResp,

        primerRespPrincipal: serverData.intervencion.primerRespPrincipal,
    };
}

module.exports.IphAdmDetenidoKotMapper = IphAdmDetenidoKotMapper;


