

module.exports = {
    asignarEvento: asignarEvento,
    findAsignaciones: findAsignaciones,
    updateWithClientData: updateWithClientData,
};

const mongoose = require('mongoose');
const UsuarioAsignaciones = require('../model/common/usuario-asignaciones.model');
const VWAsignaciones = require('../model/common/vw-asignaciones.model');
const _ = require('lodash');

async function asignarEvento(idEvento, idUsuario) {
    try {
        console.log("asignarEvento (1)");
        // Obtener la información del usuario
        let userData = await UsuarioAsignaciones.findOne({idUsr: idUsuario}, null, {lean: true}).exec();
        console.log();
        console.log(userData);

        if(isNullOrEmpty(userData)) {
            console.log("asignarEvento (2)");
            userData = factory_asignarEvento(idUsuario);
        }

        console.log("asignarEvento (3)");
        console.log(userData);

        let foundIdEvt = false;
        for (let item of userData.asigs) {
            console.log(item);
            if (item.idEvt.toString() == idEvento) {
                console.log("asignarEvento (3.1)");
                foundIdEvt = true;
                item.fclick = null;
                item.idTerClick = null;
            }
        }

        if (!foundIdEvt) {
            userData.asigs.push(factory_asignacion(idEvento));
        }

        let dbRes = await UsuarioAsignaciones.findOneAndUpdate({_id: userData.idUsr}, userData, {
            new: true,
            upsert: true
        });

        console.log("asignarEvento (4)");
    } catch (e) {
        console.log("asignarEvento (5)");
        console.log(`[asignarEvento] error ${e}`);
    }
}



async function findAsignaciones(idUsuario) {
    try {
        // Obtener la información del usuario
        let userData = await UsuarioAsignaciones.findOne({idUsr: idUsuario}, {lean: true}).exec();
        if (!_.isNil() && !_.isEmpty(userData)) {
            return {
                l: null,
                r: userData
            };
        } else {
            return {
                l: new USARIOASIGNACIONES_NOTFOUND_FAILURE(),
                r: null,
            };
        }
    } catch (e) {
        console.log(`[asignarEvento] error ${e}`);
        return {
            l: new USARIOASIGNACIONES_UNKNOW_FAILURE(),
            r: null,
        };
    }
}



async function updateWithClientData(clientData) {
    try {
        console.log("updateWithClientData (1)");
        console.log(clientData);
        // Obtener información del usuario
        //let userData = await UsuarioAsignaciones.findOne({idUsr: clientData.idUsr}, null, {lean: true}).exec();
        let userData = await VWAsignaciones.findOne({idUsr: clientData.idUsr}, null, {lean: true}).exec();
        console.log(userData);

        // Si no existe en la base de datos, retornar un error
        // El evento debió existir en la base de datos
        if (isNullOrEmpty(userData)) {
            console.log("updateWithClientData (2)");
            return {
                l: new USARIOASIGNACIONES_UNKNOW_FAILURE(),
                r: null,
            };
        }

        // Actualizar asignaciones
        console.log("updateWithClientData (3)");
        let pendingAsgmt = [];
        for(let item of userData.asigs) {
            for(let clientItem of clientData.asigs) {
                if (item.idEvt == clientItem.idEvt) {
                    console.log("updateWithClientData (4)");
                    item.fclick = clientItem.fclick;
                    item.idTerClick = clientItem.idTerClick;
                }
            }

            if(isNullOrEmpty(item.fclick)) {
                console.log("updateWithClientData (5)");
                pendingAsgmt.push(item);
            }
        }

        // Añadir latlong del dispositivo
        console.log("updateWithClientData (6)");
        for(let clientItem of clientData.ruta) {
            userData.ruta.push(clientItem);
        }

        console.log("updateWithClientData (7)");
        let dbRes = await UsuarioAsignaciones.findOneAndUpdate({_id: userData.idUsr}, userData, {
            new: true,
            upsert: true
        });

        // TODO: Revisar que pasa cuando la asignación ya es muy antigua
        return {
            l: null,
            r: {
                idUsr: clientData.idUsr,
                asigs: pendingAsgmt
            }
        }
    } catch (e) {
        console.log(`[asignarEvento] error ${e}`);
        return {
            l: new USARIOASIGNACIONES_UNKNOW_FAILURE(),
            r: null,
        };
    }
}

// TODO: Revisar si sirve, si no, borrar
// async function findPendingAsgmt(idUsr) {
//     let userData = await UsuarioAsignaciones.findOne({idUsr: idUsuario, 'asigs.fclick': null}, {lean: true}).exec();
//     return userData;
// }


function factory_asignarEvento(idUser) {
    return {
        idUsr: idUser,
        asigs: [],
        ruta: []
    };
}

function factory_asignacion(idEvento) {
    return {
        idEvt: idEvento,
        fa: Date(),
        fclick: null,
        idTerClick: null
    };
}



function isNullOrEmpty(data) {
    if(!_.isNil(data) && !_.isEmpty(data)) {
        return false;
    }
    return true;
}

function USARIOASIGNACIONES_NOTFOUND_FAILURE() {
    return {}
}



function USARIOASIGNACIONES_UNKNOW_FAILURE() {
    return {}
}
