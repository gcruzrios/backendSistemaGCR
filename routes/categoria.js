var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Categoria = require('../models/categoria');

// ==========================================
// Obtener todos los categorias
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Categoria.find({})
        .skip(desde)
        .limit(20)
        .populate('usuario', 'nombre email')
        .exec(
            (err, categorias) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando categorias',
                        errors: err
                    });
                }

                Categoria.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        categorias: categorias,
                        total: conteo
                    });
                })

            });
});



// ==========================================
// Obtener Categoria por ID
// ==========================================
app.get('/:id', (req, res) => {
        var id = req.params.id;
            Categoria.findById(id)
            .populate('usuario', 'nombre img email')
            .exec((err, categoria) => {
            if (err) {
                    return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar Categoria',
                    errors: err
                });
            }
            if (!categoria) {
                return res.status(400).json({
                    ok: false,
            
                    mensaje: 'La Categoria con el id ' + id + 'no existe',
                    errors: { message: 'No existe una categoria con ese ID' }
                });
            }
            res.status(200).json({
            ok: true,
            categoria: categoria
            });
        })
    })
    







// ==========================================
// Actualizar Categoria
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Categoria.findById(id, (err, categoria) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar categoria',
                errors: err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La Categoria con el id ' + id + ' no existe',
                errors: { message: 'No existe una Categoria con ese ID' }
            });
        }


        categoria.nombre = body.nombre;
        //categoria.usuario = req.usuario._id;

        categoria.save((err, categoriaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar categoria',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                categoria: categoriaGuardado
            });

        });

    });

});



// ==========================================
// Crear una nueva categoria
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var categoria = new Categoria({
        nombre: body.nombre,
        //usuario: req.usuario._id
    });

    categoria.save((err, categoriaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear categoria',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            categoria: categoriaGuardado
        });


    });

});


// ============================================
//   Borrar un hospital por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar categoria',
                errors: err
            });
        }

        if (!categoriaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una categoria con ese id',
                errors: { message: 'No existe una Categoria con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            categoria: categoriaBorrado
        });

    });

});


module.exports = app;