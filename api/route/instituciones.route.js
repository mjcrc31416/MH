
const express = require('express');
const app = express();
const instRoute = express.Router();
const mongoose = require('mongoose');

// Require Business model in our routes module
let Instituciones = require('../model/Instituciones');

// Agregar nuevo
instRoute.route('/add').post(function (req, res) {
  let instituciones = new Instituciones(req.body);

  // Actualizar
  let filter = {_id: instituciones._id};
  Instituciones.findOneAndUpdate(filter, instituciones, {
    new: true,
    upsert: true // Make this update into an upsert
  }).exec((err,data) => {
    if (!err) {
      res.status(200).json(data);
    } else {
      res.status(200).json(null);
    }
  });
  //
  // instituciones.save()
  //   .then(obj => {
  //     res.status(200).json(obj);
  //   })
  //   .catch(err => {
  //     res.status(400).send("unable to save to database");
  //   });
});

// Obtener todos
instRoute.route('/getall').get(function (req, res) {
  console.log('en servicio');

  Instituciones.find()
    .then( (obj,msg)=>{
      res.status(200).json(obj);
    })
    .catch( err => {
      res.status(400).send(err);
    })
  ;
});

// Prueba
instRoute.route('/test').get(function (req, res) {
  res.json({data: 'test'});
});

// Prueba
instRoute.route('/remove/:id').get(function (req, res) {
  Instituciones.remove({_id: req.params.id}, function(err) {
    if (!err) {
      res.status(200).send('ok');
    }
    else {
      res.status(400).send(err);
    }
  });
});

instRoute.route('/get/:id').get(function (req, res) {
  console.log(req.params);
  Instituciones.findById( req.params.id,(err,data) => {
    console.log(data);
    if(data) {
      res.status(200).json(data);
    } else {
      res.status(400).json(null);
    }
  });
});


module.exports = instRoute;
