const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const _ = require('lodash');

// MONGO MODELS -----------------------------------------
let Corporaciones = require('./copr.model');
let Personal = require('./personal.model');
let NewModel = require('./personal.model');
let Vehiculos = require('./vehiculos.model');
let VehcEstatus = require('./vehc-estatus.model');
let VehcMarcas = require('./vehc-marcas.model');
let VehcUsos = require('./vehc-usos.model');
let VehcTipos = require('./vehc-tipos.model');
let Certificado = require('./certificado.model');
let Dactiloscopia = require('./dactiloscopia.model');
let Incidentes = require('./incidentes.model');
let Terminal = require('./terminal.model');
let Usuarios = require('../Usuarios');
let Detenidos = require('../iph-admin/detenidos.model');
let Etiquetas = require('../DocEtiquetas');
let PreIph = require('../iph-admin/pre-iph-admin.model');

// ======================================================
// CORPORACIONES
// ======================================================
const routeName = '/corps/upse';
router.route(routeName).post(function (req, res) {

  console.log(routeName + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await upseCorporacion(req.body);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(routeName + ' : '+'fin');
  };

  fnMain(req, res);
});

async function upseCorporacion (data) {
  const nameSrv = 'upseCorporacion';
  console.log(nameSrv + ' : inicio');

  let resp = null;

  const _id = (data._id) ? data._id : null;
  if (_.isNil(_id)) {
    data = new Corporaciones(data);
  }
  console.log(data);

  try {
    resp = await Corporaciones.findOneAndUpdate({_id: data._id}, data, {
      new: true,
      upsert: true // Make this update into an upsert
    });
  } catch (e) {
    console.log(nameSrv + ' : error');
    console.log(e);
  }

  return resp;
}


// ======================================================
// CORPORACION
// ======================================================
const routeName02 = '/corps/getById/:id';
router.route(routeName02).get(function (req, res) {
  const rn = routeName02;
  console.log(rn + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await getByIdCorp(req.params.id);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(rn + ' : '+'fin');
  };

  fnMain(req, res);
});

async function getByIdCorp (idCorp) {
  const rn = routeName02;
  console.log(rn + ' : inicio');

  let resp = null;
  try {
    resp = await Corporaciones.aggregate([
      {
        '$match': {
          '_id': mongoose.Types.ObjectId(idCorp) // idCorp, //ObjectId('5dfd07748a890cafc369be8b')
        }
      }
    ]);
  } catch (e) {
    console.log(rn + ' : error');
    console.log(e);
  }

  return resp;
}

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

// ======================================================
// VEHICULOS
// ======================================================
const routeName05 = '/vehi/upse';
router.route(routeName05).post(function (req, res) {
  const rn = routeName05;
  console.log(rn + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await upseVehiculo(req.body);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(rn + ' : '+'fin');
  };

  fnMain(req, res);
});

async function upseVehiculo (data) {
  const rn = routeName05;
  console.log(rn + ' : inicio');

  const _id = (data._id) ? data._id : null;
  if (_.isNil(_id)) {
    data = new Vehiculos(data);
  }
  console.log(data);

  let resp = null;
  try {
    resp = await Vehiculos.findOneAndUpdate({_id: data._id}, data, {
      new: true,
      upsert: true // Make this update into an upsert
    });
  } catch (e) {
    console.log(rn + ' : error');
    console.log(e);
  }

  return resp;
}

const routeName06 = '/vehi/getById/:id';
router.route(routeName06).get(function (req, res) {
  const rn = routeName06;
  console.log(rn + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await vehiculoGetById(req.params.id);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(rn + ' : '+'fin');
  };

  fnMain(req, res);
});

async function vehiculoGetById (id) {
  const rn = routeName06;
  console.log(rn + ' : inicio');

  let resp = null;
  try {
    resp = await Vehiculos.find({_id: id});
  } catch (e) {
    console.log(rn + ' : error');
    console.log(e);
  }

  return resp;
}

// Obtener todos los catalogos
const routeName07 = '/vehi/getVehiCatalogs';
router.route(routeName07).get(function (req, res) {
  const rn = routeName07;
  console.log(rn + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await vehiGetCatalogs();
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(rn + ' : '+'fin');
  };

  fnMain(req, res);
});

