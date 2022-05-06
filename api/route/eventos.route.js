const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const _ = require('lodash');

//let Reporta = require('../model/Reporta');
let Elementos = require('../model/elementos.model');
let Reporta = require('../model/reporta.model');
let Eventos = require('../model/eventos.model');
let Corps = require('../model/corporacion/copr.model');
let NewModel = require('../model/iph-admin/pre-iph-admin.model');
const { response } = require('express');
const EventosMapper = require('../model/eventos/mappers/eventos-mapper').EventosMapper;


router.route('/upsert').post(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await upsertEvento(req.body);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});


async function upsertEvento (data) {
  console.log('upsertEvento: init');

  let resp = null;
  let isNew = false;

  const _id = (data._id) ? data._id : null;
  if (_.isNil(_id)) {
    // data._id = mongoose.Types.ObjectId();
    data = new Eventos(data);
    isNew = true;
    // data._id = mongoose.Types.ObjectId();
  }

  console.log(data);

  try{
    // Encontrar el consecutivo máximo con base a la fecha
    if (isNew) {
      console.log('Eventos.aggregate ===========');
      let max = await Eventos.aggregate([
        {
          '$match': {
            'strFecha': data.strFecha
          }
        }, {
          '$group': {
            '_id': '$strFecha',
            'maxCons': {
              '$max': '$numCons'
            }
          }
        }
      ]);

      console.log(max);
      if(max && max.length > 0) {
        console.log('if');
        // max = (max.maxCons) ? max.maxCons : 0;
        max = max[0];
        max = max.maxCons + 1;
      } else {
        console.log('else');
        max = 1;
      }

      console.log(max);
      data.numCons = max;

      // Obtener siglas
      // let corp = Corps.find({_id: })
      let strCons = '000' + max.toString();
      strCons = strCons.substring(strCons.length-3, strCons.length);
      data.folioInterno = data.strFecha+'GOE'+strCons;

      data.estatus = {
        cve: 1,
        nom: 'REGISTRADO'
      };
    }

    resp = await Eventos.findOneAndUpdate({_id: data._id}, data, {
      new: true,
      upsert: true // Make this update into an upsert
    });
  }catch (e) {
    console.log('upsertEvento: Error ');
    console.log(e);
  }

  return resp;
}

// =========
       
// Obtener evento por ID
router.route('/getById/:id').get(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await getEventoById(req.params.id);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});


async function getEventoById (id) {
  console.log('getEventoById: init');

  let resp = null;

  try{
    resp = await Eventos.find({_id: id});
    eventos = EventosMapper.setDummyCordOnList(resp);

  }catch (e) {
    console.log('getEventoById: Error ');
    console.log(e);
  }

  return eventos;
}

// ================================================================
// CARGA GRID =========================================================
router.route('/get').get(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await getEventos(req.query.tipo, req.query.inst, req.query.sede, req.query.mun, req.query.pageIndex, req.query.pageSize);
      //console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});

async function getEventos (tipo, inst, sede, mun, page, perPage) {
  console.log('getEventos: init');
  console.log(tipo);
  console.log(inst);
  console.log(sede);
  console.log(mun);

  let resp = null
  let count = null

  try{
    page = page ? Number(page):0
    perPage = perPage ? Number(perPage):25

    let skip = page > 0 ? (page * perPage):0

    resp = await Eventos.aggregate(
      [
        { 
          $sort: {
            'fecha': -1
          }
        },
        {
          '$match': {
            'tipo.cve': tipo,
            'institucion.cve': inst,
            'sede.cve': sede,
            'municip.cve': mun
          }
        }
      ]
    ).skip(skip).limit(perPage);
      
    count = await Eventos.aggregate(
      [
        {
          '$match': {
            'tipo.cve': tipo,
            'institucion.cve': inst,
            'sede.cve': sede,
            'municip.cve': mun
          }
        },
        { $group: { _id: "folioInterno", count: { $sum: 1 } } }
        // {
        //   $group: {
        //     _id: null,
        //     myCount: {
        //       $sum: 1
        //     }
        //   }
        // }
      ]
    );

  }catch (e) {
    console.log('getEventos: Error ');
    console.log(e);
  }

  let result = {
    "data": resp,
    "total": count[0].count
  }
console.log(result)
  return result;
}

// FUNCION REVOMER GRID

router.route('/remove/:id').get(function (req, res) {
  Eventos.remove({_id: req.params.id}, function(err) {
    if (!err) {
      res.status(200).send('ok');
    }
    else {
      res.status(400).send(err);
    }
  });
});

router.route('/asignar').post(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await upseAsignarEvento(req.body);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});

async function upseAsignarEvento (data) {
  console.log('upseAsignarEvento: init');

  let resp = null;

  try{
    let evento = await Eventos.findOne({_id: data._id}).exec();

    if (!_.isNil(evento)) {
      evento.estatus = {
        cve: 2,
        nom: 'ASIGNADO'
      };

      evento.asignacionPrimResp = data.lstPersonal;
      evento.fechaAsignacion = new Date();

      resp = await evento.save();
    }

  }catch (e) {
    console.log('upsertEvento: Error ');
    console.log(e);
  }

  return resp;
}


router.route('/getByEstatus').post(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await getEventoByEstatus(req.body);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});

// async function getEventoByEstatus (data) {
//   console.log('getByEstatus: init');

//   let resp = null;

//   try{
//     // resp = await Eventos.find({}).exec();
//     resp = await Eventos.aggregate(
//       [
//         {
//           $sort: {
//             'fecha': -1
//           }
//         },
//         {
//           $match:{
//             $or: [{
//                 'estatus.cve': 2
//               },
//               {
//                 'estatus.cve': 3
//               },
//               {
//                 'estatus.cve': 4
//               }
//             ]
//           }
//         }
//         // {
//         // '$project': {
//         //   // 'nincidente': '$nincidente',
//         //   // 'reporta': '$reporta.nombre',
//         //   // 'atende': '$atiende.atiende',
//         //   // 'incidente': '$incidente.incidente',
//         //   // 'municipio': '$municipio.municipio'
//         // }
//         // }
//       ]
//     );

//   }catch (e) {
//     console.log('upsertEvento: Error ');
//     console.log(e);
//   }

//   return resp;
// }


// ================================================================
// CARGA GRID EVENTOS=========================================================
router.route('/getevento').get(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await getEvento(req.query.tipo, req.query.inst, req.query.sede, req.query.mun);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});

async function getEvento (tipo, inst, sede, mun) {
  console.log('getEvento: init');
  console.log(tipo);
  console.log(inst);
  console.log(sede);
  console.log(mun);

  try{
    resp = await NewModel.aggregate(
      [
        {
          $sort: {
            'fecha': -1
          }
        },
        {
          '$lookup': {
            'from': 'eventos', 
            'localField': 'idEvento', 
            'foreignField': '_id', 
            'as': 'eventos'
          },          
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
            'path': '$eventos'
            // 'includeArrayIndex': 'idEvento'
          }
        },
        {
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
      ])
        } catch (e) {
          console.log('preIphGetByIdEv: Error ');
          console.log(e);
        }

  return resp;
}

module.exports = router;
