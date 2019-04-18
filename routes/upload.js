// Requires
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
// Inicializar Variables
var app = express();

//Modelo
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// Rutas

app.use(fileUpload());

app.put('/:tabla/:id', (req, res, next) => {

    var tabla = req.params.tabla;
    var id = req.params.id;

    //Verificar tabla valida
    var tablasValidas = ["hospitales", "medicos", "usuarios"];
    if (tablasValidas.indexOf(tabla) < 0) {
        return res.status(400), json({
            ok: false,
            mensaje: 'Tipo de coleccion no es valida'
        });
    }
    //Verificar que lo que entra es un file
    if (!req.files) {
        return res.status(400).json({
            ok: true,
            mensaje: 'Debe de seleccionar una imagen'
        });
    }

    //Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Control de extensiones

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: "Extension no valida"
        });
    }

    //Nombre de archivo Personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover el archivo del temporal a un path
    var path = `./uploads/${ tabla }/${ nombreArchivo }`;

    archivo.mv(path, err => {
        if (err) {
            return req.status(500).json({
                ok: false,
                err: err
            });
        }

        subirPorTipo(tabla, id, nombreArchivo, res);

        /*
        res.status(200).json({
            ok: true,
            mensaje: 'Archivo Movido'
        });
*/
    });


});

function subirPorTipo(tabla, id, nombreArchivo, res) {

    if (tabla === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario Actualizada',
                    usuario: usuarioActualizado
                });
            });

        });
    }
    if (tabla === 'medicos') {
        Medico.findById(id, (err, medico) => {
            var pathViejo = './uploads/medicos/' + medico.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Medico Actualizada',
                    medico: medicoActualizado
                });
            });
        });
    }
    if (tabla === 'hospitales') {


        Hospital.findById(id, (err, hospital) => {
            var pathViejo = './uploads/hospitales/' + hospital.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Hospital Actualizada',
                    hospital: hospitalActualizado
                });
            });
        });

    }


}



module.exports = app;