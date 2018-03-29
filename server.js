var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
const bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
// ITEAMDEVS
var multipart=require('connect-multiparty');
//var md_upload=multipart({uploadDir:'./uploads/resources'});
var md_upload=multipart({uploadDir:'./src/uploads'});
//----------



var COLABORADORES_COLLECTION = "colaboradores";
var COMPORTAMIENTOS_COLLECTION = "comportamientos";

var app = express();
app.use(bodyParser.json());

// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
var url = 'mongodb://db-enel:enel$123@18.188.95.221:27017/lidera';

mongodb.MongoClient.connect(url, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Create link to Angular build directory
  var distDir = __dirname + "/dist/";
  app.use(express.static(distDir));

  app.get('*', function(req, res) {
    res.sendFile(distDir + 'index.html')
  })

  // Initialize the app.
  var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// Mailer
var mailer = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: 'pdidesarrolloenel@gmail.com',
      pass: 'enel$123'
  },
  tls: {
      rejectUnauthorized: false
  }
});

mailer.use('compile', hbs({
  viewPath: 'templates/email',
  extName: '.hbs'
}));


// FUNCTIONS

function getUserByEmail(correo, callback){
  db.collection(COLABORADORES_COLLECTION).findOne({ email: correo }, callback);
}

function compareDNI(candidateDNI, hash, callback){
  bcrypt.compare(candidateDNI, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}


// CONTACTS API ROUTES BELOW

// Verify if exists
app.get("/api/verify/:email", function(req, res) {
  db.collection(COLABORADORES_COLLECTION).findOne({ email: req.params.email }, function(err, doc) {
    if (doc) {
      return res.status(200).json({success: true, msg: 'Usuario ya existe', id: ObjectID(doc._id)});
    } else {
      return res.status(200).json({success: false, msg: 'Usuario no existe'});
    }
  });
});

// Authenticate
app.post('/api/authenticate', (req, res, next) => {
  const email = req.body.email;
  const id_colaborador = req.body.id_colaborador;

  getUserByEmail(email, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'Correo electrónico no encontrado'});
    }

    //if(id_colaborador == user.id_colaborador){
      res.json({
        success: true,
        user: {
          _id: user._id,
          id_colaborador: user.id_colaborador,
          nombres: user.nombres,
          email: user.email,
          role: user.role
        },
        token: bcrypt.hashSync("enel-hash")
      });
    //} else {
      //return res.json({success: false, msg: 'Correo electrónico y Id de colaborador no coinciden'});
    //}

  });
});


// Colaboradores
// get all
app.get("/api/colaboradores", function(req, res) {
  db.collection(COLABORADORES_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Error al obtener todas los colaboradores.");
    } else {
      res.status(200).json(docs);
    }
  });
});

