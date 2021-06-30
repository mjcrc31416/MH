const express = require('express');
const app = express();
const docEtiquetas = express.Router();

let DocEtiquetas = require('../model/DocEtiquetas');


docEtiquetas.route('/getall').get(function (req, res) {
  DocEtiquetas.find()
    .then( (obj,msg)=>{
      res.status(200).json(obj);
    })
    .catch( err => {
      res.status(400).send(err);
    })
});

// Prueba
docEtiquetas.route('/remove/:id').get(function (req, res) {
  DocEtiquetas.deleteOne({_id: req.params.id}, function(err) {
    if (!err) {
      res.status(200).send('ok');
    }
    else {
      res.status(400).send(err);
    }
  });
});

docEtiquetas.route('/get/:id').get(function (req, res) {
  console.log(req.params);
  DocEtiquetas.findById( req.params.id,(err,data) => {
    console.log(data);
    if(data) {
      res.status(200).json(data);
    } else {
      res.status(400).json(null);
    }
  });
});

// Agregar nuevo
docEtiquetas.route('/add').post(function (req, res) {
  let docEtiquetas = new DocEtiquetas(req.body);

  // Actualizar
  let filter = {_id: docEtiquetas._id};
  DocEtiquetas.findOneAndUpdate(filter, docEtiquetas, {
    new: true,
    upsert: true // Make this update into an upsert
  }).exec((err,data) => {
    if (!err) {
      res.status(200).json(data);
    } else {
      res.status(200).json(null);
    }
  });
});


docEtiquetas.route('/new').post(function (req, res) {

  let newElement = async(req, res) => {

    //Validar si la existe la etiqueta
    let docEtqObj = req.body.docEtiqueta;

    const searchDoc = docEtqObj.nombre.toLowerCase().trim();
    const result = await DocEtiquetas.findOne({lwc_nombre: searchDoc}).exec();

    //Si no se encontró elemento
    if(!result) {
      //Agregar a la base de datos
      let docEtqModel = new DocEtiquetas({
        nombre: docEtqObj.nombre,
        lwc_nombre: docEtqObj.nombre.toLowerCase().trim()
      });
      let dbDocEtqObj = await docEtqModel.save();

      res.status(200).json(dbDocEtqObj);
    } else {
      res.status(409).json({err: 'Elemento ya existe'});
    }
  };

  newElement(req,res);

});

docEtiquetas.route('/search').post(function (req, res) {

  let service = async(req, res) => {

    try{
      let searchText = req.body.searchText;
      searchText = searchText.toLowerCase().trim();

      const results = await DocEtiquetas.find({lwc_nombre: { $regex: '.*' + searchText + '.*' }}).exec();

      res.status(200).json(results);
    } catch(e) {
      res.status(400).json({err: e});
    }

  };

  service(req,res);

});

module.exports = docEtiquetas;
