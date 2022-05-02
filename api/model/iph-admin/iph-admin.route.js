const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const _ = require('lodash');

// MONGO MODELS -----------------------------------------
let PreIph = require('./pre-iph-admin.model');
let Evento = require('../eventos.model');
let Detenidos = require('./detenidos.model');
let MyModel = require('./detenidos.model');
let NewModel = require('./pre-iph-admin.model');
let Certificado = require('./../corporacion/certificado.model');
let Dactiloscopia = require('./../corporacion/dactiloscopia.model');
let Usuarios = require('./../Usuarios');


// ======================================================
// PRE IPH
// ======================================================
const routeName01 = '/preiph/getByIdEv/:idEvento/:idPreIph';
router.route(routeName01).get(function (req, res) {

  console.log(routeName01 + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await preIphGetByIdEv(req.params.idEvento, req.params.idPreIph);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(routeName01 + ' : '+'fin');
  };

  fnMain(req, res);
});

async function preIphGetByIdEv (idEvento, idPreIph) {
  const nameSrv = routeName01;
  console.log(nameSrv + ' : inicio');

  let resp = null;
  let evento, preIph;

  try {

    evento = await Evento.aggregate([
      // {
      //   '$match': {
      //     '_id': isObjectIdValid(idEvento)
      //   }
      // },
      {
        '$match': {
          '_id': mongoose.Types.ObjectId(idEvento)
        }
      }, {
        '$project': {
          'asignacionPrimResp': '$asignacionPrimResp',
          'atiende': '$atiende.atiende',
          'coordinadora': '$coordinadora.coordinadora',
          'denunciante': '$denunciante',
          'estatus': '$estatus.nom',
          'fecha': '$fecha',
          'fechaAsignacion': '$fechaAsignacion',
          'folio911': '$folio911',
          'folioInterno': '$folioInterno',
          'lat': '$lat',
          'long': '$long',
          'tincidente': '$tincidente.nom',
          'stincidente': '$stincidente.nom',
          'incidente': '$incidente.nom',
          'municipio': '$municipio.municipio',
          'numCons': '$numCons',
          'reporta': '$reporta.nombre',
          'strFecha': '$strFecha',
          'texto': '$texto',
          'torre': '$torre.torre',
          'ubicacionEvento': '$ubicacionEvento',
          'ultimaActualizacion': '$ultimaActualizacion'
        }
      }
    ]);
   } catch (e) {
    console.log('preIphGetByIdEv: Error ');
    console.log(e);
  }

  try{
    preIph = await PreIph.aggregate([
  {
    '$lookup': {
      'from': 'eventos',
      'localField': 'idEvento',
      'foreignField': '_id',
      'as': 'eventos'
    }
  }, {
    '$unwind': {
      'path': '$eventos',
      'includeArrayIndex': 'idEvento'
    }
  }, {
    '$project': {
      'folioInterno': '$conocimiento.folioInterno',
      'folio911': '$conocimiento.folio911',
      'tincidente': '$eventos.tincidente.nom',
      'estatus': '$estatus.nom',
      'fecha': '$eventos.fecha',
      'asignado': '$eventos.aceptado.fechaArribo',
      'ultimaMod': '$conocimiento.ultimaMod'
    }
  }
]);
  } catch (e) {
    console.log('preIphGetByIdEv: Error ');
    console.log(e);
  }

  return {
    evento: evento,
    preIph: preIph,
  };
}

const routeName02 = '/preiph/upse';
router.route(routeName02).post(function (req, res) {

  console.log(routeName02 + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await upsePreIph(req.body);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(routeName01 + ' : '+'fin');
  };

  fnMain(req, res);
});

async function upsePreIph (data) {
  const nameSrv = routeName02;
  console.log(nameSrv + ' : inicio');
  const clientData = data;

  let resp = null;

  const _id = (data._id) ? data._id : null;
  if (_.isNil(_id)) {
    data = new PreIph(data);
  }
  console.log(data);

  try {
    // Eliminar detidos en caso de que existan
    if (clientData.delDetenidos && clientData.delDetenidos.length) {
      await upsePreIphDelDetenidos(clientData.delDetenidos);
    }

    // Insertar detenidos desde pre iph
    let lstDetenido = clientData.detenidos;
    lstDetenido = await upsertDetenidosFromPreIph(lstDetenido);
    // for (const det of lstDetenido) {
    //   if (!det.docInfo) {
    //     det.docInfo = {
    //       isActive: true
    //     };
    //   }
    //   // Es nuevo
    //   if (!det._id || det.serverLoaded) {
    //     const tmpDet = new Detenidos(det);
    //
    //     let respTmp = await Detenidos.findOneAndUpdate({_id: tmpDet._id}, tmpDet, {
    //       new: true,
    //       upsert: true // Make this update into an upsert
    //     });
    //
    //     det._id = respTmp._id;
    //   }
    // }
    console.log('upsert >>>>>>>>>>>>>>>>>>>>>>>>>>>');
    if (_.isNil(clientData.detenidos) || clientData.detenidos.length <= 0 ) {
      data.detenidos = null;
    } else {
      data.detenidos = lstDetenido;
    }

    console.log(data);
    resp = await PreIph.findOneAndUpdate({_id: data._id}, data, {
      new: true,
      upsert: true // Make this update into an upsert
    });
    console.log(resp);
  } catch (e) {
    console.log(nameSrv + ' : error');
    console.log(e);
  }

  return resp;
}

