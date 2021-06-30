const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const _ = require('lodash');

//let Reporta = require('../model/Reporta');
let Elementos = require('../model/elementos.model');
let Reporta = require('../model/reporta.model');
let Incidente = require('../model/incidente.model');
let Personal = require('./../model/corporacion/personal.model');
let Entidades = require('../model/common/cat-ents.model');
let Instituciones = require('../model/common/cat-tipos.model');
let Institucion = require('../model/Instituciones');


router.route('/reporta/get').get(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await getReporta();
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});


async function getReporta () {
  //let resp = await Clients.find({'docInfo.isActive': true});
  let resp = await Reporta.find();
  console.log(resp);
  return resp;
}

router.route('/incidente/:id').get(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await getIncidentes(req.params.id);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});

async function getIncidentes (id) {
  //let resp = await Clients.find({'docInfo.isActive': true});
  try{

    // para traer los datos para campos de seleccion
   resp = await Incidente.find().exec();
  }
catch (e) {
  console.log('getIncidentes: Error ');
  console.log(e);
}
  return resp;
}

router.route('/catentfed').get(function (req, res) {
  console.log('cats (1)');
  let fnMain = async (req,res) => {
    try {
      let response = await catentfed_getCatalog(req.body);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };
  console.log('cats (2)');

  fnMain(req, res);
});

async function catentfed_getCatalog (catSol) {
  try {
    console.log("catentfed_getCatalog (1)");

    let entidadesFederativas = await Entidades.aggregate(
      [
        {
          '$sort': {
            'nomOf': 1
          }
        }
      ]
    );

    return entidadesFederativas;
  } catch (e) {
    console.log("catentfed_getCatalog (2)");
    console.log("ERROR [/catentfed] ###########################");
    console.log(e);
  }
}

router.route('/cattipos').get(function (req, res) {
  console.log('cats (1)');
  let fnMain = async (req,res) => {
    try {
      let response = await cattipos_getCatalog(req.body);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };
  console.log('cats (2)');

  fnMain(req, res);
});

async function cattipos_getCatalog (catSol) {
  try {
    console.log("cattipos_getCatalog (1)");

    let tipos = await Instituciones.aggregate(
      [
        {
          '$sort': {
            'tipo': 1
          }
        }
      ]
    );

    return tipos;
  } catch (e) {
    console.log("cattipos_getCatalog (2)");
    console.log("ERROR [/catentfed] ###########################");
    console.log(e);
  }
}

module.exports = router;
