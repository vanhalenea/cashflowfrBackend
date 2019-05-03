const express = require("express");
var nodemailer = require("nodemailer");
const app = express();
const Usuario = require("../models/usuarios");
const jwt = require("jsonwebtoken");
const _ = require("underscore");
const bcrypt = require("bcrypt");
const { verificaTokenChangePassword } = require("../middlewares/autenticacion");

app.post("/password/forgot", (req, res) => {
  let body = _.pick(req.body, ["email"]);

  Usuario.findOne({ email: body.email, google: false }, (err, usuarioDb) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        error: "Error interno"
      });
    }
    if (!usuarioDb) {
      return res.status(401).json({
        ok: false,
        error: "Usuario no encontrado"
      });
    } else {
      var transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
          user: process.env.USER_MAIL_SENDER,
          pass: process.env.USER_PASSWORD_MAIL_SENDER
        }
      });

      let token = jwt.sign(
        {
          usuario: usuarioDb,
          isPasswordReset: true
        },
        process.env.SEED,
        {
          expiresIn: process.env.CADUCIDAD_TOKEN_MAIL_PASS_RESTORE
        }
      );

      const mailContent = `Acabas de recibir este mail ya que tu (o alguien mas) esta solicitando restablecer la contraseña de tu cuenta.
      Favor clickear en el siguiente link, o pegalo en el navegador para completar el proceso:

       http://${req.headers.origin}/reset?id=${token}

      Si tu no solicitaste esto, ignora este correo y tu contraseña seguira siendo la misma.
      
      Atte.
      Equipo de soporte CashflowFr.`;

      var mailOptions = {
        from: process.env.MAIL_REMITENTE,
        to: body.email,
        subject: process.env.MAIL_SUBJECT,
        text: mailContent
      };

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
          res.status(500).json({ ok: false, code: 500, error: error.response });
        } else {
          res.status(200).json({
            ok: true,
            msg: `Correo enviado `
          });
        }
      });
    }
  });
});

app.post(
  "/password/submitPassChange",
  verificaTokenChangePassword,
  (req, res) => {
    const updObject = {
      password: bcrypt.hashSync(req.body.newPasword, 10)
    };

    Usuario.findOneAndUpdate(
      { _id: req.usuario._id },
      updObject,
      { runValidators: false, new: true },
      (err, usuarioDB) => {
        console.log();
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
  }
);

module.exports = app;
