const Component = require('../models/component');
const mongoose = require('mongoose');
const express = require('express');
const Ingredient = require('../models/ingredient');
const ingredient = require('../models/ingredient');
const app = express();


// Return all recipes stored to user.
exports.component_get_all = (req, res, next) => {
    Component.find().exec().then(docs => {
        const response = {
            count: docs.length,
            components: docs.map(doc => {
                return {
                    title: doc.title,
                    _id: doc._id,
                    ingredients: doc.ingredients,
                    activeTime: doc.activeTime,
                    awayTime: doc.awayTime,
                    steps: doc.steps,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/api/component/' + doc._id
                    }
                }
            })
        }
        if (docs.length > 0) {
            console.log(response);
            res.status(200).json(response);
        } else {
            res.status(200).json({
                message: "No valid component entries"
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
    
}

exports.component_get_one = (req, res, next) => {
    Component.findOne({
        _id: req.params.componentID
    }).exec().then(doc => {
        console.log(doc),
        res.status(200).json({
            title: doc.title,
            _id: doc._id,
            ingredients: doc.ingredients,
            activeTime: doc.activeTime,
            awayTime: doc.awayTime,
            steps: doc.steps,
            request: {
                type: 'GET-ALL',
                url: 'http://localhost:3000/api/component'
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}


exports.component_post = (req, res, next) => {
    
    const component = new Component({
        title: req.body.title.split(" ").map((word) => { return word[0].toUpperCase() + word.substring(1).toLowerCase() ; }).join(" "),
        //author: req.userData.name, //REMOVED FOR TESTING
        _id: new mongoose.Types.ObjectId(),
        ingredients: JSON.parse(req.body.ingredients),
        activeTime: req.body.activeTime,
        awayTime: req.body.awayTime,
        steps: req.body.steps
    });
    for (ingr in JSON.parse(req.body.ingredients)){
        console.log(ingr.name);
        Ingredient.updateOne({name: ingr.name}, {$addToSet: {references: component._id, }});
    }
    component
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                createdComponent: {
                    title: result.title,
                    _id: result._id,
                    ingredients: result.ingredients,
                    activeTime: result.activeTime,
                    awayTime: result.awayTime,
                    steps: result.steps,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/api/component/' + result._id
                    }
                }
            });
        })
        .catch(err => console.log(err));
}

exports.component_patch = (req, res, next) => {
    const id = req.params.componentID;
    const now = Date.now();
    Component.updateOne({
        _id: id
    }, {
        $set: {
            "updated": now
        }
    }).exec().then(doc => {
        console.log("Updated", doc);
        if(doc) {
            res.status(200).json({
                message: "Component updated",
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/component/' + id
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

exports.component_delete = (req, res, next) => {
    const id = req.params.componentID;
    Component.deleteOne({
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