const express = require('express');
const app = express();
const docsRoute = express.Router();
const _ = require('underscore');

// Require Business model in our routes module
let Documentos = require('../model/Documentos');
let SASTokens = require('../model/SASTokens');
let AzureStorage = require('../shared/azurestuff');
let azure = require('azure-storage');


// Request new doc
docsRoute.route('/reqnew').post(function (req, res) {
  console.log('init reqnew');
  let asyncFn = async (req,res) => {
    console.log('init async');
    try {
      // Obtener token;
      let token = req.body.st;
      // Obtener datos del documento
      let docInfo = req.body.doc;

      // Guardar información del documento
      let dbDocModel = new Documentos(docInfo);
      let dbDoc = await dbDocModel.save();

      //Obtener token
      let newToken = await generateTokenIfNotExists(token);

      res.status(200).json({
        doc: dbDoc,
        st: newToken
      });
    } catch (e) {
      console.log('Error');
      console.log(e);
      res.status(400).json(e);
    }
    console.log('end async');
  };

  asyncFn(req,res);

  console.log('end reqnew');
});

// Request download link
docsRoute.route('/downloadlink/:id').get(function (req, res) {
  console.log('init downloadlink');
  let asyncFn = async (req,res) => {
    console.log('init async');
    try {
      const donwloadLink = await generateDownloadLink(req.params.id);
      res.status(200).json({
        downloadLink: donwloadLink
      });
      return;
    } catch (e) {
      console.log('Error');
      console.log(e);
      res.status(400).json(e);
    }
    console.log('end async');
  };

  asyncFn(req,res);

  console.log('end reqnew');
});

