const express = require("express");
const cors = require("cors");

const inicio = require("./rotas/inicio");
const { application } = require("express");

const server = express();

server.use(express.json());
server.use(cors());
server.use(inicio);

server.listen(2258, () => {
    console.log("AVISO: Sucesso ao iniciar o serviço da API!");
});