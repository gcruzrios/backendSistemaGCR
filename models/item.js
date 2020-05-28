var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var itemSchema = new Schema({
    num_linea: { type: String,  required: [true, 'El número  de linea es necesario'] },
    cantidad: { type: Number, required: false },
    orden: { 
        type: Schema.Types.ObjectId,
        required: [true, 'La orden es requerida'],
        ref: 'Orden' 
    },
    producto: { 
        type: Schema.Types.ObjectId,
        required: [true, 'El producto es requerido'],
        ref: 'Producto' 
    },
    precio:{ type: Number, required:[true, 'El precio de Producto es necesario'] },
    
}, { collection: 'items' });



module.exports = mongoose.model('Item', itemSchema);