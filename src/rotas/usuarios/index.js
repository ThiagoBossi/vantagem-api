const rota = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const md5 = require("md5");

rota.post("/api/v1/registro", async (req, res) => {
  const { nome, sobrenome, email, senha, tipo_cadastro, documento } = req.body;

  var now = new Date();

  if (!nome || !sobrenome || !email || !senha || !tipo_cadastro || !documento) {
    return res
      .status(400)
      .send("Solicitação Incorreta. Por favor valide os campos.");
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
      return res.status(200).send(e);
    })
    .catch((err) => {
      return res.status(500).send("Ocorreu um erro inesperado.");
    });
});

module.exports = rota;
