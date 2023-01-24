const rota = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const md5 = require("md5");
const validator = require("email-validator");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/autenticacao.json");

function GenerateToken(param = {}) {
  return jwt.sign({ param }, authConfig.secret).toString();
}

rota.post("/api/v1/registro", async (req, res) => {
  const { nome, sobrenome, email, senha, tipo_cadastro, documento } = req.body;

  var now = new Date();
  now.setHours(now.getHours() - 3);

  if (!nome || !sobrenome || !email || !senha || !tipo_cadastro || !documento) {
    return res
      .status(400)
      .send("Solicitação Incorreta. Por favor valide os campos.");
  }

  if (!validator.validate(email.trim())) {
    return res.status(400).send("O e-mail informado é inválido.");
  }

  const validaEmail = await prisma.usuario.findFirst({
    where: { email: email.trim() },
  });

  if (validaEmail) {
    return res.status(400).send("O e-mail informado já está cadastrado.");
  }

  const validaDoc = await prisma.usuario.findFirst({
    where: { documento: documento.trim() },
  });

  if (validaDoc) {
    return res
      .status(400)
      .send("Já existe um usuário com o documento informado.");
  }

  if (senha.length < 6) {
    return res.status(400).send("A senha deve conter no mínimo 6 caractéres.");
  }

  await prisma.usuario
    .create({
      data: {
        nome: nome.trim(),
        sobrenome: sobrenome.trim(),
        email: email.trim(),
        senha: md5(senha.trim()),
        tipo_cadastro: parseInt(tipo_cadastro),
        documento: documento.trim(),
        cadastrado: now,
        alterado: now,
      },
    })
    .then((e) => {
      return res.status(200).send({
        codigo: e.codigo,
        nome: e.nome,
        sobrenome: e.sobrenome,
        email: e.email,
        cadastrado: e.cadastrado,
        tipo_cadastro: e.tipo_cadastro,
        token: "Bearer " + GenerateToken({ codigo: e.codigo }),
      });
    })
    .catch((err) => {
      return res.status(500).send("Ocorreu um erro inesperado.");
    });
});

rota.post("/api/v1/acesso", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res
      .status(400)
      .send("Solicitação Incorreta. Por favor valide os campos.");
  }

  if (!validator.validate(email.trim())) {
    return res.status(400).send("O e-mail informado é inválido.");
  }

  if (senha.length < 6) {
    return res.status(400).send("A senha deve conter no mínimo 6 caractéres.");
  }

  const validaUsuario = await prisma.usuario.findFirst({
    where: { email: email.trim(), senha: md5(senha.trim()) },
  });

  if (!validaUsuario) {
    return res.status(404).send("E-mail e/ou senha incorretos.");
  }

  return res.status(200).send({
    codigo: validaUsuario.codigo,
    nome: validaUsuario.nome,
    sobrenome: validaUsuario.sobrenome,
    email: validaUsuario.email,
    tipo_cadastro: validaUsuario.tipo_cadastro,
    cadastrado: validaUsuario.cadastrado,
    token: "Bearer " + GenerateToken({ codigo: validaUsuario.codigo }),
  });
});

module.exports = rota;
