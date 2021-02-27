const { realpath } = require('fs');
const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    author: { type: String },
    components: [{
        name: {type: String},
        ingredients: [{name: {type: String}, 
            _id: {type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient'},
            quantity: {type: Number},
            unit: {type: String, enum: ["g", "q", "p", "c", "floz", "tbsp", "tsp", "l", "ml", "lb", "oz", "kg", "g", "in", "cm", "u"]}
        }], 
        activeTime: {type: Number},      // Time actively working in minutes.
        awayTime: {type: Number},        // Time in minutes.
        steps: [{type: String}],
        image: [{ type: String }],
        quantity: {type: Number, default: 1}
    }],
    preface: { type: String},
    steps: [ { type: String } ],
    servings: {type: Number, default: 1},
    notes: [ { type: String } ],
    updated: { type: Date, default: Date.now() },
    created: { type: Date, default: Date.now() },
    recipeImage: { type: String },
    meta: { type: mongoose.Schema.Types.ObjectId, default: null } //TODO: Link to modifications
});

module.exports = mongoose.model('Recipe', recipeSchema);