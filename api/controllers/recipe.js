const Recipe = require('../models/recipe');
const mongoose = require('mongoose');
const express = require('express');
const app = express();


// Return all recipes stored to user.
exports.recipe_get_all = (req, res, next) => {
    Recipe.find().select('title author _id').exec().then(docs => {
        const response = {
            count: docs.length,
            recipes: docs.map(doc => {
                return {
                    title: doc.title,
                    author: doc.author,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/api/recipe/' + doc._id
                    }
                }
            })
        }
        if (docs.length > 0) {
            res.status(200).json(response);
        } else {
            res.status(200).json({
                message: "No valid recipe entries"
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

exports.recipe_get_one = (req, res, next) => {
    Recipe.findOne({
        _id: req.params.recipeID
    }).exec().then(doc => {
        console.log(doc),
        res.status(200).json({
            recipe: doc.title,
            //recipeImage: doc.recipeImage,
            request: {
                type: 'GET-ALL',
                url: 'http://localhost:3000/api/recipe'
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}


exports.recipe_post = (req, res, next) => {
    console.log(req);
    const recipe = new Recipe({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title.split(" ").map((word) => { return word[0].toUpperCase() + word.substring(1).toLowerCase() ; }).join(" "),
        author: req.userData.name,
        components: {
            componentID: new mongoose.Types.ObjectId()
        },
        //recipeImage: req.file.path,
        preface: req.body.preface,
        steps: req.body.steps,
        notes: req.body.notes,
        updated: req.body.updated,
        created: req.body.created
    });
    recipe
        .save()
        .then(result => {
            res.status(201).json({
                createdRecipe: {
                    title: result.title,
                    author: result.author,
                    _id: result._id,
                    image: result.filename,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/recipe/' + result._id
                    }
                }
            })
        })
        .catch(err => console.log(err));
}

exports.recipe_patch = (req, res, next) => {
    const id = req.params.recipeID;
    const now = Date.now();
    Recipe.updateOne({
        _id: id
    }, {
        $set: {
            "meta.updated": now
        }
    }).exec().then(doc => {
        console.log("Updated", doc);
        if(doc) {
            res.status(200).json({
                message: "Recipe updated",
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/recipe/' + id
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

exports.recipe_delete = (req, res, next) => {
    const id = req.params.recipeID;
    Recipe.deleteOne({
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