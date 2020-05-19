var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tiposValidos = {
    values: ['PRODUCTO', 'SERVICIO'],
    message: '{VALUE} no es un tipo permitido'
};

var productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre de Producto es necesario'] },
    img: { type: String, required: false },
    categoria: { 
        type: Schema.Types.ObjectId,
        required: [true, 'La categoría es requerida'],
        ref: 'Categoria' 
    },
    precio:{ type: Number, required:[true, 'El precio de Producto es necesario'] },
    tipo: { type: String, required: true, default: 'PRODUCTO', enum: tiposValidos },
}, { collection: 'productos' });



module.exports = mongoose.model('Producto', productoSchema);