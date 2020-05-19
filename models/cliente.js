var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tiposValidos = {
    values: ['CLIENTE_FISICO', 'CLIENTE_JURIDICO'],
    message: '{VALUE} no es un tipo permitido'
};

var clienteSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    contacto: { type: String, required: [true, 'El contacto es necesario'] },
    email: { type: String, required: [true, 'El email es necesario'] },
    telefono: { type: String, required: [true, 'El telefono es necesario'] },
    tipo: { type: String, required: true, default: 'CLIENTE_FISICO', enum: tiposValidos },
    usuario: { 
        type: Schema.Types.ObjectId,
        ref: 'Usuario' 
    }
}, { collection: 'clientes' });



module.exports = mongoose.model('Cliente', clienteSchema);