async function upsePreIphDelDetenidos (delDetenidos) {
  console.log('upsePreIphDelDetenidos >>>>>>>>>>>>>>>>>>>>>>>>>>>');
  if (_.isNil(delDetenidos) || delDetenidos.length <= 0) {
    return;
  }

  try {
    for (const det of delDetenidos) {
      if (det._id) {
        const tmpDet = await Detenidos.findOne({_id: det._id}).exec();
        console.log(tmpDet);
        if (tmpDet) {
          tmpDet.docInfo = {
            isActive: false
          };
          await tmpDet.save();
        }
      }
    }// end for
  } catch (e) {
    console.log(e);
  }
  console.log('upsePreIphDelDetenidos <<<<<<<<<<<<<<<<<<<<<<<<<<<');
}

async function upsertDetenidosFromPreIph (lstDetenido) {
  console.log('upsertDetenidosFromPreIph >>>>>>>>>>>>>>>>>>>>>>>>>>>');
  if (_.isNil(lstDetenido) || lstDetenido.length <= 0) {
    return lstDetenido;
  }

  try {
    for (const det of lstDetenido) {
      if (!det.docInfo) {
        det.docInfo = {
          isActive: true
        };
      }
      // Es nuevo
      let tmpDet = null;
      if (_.isNil(det._id)) {
        tmpDet = new Detenidos(det);
      } else {
        tmpDet = det;
      }

      let respTmp = await Detenidos.findOneAndUpdate({_id: tmpDet._id}, tmpDet, {
        new: true,
        upsert: true // Make this update into an upsert
      });

        det._id = respTmp._id;
      }
   }  catch (e) {
    console.log(e);
  }

  console.log('upsertDetenidosFromPreIph <<<<<<<<<<<<<<<<<<<<<<<<<<<');
  return lstDetenido;
}


const rnDet01 = '/preiph/getDet/:id';
router.route(rnDet01).get(function (req, res) {

  console.log(rnDet01 + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await getDetById(req.params.id);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(routeName01 + ' : '+'fin');
  };

  fnMain(req, res);
});

async function getDetById (id) {
  const nameSrv = rnDet01;
  console.log(nameSrv + ' : inicio');

  let resp = null;
  try {
    resp = await Detenidos.aggregate([
      {
        '$match': {
          '_id': isObjectIdValid(id)
        }
      },
    ]);
  } catch (e) {
    console.log(nameSrv + ' : error');
    console.log(e);
  }

  return resp;
}

// ================================================================
// CARGA GRID DETENIDO CERTIFICADO=========================================================
router.route('/getdetenido').get(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await getDetenidos(req.query.tipo, req.query.inst, req.query.sede, req.query.mun);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});

async function getDetenidos (tipo, inst, sede, mun) {
  console.log('getDetenidos: init');
    // ent = 'Nuevo León'

  try{
    resp = await Detenidos.aggregate(
            [
              {
                '$lookup': {
                  'from': 'eventos', 
                  'localField': 'idEvento', 
                  'foreignField': '_id', 
                  'as': 'eventos'
                }
              }, 
              {
                '$match': {
                  'eventos.tipo.cve': tipo,
                  'eventos.institucion.cve': inst,
                  'eventos.sede.cve': sede,
                  'eventos.municip.cve': mun
                }
              },
              {
                '$unwind': {
                  'path': '$eventos', 
                  'includeArrayIndex': 'idPreIph'
                }
              }, 
              {
                $sort: {
                  'intervencion.fechaDetencion': -1
                }
              },
              {
                '$project': {
                  'folioInterno': '$eventos.folioInterno', 
                  'fechaDetencion': '$intervencion.fechaDetencion', 
                  'incidente': '$eventos.incidente.nom', 
                  'nombre': '$intervencion.datPer.nombre', 
                  'appat': '$intervencion.datPer.appat', 
                  'apmat': '$intervencion.datPer.apmat', 
                  'sexo': '$intervencion.datPer.sexo.nom', 
                  'fecnac': '$intervencion.datPer.fecnac', 
                  'nacionalidad': '$intervencion.datPer.nacionalidad.nom'
                  
                }
              }
            ]
    ).limit(70);
  }catch (e) {
    console.log('getDetenidos: Error ');
    console.log(e);
  }

  return resp;
}

