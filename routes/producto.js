var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Producto = require('../models/producto');

// ==========================================
// Obtener todos los medicos
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({})
        .skip(desde)
        .limit(20)
        //.populate('usuario', 'nombre email')
        .populate('categoria')
        .exec(
            (err, productos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando producto',
                        errors: err
                    });
                }

                Producto.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        productos: productos,
                        total: conteo
                    });

                })

            });
});

// Obtener 1 medico
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Producto.findById(id) 
        //.populate('usuario', 'nombre email img')
        .populate('categoria')
        .exec ((err, producto)=>{
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar producto',
                    errors: err
                });
            }

            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El producto con el id ' + id + ' no existe',
                    errors: { message: 'No existe un producto con ese ID' }
                });
            }
    
            
             res.status(200).json({
             ok: false,
             producto: producto
                    
             });
          

        })

});

// ==========================================
// Actualizar Medico
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Producto.findById(id, (err, producto) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar producto',
                errors: err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El producto con el id ' + id + ' no existe',
                errors: { message: 'No existe un producto con ese ID' }
            });
        }


        producto.nombre = body.nombre;
        //producto.usuario = req.usuario._id;
        producto.categoria = body.categoria;
        producto.precio = body.precio;
        

        producto.save((err, productoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar producto',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                producto: productoGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo medico
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var producto = new Producto({
        nombre: body.nombre,
        //usuario: req.usuario._id,
        categoria: body.categoria,
        precio: body.precio
    });

    producto.save((err, productoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear producto',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoGuardado
        });


    });

});


// ============================================
//   Borrar un medico por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Producto.findByIdAndRemove(id, (err, productoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar producto',
                errors: err
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un producto con ese id',
                errors: { message: 'No existe un producto con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            producto: productoBorrado
        });

    });

});


module.exports = app;