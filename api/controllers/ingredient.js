const Ingredient = require('../models/ingredient');
const mongoose = require('mongoose');
const express = require('express');
const app = express();


// Return all recipes stored to user.
exports.ingredient_get_all = (req, res, next) => {
    Ingredient.find().exec().then(docs => {
        const data = docs;
        console.log(data[0]);
        res.send({ingredients: data});
    }).catch(err => {
        console.log(err);
    })
    /*
    Ingredient.find().exec().then(docs => {
        const response = {
            count: docs.length,
            ingredients: docs.map(doc => {
                return {
                    name: doc.name,
                    _id: doc._id,
                    unitType: doc.unitType,
                    modifier: doc.modifier,
                    note: doc.note,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/api/ingredient/' + doc._id
                    }
                }
            })
        }
        if (docs.length > 0) {
            console.log(response);
            res.status(200).json(response);
        } else {
            res.status(200).json({
                message: "No valid ingredient entries"
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
    */
}

exports.ingredient_get_one = (req, res, next) => {
    Ingredient.findOne({
        _id: req.params.ingredientID
    }).exec().then(doc => {
        console.log(doc),
        res.status(200).json({
            name: doc.name,
            _id: doc._id,
            unitType: doc.unitType,
            modifier: doc.modifier,
            note: doc.note,
            request: {
                type: 'GET-ALL',
                url: 'http://localhost:3000/api/ingredient'
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}


exports.ingredient_post = (req, res, next) => {
    console.log(req.body.name);
    const ingredient = new Ingredient({
        name: req.body.name.split(" ").map((word) => { return word[0].toUpperCase() + word.substring(1).toLowerCase() ; }).join(" "),
        _id: new mongoose.Types.ObjectId(),
        unitType: req.body.unitType,
        modifier: req.body.modifier,
        note: req.body.note,
    });
    ingredient
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                createdIngredient: {
                    name: result.name,
                    _id: result._id,
                    unitType: result.unitType,
                    modifier: result.modifier,
                    note: result.note,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/api/ingredient/' + result._id
                    }
                }
            });
        })
        .catch(err => console.log(err));
}

exports.ingredient_patch = (req, res, next) => {
    const id = req.params.ingredientID;
    const now = Date.now();
    Ingredient.updateOne({
        _id: id
    }, {
        $set: {
            "updated": now
        }
    }).exec().then(doc => {
        console.log("Updated", doc);
        if(doc) {
            res.status(200).json({
                message: "Ingredient updated",
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/ingredient/' + id
                }
            });
        } else {
            res.status(404).json({
                message: "No valid entry for provided ID"
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.ingredient_delete = (req, res, next) => {
    const id = req.params.ingredientID;
    Ingredient.deleteOne({
        _id: id
    }).exec().then(result => {
        res.status(200).json({
            ok: result.ok
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
}