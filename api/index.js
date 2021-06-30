// server.js
const dotenv = require('dotenv');
dotenv.config();

const allowedExt = [
  '.js',
  '.ico',
  '.css',
  '.png',
  '.jpg',
  '.woff2',
  '.woff',
  '.ttf',
  '.svg',
];

const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MDBCS, {
  useNewUrlParser: true
}).then(
  () => {
    console.log('Database is connected')
    mongoose.set('useFindAndModify', false);
  },
  err => { console.log('Can not connect to the database'+ err)}
);

const app = express();
app.use(express.static(process.env.ANGAPPDIRNAME));
app.use(bodyParser.json());
app.use(cors());

//ROUTES ------------------------------------------------

// ============================================================
// IPH =======================================================
//REPORTA
const catalogosRoute = require('./route/catalogos.route');
app.use('/api/catalogos', catalogosRoute);
//EVENTOS
const eventosRoute = require('./route/eventos.route');
app.use('/api/eventos', eventosRoute);
// CORPORACIONES
const corporacionesRoute = require('./model/corporacion/corps.route');
app.use('/api/corps', corporacionesRoute);
const preIphRoute = require('./model/iph-admin/iph-admin.route');
app.use('/api/iphadm', preIphRoute);
//Usuarios
const userRoute = require('./route/usuarios.route');
app.use('/api/usuarios', userRoute);
//Mov
const movRoute = require('./route/mov.route');
app.use('/api/mov', movRoute);

// Redirect all the other resquests
const __dirname11 = process.env.ANGAPPDIRNAME;
app.get('*', function (req, res) {
  var _req = req;
  if (allowedExt.filter(function (ext) {
    return _req.url.indexOf(ext) > 0;
  }).length > 0) {
    res.sendFile(path.join(__dirname11, '/', req.url));
  } else {
    res.sendFile(path.join(__dirname11, '/index.html'));
  }
});

// app.get("/Acuerdos", function (req, res) {
//   Acuerdos.find({}, function (err, Acuerdos) {
//     Instituciones.populate(Acuerdos, { path: "Instituciones" }, function (err, Acuerdos) {
//       res.status(200).send(Acuerdos);
//     });
//   });
// });

// Depending on your own needs, this can be extended
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.raw({ limit: '50mb' }));
app.use(bodyParser.text({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));


const port = process.env.PORT || 4350;

const server = app.listen(port, function(){
  console.log('Listening on port ' + port);
});
