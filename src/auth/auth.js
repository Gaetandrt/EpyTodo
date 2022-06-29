const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require('dotenv').config();

module.exports = function(app, db) {
    app.post("/register", function(req,res) {
        if (req.body.email == null || req.body.name == null || req.body.firstname == null || req.body.password == null) return res.type('json').status(500).send(JSON.stringify({msg: "internal server error"}, null, 2));
        var hh = bcrypt.hashSync(req.body.password, 8);
        var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        db.connection.query(
        "INSERT INTO user (email, name, firstname, password, created_at) VALUES (?, ?, ?, ?, ?)",
        [req.body.email, req.body.name, req.body.firstname, hh, date],
        function(err, rows, fields) {
            if (err) {
                if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) return res.type('json').status(409).send(JSON.stringify({msg: "account already exists"}, null, 2));
                else {
                    console.error(err);
                    return res.type('json').status(500).send(JSON.stringify({msg: "internal server error"}, null, 2));
                }
            } else {
                var jwtoken = jsonwebtoken.sign({email: req.body.email}, process.env.SECRET);
                res.type('json').status(201).send(JSON.stringify({token: jwtoken}, null, 2));
            }
        });
    });

    app.post("/login", function(req, res) {
        console.log(req.body);
        if (req.body.email == null || req.body.password == null) return res.type('json').status(500).send(JSON.stringify({msg: "internal server error"}, null, 2));
        db.connection.query(
        "SELECT email, password FROM user WHERE email = ?",
        [req.body.email],
        function(err, rows, fields) {
            if (err) {
                console.error(err);
                return res.type('json').status(500).send(JSON.stringify({msg: "internal server error"}, null, 2));
            }
            if (rows.length < 1) res.type('json').status(401).send(JSON.stringify({msg: "Invalid Credentials"}, null, 2));
            else {
                var passvalidation = bcrypt.compareSync(req.body.password, rows[0].password);
                if (!passvalidation) res.type('json').status(401).send(JSON.stringify({msg: "Invalid Credentials"}, null, 2));
                else {
                    var jwtoken = jsonwebtoken.sign({email: req.body.email}, process.env.SECRET);
                    res.cookie('jwtoken', jwtoken);
                    res.type('json').status(200).send(JSON.stringify({token: jwtoken}, null, 2));
                }
            }
        });
    });
}