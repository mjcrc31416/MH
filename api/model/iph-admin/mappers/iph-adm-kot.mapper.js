

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
const mongoose = require('mongoose');
const IphAdmDetenidoKotMapper = require('../mappers/iph-adm-detenido-kot.mapper').IphAdmDetenidoKotMapper;
const IphAdmUbicacionKotMapper = require('../mappers/iph-adm-ubicacion-kot.mapper').IphAdmUbicacionKotMapper;
const IphAdmVehiculoKotMapper = require('../mappers/iph-adm-vehiculo-kot.mapper').IphAdmVehiculoKotMapper;
const IphAdmPrimerRespondienteKotMapper = require('../mappers/iph-adm-primerrespondiente.mapper').IphAdmPrimerRespondienteKotMapper;
const IphAdmKotMapper = {}

IphAdmKotMapper.localToServerWithData = function(serverData, localData) {
    // properties
    serverData.idEvento = localData.idEvento;
    serverData.idLocal = localData.idLocal;
    serverData.idPreIph = localData.idPreIph;
    serverData.ultimaMod = localData.ultimaMod;

    //serverData.conocimiento = localData.conocimiento
    // serverData.intervencion = localData.intervencion
    // serverData.narrativa = localData.narrativa
    serverData.detenidos = localData.detenidos.map((it) => IphAdmDetenidoKotMapper.toServer(it));
    // serverData.vehiculos = localData.vehiculos
    // serverData.puestaDisposicion = localData.puestaDisposicion
    // serverData.estatus = localData.estatus

    return serverData;
}

IphAdmKotMapper.localToServer = function(localData) {
    return {
        _id: (!mongoose.Types.ObjectId.isValid(localData._id)) ? mongoose.Types.ObjectId() : mongoose.Types.ObjectId(localData._id),
        idEvento: (!mongoose.Types.ObjectId.isValid(localData.idEvento)) ? mongoose.Types.ObjectId() : mongoose.Types.ObjectId(localData.idEvento),
        ultimaMod: localData.ultimaMod,

        idLocal: localData.id,

        // Relaciones
        detenidosRel: localData.detenidos.map((item) => item._id),


        // Objetos hijos > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > >
        detenidos: localData.detenidos.map((it) => IphAdmDetenidoKotMapper.localToServer(it)),

        conocimiento: {
            idLocal: localData.conocimiento.id,
            tipoConocimiento: {
              cve: localData.conocimiento.tipoConocimiento.cve,
              nom: localData.conocimiento.tipoConocimiento.nom,
            },
            conocimientoOtro: localData.conocimiento.conocimientoOtro,
            folio911: localData.conocimiento.folio911,
            folioInterno: localData.conocimiento.folioInterno,
            folioIph: localData.conocimiento.folioIph,
            ultimaMod: localData.conocimiento.ultimaMod,
            arribo: localData.conocimiento.arribo,
        },

        narrativa: {
            idLocal: localData.narrativa.id,
            narrativa: localData.narrativa.narrativa,
            ultimaMod: localData.narrativa.ultimaMod,
        },

        puestaDisposicion: {
            idLocal: localData.puestaDisposicion.id,

            puestaDisp: localData.puestaDisposicion.puestaDisp,
            noExp: localData.puestaDisposicion.noExp,
            unidadArribo: localData.puestaDisposicion.unidadArribo,
            isUnidadArribo: localData.puestaDisposicion.isUnidadArribo,
            // TODO: FALTA INFORMACIÓN DEL PRIMER RESPONDIENTE
            // primerResp: localData.puestaDisposicion.primerResp,
            // adscripcion: localData.puestaDisposicion.adscripcionRecibe,
            autoridadRecibe: localData.puestaDisposicion.autoridadRecibe,
            adscripcionRecibe: localData.puestaDisposicion.adscripcionRecibe,
            cargoRecibe: localData.puestaDisposicion.cargoRecibe,
            ultimaMod: localData.puestaDisposicion.ultimaMod,

        },

        intervencion: {
            idLocal: localData.intervencion.id,
            ubicacion: IphAdmUbicacionKotMapper.localToServer(localData.intervencion), //(localData.intervencion != null && localData.intervencion.ubicacion != null) ? IphAdmUbicacionKotMapper.localToServer(localData.intervencion.ubicacion) : null,
            ultimaMod: localData.intervencion.ultimaMod,
        },

        estatus: {
            idLocal: localData.estatus.id,
            cve: localData.estatus.cve,
            nom: localData.estatus.nom,
        },

        vehiculos: localData.vehiculos.map((it) => IphAdmVehiculoKotMapper.localToServer(it)),
        primerosRespondientes: localData.primerosRespondientes.map((it) => IphAdmPrimerRespondienteKotMapper.localToServer(it)),
    };
}

