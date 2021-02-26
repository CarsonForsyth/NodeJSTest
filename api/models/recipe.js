const { realpath } = require('fs');
const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    author: { type: String },
    components: [{
        componentID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Component'},
        quantity: { type: Number, default: 1 }
    }],
    preface: { type: String},
    steps: [ { type: String } ],
    notes: [ { type: String } ],
    updated: { type: Date, default: Date.now() },
    created: { type: Date, default: Date.now() },
    recipeImage: { type: String },
    meta: { type: mongoose.Schema.Types.ObjectId, default: null } //TODO: Link to modifications
});

module.exports = mongoose.model('Recipe', recipeSchema);