var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Orden = require('../models/orden');

// ==========================================
// Obtener todos las ordenes
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Orden.find({})
        .skip(desde)
        .limit(20)
        .populate('usuario', 'nombre email')
        .populate('cliente')
        .exec(
            (err, ordenes) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando ordenes',
                        errors: err
                    });
                }

                Orden.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        ordenes: ordenes,
                        total: conteo
                    });

                })

            });
});

// Obtener 1 orden
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Orden.findById(id) 
        .populate('usuario', 'nombre email img')
        .populate('cliente')
        .exec ((err, orden)=>{
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar una orden',
                    errors: err
                });
            }

            if (!orden) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La orden con el id ' + id + ' no existe',
                    errors: { message: 'No existe una orden con ese ID' }
                });
            }
    
            
             res.status(200).json({
             ok: false,
             orden: orden
                    
             });
          

        })

});

// ==========================================
// Actualizar Orden
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Orden.findById(id, (err, orden) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar orden',
                errors: err
            });
        }

        if (!orden) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La orden con el id ' + id + ' no existe',
                errors: { message: 'No existe una orden con ese ID' }
            });
        }


        orden.num_orden = body.num_orden;
        orden.consecutivo = body.consecutivo;
        orden.usuario = req.usuario._id;
        orden.cliente = body.cliente;
        orden.total = body.total;
        orden.tipo = body.tipo;

        orden.save((err, ordenGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar orden',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                orden: ordenGuardado
            });

        });

    });

});



// ==========================================
// Crear un nueva orden mdAutenticacion.verificaToken
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var orden = new Orden({

        num_orden : body.num_orden,
        consecutivo : body.consecutivo,
        usuario : req.usuario._id,
        cliente : body.cliente,
        
    });

    orden.save((err, ordenGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear la orden',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            orden: ordenGuardado
        });


    });

});


// ============================================
//   Borrar una orden por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Orden.findByIdAndRemove(id, (err, ordenBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar la orden',
                errors: err
            });
        }

        if (!ordenBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una orden con ese id',
                errors: { message: 'No existe una orden con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            orden: ordenBorrado
        });

    });

});


module.exports = app;