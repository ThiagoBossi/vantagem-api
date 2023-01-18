const express = require("express");

const cors = require("cors");

const inicio = require("./rotas/inicio");
const usuario = require("./rotas/usuarios");
const { application } = require("express");

const server = express();

server.use(express.json());
server.use(cors());
server.use(inicio);
server.use(usuario);

server.listen(2258, () => {
  console.log("AVISO: Sucesso ao iniciar o serviço da API!");
});
