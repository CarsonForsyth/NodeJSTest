const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./../models/recipe');
const Ingredient = require('./../models/ingredient');
const app = express();
const bodyParser = require("body-parser");
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
  var data = {}
  recipe = Recipe.findOne({
    _id: req.params.recipeID
  }).populate('components').exec()
  .then(doc => {
    console.log(doc);
    data.doc = doc;
  }).then(() => {
    return Ingredient.find({});
  }).then(docs => {
    data.availableIngredients = docs;
  }).then(() => {
    console.log(data);
    res.render("viewRecipe.ejs", {data});
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
  Ingredient.find({}).exec(function (err, data){
    
    res.render("createRecipe.ejs", {availableIngredients: data});
  });
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

module.exports = app;