const express = require("express");

const cors = require("cors");

const inicio = require("./rotas/inicio");
const usuario = require("./rotas/usuarios");
const autenticacao = require("./rotas/autenticacao");
const { application } = require("express");

const server = express();

//Liberar o Cors
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    return res.status(200).json({});
  }
  next();
});

server.use(express.json());
server.use(cors());
server.use(autenticacao);
server.use(inicio);
server.use(usuario);

server.listen(2258, () => {
  console.log("AVISO: Sucesso ao iniciar o serviço da API!");
});
