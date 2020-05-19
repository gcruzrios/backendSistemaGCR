var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;



var categoriaSchema = new Schema({

    nombre: { type: String, unique: true, required: [true, 'El nombre de Categoría es necesario'] },
});

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Categoria', categoriaSchema);