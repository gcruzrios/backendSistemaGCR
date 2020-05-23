// Requires

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Init variables

var app = express();

//Rutas

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Conexión a la base de datos
// mongoose.connection.openUri('mongodb://localhost:27017/sistemaAdminDB', (err, res) => {
mongoose.connection.openUri('mongodb+srv://gcruzrios:Grvn240675@gcr-mongodb-jbim8.mongodb.net/test?retryWrites=true&w=majority',(err, res) => {

    //const uri = "mongodb+srv://gcruzrios:<password>@gcr-mongodb-jbim8.mongodb.net/test?retryWrites=true&w=majority";

    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

});
// Escuchar peticiones
//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","POST, GET, PUT, DELETE, OPTIONS")
    next();
  });
// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');

 var categoriaRoutes = require('./routes/categoria');
 var loginRoutes = require('./routes/login');
 var productoRoutes = require('./routes/producto');
 var clienteRoutes = require('./routes/cliente');
 var ordenRoutes = require('./routes/orden');
 var itemRoutes = require('./routes/item');
 
 var busquedaRoutes = require('./routes/busqueda');
 var uploadRoutes = require('./routes/upload');
 var imagenesRoutes = require('./routes/imagenes');


// Rutas


app.use('/usuario', usuarioRoutes);
app.use('/categoria', categoriaRoutes);

app.use('/login', loginRoutes);
app.use('/producto', productoRoutes);
app.use('/cliente', clienteRoutes);
app.use('/orden', ordenRoutes);
app.use('/item', itemRoutes);

 app.use('/busqueda', busquedaRoutes);
 app.use('/upload', uploadRoutes);
 app.use('/img', imagenesRoutes);


app.use('/', appRoutes);

app.listen(3001, ()=>{
    console.log('Express server puerto 3001: \x1b[32m%s\x1b[0m', 'online');
})