async function vehiGetCatalogs () {
  const rn = routeName07;
  console.log(rn + ' : inicio');

  let resp = null;
  try {
    vehcEstatus = await VehcEstatus.find();
    vehcMarcas = await VehcMarcas.find();
    vehcUsos = await VehcUsos.find();
    vehcTipos = await VehcTipos.find();

    resp = {
      vehcEstatus: vehcEstatus,
      vehcMarcas: vehcMarcas,
      vehcUsos: vehcUsos,
      vehcTipos: vehcTipos,
    };
  } catch (e) {
    console.log(rn + ' : error');
    console.log(e);
  }

  return resp;
}

// ================================================================
// CARGA GRID =========================================================
router.route('/getvehiculo').get(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await getVehiculos(req.query.tipo, req.query.inst, req.query.sede, req.query.mun);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});

async function getVehiculos (tipo, inst, sede, mun) {
  console.log('getVehiculos: init');
  console.log(tipo);
  console.log(inst);
  console.log(sede);
  console.log(mun);

  try{
    resp = await Vehiculos.aggregate(

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
                  'vehiculo': '$vehiculo',
                  'tipoVehi': '$tipoVehi.nom',
                  'marca': '$marca.nom',
                  'placa': '$placa',
                  'numSerie': '$numSerie'
                }
              }
            ]
    )
  }catch (e) {
    console.log('getVehiculos: Error ');
    console.log(e);
  }

  return resp;
}

// FUNCION REVOMER GRID

router.route('/remo/:id').get(function (req, res) {
  Vehiculos.remove({_id: req.params.id}, function(err) {
    if (!err) {
      res.status(200).send('ok');
    }
    else {
      res.status(400).send(err);
    }
  });
});

// ======================================================
// CERTIFICADO
// ======================================================
const routeName08 = '/certificado/upsert';
router.route(routeName08).post(function (req, res) {
  const rn = routeName08;
  console.log(rn + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await upsertCertificado(req.body);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(rn + ' : '+'fin');
  };

  fnMain(req, res);
});

async function upsertCertificado (data) {
  const rn = routeName08;
  console.log(rn + ' : inicio');

  const _id = (data._id) ? data._id : null;
  if (_.isNil(_id)) {
    data = new Certificado(data);
  }
  console.log(data);

  let resp = null;
  try {
    resp = await Certificado.findOneAndUpdate({_id: data._id}, data, {
      new: true,
      upsert: true // Make this update into an upsert
    });
  } catch (e) {
    console.log(rn + ' : error');
    console.log(e);
  }

  return resp;
}

