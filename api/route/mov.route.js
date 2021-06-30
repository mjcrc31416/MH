const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const _ = require('lodash');
//const request = require('request');
const request = require("request-promise");
const moment = require("moment");
const querystring = require('query-string');


const https = require('https');

let Eventos = require('../model/eventos.model');
let PreIphaAdmin = require('../model/iph-admin/pre-iph-admin.model');
let Detenidos = require('../model/iph-admin/detenidos.model');
let Entidades = require('../model/common/cat-ents.model');
let CatUpdates = require('../model/common/cat-updates.model');
let Terminales = require('../model/corporacion/terminal.model');
let Usuarios = require('../model/Usuarios');
let Personals = require('../model/corporacion/personal.model');
let Corporaciones = require('../model/corporacion/copr.model');
let UbicacionTerminal = require('../model/common/ubicacion-terminal.model');
let MediafilCatModel = require('../model/mediafil/mediafilcat.model');
const ADLS = require("@azure/storage-file-datalake");

const STORAGE_ACCOUNT_NAME = "iphg15storage";
const TENANT_NAME = "delitos.app";
const CLIENT_ID = "830d3488-8f18-4bb5-b08c-3929f6d2b98a";
const CLIENT_SECRET = "RUvqtr02igDEjNHO3WxVc3A/nJ?f-WK.";
const ACCOUNT_NAME = "devcni@outlook.com";
const ACCOUNT_KEY = "Nstl+8485";


//>> KOTLIN ================================
let LogData = require('../model/common/logdata.model');
const IphAdmDetenidoKotMapper = require('../model/iph-admin/mappers/iph-adm-detenido-kot.mapper').IphAdmDetenidoKotMapper;
const IphAdmKotMapper = require('../model/iph-admin/mappers/iph-adm-kot.mapper').IphAdmKotMapper;

const EventosMapper = require('../model/eventos/mappers/eventos-mapper').EventosMapper;
//>> KOTLIN ================================


