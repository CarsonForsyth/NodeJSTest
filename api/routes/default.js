const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./../models/recipe');
const Ingredient = require('./../models/ingredient');

const app = express();
const bodyParser = require("body-parser");
const { readSync } = require('fs')
;
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://recipeDB:" + process.env.MONGO_ATLAS_PW + "@node-recipes.7gzaw.mongodb.net/food?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/* GET home page. */

app.get("/", (req, res) => {
  const recipes = Recipe.find({}).select('title author').exec().then(docs => {
    console.log(docs);
    res.render("index.ejs", {title: 'cooking', 
      recipes: docs.map(doc => {
        return {
            title: doc.title,
            author: doc.author,
            _id: doc._id,
            url: 'http://localhost:3000/find/' + doc._id
        }
    })
});
    }).catch(err => {
      console.log(err);
      res.status(500).json({
          error: err
      });
  })
});

app.get("/viewRecipe/:recipeID", (req, res) => {
  recipe = Recipe.findOne({
    _id: req.params.recipeID
  }).populate('components').exec()
  .then(doc => {
    console.log(doc);
    console.log(doc.ingredients);
    res.set('Content-Type', 'text/html');
    /*for (var i = 0 ; i < doc.components.length ; i ++) {
      for (var j = 0 ; j < doc.components[i].steps.length ; i ++ ) {

      }
    }*/
    res.render("viewRecipe.ejs", {doc: doc})
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
        error: err
    });
  })
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/createRecipe", (req, res) => {
  res.set('Content-Type', 'text/html');
  /*Ingredient.find({}).exec(function (err, data){
    
    res.render("test.ejs", {availableIngredients: data, units: units.units});
  });*/
  res.render("createRecipe.ejs");
});

app.get("/createComponent", (req, res) => {
  res.set('Content-Type', 'text/html');
  Ingredient.find({}).exec(function (err, data){
    
    res.render("createComponent.ejs", {availableIngredients: data});
  });
  
});

app.get("/createIngredient", (req, res) => {
  res.render("createIngredient.ejs");
});
app.get("/combineIngredient", (req, res) => {
  res.render("combineIngredient.ejs");
});

app.get("/ingredient/:ingredientID", (req, res) => {
  Ingredient.findOne({
    _id: req.params.ingredientID
  }).exec().then(doc => {
    console.log(doc);
    res.render("viewIngredient.ejs", {doc: doc});
  }).catch(err => {
    console.log(err);
  });
});

app.post("/recipe", (req, res) => {
  console.log(req.body);
  res.status(200);
  res.send(req.body.name);
});

module.exports = app;