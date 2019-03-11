const express = require('express');
const app = express();
const Usuario = require('../models/usuarios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {

    let body = req.body;

    if (body.password === undefined || body.email === undefined) {
        res.status(400).json({
            ok: false,
            error: 'Parametros de entrada incorrectos'
        });
    } else {

        Usuario.findOne({ email: body.email }, (err, usuarioDb) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    error: 'Error interno'
                })
            }
            if (!usuarioDb) {
                res.status(400).json({
                    ok: false,
                    error: 'Usuario o contraseña incorrecta',
                });
            } else {
                if (!bcrypt.compareSync(body.password, usuarioDb.password)) {
                    res.status(400).json({
                        ok: false,
                        error: 'Usuario o contraseña incorrecta',
                    });
                } else {
                    usuarioDb.password = undefined;
                    let token = jwt.sign({
                        usuario: usuarioDb
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                    res.status(200).json({
                        ok: true,
                        usuarioDb: usuarioDb,
                        token: token
                    });
                }
            }
        });
    }
});


module.exports = app;