//>> ACTUALIZAR EL ESTATUS DEL EVENTO ================================
router.route('/updestatus').post(function (req, res) {
  console.log('updestatus (1)');
  let fnMain = async (req,res) => {
    try {
      let response = await eventoUpdateEstatus(req.body);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };
  console.log('updestatus (2)');

  fnMain(req, res);
});

async function eventoUpdateEstatus (data) {
  try {
    let evento = await Eventos.findOne({_id: data._id}).exec();
    if (evento) {
      // Actualizar
      // TODO: Validar si el dato del local update ts del servidor es más actual que el de
      if (evento_isLocalDataNewer(data, evento)) {
        evento.estatus = data.estatus;
        evento.localUpdateTS = data.localUpdateTS;
        evento.arribo = data.arribo;
        evento.aceptado = data.aceptado;
      }

      await evento.save();
      evento = await Eventos.findOne({_id: data._id}).lean();
      console.log(evento);
      return EventosMapper.fixEvento(evento);
    }
  } catch (e) {
    console.log("ERROR [/updestatus] ###########################");
    console.log(e);
  }
}

function evento_isLocalDataNewer (localData, serverData) {
  let res = false;
  if (_.isNil(serverData.localUpdateTS)) {
    res = true;
    return res;
  }

  if (!_.isNil(localData.localUpdateTS) && serverData.localUpdateTS < localData.localUpdateTS) {
    res = true;
    return res;
  }

  return res;
}

//>> VERSION SIMPLIFICADA IPH ===============================================================================================
router.route('/iphaupd2').post(function (req, res) {
  console.log('iphaupd2 (1)');
  let fnMain = async (req,res) => {
    try {
      let response = await iphaSyncUpsert(req.body);
      console.log('iphaupd2 (1.1 = = = = = = = = = = = = = = = = = = = = = = = = = = = = =)');
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      console.log('iphaupd2 (1.2 = = = = = = = = = = = = = = = = = = = = = = = = = = = = =)');
      console.log(error);
      res.status(400).send(error);
    }
  };
  console.log('iphaupd2 (2)');

  fnMain(req, res);
});

async function iphaSyncUpsert (data) {
  try {
    let singleRes = null;
    let insertedDocument = null;

    console.log("iphaSyncUpsert (1): = = = = = == = = = == = = = = == = = = = == = =");
    console.log(data);

    //BUSCAR POR FOLIO INTERNO
    let res = await PreIphaAdmin.aggregate([
      {
        '$match': {
          'conocimiento.folioInterno': data.conocimiento.folioInterno,
        }
      }, {
        '$sort': {
          'ultimaMod': -1
        }
      }
    ]);
    res = (res != null) ? res[0] : null;
    let _idRes = _.get(res, '_id', null);
    let _id = (data._id) ? data._id : null;
    if (_.isNil(_id)) {
      if (!_.isNil(_idRes)) {
        data._id = _idRes;
      } else {
        data._id = mongoose.Types.ObjectId();
      }
    }

    let detenidos = await det_procesar(data);
    data.detenidos = detenidos;
    console.log("iphaSyncUpsert (2): = = = = = == = = = == = = = = == = = = = == = =");
    console.log(data);

    data = await PreIphaAdmin.findOneAndUpdate({_id: data._id}, data, {
      new: true,
      upsert: true // Make this update into an upsert
    });
    console.log("iphaSyncUpsert (3): = = = = = == = = = == = = = = == = = = = == = =");
    console.log(data);

    console.log("iphaSyncUpsert (8): DATOS RECIBIDOS");
    let fromDB = await getIPHALocalModelFromDBWithId(data._id);
    console.log(fromDB);
    return fromDB;
  } catch (e) {
    console.log("iphaSyncUpsert = = = = = = = = = = = = = = = = = = = = = = = = = =");
    console.log(e.toString());
    console.log("= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =");
  }
  return null;
}

async function ipha_SyncUpdate2 (localData, serverData) {
  console.log("ipha_SyncUpdate2 (1)");
  let modelLocalDadta = new PreIphaAdmin(localData);
  // Actualizar conocimiento del hecho - - - - - - - - - - - - - - - - -- - - - - - - - -
  serverData.conocimiento = ipha_UpdateSection(modelLocalDadta.conocimiento, serverData.conocimiento);
  serverData.intervencion = ipha_UpdateSection(modelLocalDadta.intervencion, serverData.intervencion);
  serverData.narrativa = ipha_UpdateSection(modelLocalDadta.narrativa, serverData.narrativa);
  serverData.puestaDisposicion = ipha_UpdateSection(modelLocalDadta.puestaDisposicion, serverData.puestaDisposicion);

  console.log("ipha_SyncUpdate2 (2)");

  serverData.vehiculos = localData.vehiculos;
  return serverData;
}

async function getDetenidosFromDB(detenidos) {
  var dbDetenidos = [];
  if (!_.isNil(detenidos)) {
    for (const det of detenidos) {
      let tmp = await Detenidos.findOne({_id: det._id});
      dbDetenidos.push(tmp);
    }
  }
  return dbDetenidos;
}

async function getIPHALocalModelFromDBWithId(id) {
  let res = null;
  try {
    res = await PreIphaAdmin.aggregate([{ '$match':{ '_id': mongoose.Types.ObjectId(id)} }]);
    res = res[0];
    console.log("getIPHALocalModelFromDBWithFolioInterno  (0) = = = = = = = = = = = = = = = = = = = = = = = = = =");
    console.log(res);

    let detenidos = await getDetenidosFromDB(res.detenidos);
    console.log("getIPHALocalModelFromDBWithFolioInterno  (1) = = = = = = = = = = = = = = = = = = = = = = = = = =");
    console.log(detenidos);
    let converted = [];
    for(let det of detenidos) {
      let tmp = det_convertModelToLocal(det);
      converted.push(tmp);
    }
    console.log("getIPHALocalModelFromDBWithFolioInterno  (2) = = = = = = = = = = = = = = = = = = = = = = = = = =");
    console.log(converted);

    let newRes = _.defaultsDeep({detenidos: converted}, res);
    return newRes;
  } catch (e) {
    console.log("getIPHALocalModelFromDBWithFolioInterno = = = = = = = = = = = = = = = = = = = = = = = = = =");
    console.log(e.toString());
    console.log("= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =");
  }
  return res;
}



//>> GUARDAR IPHS ======================================================================================================
router.route('/iphaupd').post(function (req, res) {
  console.log('iphaupd (1)');
  let fnMain = async (req,res) => {
    try {
      let response = await iphaUpdate(req.body);
      console.log('updestatus (1.1 = = = = = = = = = = = = = = = = = = = = = = = = = = = = =)');
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      console.log('updestatus (1.2 = = = = = = = = = = = = = = = = = = = = = = = = = = = = =)');
      console.log(error);
      res.status(400).send(error);
    }
  };
  console.log('iphaupd (2)');

  fnMain(req, res);
});

async function iphaUpdate (data) {
  try {
    console.log("iphaUpdate (1)");
    console.log(data);
    console.log("iphaUpdate (1.1)");

    // BUSCAR IPHS EXISTENTES
    if (data.conocimiento != null && data.conocimiento.folioInterno != null) {
      console.log("IPHA BUSQUEDA DE EXISTENTE (1)");

      let res = await PreIphaAdmin.aggregate([{
        $match: {
          "conocimiento.folioInterno": data.conocimiento.folioInterno,
          "estatus.cve": 2,
        }
      }]);

      console.log("IPHA BUSQUEDA DE EXISTENTE (1)");
      console.log(res);

      if (!_.isNil(res) && res.length > 0) {
        let iphExistente = res[0];
        if (!_.isNil(data) && data._id != null) {
          data._id = iphExistente._id;
        }
        console.log(iphExistente);

        if (iphExistente.estatus != null && iphExistente.estatus.cve == 2) {
          await ipha_movGetDetenidos(iphExistente);
          return iphExistente;
        }
      }
    }

    if (!data._id) {
      console.log("iphaUpdate (2)");
      // Es un nuevo elemento
      // Guardar en la base de datos
      // TODO: GUARDAR INFORMACIÓN DE LOS DETENIDOS: NO SE ESTA GUARDANDO LA PRIMERA VEZ
      data._id = mongoose.Types.ObjectId();
      let newData = new PreIphaAdmin(data);
      await newData.save();
      console.log(newData);

      await det_procesar(newData);

      return data;
    } else {
      console.log("iphaUpdate (3)");
      // Ya existe el id
      //Obtener el elemento de la base
      console.log(data._id);
      let dbItem = await PreIphaAdmin.findOne({_id: data._id}).exec();
      if (_.isNil(dbItem)) {
        console.log("iphaUpdate (3.1)");
        let newData = new PreIphaAdmin(data);
        await newData.save();
        return data;
      }
      // console.log(dbItem);
      let response = await ipha_SyncUpdate(data ,dbItem);
      // console.log(dbItem);
      if (response) {
        // Convertir response a objeto de IPHA local
        data = ipha_converToLocalFormat(response.serverData, response.detenidos);
      }
      return data;
    }
  } catch (e) {
    console.log("#############################################");
    console.log("ERROR: mov.route --> iphaUpdate");
    console.log(e);
    console.log("#############################################");
  }
  return null;
}

async function ipha_SyncUpdate (localData, serverData) {
  console.log("ipha_SyncUpdate (1)");
  let modelLocalDadta = new PreIphaAdmin(localData);
  // console.log("ipha_SyncUpdate (2)");
  // console.log(modelLocalDadta);
  // console.log("ipha_SyncUpdate (3)");
  // console.log(serverData);
  // Actualizar conocimiento del hecho - - - - - - - - - - - - - - - - -- - - - - - - - -
  serverData.conocimiento = ipha_UpdateSection(modelLocalDadta.conocimiento, serverData.conocimiento);
  serverData.intervencion = ipha_UpdateSection(modelLocalDadta.intervencion, serverData.intervencion);
  serverData.narrativa = ipha_UpdateSection(modelLocalDadta.narrativa, serverData.narrativa);
  serverData.puestaDisposicion = ipha_UpdateSection(modelLocalDadta.puestaDisposicion, serverData.puestaDisposicion);

  console.log("ipha_SyncUpdate (4)");

  // Actualizar los datos de los detenidos
  let detList = [];
  let index = 0;
  for(const item of localData.detenidos) {
    let tmpDet = await det_Upsert(item, localData, index);
    detList.push(tmpDet);
    index++;
  }
  // VEHICULOS - - - - - - - - - - - - - - - - - - - - - -- -
  // if (!_.isNil(localData.vehiculos)) {
  //   let indexVehi = 0;
  //   for(const item of localData.vehiculos) {
  //
  //     let tmpDet = await det_Upsert(item, localData, index);
  //     detList.push(tmpDet);
  //     indexVehi++;
  //   }
  // }
  serverData.vehiculos = localData.vehiculos;

  // Actualizar el estatus
  if (localData.ultimaMod != null) {
    if (serverData.ultimaMod != null) {
      let resCompare = ipha_CompareDates(localData.ultimaMod, serverData.ultimaMod);
      if (resCompare >= 0) {
        serverData.estatus = localData.estatus;
        serverData.ultimaMod = localData.ultimaMod;
      }
    } else {
      serverData.estatus = localData.estatus;
      serverData.ultimaMod = localData.ultimaMod;
    }
  }

  console.log("ipha_SyncUpdate (5)");
  serverData.detenidos = detList;
  console.log("ipha_SyncUpdate (6)");
  await serverData.save();
  console.log("ipha_SyncUpdate (7)");
  return {serverData: serverData, detenidos: detList};
}

function ipha_UpdateSection(secLocal, secServer) {
  // Actualizar una seccion generica del iph  - - - - - - - - - - - - - - - - -- - - - - - - - -
  if ( _.isNil(secServer)  &&  !_.isNil(secLocal)) {
    console.log("ipha_UpdateSection (1)");
    secServer = secLocal;
    return secServer;
  } else if (!_.isNil(secLocal)) {
    console.log("ipha_UpdateSection (2)");
    let comp = ipha_CompareDates(secLocal.ultimaMod, secServer.ultimaMod);
    console.log(comp);
    if (comp == 1) {
      console.log("ipha_UpdateSection (3)");
      // Local es mas reciente que servidor
      secServer = secLocal;
      return secServer;
    }
  }
  return secLocal;
}

function ipha_CompareDates(a, b) {

  let server = moment(a);
  let local = moment(b);
  let dif = server.diff(local, "minutes");

  doLog(Date(), "diference: " + dif.toString());

  if (dif > 0) {
    // server es mayor
    doLog(Date(), "diference result 1");
    return 1;
  } else if (dif < 0) {
    // local es mayor
    doLog(Date(), "diference result -1");
    return -1;
  } else {
    doLog(Date(), "diference result 0");
    return 0;
  }

  // let res = 0; // -1, menor, 0 igual, 1 mayor
  //
  // if (a == null && b == null) {
  //   res = 0;
  // } else if (a == null) {
  //   res = -1;
  // } else if (b == null) {
  //   res = 1;
  // } else if (a < b) {
  //   res = -1;
  // } else if (a == b) {
  //   res = 0;
  // } else if (a > b) {
  //   res = 1;
  // }
  //
  // return res;
}

function ipha_converToLocalFormat(iphaServer, detenidos) {
  console.log("ipha_converToLocalFormat (1)");
  let iphaLocal = iphaServer;

  console.log("ipha_converToLocalFormat (2)");
  let locaDetList = [];
  let tmp;
  for (let item of detenidos) {
    console.log("ipha_converToLocalFormat (3)");
    tmp = det_convertModelToLocal(item);
    locaDetList.push(tmp);
  }
  console.log("ipha_converToLocalFormat (4)");
  iphaLocal.detenidos = locaDetList;

  iphaLocal.folioInterno = iphaServer.conocimiento.folioInterno;
  iphaLocal.idEvento = iphaServer.idEvento;

  console.log("ipha_converToLocalFormat (5)");
  return iphaLocal;
}

async function ipha_movGetDetenidos(ipha) {
  let movDetenivos = [];
  if (!_.isNil(ipha) && ipha.detenidos) {
    for(const item in ipha.detenidos) {
      // Obtener el dato de la colección de detenidos
      let det = await Detenidos.findById(item._id).exec();
      // Convertir al formato de objeto móvil
      let detMov = det_convertModelToLocal(det);
      movDetenivos.push(detMov);
    }
    ipha.detenidos = movDetenivos;
  }
}

// Detenido - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
async function det_procesar (iphaLocal) {
  // Actualizar los datos de los detenidos
  let detList = [];
  let index = 0;
  let tmpNewDet;
  for(const item of iphaLocal.detenidos) {
    // Si el id es null ...
    if (!_.isNil(item._id)) {
      tmpNewDet = det_convertLocalToModel2(item, iphaLocal, null);
    } else {
      let detDB = await Detenidos.findOne({idLocal: item.idLocal});
      tmpNewDet = det_convertLocalToModel2(item, iphaLocal, _.get(detDB, "_id", null));
    }

    // ACTUALIZAR EN LA BD
    tmpNewDet = await Detenidos.findOneAndUpdate(
        {_id: tmpNewDet._id},
        tmpNewDet,
        {
          new: true,
          upsert: true // Make this update into an upsert
        }
    );

    detList.push(tmpNewDet);
    index++;
  }
  return detList; // REGRESA EN FORMATO MODEL, OSEA FORMATO SERVER
}
// async function det_procesar (iphaLocal) {
//   // Actualizar los datos de los detenidos
//   let detList = [];
//   let index = 0;
//   for(const item of iphaLocal.detenidos) {
//     let tmpDet = await det_Upsert(item, iphaLocal, index);
//     detList.push(tmpDet);
//     index++;
//   }
//   return detList;
// }


async function det_Upsert (det, ipha, index)  {
  console.log("det_Upsert (1): Datos enviados por el dispositivo móvil * * * * * * * * * * ");
  console.log(det);
  // Convertir a objeto
  let detModel = det_convertLocalToModel(det, ipha);
  console.log("det_Upsert (2): Datos del dispositivo convertidos a la estructura de datos  * * * * * * * * ");
  console.log(detModel);

  let resp = await Detenidos.findOneAndUpdate({_id: detModel._id}, detModel, {
    new: true,
    upsert: true // Make this update into an upsert
  });
  return resp;
}

// Actualizar campos - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
async function det_SyncUpsert (detLocal, detServer, iphaLocal)  {
  console.log("det_SyncUpsert (1)");
  let comp = ipha_CompareDates(detLocal.ultimaMod, detServer.ultimaMod);
  console.log("det_SyncUpsert (2): Compare Dates");
  console.log(comp);
  if (comp == 1) {
    console.log("det_SyncUpsert (3)");
    // El dato local es más reciente que el dato de servidor
    // let detLocalModel = det_convertLocalToModel(detLocal, iphaLocal);
    console.log("det_SyncUpsert (4): Converted to server model * * * * * * * * ** ");
    console.log(detLocal);
    // detServer = det_localToServer(detLocal, "", "", detServer);
    detServer.intervencion = detLocal.intervencion;
    detServer.primresp = detLocal.primresp;
    detServer.ultimaMod = detLocal.ultimaMod;
    detServer.idEvento = detLocal.idEvento;
    detServer.idPreIph = detLocal.idPreIph;
  }

  await detServer.save();
  return detServer;
}

function det_convertLocalToModel (detLocal, ipha) {
  /*
  @HiveField(0)
  DateTime fechaDetencion;
  @HiveField(1)
  DatosPersonales datper;
  @HiveField(2)
  UbicacionModel domicilio;
  @HiveField(3)
  String descripcion;
  @HiveField(4)
  CatGenAfirmacionModel presentaLesiones;
  @HiveField(5)
  CatGenAfirmacionModel padecimiento;
  @HiveField(6)
  CatGenAfirmacionModel gurpoVul;
  @HiveField(7)
  CatGenAfirmacionModel delorg; // Si pertenece o no a la delencuencia organizada
  @HiveField(8)
  String descLugarTraslado; // Descripción de a donde lo trasladaran
  @HiveField(9)
  IphaPrimerRespInter primerResp; // Datos del primer respondiente
  @HiveField(10)
  List<CatGenImgFile> imgs;

  @HiveField(11)
  String descGrupoVul;
  @HiveField(12)
  String descPadecimiento;

  @HiveField(13)
  bool isDomicilioPropor;
  @HiveField(14)
  bool isNombrePropor;
  @HiveField(15)
  bool isFechaNacPropor;
  @HiveField(16)
  bool isEntidadNacPropor;
  @HiveField(17)
  bool isNacionalidadPropor;

  @HiveField(18)
  DateTime ultimaMod;

  @HiveField(19)
  int saveStatus;

  @HiveField(20)
  String id;
   */
  let det = {
    idLocal: _.get(detLocal, 'idLocal', null),
    idPreIph: ipha._id,
    idEvento: ipha.idEvento,
    intervencion: {
      datPer: {
        nombre: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.nombre)) ? detLocal.datPer.nombre : null,
        appat: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.appat)) ? detLocal.datPer.appat : null,
        apmat: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.apmat)) ? detLocal.datPer.apmat : null,
        fecnac: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.fecnac)) ? detLocal.datPer.fecnac : null,
        sexo: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.sexo)) ? detLocal.datPer.sexo : null,
        edadAparente: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.edadAparente)) ? detLocal.datPer.edadAparente : null,
        alias: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.alias)) ? detLocal.datPer.alias : null,
        nacionalidad: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.nacionalidad)) ? detLocal.datPer.nacionalidad : null,
        entidadNacimiento: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.entidadNacimiento)) ? detLocal.datPer.entidadNacimiento : null,

        isNomPropor: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.isNomPropor)) ? detLocal.datPer.isNomPropor : null,
        isSexoPropor: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.isSexoPropor)) ? detLocal.datPer.isSexoPropor : null,
        isNacionalidadPropor: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.isNacionalidadPropor)) ? detLocal.datPer.isNacionalidadPropor : null,
        isFecnacPropor: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.isFecnacPropor)) ? detLocal.datPer.isFecnacPropor : null,
        isEntidadNacPropor: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.isEntidadNacPropor)) ? detLocal.datPer.isEntidadNacPropor : null,
        isAliasPropor: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.isAliasPropor)) ? detLocal.datPer.isAliasPropor : null,
      },
      domicilio: detLocal.domicilio,

      descripcion: detLocal.descripcion,

      lesVis: detLocal.presentaLesiones,

      tienePad: detLocal.padecimiento,
      padecimiento: detLocal.descPadecimiento,
      esGpoVul: detLocal.gurpoVul,
      grupoVulne: detLocal.descGrupoVul,
      esDelOrg: detLocal.delorg,
      fechaDetencion: detLocal.fechaDetencion,

      descLugarTraslado: detLocal.descLugarTraslado,

      imgs: detLocal.imgs,

    },
    ultimaMod: (detLocal.ultimaMod) ? Date(detLocal.ultimaMod) : null,
  };

  let _id = (detLocal._id) ? detLocal._id : null;
  if (_.isNil(_id)) {
    // det = new Detenidos(det);
    _id = mongoose.Types.ObjectId();
  }
  det._id = _id;

  return det;
}