IphAdmKotMapper.serverToLocal = function(serverData) {
    return {
        id: serverData.idLocal,
        _id: serverData._id,
        idEvento: serverData.idEvento,
        ultimaMod: serverData.ultimaMod,
        // idPreIph: serverData.idPreIph,

        // OBJETOS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        conocimiento: {
            id: serverData.conocimiento.idLocal,
            folio911: serverData.conocimiento.folio911,
            conocimientoOtro: serverData.conocimiento.conocimientoOtro,
            folioInterno: serverData.conocimiento.folioInterno,
            folioIph: serverData.conocimiento.folioIph,
            ultimaMod: serverData.conocimiento.ultimaMod,
            arribo: serverData.conocimiento.arribo,

            tipoConocimiento: {
                id: Number(serverData.conocimiento.tipoConocimiento.cve),//serverData.conocimiento.tipoConocimiento.idLocal,
                _id: serverData.conocimiento.tipoConocimiento._id,
                cve: serverData.conocimiento.tipoConocimiento.cve,
                nom: serverData.conocimiento.tipoConocimiento.nom,
            }, //serverData.conocimiento.tipoConocimiento,
        }, //serverData.conocimiento,
        
        intervencion: (serverData.intervencion != null && serverData.intervencion.ubicacion != null) ? IphAdmUbicacionKotMapper.serverToLocal(serverData.intervencion.ubicacion) : null,

        narrativa: {
            id: serverData.narrativa.idLocal,
            narrativa: serverData.narrativa.narrativa,
            ultimaMod: serverData.narrativa.ultimaMod,
        },//serverData.narrativa,

        puestaDisposicion: {
            id: serverData.puestaDisposicion.idLocal,
            puestaDisp: serverData.puestaDisposicion.puestaDisp,
            noExp: serverData.puestaDisposicion.noExp,
            unidadArribo: serverData.puestaDisposicion.unidadArribo,
            isUnidadArribo: serverData.puestaDisposicion.isUnidadArribo,
            autoridadRecibe: serverData.puestaDisposicion.autoridadRecibe,
            adscripcionRecibe: serverData.puestaDisposicion.adscripcionRecibe,
            cargoRecibe: serverData.puestaDisposicion.cargoRecibe,
            ultimaMod: serverData.puestaDisposicion.ultimaMod,
        },//serverData.puestaDisposicion,

        estatus: {
             id: serverData.estatus.idLocal,
             cve: serverData.estatus.cve,
             nom: serverData.estatus.nom,
        },//serverData.estatus,

        detenidos: serverData.detenidos.map((it) => IphAdmDetenidoKotMapper.serverToLocal(it)),
        vehiculos: serverData.vehiculos.map((it) => IphAdmVehiculoKotMapper.serverToLocal(it)),
        primerosRespondientes: (serverData.primerosRespondientes != null) ? serverData.primerosRespondientes.map((it) => IphAdmPrimerRespondienteKotMapper.serverToLocal(it)) : [],
    }
}

// module.exports = {
//     IphAdmKotMapper: IphAdmKotMapper
// };
module.exports.IphAdmKotMapper = IphAdmKotMapper;