// Update document data
docsRoute.route('/update/:id').post(function (req, res) {

  let asyncFn = async (req,res) => {
    try {
      let savedDoc = null;

      let newData = req.body;
      console.log(newData);
      // Obtener el documento basado en el id
      const dbDoc = await Documentos.findById(req.params.id).exec();

      //Actualizar
      if(dbDoc) {
        console.log('Actualizando atributos');
        for(let attr in newData) {
          console.log(attr);
          dbDoc[attr] = newData[attr];
        }

        savedDoc = await dbDoc.save();
      } else {
        console.log('dbDoc falso');
      }

      if(savedDoc) {
        res.status(200).json(savedDoc);
      } else {
        res.status(400).json({err: 'Ha ocurrido un error al actualizar documento'});
      }

    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  };

  asyncFn(req,res);

});



// Agregar nuevo
docsRoute.route('/new').post(function (req, res) {

  console.log('On init');
  let sasToken;
  console.log(req.body.st);

  let func = async (req,res) => {
    let currentDate = new Date();
    let createNewToken = false;

    if (req.body.st) {

      // Obtener SAS
      console.log('Pre query SASTokens');
      let dbToken = await SASTokens.findOne({
        token: req.body.st
      }).exec();
      console.log('Post query SASTokens');

      //Validar que no esté caduco
      console.log(currentDate);
      console.log(dbToken.expiryDate);
      if (currentDate < dbToken.expiryDate) {
        console.log('Token aún es válido');
        res.status(200).json(dbToken);
        return;
      } else {
        console.log('Token ha expirado');
        createNewToken = true;
      }
    } else {
      createNewToken = true;
    }

    if (createNewToken) {
      //Crear un nuevo token
      console.log('Pre Generar Token');
      newSasToken = AzureStorage.generateSasToken(null, process.env.APP_BLOB_CONT_NAME, null, 'racwd');
      console.log(newSasToken);
      console.log('Post Generar Token');

      //Guardar token en la base de datos
      let sasTokenModel = new SASTokens(newSasToken);
      let newDbToken = await sasTokenModel.save();
      res.status(200).json(newDbToken);

      return;
    }

    //Salida por default
    res.status(400).json('Error!');
  };

  func(req, res);



  //     sasToken = validateSASToken(req.body.st);
  //     console.log('Post validate sas token');
  //     console.log(sasToken);
  //
  //     // Si es nulo, se tiene que generar nuevo token
  //     if (!sasToken) {
  //       console.log('Generando nuevo token');
  //       sasToken = AzureStorage.generateSasToken(null,process.env.APP_BLOB_CONT_NAME,null,'arwdl');
  //       console.log(sasToken);
  //
  //       //Guardar en la base de datos
  //       console.log('Guardando token en base de datos');
  //       let sasTokenModel = new SASTokens(sasToken);
  //       sasTokenModel.save()
  //         .then(obj => {
  //           res.status(200).json(obj);
  //         })
  //         .catch(err => {
  //           res.status(400).send("unable to save to database");
  //         });
  //     } else {
  //       res.status(200).json(sasToken);
  //     }
  //   } else {
  //     console.log('Generar nuevo');
  //
  //     sasToken = AzureStorage.generateSasToken(null,process.env.APP_BLOB_CONT_NAME,null,'racwd');
  //     console.log('post AzureStorage.generateSasToken');
  //     console.log( sasToken );
  //
  //     //Guardar en la base de datos
  //     let sasTokenModel = new SASTokens(sasToken);
  //     sasTokenModel.save()
  //       .then(obj => {
  //         res.status(200).json(obj);
  //       })
  //       .catch(err => {
  //         res.status(400).send("unable to save to database");
  //       });
  //   }
  //
  // };








  // let docs = new Documentos(req.body);
  // conferencias.save()
  //   .then(obj => {
  //     res.status(200).json(obj);
  //   })
  //   .catch(err => {
  //     res.status(400).send("unable to save to database");
  //   });
});


async function generateTokenIfNotExists (token) {
  console.log('On init');

  let currentDate = new Date();
  let createNewToken = false;

  if (token) {
    // Obtener SAS
    console.log('Pre query SASTokens');
    let dbToken = await SASTokens.findOne({
      token: token
    }).exec();
    console.log('Post query SASTokens');

    //Validar que no esté caduco
    console.log(currentDate);
    console.log(dbToken.expiryDate);
    if (currentDate < dbToken.expiryDate) {
      console.log('Token aún es válido');
      return dbToken;
    } else {
      console.log('Token ha expirado');
      createNewToken = true;
    }
  } else {
    createNewToken = true;
  }

  if (createNewToken) {
    //Crear un nuevo token
    console.log('Pre Generar Token');
    let newSasToken = AzureStorage.generateSasToken(null, process.env.APP_BLOB_CONT_NAME, null, 'racwd');
    console.log(newSasToken);
    console.log('Post Generar Token');

    //Guardar token en la base de datos
    let sasTokenModel = new SASTokens(newSasToken);
    let newDbToken = await sasTokenModel.save();

    return newDbToken;
  }
}

async function generateDownloadLink (bloblName) {
  console.log('On init');

  //Generar un nuevo SAS Token
  const container = process.env.APP_BLOB_CONT_NAME;
  const connString = process.env.BLOB_STORAGE_CS;
  let newSasToken = AzureStorage.generateSasToken(null, container, bloblName, 'r');


  const blobService = azure.createBlobService(connString);
  let downloadUrl = blobService.getUrl(container,bloblName,newSasToken.token);


  return downloadUrl;
}//generateDownloadLink <<

function validateSASToken (token) {
  console.log('validateSASToken');
  const PREV = 5;
  let nowDate = new Date();
  nowDate.setMinutes(nowDate.getMinutes() - PREV);

  console.log('Pre async');
  let result = async (token) => {
    let retToken = await SASTokens.find({
      token: token
    }).exec();
    return retToken;
  };

  let res = result(token);


  console.log('Post async');

  console.log(res);



  // let res=SASTokens.find({
  //   token: token
  // },function (err, data) {
  //   if (data) {
  //     if (data.length > 0 ) {
  //       console.log('Datos encontrados');
  //       console.log(nowDate);
  //       let temp = data[0];
  //       if( nowDate < temp.expiryDate) { // Token se encontró y aun está vigente
  //         console.log('Token aún es válido');
  //         return temp;
  //       } else {
  //         console.log('Token ha expirado');
  //         console.log(temp)
  //       }
  //     }
  //   }
  //
  //   console.log('Fin de la funcion con null');
  //   return null;
  // });

  return res;
};

module.exports = docsRoute;
