const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors');
var path = require('path');

const recipeRoutes = require('./api/routes/recipe');
const userRoutes = require('./api/routes/user');
const componentRoutes = require('./api/routes/component');
const ingredientRoutes = require('./api/routes/ingredient');
const defaultRoutes = require('./api/routes/default');

mongoose.connect("mongodb+srv://recipeDB:" + process.env.MONGO_ATLAS_PW + "@node-recipes.7gzaw.mongodb.net/food?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var corsOptions = {
    origin: 'https://localhost:3000',
    credentials: true
};

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//app.engine('pug', require('pug').__express)
app.use('/views', express.static(__dirname + '/views/'));
app.set('view engine', 'ejs');

//app.use(express.static(__dirname + '/views/css'));

app.use('/api/recipe', recipeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/component', componentRoutes);
app.use('/api/ingredient', ingredientRoutes);
app.use('/', defaultRoutes);



app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;