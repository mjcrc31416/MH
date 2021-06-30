
const express = require('express');
const app = express();
const inciRoute = express.Router();

// Require Business model in our routes module
let Incidente = require('../model/Incidente');

// Agregar nuevo
inciRoute.route('/add').post(function (req, res) {
  let incidente = new Incidente(req.body);
  incidente.save()
    .then(obj => {
      res.status(200).json(obj);
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

// Obtener todos
inciRoute.route('/getall').get(function (req, res) {
  console.log('en servicio');

  Incidente.find()
    .then( (obj,msg)=>{
      res.status(200).json(obj);
    })
    .catch( err => {
      res.status(400).send(err);
    })
  ;
});

// Prueba
inciRoute.route('/test').get(function (req, res) {
  res.json({data: 'test'});
});


module.exports = inciRoute;
