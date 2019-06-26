// Requires
var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

// Inicializar Variables
var app = express();

//Import
var Hospital = require('../models/hospital');

// Rutas

//  ==============================
//  Obtener todos los Hospitales
//  ==============================

app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email').exec((err, hospitales) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error Cargando Hospital',
                    errors: err
                });
            }

            Hospital.countDocuments({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total: conteo
                });

            });


        });


});

//  ==============================
//  Actualizar un Hospital
//  ==============================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al Actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });

    });

});

//  ==============================
//  Crear un nuevo Hospital
//  ==============================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error Guardando Hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });

    });


});

//  ==============================
//  Eliminar Hospital
//  ==============================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar Hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No hay un Hospital con ese id',
                errors: err
            });
        }


        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });


    });
});

// ==========================================
// Obtener Hospital por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Hospital.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar hospital',
                    errors: err
                });
            }
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el id ' + id + ' no existe',
                    errors: { message: 'No existe un hospital con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospital
            });
        });
});

module.exports = app;