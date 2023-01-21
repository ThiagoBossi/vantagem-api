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

rota.put("/api/v1/usuarios/:codigo/alteraSenha", async (req, res) => {
  const { codigo } = req.params;
  const { senha_antiga, senha_nova, confirma_senha } = req.body;

  var now = new Date();
  now.setHours(now.getHours() - 3);

  if (!codigo) {
    return res.status(400).send("Nenhum código informado.");
  }

  if (!senha_antiga || !senha_nova || !confirma_senha) {
    return res.status(400).send("Solicitação Incorreta.");
  }

  const existe_usuario = await prisma.usuario.findFirst({
    where: { codigo: parseInt(codigo) },
  });

  if (!existe_usuario) {
    return res.status(404).send("Nenhuma conta com o código informado.");
  }

  const usuario_senha = await prisma.usuario.findFirst({
    where: { codigo: parseInt(codigo), senha: md5(senha_antiga) },
  });

  if (!usuario_senha) {
    return res.status(401).send("A senha antiga é invalida.");
  }

  if (senha_nova.trim() !== confirma_senha.trim()) {
    return res.status(401).send("As senhas não coincidem.");
  }

  if (senha_nova.trim().length < 6) {
    return res
      .status(401)
      .send("As senhas devem conter no minimo 6 caracteres.");
  }

  await prisma.usuario
    .update({
      where: { codigo: parseInt(codigo) },
      data: { senha: md5(senha_nova.trim()), alterado: now },
    })
    .then(() => {
      return res.status(200).send("Senha alterada com sucesso!");
    })
    .catch(() => {
      return res
        .status(500)
        .send("Ocorreu um erro inesperado ao alterar a senha da conta.");
    });
});

rota.put("/api/v1/usuarios/:codigo/alteraEmail", async (req, res) => {
  const { codigo } = req.params;
  const { email_antigo, email_novo, confirma_email } = req.body;

  var now = new Date();
  now.setHours(now.getHours() - 3);

  if (!codigo) {
    return res.status(400).send("Nenhum código informado.");
  }

  if (!email_antigo || !email_novo || !confirma_email) {
    return res.status(400).send("Solicitação Incorreta.");
  }

  const existe_usuario = await prisma.usuario.findFirst({
    where: { codigo: parseInt(codigo) },
  });

  if (!existe_usuario) {
    return res.status(404).send("Nenhuma conta com o código informado.");
  }

  const retorno_email = await prisma.conta.findFirst({
    where: { NOT: { codigo: parseInt(codigo) }, email: email_novo.trim() },
  });

  if (retorno_email) {
    return res.status(401).send("Já existe uma conta com este e-mail.");
  }

  const usuario_email = await prisma.usuario.findFirst({
    where: { codigo: parseInt(codigo), email: email_antigo },
  });

  if (!usuario_email) {
    return res.status(401).send("O e-mail antigo é invalido.");
  }

  if (email_novo.trim() !== confirma_email.trim()) {
    return res.status(401).send("Os e-mails não coincidem.");
  }

  await prisma.usuario
    .update({
      where: { codigo: parseInt(codigo) },
      data: { email: email_novo.trim(), alterado: now },
    })
    .then(() => {
      return res.status(200).send("E-mail alterado com sucesso!");
    })
    .catch(() => {
      return res
        .status(500)
        .send("Ocorreu um erro inesperado ao alterar o e-mail da conta.");
    });
});

rota.put("/api/v1/usuarios/:codigo/alteraInformacao", async (req, res) => {
  const { codigo } = req.params;
  const { nome, sobrenome, celular, data_nascimento, sobre_mim } = req.body;

  if (!codigo) {
    return res.status(400).send("Nenhum código informado.");
  }

  if (!nome || !sobrenome || !celular || !data_nascimento || !sobre_mim) {
    return res.status(400).send("Solicitação Incorreta.");
  }

  var now = new Date();
  var data = new Date(data_nascimento);
  now.setHours(now.getHours() - 3);

  const usuario = await prisma.usuario.findFirst({
    where: { codigo: parseInt(codigo) },
  });

  if (!usuario) {
    return res.status(400).send("Nenhuma conta com o código informado.");
  }

  await prisma.usuario
    .update({
      where: {
        codigo: parseInt(codigo),
      },
      data: {
        nome: nome.trim(),
        sobrenome: sobrenome.trim(),
        celular: celular.trim(),
        data_nascimento: data,
        sobre_mim: sobre_mim.trim(),
        alterado: now,
      },
    })
    .then(() => {
      return res.status(200).send("Alterado com suceso!");
    })
    .catch((e) => {
      console.log(e);
      return res
        .status(200)
        .send(
          "Ocorreu um erro inesperado ao tentar atualizar as informações da conta."
        );
    });
});

module.exports = rota;
