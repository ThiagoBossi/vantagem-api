const jwt = require("jsonwebtoken");
const authConfig = require("../config/autenticacao");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).send({ erro: "Token não informado." });

  const parts = token.split(" ");

  if (!parts.length === 2)
    return res.status(401).send({ erro: "Token incorreto." });

  const [scheme, auth] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ erro: "Token mal-formado." });

  jwt.verify(auth, authConfig.secret, (error, decode) => {
    if (error) return res.status(401).send({ erro: "Token inválido." });

    req.codigo = decode.codigo;
    return next();
  });
};
