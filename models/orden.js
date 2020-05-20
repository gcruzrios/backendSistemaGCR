var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var tiposValidos = {
    values: ['COTIZACION', 'ORDEN', 'FACTURA'],
    message: '{VALUE} no es un tipo permitido'
}
var ordenSchema = new Schema({
    num_orden: { type: String, unique: true, required: [true, 'El número es necesario'] },
    consecutivo:{ type: Number, required: [true, 'El consecutivo es necesario'] },
    total: { type: Number, required: false, default: 0 },
    fechaCreado: { type: Date, default: Date.now},
    tipo : { type: String, required: true, default: 'COTIZACION', enum: tiposValidos },
    usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: [true, 'El id del Cliente es un campo obligatorio ']
    }
},{ collection: 'ordenes' });

ordenSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Orden', ordenSchema);