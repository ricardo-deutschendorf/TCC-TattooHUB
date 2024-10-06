const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const Usuario = require("../models/Usuario");
const { Op } = require("sequelize");

// Rota para renderizar a página de chats ativos
router.get("/", async function (req, res) {
  res.render("chatAtivo", { title: "Chats Ativos" });
});

// Rota para buscar os chats ativos
router.get("/buscaChatsAtivos", async function (req, res) {
  try {
    const usuario_logado = req.session.passport.user.id;

    const chatsAtivos = await Chat.findAll({
      where: {
        [Op.or]: [
          { enviou_id: usuario_logado },
          { recebeu_id: usuario_logado }
        ]
      },
      include: [
        {
          model: Usuario,
          as: "enviou",
          attributes: ["id", "nome", "nome_artistico", "imagem"],
        },
        {
          model: Usuario,
          as: "recebeu",
          attributes: ["id", "nome", "nome_artistico", "imagem"],
        }
      ],
      order: [["id", "DESC"]],
      raw: false, // Ensure raw is set to false to get Sequelize instances
    });

    console.log(JSON.stringify(chatsAtivos, null, 2)); // Log the result to debug

    const uniqueChats = {};
    chatsAtivos.forEach((chat) => {
      const outroUsuario = chat.enviou_id === usuario_logado ? chat.recebeu : chat.enviou;
      if (!uniqueChats[outroUsuario.id]) {
        uniqueChats[outroUsuario.id] = {
          usuario: outroUsuario,
          mensagem: chat.mensagem,
        };
      } else {
        // Atualiza a mensagem mais recente
        uniqueChats[outroUsuario.id].mensagem = chat.mensagem;
      }
    });

    const retorno = Object.values(uniqueChats).map((chat) => {
      const outroUsuario = chat.usuario;
      const nomeExibido = outroUsuario.nome_artistico || outroUsuario.nome;
      return `
        <div class='chat-ativo'>
          <img class='avatar' src='/imagens/${outroUsuario.imagem}' alt='Avatar'>
          <div class='chat-info'>
            <p><strong>${nomeExibido}</strong></p>
            <p>${chat.mensagem}</p>
            <form method="POST" action="/chat">
              <input type="hidden" name="idUser" value="${outroUsuario.id}" />
              <button type="submit" class="botaozika">Ir para o chat</button>
            </form>
          </div>
        </div>`;
    }).join("");

    res.send(retorno);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar chats ativos");
  }
});

module.exports = router;