const routeName09 = '/certificados/getById/:id';
router.route(routeName09).get(function (req, res) {
  const rn = routeName09;
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
  const rn = routeName09;
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


router.route('/upsertmediafil').post(function (req, res) {
  console.log('upsertmediafil (1)');
  let fnMain = async (req,res) => {
    try {
      console.log('upsertmediafil (2)');
      let detenidos = await UpsertMediaFil(req.body);
      console.log('upsertmediafil (3)');
      res.status(200).send(detenidos);
    } catch (error){
      console.log(error);
      res.status(400).send(error);
    }
  };
  console.log('upsertmediafil (4)');
  fnMain(req, res);
});

async function UpsertMediaFil(data) {
  console.log('UpsertMediaFil (1)');
  console.log(data);
  try {
    if (!_.isNil(data._id)) {
      let upsertData = {
        _id: data._id,
        mediafiliacion: data.mediafiliacion
      };

      let res = await Detenidos.findOneAndUpdate({_id: upsertData._id}, upsertData, {
        new: true,
        upsert: true // Make this update into an upsert
      });
      console.log('UpsertMediaFil (2)');
      console.log(res);
      return res;
    }
  } catch (e) {
    console.log(e);
  }
  return null;
}

const routeName11 = '/mediagetById/:id';
router.route(routeName11).get(function (req, res) {
  const rn = routeName11;
  console.log(rn + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await dactiloscopiaGetById(req.params.id);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(rn + ' : '+'fin');
  };

  fnMain(req, res);
});

async function dactiloscopiaGetById (id) {
  const rn = routeName11;
  console.log(rn + ' : inicio');

  let resp = null;
  try {
    resp = await Detenidos.findOne({_id: id});
  } catch (e) {
    console.log(rn + ' : error');
    console.log(e);
  }

  return resp;
}

// INSERTAR CERTIFICADO

router.route('/upsertcertificado').post(function (req, res) {
  console.log('upsertcertificado (1)');
  let fnMain = async (req,res) => {
    try {
      console.log('upsertcertificado (2)');
      let detenidos = await UpsertCertificado(req.body);
      console.log('upsertcertificado (3)');
      res.status(200).send(detenidos);
    } catch (error){
      console.log(error);
      res.status(400).send(error);
    }
  };
  console.log('upsertcertificado (4)');
  fnMain(req, res);
});

async function UpsertCertificado(data) {
  console.log('upsertcertificado (1)');
  console.log(data);
  try {
    if (!_.isNil(data._id)) {
      let upsertData = {
        _id: data._id,
        certificado: data.certificado
      };

      let res = await Detenidos.findOneAndUpdate({_id: upsertData._id}, upsertData, {
        new: true,
        upsert: true // Make this update into an upsert
      });
      console.log('upsertcertificado (2)');
      console.log(res);
      return res;
    }
  } catch (e) {
    console.log(e);
  }
  return null;
}

// PERSONAL
const rnPerGetConDet = '/personal/getConsDet';
router.route(rnPerGetConDet).get(function (req, res) {
  const rn = rnPerGetConDet;
  console.log(rn + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await personalGetConsDet(req.query.tipo, req.query.inst, req.query.sede, req.query.mun);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(rn + ' : '+'fin');
  };

  fnMain(req, res);
});

async function personalGetConsDet (tipo, inst, sede, mun) {
  const rn = rnPerGetConDet;
  console.log(rn + ' : inicio');
  console.log(tipo);
  console.log(inst);
  console.log(sede);
  console.log(mun);

  let resp = null;

  try {
    resp = await Usuarios.aggregate(
      [
        [         
          // {
          //   '$match': {
          //     'tipo.cve': tipo,
          //     'institucion.cve': inst,
          //     'sede.cve': sede,
          //     'municip.cve': mun
          //   }
          // },
          {
            '$lookup': {
              'from': 'terminales',
              'let': {
                'idPol': '$_id'
              },
              'pipeline': [
                {
                  '$unwind': '$usuarios'
                }, 
                {
                  '$match': {
                    '$expr': {
                      '$eq': [
                        '$$idPol', '$usuarios._id'
                      ]
                    },
                  }
                }
              ],
              'as': 'terminal'
            }
          }, {
            '$unwind': {
              'path': '$terminal'
            }
          }, 
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
              '_id': 1,
              'correo': 1,
              'policia': 1,
              'terminal': 1
            }
          }, {
            '$sort': {
              'correo': 1,
              'terminal.fechagenpinmax': 1
            }
          }
        ]
      ]
    );
  } catch (e) {
    console.log(rn + ' : error');
    console.log(e);
  }

  return resp;
}

// ======================================================
// CORPORACIONES
// ======================================================

router.route('/incidente/upse').post(function (req, res) {
  console.log('/incidente/upse' + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await upseIncidente(req.body);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(routeName + ' : '+'fin');
  };

  fnMain(req, res);
});

async function upseIncidente (data) {
  const nameSrv = 'upseIncidente';
  console.log(nameSrv + ' : inicio');

  let resp = null;

  const _id = (data._id) ? data._id : null;
  if (_.isNil(_id)) {
    data = new Incidentes(data);
  }
  console.log(data);

  try {
    resp = await Incidentes.findOneAndUpdate({_id: data._id}, data, {
      new: true,
      upsert: true // Make this update into an upsert
    });
  } catch (e) {
    console.log(nameSrv + ' : error');
    console.log(e);
  }

  return resp;
}


router.route('/incidente/getAll').get(function (req, res) {
  console.log('/incidente/getAll' + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await getIncAll();
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(routeName + ' : '+'fin');
  };

  fnMain(req, res);
});

async function getIncAll (data) {
  const nameSrv = 'getIncAll';
  console.log(nameSrv + ' : inicio');

  let resp = null;

  try {
    resp = await Incidentes.find({});
  } catch (e) {
    console.log(nameSrv + ' : error');
    console.log(e);
  }

  return resp;
}