function det_convertLocalToModel2 (detLocal, ipha, idServer) {
  let det = {
    idLocal: _.get(detLocal, 'idLocal', null),
    idPreIph: ipha._id,
    idEvento: ipha.idEvento,
    intervencion: {
      datPer: {
        nombre: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.nombre)) ? detLocal.datPer.nombre : null,
        appat: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.appat)) ? detLocal.datPer.appat : null,
        apmat: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.apmat)) ? detLocal.datPer.apmat : null,
        fecnac: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.fecnac)) ? detLocal.datPer.fecnac : null,
        sexo: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.sexo)) ? detLocal.datPer.sexo : null,
        edadAparente: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.edadAparente)) ? detLocal.datPer.edadAparente : null,
        alias: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.alias)) ? detLocal.datPer.alias : null,
        nacionalidad: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.nacionalidad)) ? detLocal.datPer.nacionalidad : null,
        entidadNacimiento: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.entidadNacimiento)) ? detLocal.datPer.entidadNacimiento : null,

        isNomPropor: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.isNomPropor)) ? detLocal.datPer.isNomPropor : null,
        isSexoPropor: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.isSexoPropor)) ? detLocal.datPer.isSexoPropor : null,
        isNacionalidadPropor: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.isNacionalidadPropor)) ? detLocal.datPer.isNacionalidadPropor : null,
        isFecnacPropor: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.isFecnacPropor)) ? detLocal.datPer.isFecnacPropor : null,
        isEntidadNacPropor: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.isEntidadNacPropor)) ? detLocal.datPer.isEntidadNacPropor : null,
        isAliasPropor: (!_.isNil(detLocal.datPer) && !_.isNil(detLocal.datPer.isAliasPropor)) ? detLocal.datPer.isAliasPropor : null,
      },
      domicilio: detLocal.domicilio,

      descripcion: detLocal.descripcion,

      lesVis: detLocal.presentaLesiones,

      tienePad: detLocal.padecimiento,
      padecimiento: detLocal.descPadecimiento,
      esGpoVul: detLocal.gurpoVul,
      grupoVulne: detLocal.descGrupoVul,
      esDelOrg: detLocal.delorg,
      fechaDetencion: detLocal.fechaDetencion,

      descLugarTraslado: detLocal.descLugarTraslado,

      imgs: detLocal.imgs,

    },
    ultimaMod: (detLocal.ultimaMod) ? Date(detLocal.ultimaMod) : null,
  };

  let _id = _.get(detLocal, "_id", null);
  if (_.isNil(_id)) {
    if (_.isNil(idServer)) {
      _id = mongoose.Types.ObjectId();
    } else {
      _id = idServer;
    }
  }
  det._id = _id;

  return det;
}

