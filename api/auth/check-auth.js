const jwt = require('jsonwebtoken');
const express = require('express');




module.exports = (req, res, next) => {
    try {
        const token = req.cookies['token'];
        if (!token){
            console.log("Token not found");
            return res.status(401).json({
                message: "Auth failed"
            })
        }
        console.log(token);
        const decoded = jwt.verify(token, 'process.env.JWT_KEY');
        req.userData = decoded;
        next(); 
    } catch (error) {
        console.log(error)
        const token = req.cookies;
        return res.status(401).json({
            message: "Auth failed"
        })
    }
}