router.route('/incidente/getById/:id').get(function (req, res) {
  console.log('/incidente/getById' + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await getIncById(req.params.id);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(routeName + ' : '+'fin');
  };

  fnMain(req, res);
});

async function getIncById (id) {
  const rn = '/incidente/getById';
  console.log(rn + ' : inicio');
  console.log(id);

  let resp = null;
  try {
    resp = await Incidentes.find({_id: id});
  } catch (e) {
    console.log(rn + ' : error');
    console.log(e);
  }

  return resp;
}

// ======================================================
// TERMINALES
// ======================================================
const routeName12 = '/terminal/upse';
router.route(routeName12).post(function (req, res) {
  const rn = routeName12;
  console.log(rn + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await upseTerminal(req.body);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(rn + ' : '+'fin');
  };

  fnMain(req, res);
});

async function upseTerminal (data) {
  const rn = routeName12;
  console.log(rn + ' : inicio');

  const _id = (data._id) ? data._id : null;
  if (_.isNil(_id)) {
    data = new Terminal(data);
  }
  console.log(data);

  let resp = null;
  try {

    resp = await Terminal.findOneAndUpdate({_id: data._id}, data, {
      new: true,
      upsert: true // Make this update into an upsert
    });

     let fechgenpin = Date.now();
      console.log(fechgenpin);

  } catch (e) {
    console.log(rn + ' : error');
    console.log(e);
  }

  return resp;
}

// TERMINALES FECHA PIN
// ======================================================
const routeName13 = '/terminalPIN/getTerminalPin';
router.route(routeName13).post(function (req, res) {
  const rn = routeName13;
  console.log(rn + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await getTerminalPIN(req.body);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(rn + ' : '+'fin');
  };

  fnMain(req, res);
});

async function getTerminalPIN (data) {
  console.log("getTerminalPIN (1)");
  const rn = routeName13;
  console.log(rn + ' : inicio');

  const _id = (data._id) ? data._id : null;
  if (_.isNil(_id)) {
    data = new Terminal(data);
  }
  console.log("getTerminalPIN (2)");
  console.log(data);
  let resp = null;
  let fechagenpin = null;
  let fechagenpinmax = null;

  try {
    console.log("getTerminalPIN (3)");
    data.fechagenpin =  new Date();
    data.fechagenpinmax = new Date();
    data.registroActivo;
    //true
    let tmp = getRandomInt(100000,999999).toString();
    data.noAleatorio = tmp;
    console.log(tmp);

    data.fechagenpinmax.setMinutes(data.fechagenpinmax.getMinutes() + 10);

    // PIN no debe de existir como activo en la base datos
    let respPin;
    let existe = true;
    let curLoops = 0;
    while (existe) {
      console.log("getTerminalPIN (4)");
      if (curLoops > 5) {
        existe = false;
      } else {
        respPin = await searchPIN(data.noAleatorio, data.fechagenpin);
        console.log(respPin);
        if (respPin == null) {
          existe = false;
        } else if (respPin.length <= 0 ){
          existe = false;
        } else {
          data.noAleatorio = getRandomInt(100000,999999).toString();
        }
      }
      curLoops++;
    }
    console.log("getTerminalPIN (5)");
    console.log(data);
    resp = await Terminal.findOneAndUpdate({_id: data._id}, data, {
      new: true,
      upsert: true // Make this update into an upsert
    });
  } catch (e) {
    console.log(rn + ' : error');
    console.log(e);
  }

  return resp;
}

// FUNCION GENERAR NUMEROS ALEATORIOS
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// COnsulta para buscar pin en rango de fechas
async function searchPIN (pin, fechaMin) {
  resp = await Terminal.aggregate(
    [
      {
        '$match': {
          '$and': [
            {
              'registroActivo': true
            }, {
              'noAleatorio': pin
            }, {
              'fechgenpinmax': {
                '$lt': fechaMin
              }
            }
          ]
        }
      },
      {
        '$project': {
          'nombres': '$nombre',
          'marca': '$marca',
          'noInventario': '$noInventario',
          'noAleatorio': '$noAleatorio'
        }

      }
    ]
  );

  return resp;
}


