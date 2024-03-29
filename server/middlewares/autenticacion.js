const jwt = require("jsonwebtoken");

let verificaToken = (req, res, next) => {
  let token = req.get("Authorization");

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      res.status(401).json({
        ok: false,
        err: "No autorizado"
      });
    } else {
      req.usuario = decoded.usuario;
      next();
    }
  });
};

let verificaTokenChangePassword = (req, res, next) => {
  let token = req.get("Authorization");

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      res.status(401).json({
        ok: false,
        err: "No autorizado"
      });
    } else if (!decoded.isPasswordReset) {
      res.status(401).json({
        ok: false,
        err: "Token no valido, No autorizado"
      });
    } else {
      req.usuario = decoded.usuario;
      next();
    }
  });
};

let verificaAdminRole = (req, res, next) => {
  let usuario = req.usuario;

  if (usuario.role === "ADMIN_ROLE") {
    next();
  } else {
    res.status(401).json({
      ok: false,
      err: "No autorizado para realizar esta operacion"
    });
  }
};

module.exports = { verificaToken, verificaAdminRole, verificaTokenChangePassword };
