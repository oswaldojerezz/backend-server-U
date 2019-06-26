var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

//  ==============================
//  Verificar Token
//  ==============================

exports.verificaToken = function(req, res, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Debe estar Autenticado',
                errors: err
            });
        }

        req.usuario = decoded.usuario;
        req.hospital = decoded.hospital;

        next();
    });



};

//  ==============================
//  Verificar Admin
//  ==============================

exports.verificaAdmin = function(req, res, next) {

    var usuario = req.usuario;

    if (usuario.role === 'admin') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token Incorrecto',
            errors: err
        });
    }


};

//  ==============================
//  Verificar Admin o Mismo Usuario
//  ==============================

exports.verificaAdmin_o_MismoUsuario = function(req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'admin' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token Incorrecto',
            errors: err
        });
    }


};