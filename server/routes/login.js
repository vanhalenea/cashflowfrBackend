const express = require("express");
const app = express();
const Usuario = require("../models/usuarios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post("/login", async (req, res) => {
  try {
    let body = req.body;

    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });

    if (body.password === undefined || body.email === undefined) {
      return res.status(400).json({
        ok: false,
        error: "Parametros de entrada incorrectos"
      });
    } else {
      Usuario.findOne(
        { email: body.email, google: false },
        (err, usuarioDb) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              error: "Error interno"
            });
          }
          if (!usuarioDb) {
            return res.status(401).json({
              ok: false,
              error: "Usuario o contraseña incorrecta"
            });
          } else {
            if (!bcrypt.compareSync(body.password, usuarioDb.password)) {
              return res.status(401).json({
                ok: false,
                error: "Usuario o contraseña incorrecta"
              });
            } else {
              usuarioDb.password = undefined;
              let token = jwt.sign(
                {
                  usuario: usuarioDb
                },
                process.env.SEED,
                { expiresIn: process.env.CADUCIDAD_TOKEN }
              );

              return res.status(200).json({
                ok: true,
                user: usuarioDb,
                token: token,
                expiresIn: process.env.CADUCIDAD_TOKEN,
                createdAt: Date.now()
              });
            }
          }
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/google", async (req, res) => {
  let token = req.body.token;
  let body = req.body;

  const googleUser = await verifyAcount(token).catch(err => {
    res.status(403).json({
      ok: false,
      error: "Token invalido"
    });
  });

  Usuario.findOne({ email: googleUser.email }, (err, usuarioDb) => {
    if (err) {
      res.status(500).json({
        ok: false,
        error: "Error interno"
      });
    }

    if (usuarioDb) {
      if (usuarioDb.google === false) {
        res.status(500).json({
          ok: false,
          error: "accion no permitida"
        });
      } else {
        usuarioDb.password = undefined;
        let token = jwt.sign(
          {
            usuario: usuarioDb
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );

        res.status(200).json({
          ok: true,
          user: usuarioDb,
          token: token,
          expiresIn: process.env.CADUCIDAD_TOKEN,
          createdAt: Date.now()
          
        });
      }
    } else {
      let usuario = new Usuario({
        nombre: googleUser.nombre,
        email: googleUser.email,
        img: googleUser.img,
        google: googleUser.google,
        password: bcrypt.hashSync("aaa", 10)
      });

      usuario.save((err, usuarioDB) => {
        if (err) {
          res.status(400).json({
            ok: false,
            error: err
          });
        } else {
          usuarioDb.password = undefined;
          let token = jwt.sign(
            {
              usuario: usuarioDb
            },
            process.env.SEED,
            { expiresIn: process.env.CADUCIDAD_TOKEN }
          );
          res.json({
            ok: true,
            user: usuarioDB,
            token: token,
            expiresIn: process.env.CADUCIDAD_TOKEN,
            createdAt: Date.now()
          });
        }
      });
    }
  });
});

const verifyAcount = async token => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  const payload = ticket.getPayload();
  const userid = payload["sub"];

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  };
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
};

module.exports = app;
