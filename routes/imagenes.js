// Requires
var express = require('express');

// Inicializar Variables
var app = express();

const path = require('path');
const fs = require('fs');

// Rutas
app.get('/:tabla/:img', (req, res, next) => {

    var tabla = req.params.tipo;
    var img = req.params.img;

    var pathImagen = path.resolve(__dirname, `../uploads/${ tabla }/${ img }`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    }


});

module.exports = app;