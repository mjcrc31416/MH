
const express = require('express');
const app = express();
const conferenciaRoute = express.Router();
const _ = require('lodash');
const mongoose = require('mongoose');

// Require Business model in our routes module
let Conferencias = require('../model/Conferencias');
let Documentos = require('../model/Documentos');

// Agregar nuevo
conferenciaRoute.route('/add').post(function (req, res) {
  const tmpConf = req.body;
  console.log(tmpConf);
  if (tmpConf.hasOwnProperty('_id')) {
    if (tmpConf._id === '') {
      console.log('delete id');
      tmpConf._id = null;
      delete tmpConf._id;
    }
  }

  let conferencias = new Conferencias(tmpConf);

  conferencias.save()
    .then(obj => {
      res.status(200).json(obj);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
});

// Actualizar
conferenciaRoute.route('/update-test/:id').post(function (req, res) {
  Conferencias.findById(req.params.id, function(err, data) {
    if (!data)
      res.status(400).send("No se encontró el documento");
    else {
      // Update sub collections
      _.each(data.acuerdos, (item) => {
        if (item._id) {
          if (item._id !== 0) {
            let acuerdo = data.acuerdos.id(item._id);
            if (acuerdo) {
              acuerdo.numAcuerdo = item.numAcuerdo;
              acuerdo.titulo = item.titulo;
              acuerdo.descipcion = item.descipcion;
              acuerdo.estatus = item.estatus;
              acuerdo.observacion = item.observacion;
            }
          }
        } else {
          Conferencias.acuerdos.push(item);
        }
      });

      _.each(data.integrantes, (item) => {
        if (item._id) {
          if (item._id !== 0) {
            let integrante = data.integrantes.id(item._id);
            if (integrante) {
              integrante.nomIntegrante = item.data.nomIntegrante;
              integrante.cargo = item.data.cargo;
              integrante.sector = item.data.sector;
              integrante.inst = item.data.inst;
              integrante.entidad = item.data.entidad;
              integrante.domicilio = item.data.domicilio;
              integrante.correo = item.data.correo;
              integrante.tel = item.data.tel;
              integrante.secre = item.data.secre;
              integrante.atendido = item.data.atendido;
            }
          }
        } else {
          Conferencias.integrantes.push(item);
        }
      });

      _.each(data.invitados, (item) => {
        if (item._id) {
          if (item._id !== 0) {
            let invitado = data.invitados.id(item._id);
            if (invitado) {
              invitado.nomIntegrante = item.data.nomIntegrante;
              invitado.cargo = item.data.cargo;
              invitado.sector = item.data.sector;
              invitado.inst = item.data.inst;
              invitado.entidad = item.data.entidad;
              invitado.domicilio = item.data.domicilio;
              invitado.correo = item.data.correo;
              invitado.tel = item.data.tel;
              invitado.secre = item.data.secre;
              invitado.atendido = item.data.atendido;
            }
          }
        } else {
          Conferencias.invitados.push(item);
        }
      });

      // Update documents collection
      const newDoc = req.body.documentos;
      if(newDoc){
        for (const doc of newDoc) {
          if( _.has(doc,'_id') ) {
            let dbDoc = data.documentos.id(doc._id);
            dbDoc.nombre = newDoc.nombre;
            dbDoc.nombre = newDoc.nombre;
          }
        }
      }


      _.each(data.documentos, (item) => {
        if (item._id) {
          if (item._id !== 0) {
            let acuerdo = data.acuerdos.id(item._id);
            if (acuerdo) {
              acuerdo.numAcuerdo = item.numAcuerdo;
              acuerdo.titulo = item.titulo;
              acuerdo.descipcion = item.descipcion;
              acuerdo.estatus = item.estatus;
            }
          }
        } else {
          Conferencias.acuerdos.push(item);
        }
      });

      _.each(data.integrantes, (item) => {
        if (item._id) {
          if (item._id !== 0) {
            let integrante = data.integrantes.id(item._id);
            if (integrante) {
              integrante.nomIntegrante = item.data.nomIntegrante;
              integrante.cargo = item.data.cargo;
              integrante.sector = item.data.sector;
              integrante.inst = item.data.inst;
              integrante.entidad = item.data.entidad;
              integrante.domicilio = item.data.domicilio;
              integrante.correo = item.data.correo;
              integrante.tel = item.data.tel;
              integrante.secre = item.data.secre;
              integrante.atendido = item.data.atendido;
            }
          }
        } else {
          Conferencias.integrantes.push(item);
        }
      });

      _.each(data.invitados, (item) => {
        if (item._id) {
          if (item._id !== 0) {
            let invitado = data.invitados.id(item._id);
            if (invitado) {
              invitado.nomIntegrante = item.data.nomIntegrante;
              invitado.cargo = item.data.cargo;
              invitado.sector = item.data.sector;
              invitado.inst = item.data.inst;
              invitado.entidad = item.data.entidad;
              invitado.domicilio = item.data.domicilio;
              invitado.correo = item.data.correo;
              invitado.tel = item.data.tel;
              invitado.secre = item.data.secre;
              invitado.atendido = item.data.atendido;
            }
          }
        } else {
          Conferencias.invitados.push(item);
        }
      });

      data.tipoSesion = req.body.tipoSesion;
      data.numSesion = req.body.numSesion;
      data.fechaSesion = req.body.fechaSesion;
      data.sede = req.body.sede;
      data.integrantes = req.body.integrantes;
      data.invitados = req.body.invitados;
      data.acuerdos = req.body.acuerdos;
      data.documentos = req.body.documentos;
      data.markModified('acuerdos', 'integrantes', 'invitados');

      data.save().then(data => {
        res.json('Actualización completa');
      })
        .catch(err => {
          res.status(400).send("No se pudo actualizar el documento");
        });
    }
  });
});

// Test service
conferenciaRoute.route('/update/:id').post(function (req, res) {
  const newData = req.body;
  console.log(newData);

  let localFunc = async (newData, res, req) => {
    if (!_.isEmpty(newData)) {
      console.log('No empty');
      // Get document based on id
      try {
        const updatedDoc = await updateConferencia(newData);
        res.status(200).json(updatedDoc);
      } catch (e) {
        console.log('/update/:id ERROR ************************************');
        console.log(e);
        res.status(400).send(e);
      }xa
    }
  };

  localFunc(newData, res, req);
});

async function updateConferencia (newData) {
  //
  let updatedDoc = {test: 'updateConferencia'};
  console.log('updateConferencia');
  let session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (_.get(newData,'rechazos',null) === null) {
      newData.rechazos = [];
    }

    await Conferencias.updateOne({_id: newData._id},
      {
        $set: {
          'tipoSesion': newData.tipoSesion,
          'numSesion': newData.numSesion,
          'txSesion': newData.txSesion,
          'fechaSesion': newData.fechaSesion,
          'sede': newData.sede,
          'docActive': newData.docActive,
          'rechazos': newData.rechazos,
          'estatusAprobacion': newData.estatusAprobacion,
          'integrantes': [],
          'invitados': [],
          'acuerdos': [],
          'documentos': []
        }
      }
    );

    await Conferencias.updateOne({_id: newData._id},{
      $push:{
        'integrantes': newData.integrantes,
        'invitados': newData.invitados,
        'acuerdos': newData.acuerdos,
        'documentos': newData.documentos
      }
    });

    // Commit transactions
    session.commitTransaction();
    session.endSession();

    updatedDoc = await Conferencias.find({_id: newData._id}).exec();

    if (updatedDoc) {
      if (Array.isArray(updatedDoc)) {
        if (updatedDoc.length > 0)
          updatedDoc = updatedDoc[0];
      }
    }
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }

  return updatedDoc;
}

// Obtener todos
conferenciaRoute.route('/getall').get(function (req, res) {
  console.log('en servicio');

  const captura = mongoose.Types.ObjectId('5d8189170397eae7834bba30');

  Conferencias.find({docActive: true, 'estatusAprobacion._id': captura})
    .then( (obj,msg)=>{
      res.status(200).json(obj);
    })
    .catch( err => {
      res.status(400).send(err);
    })
  ;
});

// Obtener elementos con estatus de aprobado
conferenciaRoute.route('/getallaprobacion').get(function (req, res) {
  console.log('init: getallaprobacion');
  // {_id: "5d8189170397eae7834bba30", estatus: "En Captura", bnid: 1}
  // 5d8189170397eae7834bba30
  // Conferencias.find({docActive: true})
  Conferencias.find({docActive: true, 'estatusAprobacion._id' : mongoose.Types.ObjectId('5d8189540397eae7834bba31')})
    .then( (obj,msg)=>{
      res.status(200).json(obj);
    })
    .catch( err => {
      res.status(400).send(err);
    })
  ;
});

// Obtener todos
conferenciaRoute.route('/getallaprobacion').get(function (req, res) {
  console.log('init: getallaprobacion');
  // {_id: "5d8189170397eae7834bba30", estatus: "En Captura", bnid: 1}
  // 5d8189170397eae7834bba30
  // Conferencias.find({docActive: true})
  Conferencias.find({docActive: true, 'estatusAprobacion._id' : mongoose.Types.ObjectId('5d8189540397eae7834bba31')})
    .then( (obj,msg)=>{
      res.status(200).json(obj);
    })
    .catch( err => {
      res.status(400).send(err);
    })
  ;
});

// Obtener todos con estatus rechazado
conferenciaRoute.route('/getallrejected').get(function (req, res) {
  console.log('init: getallrejected');
  const idRejected = '5d8af9c30460e40d4cc70702';

  getCnspListByEstAprb(idRejected,req,res);

  console.log('end: getallrejected');
});

// Obtener todos con estatus aprobado
conferenciaRoute.route('/getallapproved').get(function (req, res) {
  console.log('init: getallapproved');
  const idApproved = '5d8189670397eae7834bba32';

  getCnspListByEstAprb(idApproved,req,res);

  console.log('end: getallapproved');
});

function getCnspListByEstAprb(estAprbId, req, res) {
  const id = mongoose.Types.ObjectId(estAprbId);
  Conferencias.find({docActive: true, 'estatusAprobacion._id' : id})
    .then( (obj,msg)=>{
      res.status(200).json(obj);
    })
    .catch( err => {
      res.status(400).send(err);
    })
  ;
}

// Obtiene por número de conferencia
conferenciaRoute.route('/getByNumSes/:ns').get(function (req, res) {
  console.log('en servicio');
  const numSesion = req.params.ns;

  Conferencias.find({numSesion: numSesion})
    .then( (obj,msg)=>{
      if(obj) {
        res.status(200).json({
          _id: obj._id,
          exists: true
        });
      } else {
        res.status(200).json({
          _id: null,
          exists: false
        });
      }
    })
    .catch( err => {
      res.status(400).send(err);
    });
});



// Obtiene por número de conferencia
conferenciaRoute.route('/get/:id').get(function (req, res) {
  console.log('get: inicio');
  // '_id': mongoose.Types.ObjectId(req.params.id)

  Conferencias.aggregate(
    [
      {
        '$match': {
          '_id': mongoose.Types.ObjectId(req.params.id)
        }
      },
      {
      '$lookup': {
        'from': 'documentos',
        'localField': 'documentos',
        'foreignField': '_id',
        'as': 'documentosList'
      }
    }, {
      '$unwind': {
        'path': '$documentosList',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$unwind': {
        'path': '$documentosList.etiquetas',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'docetiquetas',
        'localField': 'documentosList.etiquetas',
        'foreignField': '_id',
        'as': 'etiquetasList'
      }
    }, {
      '$unwind': {
        'path': '$etiquetasList',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$group': {
        '_id': {
          '_id': '$_id',
          'tipoSesion': '$tipoSesion',
          'numSesion': '$numSesion',
          'fechaSesion': '$fechaSesion',
          'sede': '$sede',
          'docActive': '$docActive',
          'estatusAprobacion': '$estatusAprobacion',
          'rechazos': '$rechazos',
          'documentos': '$documentos',
          'documentObj_ID': '$documentosList._id',
          'documentObj_Nombre': '$documentosList.nombre',
          'documentObj_Tipo': '$documentosList.tipo',
          'documentObj_Estdoc': '$documentosList.estdoc',
          'documentObj_IsActive': '$documentosList.isActive',
          'integrantes': '$integrantes',
          'invitados': '$invitados',
          'acuerdos': '$acuerdos'
        },
        'etiquetasList': {
          '$push': {
            'etiquetasList': '$etiquetasList'
          }
        },
        'etiquetas': {
          '$push': {
            'etiquetas': '$documentosList.etiquetas'
          }
        }
      }
    }, {
      '$group': {
        '_id': {
          '_id': '$_id._id',
          'tipoSesion': '$_id.tipoSesion',
          'numSesion': '$_id.numSesion',
          'fechaSesion': '$_id.fechaSesion',
          'sede': '$_id.sede',
          'docActive': '$_id.docActive',
          'integrantes': '$_id.integrantes',
          'invitados': '$_id.invitados',
          'acuerdos': '$_id.acuerdos',
          'estatusAprobacion': '$_id.estatusAprobacion',
          'rechazos': '$_id.rechazos',
          'documentos': '$_id.documentos'
        },
        'documentosList': {
          '$push': {
            '_id': '$_id.documentObj_ID',
            'nombre': '$_id.documentObj_Nombre',
            'tipo': '$_id.documentObj_Tipo',
            'estdoc': '$_id.documentObj_Estdoc',
            'isActive': '$_id.documentObj_IsActive',
            'etiquetasList': '$etiquetasList.etiquetasList',
            'etiquetas': '$etiquetas'
          }
        }
      }
    }, {
      '$project': {
        '_id': '$_id._id',
        'tipoSesion': '$_id.tipoSesion',
        'numSesion': '$_id.numSesion',
        'fechaSesion': '$_id.fechaSesion',
        'sede': '$_id.sede',
        'docActive': '$_id.docActive',
        'estatusAprobacion': '$_id.estatusAprobacion',
        'rechazos': '$_id.rechazos',
        'integrantes': '$_id.integrantes',
        'invitados': '$_id.invitados',
        'acuerdos': '$_id.acuerdos',
        'documentos': '$_id.documentos',
        'documentosList': '$documentosList'
      }
    }
    ]
  ).exec().then(function (obj,msg) {
    if(obj) {
      res.status(200).json(obj);
    } else {
      res.status(400).json({msg: 'No existe el elemento'});
    }
  }).catch( err => {
    console.log('get: on catch');
    //console.log(err);
    if (err.name === 'CastError' && err.value === '0' ) {
      console.log('expected error');
      res.status(200).json(null);
    } else {
      res.status(400).send(err);
    }
  });
  console.log('get: fin');
});


// Obtener datos para el reporte
conferenciaRoute.route('/getallacuerdos').get(function (req, res) {
  console.log('getallacuerdos: inicio');
  // '_id': mongoose.Types.ObjectId(req.params.id)

  Conferencias.aggregate(
    [
      {
        '$match': {
          '_id': mongoose.Types.ObjectId('5d8bf9bccb955f1d145512e0')
        }
      }, {
        '$unwind': {
          'path': '$acuerdos',
          'includeArrayIndex': 'acuerdosIndex',
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$project': {
          'acuerdos.estatus': '$acuerdos.estatus',
          'acuerdos.numAcuerdo': '$acuerdos.numAcuerdo',
          'acuerdos.titulo': '$acuerdos.titulo',
          'acuerdos.descipcion': '$acuerdos.descipcion',
          'acuerdos.responsables': '$acuerdos.responsables',
          'acuerdos.acciones': '$acuerdos.acciones',
          'tipoSesion': '$tipoSesion',
          'numSesion': '$numSesion',
          'fechaSesion': '$fechaSesion',
          'sede': '$sede',
        }
      }
    ]
  ).exec().then(function (obj, msg) {
    if (obj) {
      res.status(200).json(obj);
    } else {
      res.status(400).json({ msg: 'No existe el elemento' });
    }
  }).catch(err => {
    console.log('getallacuerdos: on catch');
    //console.log(err);
    if (err.name === 'CastError' && err.value === '0') {
      console.log('expected error');
      res.status(200).json(null);
    } else {
      res.status(400).send(err);
    }
  });
  console.log('getallacuerdos: fin');
});


// Obtener el siguiente número de conferencia
conferenciaRoute.route('/nextcnsp').get(function (req, res) {
  const id = req.params.id;
  console.log('en servicio');

  Conferencias.aggregate( [
    {$match:{docActive: true}},
    {$group: {
      _id: null,
      max: { $max: '$numSesion' }
    }},
    {$project :{
      _id:0
    }}
  ]).exec(function (err,data){
    console.log(err);
    res.json(data);
  });
});

// Obtener por Id
conferenciaRoute.route('/rmcnsp/:id').post(function (req, res) {
  const id = req.params.id;

  Conferencias.findById(id, function(err, data) {
    data.docActive = req.body.docActive;

    data.save().then(data => {
      res.json('Actualización completa');
    })
    .catch(err => {
      res.status(400).send("No se pudo actualizar el documento");
    });
  });

});

// Get an array of items to add to existing array
function getPushableItems (list, dbArray) {
  let pushableItems = [];

  //Ids para agregar
  let foundDbItem;
  for (const item of list) {
    foundDbItem = dbArray.id(item._id);

    if (!foundDbItem) {
      pushableItems.push(item);
    }
  }// end for

  return pushableItems;
}

function getPullableItems (list, dbArray) {
  let found;
  let removeIds = [];

  // Ids para eliminar
  for (const dbItem of dbArray) {
    found = false;
    for (const item of list) {
      if (dbItem._id === item._id) {
        found = true;
        break;
      }
    }

    if (!found){
      removeIds.push(dbItem._id);
    }
  }// end for

  return removeIds;
}

module.exports = conferenciaRoute;
