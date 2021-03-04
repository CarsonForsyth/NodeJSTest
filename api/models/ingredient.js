const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    modifier: {type: String},
    note: {type: String},
    unitType: [{type: String, default: 'unit', enum: ['unit', 'volume', 'mass', 'length']}],
    swaps: [{type: mongoose.Schema.Types.ObjectId}],
    references: [{type: mongoose.Schema.Types.ObjectId}]
});

module.exports = mongoose.model('Ingredient', ingredientSchema);