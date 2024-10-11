const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");
const Chat = require("../models/Chat");
const Imagem = require("../models/Imagem");
const { Op } = require("sequelize");

// Rota para obter informações do tatuador e renderizar o chat
router.post("/", async function (req, res) {
  try {
    req.session.amigoid = req.body["idUser"];
    const amigoid = req.body["idUser"];

    console.log("Amigo: " + amigoid);

    // Consulta para obter informações do tatuador
    const tatuador = await Usuario.findByPk(amigoid);
    const imagens = await Imagem.findAll({ where: { usuario_id: amigoid } }); // Adicione esta linha

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
    res.status(500).send("Erro ao salvar mensagem");
  }
});

// Rota para buscar as mensagens
router.get("/buscamensagens", async function (req, res) {
  try {
    const usuario_logado = req.session.passport.user.id;
    const amigo = req.session.amigoid;

    console.log("Amigo: " + amigo);

    // Consulta para obter a imagem do amigo
    const amigoData = await Usuario.findByPk(amigo);
    const foto_amigo = amigoData.imagem;

    const mensagens = await Chat.findAll({
      where: {
        [Op.or]: [
          { enviou_id: usuario_logado, recebeu_id: amigo },
          { enviou_id: amigo, recebeu_id: usuario_logado },
        ],
      },
      order: [["id", "ASC"]],
      limit: 500,
    });

    if (mensagens.length > 0) {
      await Chat.update(
        { lida: 1 },
        {
          where: {
            id: { [Op.lte]: mensagens[mensagens.length - 1].id },
            recebeu_id: usuario_logado,
          },
        }
      );
    } else {
      console.log("Não há mensagens disponíveis");
    }

    const retorno = mensagens.map((dados) => {
      if (usuario_logado == dados.enviou_id) {
        return `
          <div class='media media-chat media-chat-reverse'>
            <img class='avatar' src='/imagens/${req.session.passport.user.imagem}'>
            <div class='media-body'>
              <p>${dados.mensagem}</p>
            </div>
          </div>
          <div class='media media-meta-day'></div>`;
      } else {
        return `
          <div class='media media-chat'>
            <img class='avatar' src='/imagens/${foto_amigo}'>
            <div class='media-body'>
              <p>${dados.mensagem}</p>
            </div>
          </div>
          <div class='media media-meta-day'></div>`;
      }
    }).join("");

    res.send(retorno);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar mensagens");
  }
});

module.exports = router;