var express = require("express");
var router = express.Router();
var Tatuador = require("../models/Usuario"); // Ajuste o caminho se necessário
var Comentario = require("../models/Comentario"); // Ajuste o caminho se necessário
var Usuario = require("../models/Usuario"); // Ajuste o caminho se necessário
const createError = require('http-errors');

router.post("/", function (req, res, next) {
  const idUser = req.body.idUser;

  // Busca o tatuador pelo ID enviado
  Tatuador.findByPk(idUser)
    .then((tatuador) => {
      if (!tatuador) {
        return next(createError(404, 'Tatuador não encontrado'));
      }

      // Busca os comentários relacionados ao tatuador, incluindo o nome do usuário
      Comentario.findAll({
        where: { usuarioId: idUser },
        include: [{ model: Usuario, attributes: ['nome'] }]
      })
        .then((comentarios) => {
          // Renderiza a view do perfil com os dados do tatuador e os comentários
          res.render("perfil", { title: "Perfil", tatuador, comentarios, usuarioNome: req.session.usuarioNome });
        })
        .catch((err) => {
          console.error(err);
          next(createError(500, 'Erro ao buscar os comentários'));
        });
    })
    .catch((err) => {
      console.error(err);
      next(createError(500, 'Erro ao buscar o tatuador'));
    });
});


// Rota para adicionar comentário
router.post("/adicionarComentario", function (req, res, next) {
  const { idUser, comentario } = req.body;

  // Busca o usuário pelo ID
  Usuario.findByPk(idUser)
    .then((usuario) => {
      if (!usuario) {
        return next(createError(404, 'Usuário não encontrado'));
      }

      // Cria um novo comentário
      Comentario.create({
        usuarioId: idUser,
        texto: comentario
      })
        .then((novoComentario) => {
          res.json({ success: true, comentario: novoComentario, usuarioNome: usuario.nome });
        })
        .catch((err) => {
          console.error(err);
          next(createError(500, 'Erro ao adicionar comentário'));
        });
    })
    .catch((err) => {
      console.error(err);
      next(createError(500, 'Erro ao buscar o usuário'));
    });
    router.get('/buscarComentarios', async (req, res) => {
      try {
        const comentarios = await Comentario.findAll({
          include: {
            model: Usuario,
            attributes: ['nome']
          }
        });
        res.json({ comentarios: comentarios.map(c => ({ usuarioNome: c.Usuario.nome, texto: c.texto })) });
      } catch (error) {
        console.error('Erro ao buscar comentários:', error);
        res.status(500).json({ error: 'Erro ao buscar comentários' });
      }
    });
});

module.exports = router;