// create
app.post("/api/colaborador", function(req, res) {
  var newColaborador = req.body;
  db.collection(COLABORADORES_COLLECTION).insertOne(newColaborador, function(err, doc) {
    if (err) {
      return res.json({success: false, msg: 'Se produjo un error inesperado'});
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

// find by id
app.get("/api/colaborador/:id", function(req, res) {
  db.collection(COLABORADORES_COLLECTION).find({ _id: ObjectID(req.params.id)}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Error al obtener el colaborador.");
    } else {
      res.status(200).json(docs[0]);
    }
  });
});

// update by id
app.put("/api/colaborador/:id", function(req, res) {
  db.collection(COLABORADORES_COLLECTION).update({ _id: ObjectID(req.params.id)}, {$set: req.body}, function(err) {
    if (err) {
      handleError(res, err.message, "Error al actualizar colaborador");
      console.error(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// delete by id
app.delete("/api/colaborador/:id", function(req, res) {
  db.collection(COLABORADORES_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Error al eliminar colaborador");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});


// Comportamientos
// get all
app.get("/api/comportamientos", function(req, res) {
  db.collection(COMPORTAMIENTOS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Error al obtener todas las comportamientos.");
    } else {
      res.status(200).json(docs);
    }
  });
});

// find by usuario
app.get("/api/comportamientos-usuario/:id_usuario", function(req, res) {
  console.log(req.params.id_usuario);
  db.collection(COMPORTAMIENTOS_COLLECTION).find({ id_usuario: req.params.id_usuario}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Error al obtener los comportamientos.");
    } else {
      res.status(200).json(docs);
    }
  });
});

// create
app.post("/api/comportamiento", function(req, res) {
  var newComportamiento = req.body;
  db.collection(COMPORTAMIENTOS_COLLECTION).insertOne(newComportamiento, function(err, doc) {
    if (err) {
      return res.json({success: false, msg: 'Se produjo un error inesperado'});
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

// find by id
app.get("/api/comportamiento/:id_area", function(req, res) {
  db.collection(COMPORTAMIENTOS_COLLECTION).find({ id: req.params.id_area}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Error al obtener el comportamiento.");
    } else {
      res.status(200).json(docs[0]);
    }
  });
});

// update by id
app.put("/api/comportamiento/:id", function(req, res) {
  console.log(req.params.id);
  console.log(req.body);
  db.collection(COMPORTAMIENTOS_COLLECTION).update({ _id: ObjectID(req.params.id)}, {$set: req.body}, function(err) {
    if (err) {
      handleError(res, err.message, "Error al actualizar comportamiento");
      console.error(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// update by id
app.put("/api/comportamiento-comportamientos/:id", function(req, res) {
  db.collection(COMPORTAMIENTOS_COLLECTION).update({ _id: ObjectID(req.params.id)}, {$set: { "comportamientos": req.body }}, function(err) {
    if (err) {
      handleError(res, err.message, "Error al actualizar comportamiento");
      console.error(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// update by id
app.put("/api/comportamiento-acciones/:id", function(req, res) {
  let parametros = req.params.id.split('-');
  db.collection(COMPORTAMIENTOS_COLLECTION).update({ _id: ObjectID(parametros[0]), "comportamientos.id_pregunta": parametros[1]}
    , {$set: { "comportamientos.$.acciones": req.body }}, function(err) {
    if (err) {
      handleError(res, err.message, "Error al actualizar acciones");
      console.error(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// delete by id
app.delete("/api/comportamiento/:id", function(req, res) {
  db.collection(COMPORTAMIENTOS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Error al eliminar comportamiento");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});


//=================================  BEGIN ITEAMDEVS  ============================


// subir imagenes
app.post("/api/uploads",md_upload,function(req, res) {
    var lstFiles = req.files.images;
  var userImages = [];
  var esArreglo=Array.isArray(lstFiles);
  if(esArreglo){
    lstFiles.forEach(function(item) {
      var file_path=item.path;
      var file_split=file_path.split('\\');
      var file_name=file_split[2];
      var ext_split=file_name.split('\.');
      var file_ext=ext_split[1];
          if(file_ext=='png' || file_ext=='jpg' || file_ext=='jpeg' || file_ext=='gif'){
            userImages.push({path:file_path,nameImage:file_name});

          }else{
            fs.unlink(file_path,(err)=>{
              if(err){
                res.status(200).send({mensaje:'extencion no es valida y fichero no borrado'});
              }else{
                res.status(200).send({mensaje:'extencion no es valida'});
          }
          });
      }});
    res.status(200).json({msg:'se cargaron archivos',files:userImages});
  }else{

    // valido si ha selecionado algo

    if(req.files.images){

      var file_path=lstFiles.path;
      var file_split=file_path.split('\\');
      var file_name=file_split[2];
      var ext_split=file_name.split('\.');
      var file_ext=ext_split[1];

            if(file_ext=='png' || file_ext=='jpg' || file_ext=='jpeg' || file_ext=='gif'){
              userImages.push({path:file_path,nameImage:file_name});
              res.status(200).json({msg:'se un  archivo',files:userImages});

            }else{
              fs.unlink(file_path,(err)=>{
                if(err){
                  res.status(200).send({mensaje:'extencion no es valida y fichero no borrado'});
                }else{
                  res.status(200).send({mensaje:'extencion no es valida'});
            }

            });
            }
    }else{
      res.status(200).send({esArreglo:esArreglo,msg:'NO seleciono un file',files:req.files});
    }
  }
});

//=================================  END ITEAMDEVS  ============================


app.get('*', function(req, res) {
  res.sendFile(distDir + 'index.html')
})
















