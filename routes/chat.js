const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");
const Chat = require("../models/Chat");
const Imagem = require("../models/Imagem"); // Adicione esta linha
const { Op } = require("sequelize");

// Rota para obter informações do tatuador e renderizar o chat
router.post("/", async function (req, res) {
  try {
    req.session.amigoid = req.body["idUser"];
    const amigoid = req.body["idUser"];

    console.log("Amigo: " + amigoid);

    // Consulta para obter informações do tatuador
    const tatuador = await Usuario.findByPk(amigoid);
    const imagens = await Imagem.findAll({ where: { usuario_id: amigoid } });

    if (tatuador) {
      res.render("chat", {
        amigoid: amigoid,
        title: "Chat",
        imagem: tatuador.imagem,
        nome: tatuador.nome_artistico,
        estilo: tatuador.estilo,
        descricao: tatuador.descricao,
        imagens: imagens // Passa as imagens para a view
      });
    } else {
      res.status(404).send("Tatuador não encontrado");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

// Rota para enviar uma mensagem
router.post("/recebemensagens", async function (req, res) {
  try {
    const usuario_logado = req.session.passport.user.id;
    const amigo = req.session.amigoid;

    const mensagem = req.body["mensagem"];
    await Chat.create({
      enviou_id: usuario_logado,
      recebeu_id: amigo,
      mensagem: mensagem,
      lida: 0,
    });

    console.log("Mensagem salva");
    res.send("Mensagem salva");
  } catch (err) {
    console.error(err);
  }
});

// Rota para buscar as mensagens
router.get("/buscamensagens", async function (req, res) {
  try {
    // Implementação da busca de mensagens
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

module.exports = router;