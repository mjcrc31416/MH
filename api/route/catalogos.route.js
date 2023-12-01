const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const _ = require('lodash');

let Entidades = require('../model/common/cat-ents.model');
let Instituciones = require('../model/common/cat-tipos.model');

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

module.exports = router;
