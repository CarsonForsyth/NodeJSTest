const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./../models/recipe');
const Ingredient = require('./../models/ingredient');

const app = express();
const bodyParser = require("body-parser");
const { readSync } = require('fs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://recipeDB:" + process.env.MONGO_ATLAS_PW + "@node-recipes.7gzaw.mongodb.net/food?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


app.get("/", (req, res) => {
  
    res.render("index.ejs");
    
});


app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.get("/recipes", (req, res) => {
  console.log("here")
  res.render("viewManyRecipe.ejs");
});

app.get("/recipes/new", (req, res) => {
  console.log("here")
  res.render("createRecipe.ejs");
});

app.get("/recipes/:recipeID", (req, res) => {
  recipe = Recipe.findOne({
    _id: req.params.recipeID
  }).populate('components').exec()
  .then(doc => {
    console.log(doc)
    res.set('Content-Type', 'text/html');
    res.render("viewOneRecipe.ejs", {doc: doc})
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
        error: err
    });
  })
});





app.get("/ingredients/new", (req, res) => {
  res.render("createIngredient.ejs");
});

app.get("/ingredients", (req, res) => {
  res.render("viewManyIngredient.ejs")
});

app.get("/ingredients/:ingredientID", (req, res) => {
  Ingredient.findOne({
    _id: req.params.ingredientID
  }).exec().then(doc => {
    console.log(doc);
    res.render("viewOneIngredient.ejs", {doc: doc});
  }).catch(err => {
    console.log(err);
  });
});


module.exports = app;