const rota = require("express").Router();

rota.get('/api/v1/inicio/:nome', async(requisicao, resposta) => {
    const nome = requisicao.params.nome;

    if (!nome) {
        return resposta.status(400).send("O código informado não foi encontrado...");
    }

    return resposta.status(200).send("Olá! Seja bem-vindo, " + nome + ".");
});

rota.get('/api/v1/inicio', async(requisicao, resposta) => {
    const {email, senha} = requisicao.body;

    if (!email || !senha) {
        return resposta.status(400).send("Solicitação incorreta...");
    }

    return resposta.status(200).send("" + email + "" + senha);
});


module.exports = rota;