const mongoose = require('mongoose');

const componentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required: true},
    author: {type: String},
    ingredients: [{name: {type: String}, 
        _id: {type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient'},
        quantity: {type: Number},
        unit: {type: String}
    }], 
    activeTime: {type: Number},      // Time actively working in minutes.
    awayTime: {type: Number},        // Time in minutes.
    steps: [{type: String}],
    servings: {quantity: {type: Number}, unit: {type: String, }},
    image: [{ type: String }]
});

module.exports = mongoose.model('Component', componentSchema);