/*
{
   "_id":{
      "$oid":"5eb2f0868b15e50045174512"
   },
   "__v":0,
   "conocimiento":{
      "folio911":"911",
      "tipoConocimiento":{
         "_id":"3",
         "cve":"3",
         "nom":"Llamada de emergencia"
      },
      "conocimientoOtro":"",
      "folioInterno":"20200506GOE001",
      "ultimaMod":{
         "$date":"2020-05-06T17:11:52.874Z"
      }
   },
   "detenidos":[
      {
         "_id":{
            "$oid":"5eb2f63b8b15e50045174518"
         },
         "intervencion":{
            "datPer":{
               "_id":{
                  "$oid":"5eb2f8a48b15e5004517455e"
               },
               "nombre":"carlos",
               "appat":"ramirez",
               "apmat":"hernandez",
               "fecnac":{
                  "$date":"1984-05-06T00:00:00.000Z"
               },
               "sexo":{
                  "_id":null,
                  "cve":"2",
                  "nom":"HOMBRE"
               },
               "alias":"[\"guero\"]",
               "nacionalidad":{
                  "cve":"1",
                  "nom":"Mexicana"
               },
               "entidadNacimiento":{
                  "cve":"07",
                  "nomOf":"Chiapas",
                  "nomCor":"Chiapas",
                  "municipios":null
               }
            },
            "fechaDetencion":{
               "$date":"2020-05-06T17:35:51.255Z"
            }
         },
         "__v":0,
         "idEvento":{
            "$oid":"5eb2eebc8b15e500451744e0"
         },
         "idLocal":"20200506123551255",
         "idPreIph":{
            "$oid":"5eb2f0868b15e50045174512"
         }
      }
   ],
   "estatus":{
      "cve":2,
      "nom":"FINALIZADO"
   },
   "idEvento":{
      "$oid":"5eb2eebc8b15e500451744e0"
   },
   "intervencion":{
      "ubicacion":{
         "_id":null,
         "lat":"25.8051218",
         "long":"-100.3667917",
         "cp":"66061",
         "colonia":"Sin Nombre de Colonia 8",
         "calle":"Titanio",
         "numero":"545",
         "numInt":"",
         "referencias":"enfrente de la bodega Aurrerá de Titanic",
         "entreCalle":null,
         "entreCalle2":null,
         "entidad":{
            "cve":"19",
            "nomOf":"NUEVO LEÓN",
            "nomCor":"Nuevo León"
         },
         "municipio":{
            "cve":"021",
            "nomOf":"General Escobedo",
            "nomCor":"General Escobedo"
         }
      },
      "referencias":null,
      "lat":null,
      "long":null,
      "ultimaMod":{
         "$date":"1900-01-01T06:00:00.000Z"
      }
   },
   "narrativa":{
      "narrativa":"realizando labores de seguridad a las 11:30 central de radio se encuentra una persona ingiriendo bebidas alcohólicas en la calle",
      "ultimaMod":{
         "$date":"2020-05-06T17:15:40.816Z"
      }
   },
   "puestaDisposicion":{
      "puestaDisp":{
         "$date":"2020-05-06T17:42:00.000Z"
      },
      "noExp":"2424247",
      "unidadArribo":"783",
      "isUnidadArribo":false,
      "primerResp":null,
      "adscripcion":null,
      "autoridadRecibe":"code",
      "adscripcionRecibe":"code",
      "cargoRecibe":"mp",
      "ultimaMod":{
         "$date":"1900-01-01T06:00:00.000Z"
      }
   },
   "ultimaMod":{
      "$date":"2020-05-06T17:49:04.616Z"
   },
   "vehiculos":[
      {
         "fechaRetencion":{
            "$date":"2020-05-06T17:39:16.074Z"
         },
         "tipoVehiculo":{
            "cve":1,
            "nom":"Terrestre"
         },
         "otroTipoVehiculo":"",
         "procedencia":{
            "cve":1,
            "nom":"Nacional"
         },
         "marca":"fod",
         "uso":{
            "cve":1,
            "nom":"Particular"
         },
         "submarca":"malibu",
         "modelo":"2000",
         "color":"azul",
         "placa":"stv32a",
         "noSerie":"sd",
         "observaciones":"un golpe en la cajuela ",
         "destino":"lote 10 de garges y talleres",
         "primerRespondientes":[

         ],
         "ultimaMod":{
            "$date":"2020-05-06T17:41:35.857Z"
         },
         "_id":null
      }
   ]
}
 */
