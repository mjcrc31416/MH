const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const _ = require('lodash');

// MONGO MODELS -----------------------------------------
let Certificado = require('./certificados.model');


// ======================================================
// CERTIFICADO
// ======================================================
const routeName03 = '/certificado/upse';
router.route(routeName03).post(function (req, res) {
  const rn = routeName03;
  console.log(rn + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await upseCertificado(req.body);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(rn + ' : '+'fin');
  };

  fnMain(req, res);
});

async function upseCertificado (data) {
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

const routeName04 = '/certificado/getById/:id';
router.route(routeName04).post(function (req, res) {
  const rn = routeName04;
  console.log(rn + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await certificadoGetById(req.params.id);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(rn + ' : '+'fin');
  };

  fnMain(req, res);
});

async function certificadoGetById (id) {
  const rn = routeName04;
  console.log(rn + ' : inicio');

  let resp = null;
  try {
    resp = await Certificado.find({_id: id});
  } catch (e) {
    console.log(rn + ' : error');
    console.log(e);
  }

  return resp;
}

module.exports = router;