// CARGA INFO DETENIDO CERTIFICADO=========================================================
router.route('/getdetenciones/:id').get(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await getDetenciones(req.params.id);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});

async function getDetenciones (id) {
  console.log('getDetenciones: init');

    let resp = null;
    let resp2 = null;
    let respo = null;

    try{
      resp = await NewModel.aggregate(
        [
          {
            '$unwind': {
              'path': '$detenidos',
              'includeArrayIndex': 'det_id',
              'preserveNullAndEmptyArrays': true
            }
          }, {
            '$match': {
              'detenidos._id': mongoose.Types.ObjectId(id)
            }
          }, {
            '$project': {
              'folioInterno': '$conocimiento.folioInterno'
            }
          }
        ]
      ).limit(70);
    }
  catch (e) {
    console.log('getDetenciones: Error ');
    console.log(e);
  }

  try{
    resp2 = await Detenidos.findOne({_id: id}).limit(70);
    /*
    resp2 = await Detenidos.aggregate(
      [
        {
          '$match': {
            '_id': mongoose.Types.ObjectId(id)
          }
        }, {
          '$project': {
            'nombre': '$intervencion.datPer.nombre', 
            'appat': '$intervencion.datPer.appat', 
            'apmat': '$intervencion.datPer.apmat', 
            'sexo': '$intervencion.datPer.sexo', 
            'fecnac': '$intervencion.datPer.fecnac', 
            'nacionalidad': '$intervencion.datPer.nacionalidad.nom',
            'alias': '$intervencion.datPer.alias',
            'calle': '$intervencion.domicilio.calle', 
            'colonia': '$intervencion.domicilio.colonia', 
            'numero': '$intervencion.domicilio.numero', 
            'numInt': '$intervencion.domicilio.numInt', 
            'municipio': '$intervencion.domicilio.municipio', 
            'entidad': '$intervencion.domicilio.entidad', 
            'fecnac': '$intervencion.datPer.fecnac'
          }
        }
      ]
    );
    */
  }catch (e) {
    console.log('getDetenciones: Error ');
    console.log(e);
  }
  return {
    detenido: resp2,
    preIph: resp,
    // dactiloscopia: respo,
  };
}

// ================================================================
// CARGA GRID DETENIDO DACTILOSCOPIA=========================================================
router.route('/getdetdacti').get(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await getDetdactil(req.query.tipo, req.query.inst, req.query.sede, req.query.mun);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});

async function getDetdactil (tipo, inst, sede, mun) {
  console.log('getdetdactil: init');
  // ent = 'Nuevo León'

  try{
    resp = await Detenidos.aggregate(
      [
        {
          '$lookup': {
            'from': 'eventos', 
            'localField': 'idEvento', 
            'foreignField': '_id', 
            'as': 'eventos'
          }
        }, 
        {
          '$match': {
            'eventos.tipo.cve': tipo,
            'eventos.institucion.cve': inst,
            'eventos.sede.cve': sede,
            'eventos.municip.cve': mun
          }
        },
        {
          '$unwind': {
            'path': '$eventos', 
            'includeArrayIndex': 'idPreIph'
          }
        }, 
        {
          $sort: {
            'intervencion.fechaDetencion': -1
          }
        },
        {
          '$project': {
            'folioInterno': '$eventos.folioInterno', 
            'fechaDetencion': '$intervencion.fechaDetencion', 
            'incidente': '$eventos.incidente.nom', 
            'nombre': '$intervencion.datPer.nombre', 
            'appat': '$intervencion.datPer.appat', 
            'apmat': '$intervencion.datPer.apmat', 
            'sexo': '$intervencion.datPer.sexo.nom', 
            'fecnac': '$intervencion.datPer.fecnac', 
            'nacionalidad': '$intervencion.datPer.nacionalidad.nom',
          }
        }
      ]
    ).limit(70);
  }catch (e) {
    console.log('getdetdactil: Error ');
    console.log(e);
  }

  return resp;
}

// CARGA INFO DETENIDO DACTILOSCOPIA=========================================================
router.route('/getdetdactiloscopia/:id').get(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await getDetdactiloscopias(req.params.id);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});

