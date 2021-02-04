var express = require('express');
var router = express.Router();
var connection = require('../dbconnection');


router.get('/', function (req, res, next) {
    if (connection) {
        res.send("Database connected")
    }
    else {
        res.send("Database not connected");
    }



});

module.exports = router;