// ================================================================
// CARGA GRID =========================================================
router.route('/getTerminal').get(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await getTerminales(req.query.tipo, req.query.inst, req.query.sede, req.query.mun, req.query.pageIndex, req.query.pageSize);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});

async function getTerminales (tipo, inst, sede, mun, page, perPage) {
  console.log('getTerminales: init');
  console.log(tipo);
  console.log(inst);
  console.log(sede);
  console.log(mun);
  // ent = 'NUEVO LEÓN'
  let resp = null
  let count = null

  try{

    page = page ? Number(page):0
    perPage = perPage ? Number(perPage):25

    let skip = page > 0 ? (page * perPage):0

    resp = await Terminal.aggregate(
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
                  'nombres': '$nombres',
                  'marca': '$marca',
                  'noInventario': '$noInventario',
                  'noAleatorio': '$noAleatorio'
                }
              }
            ]
    ).skip(skip).limit(perPage);

    count = await NewModel.aggregate(
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
            'nombres': '$nombres',
            'marca': '$marca',
            'noInventario': '$noInventario',
            'noAleatorio': '$noAleatorio'
          }
        },
          { $group: { _id: "folioInterno", count: { $sum: 1 } } }
        ]
    );

  }catch (e) {
    console.log('getTerminales: Error ');
    console.log(e);
  }
  let result = {
    "data": resp,
    "total": count[0].count
  }
console.log(result)
  return result;
}

//CARGAR INFO TERMINAL

const routeName14 = '/termi/getById/:id';
router.route(routeName14).get(function (req, res) {
  const rn = routeName14;
  console.log(rn + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await terminalGetById(req.params.id);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(rn + ' : '+'fin');
  };

  fnMain(req, res);
});

async function terminalGetById (id) {
  const rn = routeName14;
  console.log(rn + ' : inicio');

  let resp = null;
  try {
    resp = await Terminal.find({_id: id});
  } catch (e) {
    console.log(rn + ' : error');
    console.log(e);
  }

  return resp;
}

router.route('/rem/:id').get(function (req, res) {
  Terminal.remove({_id: req.params.id}, function(err) {
    if (!err) {
      res.status(200).send('ok');
    }
    else {
      res.status(400).send(err);
    }
  });
});

// Reomove grid usuars
router.route('/removed/:id').get(function (req, res) {
  Usuarios.remove({_id: req.params.id}, function(err) {
    if (!err) {
      res.status(200).send('ok');
    }
    else {
      res.status(400).send(err);
    }
  });
});

// CARGA GRID TERMINAL=========================================================
router.route('/getusuario').get(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await getUsuario(req.query.tipo, req.query.inst, req.query.sede, req.query.mun);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});

async function getUsuario (tipo, inst, sede, mun) {
  console.log('getUsuario: init');
  console.log(tipo);
  console.log(inst);
  console.log(sede);
  console.log(mun);

  try{
    resp = await Usuarios.aggregate(
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
          '$lookup': {
            'from': 'terminales',
            'let': {
              'idPol': '$_id'
            },
            'pipeline': [
              {
                '$unwind': '$usuarios'
              }, {
                '$match': {
                  '$expr': {
                    '$eq': [
                      '$$idPol', '$usuarios._id'
                    ]
                  }
                }
              }
            ],
            'as': 'terminal'
          }
        }, {
          '$match': {
            'terminal': {
              '$not': {
                '$gt': {}
              }
            }
          }
        },

      {
          '$project': {
            'correo':  1,
            '_id': 1,
            'nombre': 1,
            'policia': 1
          }
        }
      ]
    );
  }catch (e) {
    console.log('getUsuario: Error ');
    console.log(e);
  }

  return resp;
}


//CARGAR INFO DE MEDIAFILIACION

const routeName15 = '/mediafiliacion/getById/:id';
router.route(routeName15).get(function (req, res) {
  const rn = routeName15;
  console.log(rn + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await mediafiliacionGetById(req.params.id);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(rn + ' : '+'fin');
  };

  fnMain(req, res);
});

async function mediafiliacionGetById (id) {
  const rn = routeName15;
  console.log(rn + ' : inicio');

  let resp = null;
  try {
    resp = await Detenidos.findOne({_id: id});
  } catch (e) {
    console.log(rn + ' : error');
    console.log(e);
  }

  return resp;
}

