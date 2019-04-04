// Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializar Variables
var app = express();

//Db Conexion

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos Online');
});

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada Correctamente'
    });
});


// Escuchar Peticiones

app.listen(3000, () => {
    console.log('Express Server Puerto 3000 Online');
});