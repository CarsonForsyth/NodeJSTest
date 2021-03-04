const Recipe = require('../models/recipe');
const mongoose = require('mongoose');
const express = require('express');
const app = express();


// Return all recipes stored to user.
exports.recipe_get_all = (req, res, next) => {
    Recipe.find().select('title author _id').exec().then(docs => {
        /*const response = {
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
        }*/
        if (docs.length > 0) {
            res.send({recipes: docs});
        } else {
            res.status(200).send({
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
    var data = req.body;
    console.log(data);
    var components = new Object();
    for ( var i = 1; i <= data.compCount; i ++ ){
        var comp = {};
        var cur ='comp-'+i;
        comp.name = data[cur+"-name"]
        comp.activeTime = data[cur+"-activeTime"];
        comp.awayTime = data[cur+"-awayTime"];
        if (parseInt(data[cur+"-ingrCnt"]) == 1){
            console.log(data[cur+"-ingredients"])
            comp["ingredients"] = {"quantity": data[cur+"-quantity"], "name": data[cur+"-ingredients"], "unit": data[cur+"-unit"]};
        }
        else {
            var ingredients = [{}];
            for ( var j = 0; j < parseInt(data[cur+"-ingrCnt"]) ; j ++ ) {
                console.log(data[cur+"-ingredients"][j])
                ingredients[j] = {"quantity": data[cur+"-quantity"][j], "name": data[cur+"-ingredients"][j], "unit": data[cur+"-unit"][j]};
                console.log(ingredients[j])
            }
            comp["ingredients"] = ingredients;
        }
        
        if (parseInt(data[cur+"-stpsCnt"]) == 1){
            comp.steps = data[cur+"-steps"];
        }
        else {
            var steps = [{}];
            for ( var k = 0; k < parseInt(data[cur+"-stpsCnt"]) ; k ++ ) {
                steps[k] = data[cur+"-steps"][k];
            }
            comp["steps"] = steps;
        }
        console.log(comp);
        if (data.compCount == 1){
            components = comp;
        }
        else{
        components[i] = comp;
        }
    }
    console.log(components);
    if (!req.body.servings){
        req.body.servings = 1;
    }
    else if (req.body.servings == '' || isNaN(req.body.servings)){
        req.body.servings = 1;
    }
    const recipe = new Recipe({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        author: "Carson Forsyth",
        description: req.body.description,
        //recipeImage: req.file.path,
        preface: req.body.preface,
        components: components,
        steps: req.body.steps,
        notes: req.body.notes,
        updated: Date.now(),
        created: Date.now()
    });
    
    console.log(recipe);
    recipe
        .save()
        .then(result => {
            res.redirect("../../recipes/"+result._id)
        })
        .catch(err => {
            console.log(err)
        });
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