async function getDetdactiloscopias (id) {
  console.log('getDetdactiloscopias: init');

    let resp = null;
    let resp2 = null;
    let respo = null;

    try{
      resp = await NewModel.aggregate(
        [
          {
            '$unwind': {
              'path': '$detenidos',
              'includeArrayIndex': 'det_id',
              'preserveNullAndEmptyArrays': true
            }
          }, {
            '$match': {
              'detenidos._id': mongoose.Types.ObjectId(id)
            }
          }, {
            '$project': {
              'folioInterno': '$conocimiento.folioInterno'
            }
          }
        ]
      ).limit(70);
    }
  catch (e) {
    console.log('getDetdactiloscopias: Error ');
    console.log(e);
  }

  try{
    resp2 = await Detenidos.findOne({_id: id});
  }catch (e) {
    console.log('getDetdactiloscopias: Error ');
    console.log(e);
  }
  try{
    respo = await Detenidos.aggregate(
      [
        {
          '$match': {
            '_id': mongoose.Types.ObjectId(id)
          }
        }, {
          '$project': {
            'estatus': '$mediafiliacion.estatus.nom'
          }
        }
      ]
    ).limit(70);
  }
catch (e) {
  console.log('getDetdactiloscopias: Error ');
  console.log(e);
}
  return {
    detenido: resp2,
    preIph: resp,
    estatus: respo,
  };
}

// ================================================================
// CARGA GRID DETENIDO CERTIFICADO=========================================================
router.route('/getdetregistro').get(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await getDetregistros(req.query.tipo, req.query.inst, req.query.sede, req.query.mun);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});

async function getDetregistros (tipo, inst, sede, mun) {
  console.log('getDetregistros: init');
  // ent = 'Nuevo León'

  try{
    resp = await Detenidos.aggregate(
            [

              {
                '$lookup': {
                  'from': 'eventos', 
                  'localField': 'idEvento', 
                  'foreignField': '_id', 
                  'as': 'eventos'
                }
              }, 
              {
                '$match': {
                  'eventos.tipo.cve': tipo,
                  'eventos.institucion.cve': inst,
                  'eventos.sede.cve': sede,
                  'eventos.municip.cve': mun
                }
              },
              {
                '$unwind': {
                  'path': '$eventos', 
                  'includeArrayIndex': 'idPreIph'
                }
              }, 
              {
                $sort: {
                  'intervencion.fechaDetencion': -1
                }
              },
              {
                '$project': {
                  'folioInterno': '$eventos.folioInterno', 
                  'fechaDetencion': '$intervencion.fechaDetencion', 
                  'incidente': '$eventos.incidente.nom', 
                  'nombre': '$intervencion.datPer.nombre', 
                  'appat': '$intervencion.datPer.appat', 
                  'apmat': '$intervencion.datPer.apmat', 
                  'sexo': '$intervencion.datPer.sexo.nom', 
                  'fecnac': '$intervencion.datPer.fecnac', 
                  'nacionalidad': '$intervencion.datPer.nacionalidad.nom'
                }
              }
            ]
    ).limit(70);
  }catch (e) {
    console.log('getDetregistros: Error ');
    console.log(e);
  }

  return resp;
}

// CARGA INFO DETENIDO OBJETOS PERSONALES=========================================================
router.route('/getdetregistro/:id').get(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await getDetregistro(req.params.id);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});

async function getDetregistro (id) {
  console.log('getDetregistro: init');

    let resp = null;
    let resp2 = null;
    let respo = null;

    try{
      resp = await NewModel.aggregate(
        [
          {
            '$unwind': {
              'path': '$detenidos',
              'includeArrayIndex': 'det_id',
              'preserveNullAndEmptyArrays': true
            }
          }, {
            '$match': {
              'detenidos._id': mongoose.Types.ObjectId(id)
            }
          }, {
            '$project': {
              'folioInterno': '$conocimiento.folioInterno'
            }
          }
        ]
      );
    }
  catch (e) {
    console.log('getDetregistro: Error ');
    console.log(e);
  }

  try{
    resp2 = await Detenidos.findOne({_id: id});
  }catch (e) {
    console.log('getDetregistro: Error ');
    console.log(e);
  }
  try{
    respo = await Detenidos.aggregate(
      [
        {
          '$match': {
            '_id': mongoose.Types.ObjectId(id)
          }
        }, {
          '$project': {
            'estatus': '$mediafiliacion.estatus.nom'
          }
        }
      ]
    );
  }
catch (e) {
  console.log('getDetregistro: Error ');
  console.log(e);
}
  return {
    detenido: resp2,
    preIph: resp,
    estatus: respo,
  };
}


// ======================================================
// UTILS
// ======================================================
function isObjectIdValid(id){
  let resp = null;
  try {
    resp = mongoose.Types.ObjectId(id);
  } catch (e) {
    console.log('id invaled');
  }
  return resp;
}

module.exports = router;
