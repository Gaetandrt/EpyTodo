const EXP = require('express');
const db = require("../../config/db.js");
const jsonwebtoken = require("jsonwebtoken");

const RT = EXP.RT();
RT.use(require("../../middleware/auth.js"));
RT.get('/', getUsers);
RT.get('/todos', getUsersTodos);
RT.get('/:user', getUserUser);


function getUsers(req, res) {
    const tk = req.cookies.jwtoken;
    var decoded = jsonwebtoken.verify(tk, process.env.SECRET);
    db.connection.query(
    "SELECT id, email, password, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%S') AS created_at, firstname, name FROM user WHERE email = ?",
    [decoded.email],
    function(err, rows) {
        if (err) {
            console.error(err);
            return res.type('json').status(500).send(JSON.stringify({msg: "internal server error"}, null, 2));
        }
        if (rows.length < 1) return res.type('json').status(500).send(JSON.stringify({msg: "internal server error"}, null, 2));
        res.type('json').send(JSON.stringify(rows[0], null, 2));
    });
}

function getUsersTodos(req, res) {
        const tk = req.cookies.jwtoken;
        var decoded = jsonwebtoken.verify(tk, process.env.SECRET);
        db.connection.query(
        "SELECT todo.id, title, description, DATE_FORMAT(todo.created_at, '%Y-%m-%d %H:%i:%S') AS created_at, DATE_FORMAT(due_time, '%Y-%m-%d %H:%i:%S') AS due_time, user_id, status FROM user JOIN todo ON todo.user_id = user.id WHERE user.email = ?",
        [decoded.email],
        function(err, rows) {
            if (err) {
                console.error(err);
                return res.type('json').status(500).send(JSON.stringify({msg: "internal server error"}, null, 2));
            }
            res.type('json').send(JSON.stringify(rows, null, 2));
        });
}

function getUserUser(req, res) {
    db.connection.query(
        "SELECT id, email, password, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%S') AS created_at, firstname, name FROM user WHERE email = ? or id = ?",
        [req.params.user, req.params.user],
        function(err, rows) {
            if (err) {
                console.error(err);
                return res.type('json').status(500).send(JSON.stringify({msg: "internal server error"}, null, 2));
            }
            if (rows.length < 1) return res.type('json').status(500).send(JSON.stringify({msg: "internal server error"}, null, 2));
            res.type('json').send(JSON.stringify(rows[0], null, 2));
        });
}

module.exports = RT;