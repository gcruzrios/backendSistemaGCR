var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var tiposValidos = {
    values: ['PRODUCTO', 'SERVICIO'],
    message: '{VALUE} no es un tipo permitido'
};

var productoSchema = new Schema({
    codigo: { type: String, unique: true, required: [true, 'El código de Producto es necesario'] },
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

productoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Producto', productoSchema);