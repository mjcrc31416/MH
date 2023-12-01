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
  const multipart = require('connect-multiparty');
  const File = require('./model/corporacion/file.model');

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

const multiPartMiddleware = multipart({
  uploadDir: './subidas'
});

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
//Usuarios
const userRoute = require('./route/usuarios.route');
app.use('/api/usuarios', userRoute);
// CORPORACIONES
const corporacionesRoute = require('./model/corporacion/corps.route');
app.use('/api/corps', corporacionesRoute);

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


//EndPoint to Upload files
app.post('/api/subir', multiPartMiddleware, function (req, res) {
  let fnMain = async (req, res) => {

    try {

      const response = await File.create({
        name: req.files.uploads.originalFilename
      });

      res.status(200).send(response);
    } catch (error) {
    console.log(error);
    res.status(400).send('error');
  }
};
fnMain(req, res);
});

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