//CARGAR INFO DE CERTIFICADO

const routeName16 = '/certificado/getById/:id';
router.route(routeName16).get(function (req, res) {
  const rn = routeName16;
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
  const rn = routeName16;
  console.log(rn + ' : inicio');

  let resp = null;
  try {
    resp = await Detenidos.findOne({_id: id});
  } catch (e) {
    console.log(rn + ' : error');
    console.log(e);
  }

  return resp;
}

router.route('/upsertregistro').post(function (req, res) {
  console.log('upsertregistro (1)');
  let fnMain = async (req,res) => {
    try {
      console.log('upsertregistro (2)');
      let detenidos = await UpsertRegistro(req.body);
      console.log('upsertregistro (3)');
      res.status(200).send(detenidos);
    } catch (error){
      console.log(error);
      res.status(400).send(error);
    }
  };
  console.log('upsertregistro (4)');
  fnMain(req, res);
});

async function UpsertRegistro(data) {
  console.log('UpsertRegistro (1)');
  console.log(data);
  try {
    if (!_.isNil(data._id)) {
      let upsertData = {
        _id: data._id,
        objetos: data.objetos
      };

      let res = await Detenidos.findOneAndUpdate({_id: upsertData._id}, upsertData, {
        new: true,
        upsert: true // Make this update into an upsert
      });
      console.log('UpsertRegistro (2)');
      console.log(res);
      return res;
    }
  } catch (e) {
    console.log(e);
  }
  return null;
}

//CARGAR INFO DE OBJETOS PERSONALES

const routeName17 = '/registro/getById/:id';
router.route(routeName17).get(function (req, res) {
  const rn = routeName17;
  console.log(rn + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await registroGetById(req.params.id);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(rn + ' : '+'fin');
  };

  fnMain(req, res);
});

async function registroGetById (id) {
  const rn = routeName17;
  console.log(rn + ' : inicio');

  let resp = null;
  try {
    resp = await Detenidos.findOne({_id: id});
  } catch (e) {
    console.log(rn + ' : error');
    console.log(e);
  }

  return resp;
}

const routeName18 = '/etiquetas/upse';
router.route(routeName18).post(function (req, res) {
  const rn = routeName18;
  console.log(rn + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await upsertEtiquetas(req.body);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(rn + ' : '+'fin');
  };

  fnMain(req, res);
});

async function upsertEtiquetas (data) {
  const rn = routeName18;
  console.log(rn + ' : inicio');

  const _id = (data._id) ? data._id : null;
  if (_.isNil(_id)) {
    data = new Etiquetas(data);
  }
  console.log(data);

  let resp = null;
  try {
    resp = await Etiquetas.findOneAndUpdate({_id: data._id}, data, {
      new: true,
      upsert: true // Make this update into an upsert
    });
  } catch (e) {
    console.log(rn + ' : error');
    console.log(e);
  }

  return resp;
}

const routeName19 = '/etiqueta/getById/:id';
router.route(routeName19).get(function (req, res) {
  const rn = routeName19;
  console.log(rn + ' : ' + 'inicio');
  let fnMain = async (req,res) => {
    try {
      let response = await etiquetaGetById(req.params.id);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }

    console.log(rn + ' : '+'fin');
  };

  fnMain(req, res);
});

async function etiquetaGetById (id) {
  const rn = routeName19;
  console.log(rn + ' : inicio');

  let resp = null;
  try {
    resp = await Etiquetas.find({_id: id});
  } catch (e) {
    console.log(rn + ' : error');
    console.log(e);
  }

  return resp;
}

// CARGA GRID =========================================================
router.route('/getetiqueta').get(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await getEtiquetas();
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});

async function getEtiquetas () {
  console.log('getEtiquetas: init');

  try{
    resp = await Etiquetas.aggregate(
            [
              {
                '$project': {
                  'nombre': '$nombre'
                }
              }
            ]
    );
  }catch (e) {
    console.log('getEtiquetas: Error ');
    console.log(e);
  }

  return resp;
}

// FUNCION REVOMER GRID

