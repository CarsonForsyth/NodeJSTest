const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

const User = require('../models/user');

exports.user_signup = (req, res, next) => {
    User.find({email: req.body.email.toLowerCase()}).exec().then(user => {
        if (user.length >= 1){
            return res.status(409).json({
                message: 'User already exists'
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
        
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email.toLowerCase(),
                        name: req.body.name.split(" ").map((word) => { return word[0].toUpperCase() + word.substring(1).toLowerCase() ; }).join(" "),
                        password: hash
                    });
                    user.save().then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User created',
                            email: result.email
                        });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        })
                    });
                }
            });
        }
    }).catch(err => {
    })
}

exports.user_login = (req, res, next) => {
    console.log(req.body.email);
    
    User.findOne({ email: req.body.email.toLowerCase()}).exec().then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
        bcrypt.compare(req.body.password, user.password, (err, result) =>  {
            if (result) {
                const token = jwt.sign(
                    {
                        email: user.email.toLowerCase(),
                        userId: user._id
                    }, 
                    `process.env.JWT_KEY`, 
                    {
                        expiresIn: "12h"
                    }
                );
                res.cookie('token', token, { httpOnly: false, maxAge: 43200 });
                res.header('token', JSON.stringify({ token: 'token' }));
                res.render("index/?login=true");
            }
            return res.status(401).json({
                message: 'Auth failed'
            });
        }); 
    }).catch(err => {
        res.render("/login/?login=false")
    });
}

exports.user_get_all = (req, res, next) => {
    User.find().exec().then(results => {
        const response = {
            count: results.length,
            users: results.map(result => {
                return {
                    email: result.email,
                    _id: result._id,
                    name: result.name,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/user/' + result._id
                    }
                }
            })
        }
        if (results.length > 0) {
            res.status(200).json(response);
        } else {
            res.status(200).json({
                message: "No valid users"
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

exports.user_get_one = (req, res, next) => {
    User.findOne({
        _id: req.params.userId
    }).exec().then(result => {
        console.log(result),
        res.status(200).json({
            email: result.email,
            _id: result._id,
            name: result.name
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.user_delete = (req, res, next) => {
    User.deleteOne({
        _id: req.params.userId
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