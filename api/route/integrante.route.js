
const express = require('express');
const app = express();
const inteRoute = express.Router();

// Require Business model in our routes module
let Integrantes = require('../model/Integrantes');

// Agregar nuevo
inteRoute.route('/add').post(function (req, res) {
  let integrantes = new Integrantes(req.body);
  integrantes.save()
    .then(obj => {
      res.status(200).json(obj);
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

// Obtener todos
inteRoute.route('/getall').get(function (req, res) {
  console.log('en servicio');

  Integrantes.find()
    .then( (obj,msg)=>{
      res.status(200).json(obj);
    })
    .catch( err => {
      res.status(400).send(err);
    })
  ;
});

// Prueba
inteRoute.route('/test').get(function (req, res) {
  res.json({data: 'test'});
});


module.exports = inteRoute;