function det_convertModelToLocal (detServer) {
  if (!_.isNil(detServer)) {
    let det = {
      fechaDetencion: (!_.isNil(detServer) && !_.isNil(detServer.intervencion) && !_.isNil(detServer.intervencion.fechaDetencion)) ? detServer.intervencion.fechaDetencion : null,
      datper: (!_.isNil(detServer) && !_.isNil(detServer.intervencion) && !_.isNil(detServer.intervencion.datPer)) ? detServer.intervencion.datPer : null,
      domicilio: (!_.isNil(detServer) && !_.isNil(detServer.intervencion) && !_.isNil(detServer.intervencion.domicilio)) ? detServer.intervencion.domicilio : null,
      descripcion: (!_.isNil(detServer) && !_.isNil(detServer.intervencion) && !_.isNil(detServer.intervencion.descripcion)) ? detServer.intervencion.descripcion : null,
      presentaLesiones: (!_.isNil(detServer) && !_.isNil(detServer.intervencion) && !_.isNil(detServer.intervencion.lesVis)) ? detServer.intervencion.lesVis : null,
      padecimiento: (!_.isNil(detServer) && !_.isNil(detServer.intervencion) && !_.isNil(detServer.intervencion.tienePad)) ? detServer.intervencion.tienePad : null,
      gurpoVul: (!_.isNil(detServer) && !_.isNil(detServer.intervencion) && !_.isNil(detServer.intervencion.gurpoVul)) ? detServer.intervencion.esGpoVul : null,
      delorg: (!_.isNil(detServer) && !_.isNil(detServer.intervencion) && !_.isNil(detServer.intervencion.delorg)) ? detServer.intervencion.esDelOrg : null,
      descLugarTraslado: (!_.isNil(detServer) && !_.isNil(detServer.intervencion) && !_.isNil(detServer.intervencion.descLugarTraslado)) ? detServer.intervencion.descLugarTraslado : null,
      // TODO: Revisar la asignación de este dato
      primerResp: _.get(detServer, 'primresp', null),
      imgs: _.get(detServer, 'intervencion.imgs', null),

      descGrupoVul: (!_.isNil(detServer) && !_.isNil(detServer.intervencion) && !_.isNil(detServer.intervencion.grupoVulne)) ? detServer.intervencion.grupoVulne : null,
      descPadecimiento: (!_.isNil(detServer) && !_.isNil(detServer.padecimiento) && !_.isNil(detServer.intervencion.padecimiento)) ? detServer.intervencion.padecimiento : null,

      isDomicilioPropor: (!_.isNil(detServer) && !_.isNil(detServer.intervencion) && !_.isNil(detServer.intervencion.datPer)) ? detServer.intervencion.datPer.isDomicilioPropor : null,
      isNombrePropor: (!_.isNil(detServer) && !_.isNil(detServer.intervencion) && !_.isNil(detServer.intervencion.datPer)) ? detServer.intervencion.datPer.isNombrePropor : null,
      isFechaNacPropor: (!_.isNil(detServer) && !_.isNil(detServer.intervencion) && !_.isNil(detServer.intervencion.datPer)) ? detServer.intervencion.datPer.isFechaNacPropor : null,
      isEntidadNacPropor: (!_.isNil(detServer) && !_.isNil(detServer.intervencion) && !_.isNil(detServer.intervencion.datPer)) ? detServer.intervencion.datPer.isEntidadNacPropor : null,
      isNacionalidadPropor: (!_.isNil(detServer) && !_.isNil(detServer.intervencion) && !_.isNil(detServer.intervencion.datPer)) ? detServer.intervencion.datPer.isNacionalidadPropor : null,

      ultimaMod: _.get(detServer, 'ultimaMod', null),
      idLocal: _.get(detServer, 'idLocal', null),
    };
    if (!_.isNil(detServer._id)) {
      det._id = detServer._id;
    }
    return det;
  }
  return null;
}