router.route('/removeetiquetas/:id').get(function (req, res) {
  NewModel.remove({_id: req.params.id}, function(err) {
    if (!err) {
      res.status(200).send('ok');
    }
    else {
      res.status(400).send(err);
    }
  });
});

// CARGA GRID USUARIOS=========================================================
router.route('/getusuars').get(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await getUsuars(req.query.tipo, req.query.inst, req.query.sede, req.query.mun, req.query.pageIndex, req.query.pageSize);
      console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});

async function getUsuars (tipo, inst, sede, mun, page, perPage) {
  console.log('getUsuars: init');
  console.log(tipo);
  console.log(inst);
  console.log(sede);
  console.log(mun);
    // tipo = 'MINISTERIAL'
    // inst = 'SECRETARÍA DE SEGURIDAD Y PROTECCIÓN CIUDADANA'
    // sede= 'CIUDAD DE MÉXICO'
    let count = null

  try{
    page = page ? Number(page):0
    perPage = perPage ? Number(perPage):15

    let skip = page > 0 ? (page * perPage):0

    resp = await Usuarios.aggregate(
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
            'correo': '$correo', 
            nombreCompleto : {$concat : ["$policia.datPer.nombre"," ","$policia.datPer.appat", " ", "$policia.datPer.apmat"]},
            nombre : {$concat : ["$nombre"," ","$appat", " ", "$apmat"]},
            // 'nombre': '$nombre',
            // 'appat': '$appat',
            // 'apmat': '$apmat',
            'tusuario': '$tusuario.tusuario', 
            'institucion': '$institucion.institucion', 
            'sede': '$sede.sede'
          }
        }
      ]).skip(skip).limit(perPage);

    count = await NewModel.aggregate(
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
            'correo': '$correo', 
            nombreCompleto : {$concat : ["$policia.datPer.nombre"," ","$policia.datPer.appat", " ", "$policia.datPer.apmat"]},
            nombre : {$concat : ["$nombre"," ","$appat", " ", "$apmat"]},
            // 'nombre': '$nombre',
            // 'appat': '$appat',
            // 'apmat': '$apmat',
            'tusuario': '$tusuario.tusuario', 
            'institucion': '$institucion.institucion', 
            'sede': '$sede.sede'
          }
        },
        { $group: { _id: 'correo', count: { $sum: 1 } } }
      ]
    );
  }catch (e) {
    console.log('getUsuars: Error ');
    console.log(e);
  }

  let result = {
    "data": resp,
    "total": count[0].count
  }
  console.log(result)
  return result;
}

// CARGA GRID JUEZ=========================================================
router.route('/getJuez').get(function (req, res) {
  console.log('entro');
  let fnMain = async (req,res) => {
    try {
      let response = await getJuez(req.query.tipo, req.query.inst, req.query.sede, req.query.mun);
      //console.log(response);
      res.status(200).send(response);
    } catch (error){
      res.status(400).send(error);
    }
  };

  fnMain(req, res);
});

async function getJuez (tipo, inst, sede, mun) {
  console.log('getJuez: init');
  console.log(tipo);
  console.log(inst);
  console.log(sede);
  console.log(mun);

  try{
    resp = await PreIph.aggregate(
      [
        {
          $sort: {
            'fecha': -1
          }
        },
        // {
        //   '$match': {
        //     'tipo.cve': tipo,
        //     'institucion.cve': inst,
        //     'sede.cve': sede,
        //     'municip.cve': mun
        //   }
        // }
        {
          '$project': {
            'folio911': '$conocimiento.folio911', 
            'folioInterno': '$conocimiento.folioInterno', 
            'nombre': '$detenidos.intervencion.datPer.apmat', 
            'sexo': '$detenidos.intervencion.datPer.sexo', 
            'fecha': '$detenidos.intervencion.datPer.fecnac', 
            'narrativa': '$narrativa.narrativa', 
            'noExp': '$puestaDisposicion.noExp', 
            'autoridadRecibe': '$puestaDisposicion.autoridadRecibe', 
            'adscripcionRecibe': '$puestaDisposicion.adscripcionRecibe', 
            'cargoRecibe': '$puestaDisposicion.cargoRecibe'
          }
        }
      ]
    );
  }catch (e) {
    console.log('getJuez: Error ');
    console.log(e);
  }

  return resp;
}

module.exports = router;
