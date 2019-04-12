// Requires
var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

// Inicializar Variables
var app = express();

//Import
var Medico = require('../models/medico');

// Rutas

//  ==============================
//  Obtener todos los Medicos
//  ==============================

app.get('/', (req, res) => {

    Medico.find({}).exec((err, medicos) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error Cargando Hospital',
                errors: err
            });
        }


        res.status(200).json({
            ok: true,
            medicos: medicos
        });

    });


});


module.exports = app;