//>> OBTENER CATALOGO DE MUNICIPIOS =====================================================================
router.route('/cats').get(function (req, res) {
  console.log('cats (1)');
  let fnMain = async (req,res) => {
    try {
      let response = await cats_getCatalogs(req.body);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };
  console.log('cats (2)');

  fnMain(req, res);
});

async function cats_getCatalogs (catSol) {
  try {
    doLogMsg("cats_getCatalogs (1)");
    console.log(catSol);


    //Obtener de la bd el control de versiones de catalogos
    let response = {};
    let catControl = await CatUpdates.findOne({ typeCat: "GENCAT" }).exec();

    if (!_.isNil(catSol) && !_.isEmpty(catSol)) {
      doLogMsg("cats_getCatalogs (1.1)");
      // Entidad federativa
      if (ipha_CompareDates(catControl.edos, catSol.edos) == 1) {
        doLogMsg("cats_getCatalogs (1.1.1)");
        response.edos = await Entidades.find().exec();
      }
    } else {
      doLogMsg("cats_getCatalogs (1.2)");
      response.edos = await Entidades.find().exec();
    }

    return response;
  } catch (e) {
    doLogMsg("cats_getCatalogs (2)");
    doLogMsg("ERROR [/iphaupd] ###########################");
    doLogMsg(e);
  }
}
//  2020-02-19T01:39:20.674Z,
//  2020-02-19T01:39:20.674Z,


//>> REGISTRO DE EQUIPO ======================================================================
router.route('/regter').post(function (req, res) {
  console.log('regter (1)');
  let fnMain = async (req,res) => {
    try {
      let response = await terminal_registro(req.body);
      console.log(response);
      if (!_.isNil(response)) {
        response = {
          _id: response._id,
          registro: true,
          msg: "",
        };
      } else {
        response = {
          _id: null,
          registro: false,
          msg: "No se logró el registro",
        };
      }
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };
  console.log('cats (2)');

  fnMain(req, res);
});

async function terminal_registro (terminalData) {
  try {
    console.log("terminal_registro (1)");
    let _noAleatorio = terminalData.pin;
    let _date = new Date(terminalData.fechaRegistro);

    console.log(terminalData);
    console.log(_date);

    let dbQueryResult = await Terminales.aggregate(
        [
          {
            '$match': {
              'noAleatorio': _noAleatorio,
              'fechagenpinmax': {
                '$gt': _date
              },
              'fechagenpin': {
                '$lt': _date
              },
              'registroActivo': true
            }
          },
          {
            '$project': {
              '_id': 1
            }
          }
        ]
    );
    console.log("terminal_registro (2)");
    console.log(dbQueryResult);

    if (!_.isNil(dbQueryResult)) {
      dbQueryResult = dbQueryResult[0];
      if (!_.isNil(dbQueryResult)) {
        let dbItem = await Terminales.findOne({_id: dbQueryResult._id}).exec();
        console.log("terminal_registro (3)");
        console.log(dbItem);
        try {
          dbItem.uuid = terminalData.uuid;
          dbItem.token = terminalData.token;
          dbItem.fechaRegistro = terminalData.fechaRegistro;
          await dbItem.save();
        } catch (e) {
          console.log("terminal_registro (1.1)");
          console.log(e);
        }
        return dbQueryResult;
      }
    }
    return null;
  } catch (e) {
    console.log("terminal_registro (2)");
    console.log("ERROR [/iphaupd] ###########################");
    console.log(e);
  }
}

//>> INICIO DE SESION ======================================================================
router.route('/signin').post(function (req, res) {
  console.log('signin (1)');
  let fnMain = async (req,res) => {
    try {
      console.log('signin (2)');
      let response = await signin_attempt(req.body);
      console.log('signin (4)');
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      console.log(error);
      res.status(400).send(error);
    }
  };
  console.log('cats (3)');
  fnMain(req, res);
});

async function signin_attempt (postData) {
  console.log("signin_attempt (-1)");
  let responseData = {
    logged: false,
    msg: "",
  };
  try {
    console.log("signin_attempt (1)");
    // Validar que el usuario y pwd esté correcto
    let userResp = await Usuarios.findOne({ correo: postData.login.correo, pwd: postData.login.pwd }).exec();
    console.log("signin_attempt (2)");
    console.log(userResp);

    if (!_.isNil(userResp)) {
      // Validar ahora el terminal
      let policiaId =  null;

      if (!_.isNil(userResp.policia)) {
        policiaId = userResp.policia._id;
        console.log("signin_attempt (3)");
        console.log(postData);
        let terminalResp = await Terminales.findOne({
          _id: mongoose.Types.ObjectId(postData.terminal._id),
          "uuid": postData.terminal.uuid,
          // "token": postData.terminal.token,
          "fechaRegistro": new Date(postData.terminal.fechaRegistro),
          // "policia._id": mongoose.Types.ObjectId(policiaId) ,
        }).exec();

        console.log("signin_attempt (4)");
        console.log(terminalResp);

        if (!_.isNil(terminalResp)) {
          console.log("signin_attempt (5)");
          responseData.logged = true;

          terminalResp.token = postData.terminal.token;
          await terminalResp.save();
          console.log(userResp.policia.corporacion);

          // Obtener información de la corporacion
          let corp = null;
          if (!_.isNil(userResp.policia) && !_.isNil(userResp.policia.corporacion)) {
            corp = await Corporaciones.findOne({_id: mongoose.Types.ObjectId(userResp.policia.corporacion._id)}).exec();
            console.log("CORPORACIONES ********");
            console.log(corp);
            userResp.corp = corp;
            console.log(userResp);
            responseData.user = userResp;
          } else {
            corp = {
              "_id": "",
              "nomOfi": !_.isNil(userResp.institucion) ? userResp.institucion.institucion : "",
              "nomCor": !_.isNil(userResp.institucion) ? userResp.institucion.institucion : "",
              "siglas": "-",
              "tipCorp": {
                "_id": "",
                "cve": !_.isNil(userResp.sede) ? userResp.sede.cve : "",
                "tipCor": !_.isNil(userResp.sede) ? userResp.sede.sede : "",
                "ord": 0,
              },
              "instPolicial": {
                "nom": !_.isNil(userResp.institucion) ? userResp.institucion.institucion : "",
                "cve": !_.isNil(userResp.institucion) ? userResp.institucion.cve : "",
              },
              "gobierno": {
                "nom": "",
                "cve": "",
              },
              "entidadMunicipio": {
                "entidad": {
                  "cve": !_.isNil(userResp.sede) ? userResp.sede.cve : "",
                  "nomOf": !_.isNil(userResp.sede) ? userResp.sede.sede : "",
                  "nomCor": !_.isNil(userResp.sede) ? userResp.sede.sede : "",
                },
                "municipio": {
                  "cve": !_.isNil(userResp.municip) ? userResp.municip.cve : "",
                  "nomOf": !_.isNil(userResp.municip) ? userResp.municip.municip : "",
                  "nomCor": !_.isNil(userResp.municip) ? userResp.municip.municip : "",
                }
              },
              "ubicacionDef": {
                "lat": 0.0,
                "long": 0.0,
              },
            };
          }

          // Obtener información de datos personales en la colección policía
          let policia = {
            "_id": !_.isNil(userResp.policia._id) ? userResp.policia._id : "",
            "cve": !_.isNil(userResp.policia.cve) ? userResp.policia.cve : "",
            "datPer": {
              "_id": !_.isNil(userResp.policia.datPer._id) ? userResp.policia.datPer._id : "",
              "nombre": !_.isNil(userResp.policia.datPer.nombre) ? userResp.policia.datPer.nombre : "",
              "appat": !_.isNil(userResp.policia.datPer.appat) ? userResp.policia.datPer.appat : "",
              "apmat": !_.isNil(userResp.policia.datPer.apmat) ? userResp.policia.datPer.apmat : "",
              "sexo": {
                "nom": !_.isNil(userResp.policia.datPer.sexo.sexo) ? userResp.policia.datPer.sexo.sexo : (!_.isNil(userResp.policia.datPer.sexo.nom) ? userResp.policia.datPer.sexo.nom : ""),
                "cve": !_.isNil(userResp.policia.datPer.sexo) ? userResp.policia.datPer.sexo.cve : "",
              },
            }
          };


          responseData.user = {
            "correo": userResp.correo,
            "fecnac": (userResp.fecnac != null) ? userResp.fecnac : null,
            "nombre": userResp.nombre,
            "rol": userResp.tusuario,
            "loggedTime": userResp.loggedTime,
            "corp": corp,
            "policia": policia,
            "_id": userResp._id,
            "idTerminal": terminalResp._id
          };

          console.log(responseData);

        } else {
          responseData.msg = "El equipo no está asignado a este usuario. Comuniquese con el administrador de su corporación y solicite el acceso.";
        }
      } else {
        responseData.msg = "El usuario no cuenta con información del elemento de la corporación. Valide con el administrador del sistema de su corporación.";
      }
    } else {
      responseData.msg = "Usuario o contraseña incorrectos.";
    }

  } catch (e) {
    console.log("terminal_registro (2)");
    console.log("ERROR [/iphaupd] ###########################");
    console.log(e);
  }
  return responseData;
}

//>> ENVIAR NOTIFICACION ======================================================================
const userAsigSrv = require('../services/usuario-asignaciones.service');

router.route('/sendnot').post(function (req, res) {
  console.log('/sendnot (1)');
  let fnMain = async (req,res) => {
    try {
      let curport = req.app.currentport;
      doLogMsg(`sentnot socket (0) current port ${curport}`);
      let response = await sendnot(req.body, req.app.io);
      console.log(response);
      res.status(200).send(req.body);
    } catch (error){
      res.status(400).send(error);
    }
  };
  console.log('/sendnot (2)');
  fnMain(req, res);
});

async function sendnot (data, io) {
  // 5e5077a21189f82942fdef9b
  idEvento = data.idEvento;

  console.log("sendnot (1)");
  // Obtener los datos del evento
  let evento = await Eventos.findOne({_id: idEvento}).exec();
  console.log(evento);

  let mensajeEstandar = {
    "priority": "high",
    "notification": {
      "body" : "Nuevo Evento",
      "title": "NUEVO EVENTO ASIGNADO",
      "sound": "alarm01.mp3"
    },
    "data" : {
      test: 'test',
    },
    "to" : ""
  };

  console.log("sendnot (2)");
  let response = null;
  for (let item of evento.asignacionPrimResp) {
    console.log("sendnot (3)");
    if (!_.isNil(item.terminal.token)) {
      mensajeEstandar.notification.body = evento.incidente.nom;
      mensajeEstandar.to = item.terminal.token;
      console.log("sendnot (4)");
      console.log(mensajeEstandar);
      try {
        let data = {
          headers: {'content-type' : 'application/json', 'Authorization': 'key=AIzaSyDDyX-PjUHpyKKwhp8lmKNgoaKajbMPjt4'},
          url:     'https://fcm.googleapis.com/fcm/send',
          body:    JSON.stringify(mensajeEstandar),
        };
        response  = await request.post(data);
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    }
  }
  //

  // ASIGNAR VIA WEBSOCKET
  // doLogMsg("sentnot socket (1)");
  //
  //
  // for (let item of evento.asignacionPrimResp) {
  //   // Stringyfy evento
  //   let jsonStr = JSON.stringify(evento);
  //   let tmpBuffer = new Buffer(jsonStr)
  //   let dataResponse = tmpBuffer.toString("base64");
  //
  //   doLogMsg("socket sent");
  //   io.emit(item._id, idEvento);
  // }
  //
  // doLogMsg("sentnot socket (2)");


  // ASIGNAR EVENTO VIA BASE DE DATOS
  doLogMsg("[UsuarioAsignaciones] (1)");
  for (let item of evento.asignacionPrimResp) {
    await userAsigSrv.asignarEvento(idEvento, item._id);
  }
  doLogMsg("[UsuarioAsignaciones] (2)");


  return data;

  // Obtener usuarios asignados al evento


  // Encontrar el usuario en la bd
  // let user = await Usuarios.findOne({_id: idUsuario}).exec();
  // console.log(user);
  //
  // // Encontrar la terminal asignada al usaurio
  // let terminal = await Terminales.aggregate([
  //   {
  //     '$unwind': {
  //       'path': '$usuarios'
  //     }
  //   }, {
  //     '$match': {
  //       'usuarios._id': new ObjectId(user._id)
  //     }
  //   }, {
  //     '$project': {
  //       '_id': 1,
  //       'token': 1
  //     }
  //   }
  // ]);
  // console.log(terminal);
  //
  // let mensajeEstandar = {
  //   "priority": "high",
  //   "notification": {
  //     "body" : "Nuevo Evento",
  //     "title": "Nuevo evento",
  //     "sound": "alarm01.mp3"
  //   },
  //   "to" : ""
  // };
  //
  // let response = null;
  // for (let item of terminal) {
  //   mensajeEstandar.to = item.token;
  //   response  = await request.post({
  //     headers: {'content-type' : 'application/json', 'Authorization': 'key=AIzaSyDDyX-PjUHpyKKwhp8lmKNgoaKajbMPjt4'},
  //     url:     'https://fcm.googleapis.com/fcm/send',
  //     body:    JSON.stringify(mensajeEstandar)
  //   });
  //   console.log(response);
  // }
}



//>> RECIBIR LA UBICACION DEL DISPOSITIVO ======================================================================
router.route('/ubi').post(function (req, res) {
  console.log('ubi (1)');
  let fnMain = async (req,res) => {
    try {
      console.log('ubi (2)');
      let response = await trackLocation(req.body);
      console.log('ubi (4)');
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      console.log(error);
      res.status(400).send(error);
    }
  };
  console.log('ubi (3)');
  fnMain(req, res);
});

async function trackLocation (postData) {
  console.log("trackLocation (-1)");

  try {
    console.log("trackLocation (1)");
    let ubicacion = new UbicacionTerminal(postData);
    let count = await UbicacionTerminal.count({idUsr: postData.idUsr});
    console.log(count);
    if (count >=20) {
      // Obtener el más antiguo
      let sorResp = await UbicacionTerminal.aggregate(
          [
            {
              '$match': {
                'idUsr': mongoose.Types.ObjectId(postData.idUsr)
              }
            }, {
            '$sort': {
              'fecha': 1
            }
          }
          ]
      );

      if (!_.isNil(sorResp)) {
        await UbicacionTerminal.deleteOne({_id: sorResp[0]._id});
      }
    }
    await ubicacion.save();
    return ubicacion;
  } catch (e) {
    console.log("terminal_registro (2)");
    console.log("ERROR [/iphaupd] ###########################");
    console.log(e);
  }

  return null;
}

//>> OBTENER LOS EVENTOS DEL USUARIO ======================================================================
router.route('/getev').post(function (req, res) {
  console.log('getev post (1)');
  let fnMain = async (req,res) => {
    try {
      console.log('getev post (2)');
      let response = await getEventosOfUser(req.body);
      console.log('getev post (4)');
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      console.log(error);
      res.status(400).send(error);
    }
  };
  console.log('getev post (3)');
  fnMain(req, res);
});

async function getEventosOfUser (postData) {
  console.log("getEventosOfUser (-1)");
  console.log(postData);

  try {
    console.log("getEventosOfUser (1)");
    let eventos = await Eventos.aggregate(
        [
          {
            '$unwind': {
              'path': '$asignacionPrimResp'
            }
          }, {
          '$match': {
            'asignacionPrimResp._id': postData.idUsr
          }
        }, {
          '$sort': {
            'fecha': -1
          }
        }, {
          '$project': {
            'asignacionPrimResp': 0
          }
        }
        ]
    );


    eventos = EventosMapper.setDummyCordOnList(eventos);

    // let ubicacion = new UbicacionTerminal(postData);
    // let count = await UbicacionTerminal.count({idUsr: postData.idUsr});
    // console.log(count);
    // if (count >=20) {
    //   // Obtener el más antiguo
    //   let sorResp = await UbicacionTerminal.aggregate(
    //     [
    //       {
    //         '$match': {
    //           'idUsr': mongoose.Types.ObjectId(postData.idUsr)
    //         }
    //       }, {
    //       '$sort': {
    //         'fecha': 1
    //       }
    //     }
    //     ]
    //   );
    //
    //   if (!_.isNil(sorResp)) {
    //     await UbicacionTerminal.deleteOne({_id: sorResp[0]._id});
    //   }
    // }
    // await ubicacion.save();
    console.log(eventos);
    return eventos;
  } catch (e) {
    console.log("getEventosOfUser (2)");
    console.log("ERROR [/getEventosOfUser] ###########################");
    console.log(e);
  }

  return null;
}

//>> OBTENER EL IPH DESDE UN FOLIO ======================================================================
router.route('/getiphafolio').post(function (req, res) {
  console.log('getiphafolio post (1)');
  let fnMain = async (req,res) => {
    try {
      console.log('getiphafolio post (2)');
      let response = await getIphaByFolioInterno(req.body);
      await ipha_movGetDetenidos(response);
      console.log('getiphafolio post (4)');
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      console.log(error);
      res.status(400).send(error);
    }
  };
  console.log('getiphafolio post (3)');
  fnMain(req, res);
});

async function getIphaByFolioInterno (postData) {
  console.log("getIphaByFolioInterno (-1)");
  console.log(postData);

  try {
    console.log("getIphaByFolioInterno (1)");

    let res = await PreIphaAdmin.aggregate([{
      $match: {
        "conocimiento.folioInterno": postData.folioInterno,
        // "estatus.cve": 2,
      }
    }]);
    console.log(res);
    return res[0];
  } catch (e) {
    console.log("getIphaByFolioInterno (2)");
    console.log("ERROR [/getIphaByFolioInterno] ###########################");
    console.log(e);
  }
  return null;
}

//>> LEER ARCHIVOS ======================================================================
router.route('/getfile/:fileName').get(function (req, res) {
  console.log('getfile post (1)');
  let fnMain = async (req,res) => {
    try {
      console.log('getfile post (2)');
      let dataLakeClient = GetDataLakeServiceClient();
      console.log('getfile post (3)');
      let downloaded = await GetFile(dataLakeClient, "iphmov", req.params.fileName);
      // console.log(resp);

      // let accessToken = await _GetAccessToken();
      // console.log('getfile post (4)');
      // console.log(accessToken);
      // let dataFile = await _GetFile(accessToken, "20200223GOE003.pdf", "iphmov", "application/pdf");
      // console.log(dataFile);
      // console.log('getfile post (5)');
      // res.writeHead(200, {
      //   'Content-Type': 'application/pdf',
      //   // 'Content-Length': downloaded.length,
      //   'Content-Disposition': 'attachment; filename=test.pdf'
      //
      //   // 'Content-Disposition': 'attachment; filename=some_file.pdf',
      // });
      // res.write(downloaded.readableStreamBody, 'binary');
      // res.end();

      // res.send(new Buffer(downloaded.contentAsBlob, 'binary'))
      //res.attachment("pdfname.pdf");

      // res.setHeader('Content-Disposition', `attachment; filename=pdf.pdf`);
      // res.end(downloaded.readableStreamBody);
      // downloaded.readableStreamBody.pipe(res);

      // res.writeHead(200, {
      //   'Content-Type': 'application/pdf',
      //   // 'Content-Length': downloaded.length,
      //   'Content-Disposition': 'attachment; filename=test.pdf'
      //
      //   // 'Content-Disposition': 'attachment; filename=some_file.pdf',
      // });

      // downloaded.readableStreamBody.on("data", (data) => {
      //   console.log("ON DATA = = = = = = = = = = = =  =");
      //   res.write(data);
      // });
      // downloaded.readableStreamBody.on("end", () => {
      //   console.log("ON CLOSE = = = = = = = = = = = =  =");
      //   res.end();
      // });
      // downloaded.readableStreamBody.pipe(res);

      await streamToRead(downloaded.readableStreamBody, res);


      // res.status(200).send({accessToken: accessToken});
    } catch (error){
      console.log(error);
      res.status(400).send(error);
    }
  };
  console.log('getiphafolio post (3)');
  fnMain(req, res);
});

async function _GetAccessToken () {
  let headers = {
    "Content-type": "application/x-www-form-urlencoded"
  };
  let paramData = {
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "scope": "https://storage.azure.com/.default",
    "grant_type": "client_credentials",
  };
  let url = "https://login.microsoftonline.com/"+TENANT_NAME+"/oauth2/v2.0/token";
  let data = {
    headers: headers,
    url:     url,
    body:    querystring.stringify(paramData),
  };
  let response  = await request.post(data);
  console.log(response);
  response = JSON.parse(response);
  return response["access_token"];
}

async function _GetFile (accessToken, fileName, path, contentType) {
  let url ="https://"+STORAGE_ACCOUNT_NAME+".dfs.core.windows.net/"+path+"/"+fileName+"";
  let headers = {
    "x-ms-version": "2018-11-09",
    "content-type": contentType,
    "Authorization": "Bearer "+accessToken,
  };
  let data = {
    headers: headers,
    url:     url,
  };
  let response  = await request.get(data);
  console.log(response.length);
  return response;
}

function GetDataLakeServiceClient() {

  const sharedKeyCredential =
      new ADLS.StorageSharedKeyCredential("iphg15storage", "kBPdJxq6wWiHQRTvahwHFbfVNfB15Zi8HVHphZQezWHxsS1UAdTm6tdlMuccuF+sq1mIoeg2KqrHUp7MLuBE2w==");

  const datalakeServiceClient = new ADLS.DataLakeServiceClient(
      `https://${STORAGE_ACCOUNT_NAME}.dfs.core.windows.net`, sharedKeyCredential);

  return datalakeServiceClient;
}

async function GetFile(datalakeServiceClient, fileSystem, fileName) {
  console.log('GetFile (1)');
  const fileSystemName = fileSystem;//"iphmov";
  const fileSystemClient = datalakeServiceClient.getFileSystemClient(fileSystemName);

  console.log('GetFile (2)');
  const fileClient = fileSystemClient.getFileClient(fileName);
  const downloadResponse = await fileClient.read();
  // console.log(downloadResponse);

  // const downloaded = await streamToString(downloadResponse.readableStreamBody);
  //
  // async function streamToString(readableStream) {
  //   return new Promise((resolve, reject) => {
  //     const chunks = [];
  //     readableStream.on("data", (data) => {
  //       chunks.push(data.toString());
  //     });
  //     readableStream.on("end", () => {
  //       resolve(chunks.join(""));
  //     });
  //     readableStream.on("error", reject);
  //   });
  // }

  console.log('GetFile (3)');
  return downloadResponse;

  // const fs = require('fs');
  //
  // fs.writeFile('mytestfiledownloaded.txt', downloaded, (err) => {
  //   if (err) throw err;
  // });
}


async function streamToRead(readableStream, res) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      // console.log("DATA = = = = = = = = = = = = = = = = =");
      res.write(data);
    });
    readableStream.on("end", () => {
      // console.log("END = = = =  = = = = = = = = = = = = ");
      res.end();
    });
    readableStream.on("error", reject);
  });
}

