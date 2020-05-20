var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Item = require('../models/item');

// ==========================================
// Obtener todos los items x ordenes
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Item.find({})
        .skip(desde)
        .limit(20)
        .populate('producto', 'nombre')
        .populate('orden', 'num_orden')
        .exec(
            (err, items) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando items de ordenes',
                        errors: err
                    });
                }

                Item.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        items: items,
                        total: conteo
                    });

                })

            });
});

// Obtener 1 orden
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Item.findById(id) 
        .populate('producto', 'codigo nombre')
        .populate('orden', 'num_orden')
        .exec ((err, item)=>{
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar una orden',
                    errors: err
                });
            }

            if (!item) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La orden con el id ' + id + ' no existe',
                    errors: { message: 'No existe una orden con ese ID' }
                });
            }
    
            
             res.status(200).json({
             ok: false,
             item: item
                    
             });
          

        })

});
///=========================================
// Obtener los items de una 1 orden
// ==========================================
app.get('/orden/:orden', (req, res, next) => {
    var orden = req.params.orden;
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Item.find({orden : orden })
        .skip(desde)
        .limit(20)
        .populate('producto', 'nombre')
        .populate('orden', 'num_orden')
        .exec(
            (err, items) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando items de  ordenes',
                        errors: err
                    });
                }

                Item.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        items: items,
                        total: conteo
                    });

                })

            });
});

// ==========================================
// Actualizar Orden
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Item.findById(id, (err, orden) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar orden',
                errors: err
            });
        }

        if (!item) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El item con el id ' + id + ' no existe',
                errors: { message: 'No existe un item con ese ID' }
            });
        }


        item.cantidad = body.cantidad;
        item.precio = body.precio;
        item.producto = body.producto;
        item.orden = body.orden;
        
        item.save((err, itemGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el item',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                item: itemGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo item
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var item = new Item({

        orden : body.orden,
        producto : body.producto,
        cantidad : body.cantidad,
        precio : body.precio,
      
    });

    item.save((err, itemGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear la orden',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            item: itemGuardado
        });


    });

});


// ============================================
//   Borrar un medico por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Item.findByIdAndRemove(id, (err, itemBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar item de la orden',
                errors: err
            });
        }

        if (!itemBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un item con ese id',
                errors: { message: 'No existe un item con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            item: itemBorrado
        });

    });

});


module.exports = app;