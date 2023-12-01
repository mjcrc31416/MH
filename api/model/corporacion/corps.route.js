const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const _ = require('lodash');

// MONGO MODELS -----------------------------------------
let Personal = require('./personal.model');
let NewModel = require('./personal.model');
let Personas = require('./personas.model');
let Usuarios = require('../Usuarios');

// ======================================================
// PERSONAL
// ======================================================
const routeName03 = '/personal/upse';
router.route(routeName03).post(function (req, res) {
  const rn = routeName03;
  console.log(rn + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await upsePersonal(req.body);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(rn + ' : '+'fin');
  };

  fnMain(req, res);
});

async function upsePersonal (data) {
  const rn = routeName03;
  console.log(rn + ' : inicio');

  const _id = (data._id) ? data._id : null;
  if (_.isNil(_id)) {
    data = new Personal(data);
  }
  console.log(data);

  let resp = null;
  try {
    resp = await Personal.findOneAndUpdate({_id: data._id}, data, {
      new: true,
      upsert: true // Make this update into an upsert
    });
  } catch (e) {
    console.log(rn + ' : error');
    console.log(e);
  }

  return resp;
}

const routeName04 = '/personal/getById/:id';
router.route(routeName04).post(function (req, res) {
  const rn = routeName04;
  console.log(rn + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await personalGetById(req.params.id);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(rn + ' : '+'fin');
  };

  fnMain(req, res);
});

async function personalGetById (id) {
  const rn = routeName04;
  console.log(rn + ' : inicio');

  let resp = null;
  try {
    resp = await Personal.find({_id: id});
  } catch (e) {
    console.log(rn + ' : error');
    console.log(e);
  }

  return resp;
}

// ================================================================
// CARGA GRID =========================================================
router.route('/getPersona').get(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await getPersonal(req.query.tipo, req.query.inst, req.query.sede, req.query.mun);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});

async function getPersonal (tipo, inst, sede, mun) {
  console.log('getPersonal: init');
  console.log(tipo);
  console.log(inst);
  console.log(sede);
  console.log(mun);
  // ent = 'CIUDAD DE MÉXICO'

  try{
    resp = await Personal.aggregate(
      [
        {
          '$match': {
            'tipo.cve': tipo,
            'institucion.cve': inst,
            'sede.cve': sede,
            'municip.cve': mun
          }
        },
          {
          '$project': {
            '_id': '$_id',
            'corporacion': '$corporacion',
            'cve': '$cve',
            'datPer': '$datPer',
            'No_empleado': '$No_empleado',
            'Tipo_nomina': '$Tipo_nomina',
            'Cod_puesto': '$Cod_puesto',
            'Nom_puesto': '$Nom_puesto',
            'tipo': '$tipo.cve',
            'sede': '$sede.cve',
            'institucion': '$institucion.cve'
          }
        }
      ]
    );
  }catch (e) {
    console.log('getPersonal: Error ');
    console.log(e);
  }

  return resp;
}

// FUNCION REVOMER GRID

router.route('/remove/:id').get(function (req, res) {
  NewModel.remove({_id: req.params.id}, function(err) {
    if (!err) {
      res.status(200).send('ok');
    }
    else {
      res.status(400).send(err);
    }
  });
});

// Persona
// ======================================================
const routeName05 = '/person/upse';
router.route(routeName05).post(function (req, res) { 
  const rn = routeName05;
  console.log(rn + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await upsePerson(req.body);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(rn + ' : '+'fin');
  };

  fnMain(req, res);
});

async function upsePerson (data) {
  const rn = routeName05;
  console.log(rn + ' : inicio');

  const _id = (data._id) ? data._id : null;
  if (_.isNil(_id)) {
    data = new Personas(data);
  }
  console.log(data);

  let resp = null;
  try {
    resp = await Personas.findOneAndUpdate({_id: data._id}, data, {
      new: true,
      upsert: true // Make this update into an upsert
    });
  } catch (e) {
    console.log(rn + ' : error');
    console.log(e);
  }

  return resp;
}

// CARGA GRID USUARIOS=========================================================
router.route('/getusuars').get(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await getUsuars();
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});

async function getUsuars () {
  console.log('getUsuars: init');

  // ent = 'CIUDAD DE MÉXICO'

  try{
    resp = await Usuarios.aggregate(
      [
        {
          '$project': {
            'correo': '$correo', 
            nombreCompleto : {$concat : ["$policia.datPer.nombre"," ","$policia.datPer.appat", " ", "$policia.datPer.apmat"]},
            nombre : {$concat : ["$nombre"," ","$appat", " ", "$apmat"]},
            // 'nombre': '$nombre',
            // 'appat': '$appat',
            // 'apmat': '$apmat',
            'tusuario': '$tusuario.tusuario'
          }
        }
      ]
    );
  }catch (e) {
    console.log('getUsuars: Error ');
    console.log(e);
  }

  return resp;
}


module.exports = router;