//>> OBTENER POR ID DE IPHA =====================================================================
router.route('/iphaGetById/:idIpha').get(function (req, res) {
  console.log('iphaGetById post (1)');
  let fnMain = async (req,res) => {
    try {
      console.log('iphaGetById post (2)');
      let iphaData = await GetIPHAById(req.params.idIpha);
      console.log('iphaGetById post (3)');
      res.status(200).send(iphaData);
    } catch (error){
      console.log(error);
      res.status(400).send(error);
    }
  };
  console.log('iphaGetById post (4)');
  fnMain(req, res);
});

async function GetIPHAById(idIPHA) {
  try {
    let res = await PreIphaAdmin.findById(idIPHA).exec();
    console.log(res);
    return res;
  } catch (e) {
    console.log(e);
  }
  return null;
}

//>> UTIL BORRAR =====================================================================
router.route('/cleanfortest/:idIpha').get(function (req, res) {
  console.log('cleanfortest post (1)');
  let fnMain = async (req,res) => {
    try {
      if (req.params.idIpha === "t3stcn1") {
        await Detenidos.deleteMany().exec();
        await Eventos.deleteMany().exec();
        await PreIphaAdmin.deleteMany().exec();
        res.status(200).send("ok!");
      } else {
        res.status(200).send("ok");
      }
    } catch (error){
      console.log(error);
      res.status(400).send(error);
    }
  };
  console.log('cleanfortest post (4)');
  fnMain(req, res);
});

