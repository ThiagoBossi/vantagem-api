const rota = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const md5 = require("md5");
const middleware = require("../../middlewares/autenticacao");

rota.use(middleware);

rota.get("/api/v1/usuarios/:codigo", async (req, res) => {
  const codigo = req.params.codigo;

  if (!codigo) {
    return res.status(400).send("Parametro invalido.");
  }

  const usuario = await prisma.usuario.findFirst({
    where: { codigo: parseInt(codigo) },
  });

  if (!usuario) {
    return res.status(404).send("Nenhum usuário encontrado");
  }

  return res.status(200).send({
    codigo: usuario.codigo,
    nome: usuario.nome,
    sobrenome: usuario.sobrenome,
    email: usuario.email,
    tipo_cadastro: usuario.tipo_cadastro,
    cadastrado: usuario.cadastrado,
    alterado: usuario.alterado,
    url_avatar: usuario.url_avatar,
    data_nascimento: usuario.data_nascimento,
    cnh: usuario.cnh,
    documento: usuario.documento,
    celular: usuario.celular,
    sobre_mim: usuario.sobre_mim,
  });
});

module.exports = rota;
