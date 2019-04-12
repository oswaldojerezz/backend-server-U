// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

// Inicializar Variables
var app = express();

//Import
var Usuario = require('../models/usuario');


// Rutas

//  ==============================
//  Obtener todos los usuarios
//  ==============================

app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role').exec((err, usuarios) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error Cargando Usuario',
                errors: err
            });
        }


        res.status(200).json({
            ok: true,
            usuarios: usuarios
        });

    });


});




//  ==============================
//  Actualizar un usuario
//  ==============================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar Usuario',
                errors: err
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al Actualizar Usuario',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });

});



//  ==============================
//  Crear un nuevo usuario
//  ==============================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error Guardando Usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });

    });


});

//  ==============================
//  Eliminar Usuario
//  ==============================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar Usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No hay un usuario con ese id',
                errors: err
            });
        }


        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });


    });
});

module.exports = app;