//>> OBTENER CONSULTA DE DETENIDOS PARA MOVILES =====================================================================
router.route('/mediafildet').get(function (req, res) {
  console.log('penddet post (1)');
  let fnMain = async (req,res) => {
    try {
      console.log('penddet post (2)');
      let detenidos = await GetDetenidosPendientes();
      console.log('penddet post (3)');
      res.status(200).send(detenidos);
    } catch (error){
      console.log(error);
      res.status(400).send(error);
    }
  };
  console.log('penddet post (4)');
  fnMain(req, res);
});

async function GetDetenidosPendientes() {
  try {
    let detenidos = await Detenidos.aggregate([
      {
        '$lookup': {
          'from': 'pre-iphs',
          'localField': 'idPreIph',
          'foreignField': '_id',
          'as': 'pre-iph'
        }
      }, {
        '$project': {
          '_id': 1,
          'idLocal': 1,
          'idEvento': 1,
          'idPreIpha': 1,
          'mediafiliacion': 1,
          'intervencion': 1,
          'ultimaMod': 1,
          'preIph': {
            '_id': {
              '$arrayElemAt': [
                '$pre-iph._id', 0
              ]
            },
            'estatus': {
              '$arrayElemAt': [
                '$pre-iph.estatus', 0
              ]
            },
            'conocimiento': {
              '$arrayElemAt': [
                '$pre-iph.conocimiento', 0
              ]
            }
          }
        }
      }, {
        '$sort': {
          'intervencion.fechaDetencion': -1
        }
      }
    ]);
    return detenidos;
  } catch (e) {
    console.log(e);
  }
  return null;
}

//>> OBTENER DETENIDO ORIGIONAL BY YD =====================================================================
router.route('/detorgbyid/:id').get(function (req, res) {
  console.log('detorgbyid post (1)');
  let fnMain = async (req,res) => {
    try {
      console.log('detorgbyid post (2)');
      let detenidos = await GetDetenidoOrgById(req.params.id);
      console.log('detorgbyid post (3)');
      res.status(200).send(detenidos);
    } catch (error){
      console.log(error);
      res.status(400).send(error);
    }
  };
  console.log('detorgbyid post (4)');
  fnMain(req, res);
});

async function GetDetenidoOrgById(id) {
  try {
    let detenido = await Detenidos.findOne({_id: id});
    return detenido;
  } catch (e) {
    console.log(e);
  }
  return null;
}


//>> OBTENER DETENIDO ORIGIONAL BY YD =====================================================================
router.route('/catmediafil').get(function (req, res) {
  console.log('catmediafil post (1)');
  let fnMain = async (req,res) => {
    try {
      console.log('catmediafil post (2)');
      let detenidos = await GetMediafilCat();
      console.log('catmediafil post (3)');
      res.status(200).send(detenidos);
    } catch (error){
      console.log(error);
      res.status(400).send(error);
    }
  };
  console.log('catmediafil post (4)');
  fnMain(req, res);
});

async function GetMediafilCat() {
  try {
    let catalogos = await MediafilCatModel.find();
    console.log(catalogos);
    return catalogos[0];
  } catch (e) {
    console.log(e);
  }
  return null;
}

//>> OBTENER DETENIDO ORIGIONAL BY YD =====================================================================
router.route('/upsertmediafil').post(function (req, res) {
  console.log('upsertmediafil post (1)');
  let fnMain = async (req,res) => {
    try {
      console.log('upsertmediafil post (2)');
      let detenidos = await UpsertMediaFil(req.body);
      console.log('upsertmediafil post (3)');
      res.status(200).send(detenidos);
    } catch (error){
      console.log(error);
      res.status(400).send(error);
    }
  };
  console.log('upsertmediafil post (4)');
  fnMain(req, res);
});

async function UpsertMediaFil(data) {
  console.log('UpsertMediaFil (funciont) (1)');
  console.log(data);
  try {
    if (!_.isNil(data._id)) {
      let upsertData = {
        _id: data._id,
        mediafiliacion: data.mediafiliacion
      };

      let res = await Detenidos.findOneAndUpdate({_id: upsertData._id}, upsertData, {
        new: true,
        upsert: true // Make this update into an upsert
      });
      console.log('UpsertMediaFil (funciont) (2)');
      console.log(res);
      return res;
    }
  } catch (e) {
    console.log(e);
  }
  return null;
}




// KOTLIN ==============================================================================================================
//>> PRUEBA DE POST DE ENTITY DESDE MOBILE =====================================================================
const ENTITY_DATA = "entityData"
router.route('/entityData').post(function (req, res) {
  console.log('${ENTITY_DATA} post (1)');
  let fnMain = async (req,res) => {
    try {
      console.log('${ENTITY_DATA} post (2)');
      let stringResponse = await entityDataRoute(req.body);
      console.log('${ENTITY_DATA} post (3)');
      res.status(200).send(stringResponse);
    } catch (error){
      console.log(error);
      doLog(Date(), error.message);
      res.status(400).send(error);
    }
  };
  console.log('${ENTITY_DATA} post (4)');
  fnMain(req, res);
});


