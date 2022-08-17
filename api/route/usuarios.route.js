const express = require('express');
const app = express();
const mongoose = require('mongoose');
const router = express.Router();
const instRoute = express.Router();
const _ = require('lodash');

// Require Business model in our routes module
let Usuarios = require('../model/Usuarios');

// Agregar y / o actualizar
instRoute.route('/upsert').post(function (req, res) {
  console.log("init upsert = = = = = = = = = = = = = = = ");
  let usuarios = new Usuarios(req.body);

 if (!_.get(usuarios,'_id',null)) {
    console.log('hasOwnProperty: true');

    let id = mongoose.Types.ObjectId();
    usuarios._id = id;

  } else {
    console.log('hasOwnProperty: false');
  }

  // Buscar por ids
  let filter = {_id: usuarios._id};

  // Agregar o actualizar
  Usuarios.findOneAndUpdate(filter, usuarios, {
    new: true,
    upsert: true // Make this update into an upsert

  }).exec((err,data) => {
    if (!err) {
      res.status(200).json(data);
    } else {
      res.status(400).json(null);
    }
  });
});

// // Obtener todos
instRoute.route('/getall').get(function (req, res) {
  console.log('en servicio');

  Usuarios.find({'docInfo.isActive': true}, function (err, data) {
    if (!err) {
      res.status(200).json(data);
    } else {
      res.status(400).send(err);
    }
  });
});

// Validar correo del usuario
instRoute.route('/countcorreo').post(function (req, res) {
  console.log('en servicio');
  const clientData = req.body.correo;
  console.log(clientData);

  Usuarios.aggregate([
    {
      '$match': {
        'correo': clientData,
        'docInfo.isActive': true
      }
    }, {
      '$count': 'correo'
    }
  ]).exec(function(err,data) {
    if (!err) {
      console.log(data);
      // const count = data.length;
      let resData;
      if(data && data.length > 0) {
        resData = data[0];
      } else {
        resData = {count: 0};
      }

      res.status(200).json(resData);

    } else {
      res.status(400).send(err);
    }
  });

  // Usuarios.find({pwd: clientPwd}, function (err, data) {
  //   if (!err) {
  //     const count = data.length;
  //     res.status(200).json({
  //       count: count
  //     });
  //   } else {
  //     res.status(400).send(err);
  //   }
  // });
});

// Obtener por el id del usuario
instRoute.route('/getbyid/:id').get(function (req, res) {
  console.log(req.params);
  Usuarios.findOne( {_id: req.params.id},(err,data) => {
    console.log(data);
    if(data) {

      res.status(200).json(data);
    } else {
      res.status(400).json(null);
    }
  });
});

// Pedir datos de correo
instRoute.route('/login').post(function (req, res) {
  console.log('en servicio');
  //let usuarios = JSON.parse(req.body);
  let correo = req.body.correo;
  let pwd = req.body.pwd;

  Usuarios.findOne({ correo: correo, pwd: pwd}, (err, data) => {
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(200).send({ message: 'No existe el usuario' });
      console.log(data);
    }
  });
});

// Soft delete by id
router.route('/remove/:id').get(function (req, res) {
  Usuarios.remove({_id: req.params.id}, function(err) {
    if (!err) {
      res.status(200).send('ok');
    }
    else {
      res.status(400).send(err);
    }
  });
});

// instRoute.route('/remove/:id').post(function (req, res) {

//   // Update isActive flag
//   Usuarios.findOneAndUpdate(
//     {_id: req.params.id},
//     {$set: {'docInfo.isActive': false}},
//     {returnNewDocument: true}
//  ).exec((err,data) => {
//     if (!err) {
//       res.status(200).json(data);
//     } else {
//       res.status(400).json(null);
//     }
//   });
// });

instRoute.route('/update/:id').post(function (req, res) {
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

    await Usuarios.updateOne({_id: newData._id},
      {
        $set: {
          'nombre': newData.nombre,
          'correo': newData.correo,
          'fecNac': newData.fecNac,
          'pwd': newData.pwd,
          'integrantes': []
        }
      }
    );

    await Usuarios.updateOne({_id: newData._id},{
      $push:{
        'integrantes': newData.integrantes
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

// CARGA GRID =========================================================
router.route('/getUsuarios').get(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await getUsuarios(req.query.ent);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});

async function getUsuarios (ent) {
  console.log('getUsuarios: init');
  // ent = 'NUEVO LEÓN'

  try{
    resp = await Usuarios.aggregate(
      [
        {
          '$match': {
            'entidad.entidad': ent
          }
        },
        {
          '$project': {
            'nombre': '$nombre', 
            'correo': '$correo', 
            'equipo': '$equipo', 
            'entidad': '$entidad.entidad'
          }
        }
      ]
    );
  }catch (e) {
    console.log('getUsuarios: Error ');
    console.log(e);
  }

  return resp;
}

// FUNCION REVOMER GRID

router.route('/remove/:id').get(function (req, res) {
  Usuarios.remove({_id: req.params.id}, function(err) {
    if (!err) {
      res.status(200).send('ok');
    }
    else {
      res.status(400).send(err);
    }
  });
});


module.exports = instRoute;
