const express = require("express");
const app = express();
const Usuario = require("../models/usuarios");
const bcrypt = require("bcrypt");
const _ = require("underscore");

const {
  verificaToken,
  verificaAdminRole
} = require("../middlewares/autenticacion");

app.get("/usuario", verificaToken, (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);
  let limit = req.query.limit || 3;
  limit = Number(limit);

  Usuario.find({ estado: true }, "nombre email")
    .skip(desde)
    .limit(limit)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err: "error intero"
        });
      } else {
        Usuario.countDocuments({}, (err, count) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              err: "error intero"
            });
          } else {
            res.json({
              ok: true,
              usuarios,
              conteo: count
            });
          }
        });
      }
    });
});

app.post("/usuario", [verificaToken, verificaAdminRole], (req, res) => {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      res.status(400).json({
        ok: false,
        error: err
      });
    } else {
      res.json({
        ok: true,
        usuario: usuarioDB
      });
    }
  });
});

app.post("/usuario/public", (req, res) => {
    let body = _.pick(req.body, ["nombre", "email", "password"]);
  
    let usuario = new Usuario({
      nombre: body.nombre,
      email: body.email,
      password: bcrypt.hashSync(body.password, 10),
    });
  
    usuario.save((err, usuarioDB) => {
      console.log(err);
      if (err) {
        return res.status(460).json({
          ok: false,
          error: err.code
        });
      } else {
        return res.json({
          ok: true,
          usuario: usuarioDB
        });
      }
    });
  });

app.put("/usuario/:id", verificaToken, (req, res) => {
  let body = _.pick(req.body, ["nombre", "img", "role", "estado"]);
  let id = req.params.id;

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, usuarioDB) => {
      if (err) {
        res.status(400).json({
          ok: false,
          error: err
        });
      } else {
        res.json({
          ok: true,
          usuario: usuarioDB
        });
      }
    }
  );
});

app.delete("/usuario/:id", (req, res) => {
  let id = req.params.id;

  Usuario.findByIdAndDelete(id, (err, usuarioDeleted) => {
    if (err) {
      res.status(500).json({
        ok: false,
        error: err
      });
    } else {
      res.json({
        ok: true,
        usuario: usuarioDeleted
      });
    }
  });
});

app.get("/usuario/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  Usuario.findById(id, (err, usuarioDb) => {
    if (err) {
      res.json({
        ok: false,
        error: err
      });
    } else {
      res.json({
        ok: true,
        usuario: usuarioDb
      });
    }
  });
});

module.exports = app;