async function entityDataRoute(data) {

  console.log('(1) = = = = = = = = = = = = = = = = = = = = = = =');
  doLog(Date(), '(1) = = = = = = = = = = = = = = = = = = = = = = =');
  // console.log('Begin Input parameter: ');
  console.log(data);
  // console.log('End Input parameter: ');

  let dataConverted = IphAdmKotMapper.localToServer(data);
  // console.log('Begin dataConverted: ');
  console.log(dataConverted);
  // console.log('End dataConverted: ');

  console.log('(2) = = = = = = = = = = = = = = = = = = = = = = =');
  doLog(Date(), '(2) = = = = = = = = = = = = = = = = = = = = = = =');

  // Procesar detenidos
  let responseDetenidos = [];
  let tmpDetenido = null;
  for(let i of dataConverted.detenidos) {
    responseDetenidos.push(await entityDataRoute_processDetenidos(i, dataConverted.idEvento, dataConverted._id));
  }
  console.log('Begin responseDetenidos: ');
  doLog(Date(), 'Begin responseDetenidos: ');
  // console.log(responseDetenidos);
  console.log('End responseDetenidos: ');
  doLog(Date(), 'End responseDetenidos: ');
  dataConverted.detenidos = responseDetenidos;

  console.log('(3) = = = = = = = = = = = = = = = = = = = = = = =');
  doLog(Date(), '(3) = = = = = = = = = = = = = = = = = = = = = = =');
  // Procesar objeto de IPHADM
  let response = await entityDataRoute_processIphAdm(dataConverted);
  console.log('Begin Response data parameter: ');
  doLog(Date(), 'Begin Response data parameter: ');
  console.log(response);
  doLog(Date(), 'End Response data parameter: ');
  console.log('End Response data parameter: ');

  console.log('(4) = = = = = = = = = = = = = = = = = = = = = = =');
  doLog(Date(), '(4) = = = = = = = = = = = = = = = = = = = = = = =');
  response.detenidos = responseDetenidos;
  console.log('Begin Response data parameter: ');
  doLog(Date(), 'Begin Response data parameter: ');
  console.log(IphAdmKotMapper.serverToLocal(response));
  doLog(Date(), 'End Response data parameter: ');
  console.log('End Response data parameter: ');
  return IphAdmKotMapper.serverToLocal(response);
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
async function entityDataRoute_processIphAdm(data) {
  console.log('processIphAdm (1) >>>>>>>>>>>>>>>');
  doLog(Date(), 'processIphAdm (1) >>>>>>>>>>>>>>>');

  let dbIphAdmItemFound = await PreIphaAdmin.aggregate(
      [
        {
          '$match': {
            '$or': [{'_id': data._id}, {'idEvento': data.idEvento}]
          }
        },
      ]);


  // let dbIphAdmItem = await PreIphaAdmin.findOne({_id: data._id}, null, {lean: true}).exec();
  let updateData = null;


  if (dbIphAdmItemFound != null && dbIphAdmItemFound.length > 0) {
    let dbIphAdmItem = dbIphAdmItemFound[0];
    console.log('processIphAdm (2) >>>>>>>>>>>>>>>');
    doLog(Date(), 'processIphAdm (2) >>>>>>>>>>>>>>>');
    console.log(dbIphAdmItemFound.count);
    console.log(dbIphAdmItem.ultimaMod);
    console.log(dbIphAdmItem._id);
    console.log(data.ultimaMod);

    doLog(Date(), 'local date ' + data.ultimaMod.toString());
    doLog(Date(), 'server date ' + dbIphAdmItem.ultimaMod.toString());
    // Elemento existente
    let comparedIPhModDate = ipha_CompareDates(dbIphAdmItem.ultimaMod, data.ultimaMod);
    console.log(comparedIPhModDate)

    if (comparedIPhModDate == -1) {
      // Es más nuevo el dato local
      console.log('processIphAdm (2.1) >>>>>>>>>>>>>>>');
      doLog(Date(), 'processIphAdm (2.1) >>>>>>>>>>>>>>>');
      updateData = data;
      updateData._id = dbIphAdmItem._id;
    } else if (comparedIPhModDate >= 0) {
      console.log('processIphAdm (2.2) >>>>>>>>>>>>>>>');
      doLog(Date(), 'processIphAdm (2.2) >>>>>>>>>>>>>>>');
      // Es más nuevo el dato del servidor
      updateData = dbIphAdmItem
    }
  } else {
    console.log('processIphAdm (3) >>>>>>>>>>>>>>>');
    doLog(Date(), 'processIphAdm (3) >>>>>>>>>>>>>>>');
    // Nuevo elemento existente
    updateData = data;
  }

  console.log('processIphAdm (4) >>>>>>>>>>>>>>>');
  doLog(Date(), 'processIphAdm (4) >>>>>>>>>>>>>>>');
  console.log(updateData);
  if (updateData != null) {
    console.log('processIphAdm (5) >>>>>>>>>>>>>>>');
    doLog(Date(), 'processIphAdm (5) >>>>>>>>>>>>>>>');
    let res = await PreIphaAdmin.findOneAndUpdate({_id: updateData._id}, updateData, {
      new: true,
      lean: true,
      upsert: true // Make this update into an upsert
    }).exec();
    updateData = res;

    // Estatus finalizado
    if (res.estatus.cve == 2) {
      await entityDataRoute_cerrarEvento(res.idEvento);
    }
  }

  return updateData;
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
async function entityDataRoute_processDetenidos(data, idEvento, idPreIph) {
  console.log("processDetenidos (1) = = = = = = = = = = = = = = =");
  doLog(Date(), 'processDetenidos (1) = = = = = = = = = = = = = = =');
  console.log(data);
  // console.log(idEvento);
  // console.log(idPreIph);
  let dbItem = null;

  // data.idEvento = mongoose.Types.ObjectId(idEvento);
  // data.idPreIph = mongoose.Types.ObjectId(idPreIph);
  data.idEvento = idEvento;
  data.idPreIph = idPreIph;

  console.log("processDetenidos (2) = = = = = = = = = = = = = = =");
  doLog(Date(), 'processDetenidos (2) = = = = = = = = = = = = = = =');
  // dbItem = await Detenidos.findOne({_id: mongoose.Types.ObjectId(data._id.toString())}).exec();
  dbItem = await Detenidos.findOne({idLocal: data.idLocal}).exec();
  console.log(dbItem);

  if (dbItem == null) {
    console.log("processDetenidos (3) = = = = = = = = = = = = = = =");
    doLog(Date(), 'processDetenidos (3) = = = = = = = = = = = = = = =');
    let resp = await Detenidos.findOneAndUpdate({idLocal: data.idLocal}, data, {
      new: true,
      lean: true,
      upsert: true // Make this update into an upsert
    }).exec();
    console.log(resp)
    return resp;
  } else {
    console.log("processDetenidos (4) = = = = = = = = = = = = = = =");
    doLog(Date(), 'processDetenidos (4) = = = = = = = = = = = = = = =');
    // obtener de la base de datos

    let comparission = ipha_CompareDates(data.ultimaMod, dbItem.ultimaMod);

    if (comparission == -1) {
      // Es mas nuevo el del servidor
      console.log("processDetenidos (5) = = = = = = = = = = = = = = =");
      doLog(Date(), 'processDetenidos (5) = = = = = = = = = = = = = = =');
      let resp = await Detenidos.findOneAndUpdate({idLocal: data.idLocal}, data, {
        new: true,
        lean: true,
        upsert: true // Make this update into an upsert
      }).exec();
      return resp;
    } else if (comparission >= 1){
      // Es más nuevo el local
      console.log("processDetenidos (6) = = = = = = = = = = = = = = =");
      doLog(Date(), 'processDetenidos (6) = = = = = = = = = = = = = = =');
      let resp = await Detenidos.findOneAndUpdate({idLocal: data.idLocal}, data, {
        new: true,
        lean: true,
        upsert: true // Make this update into an upsert
      }).exec();
      // console.log(resp)
      return resp;
    }

    return data
  }
}


async function entityDataRoute_cerrarEvento(idEvento) {
  try {
    const result = await Eventos.findOne({_id: idEvento}).exec();

    if (!_.isNil(result)) {
      doLogMsg("entityDataRoute_cerrarEvento (1)");
      result.ultimaActualizacion = Date();
      result.estatus = {
        cve: 7,
        nom: "ATENDIDO"
      };
      await result.save();
    } else {
      doLogMsg("entityDataRoute_cerrarEvento (2)");
      doLogMsg(`No se encontró el id evento ${idEvento}`);
    }

  } catch (e) {
    doLogMsg("entityDataRoute_cerrarEvento (3)");
    doLogMsg(e.message);
  }
}

async function doLog(date, msg) {
  let newLogData = {
    logDate: date,
    msg: msg
  };
  let newDbItem = new LogData(newLogData);
  await newDbItem.save()

  console.log(msg);
}

async function doLogMsg(msg) {
  await doLog(Date(), msg);
}


//>> TEST SOCKT ================================
router.route('/testSocket').post(function (req, res) {
  console.log('updestatus (1)');
  let fnMain = async (req,res) => {
    try {

      req.app.io.emit("test1", {key:"val"});
      // io.ctrl.socket.on('connection', function (socket) {
      //   socket.on('test1', function(data) {
      //     console.log(data);
      //     socket.emit('Hello');
      //   });
      // });
      res.status(200).send("ok");
    } catch (error){
      console.log(error);
      res.status(400).send(error);
    }
  };
  console.log('updestatus (2)');

  fnMain(req, res);
});



//>> CHECK-ASGMT ================================
/*
  El objeto de entrada debe ser igual a la estructura de UsuarioAsignaciones
 */
router.route('/check-asgmt').post(function (req, res) {
  doLogMsg("check-asgmt (1)");
  let fnMain = async (req,res) => {
    try {
      let response = await userAsigSrv.updateWithClientData(req.body);
      res.status(200).send(response.r);
    } catch (error){
      console.log(error);
      res.status(400).send(error);
    }
  };
  doLogMsg("check-asgmt (2)");

  fnMain(req, res);
});

module.exports = router;
