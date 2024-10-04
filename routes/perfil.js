var express = require("express");
var router = express.Router();
var Tatuador = require("../models/Usuario"); // Ajuste o caminho se necessário
var Comentario = require("../models/Comentario"); // Ajuste o caminho se necessário
var Usuario = require("../models/Usuario"); // Add this line
const createError = require('http-errors');

router.get("/:id", function (req, res, next) {
  const id = req.params.id;

  // Busca o tatuador pelo ID enviado
  Tatuador.findByPk(id)
    .then((tatuador) => {
      if (!tatuador) {
        return next(createError(404, 'Tatuador não encontrado'));
      }

      // Busca os comentários relacionados ao tatuador, incluindo o nome do usuário
      Comentario.findAll({
        where: { usuarioId: id },
        include: Usuario
      })
        .then((comentarios) => {
          // Renderiza a view do perfil com os dados do tatuador e os comentários
          res.render("perfil", { title: "Perfil", tatuador, comentarios, usuario: req.session.usuario, usuarioNome: req.session.usuarioNome });
        })
        .catch((err) => {
          console.error("Erro ao buscar os comentários:", err);
          next(createError(500, 'Erro ao buscar os comentários'));
        });
    })
    .catch((err) => {
      console.error("Erro ao buscar o tatuador:", err);
      next(createError(500, 'Erro ao buscar o tatuador'));
    });
});
// Rota para adicionar comentário
router.post("/adicionarComentario", function (req, res, next) {
  const { id, comentario } = req.body;

  // Busca o usuário pelo ID
  Usuario.findByPk(id)
    .then((usuario) => {
      if (!usuario) {
        return next(createError(404, 'Usuário não encontrado'));
      }

      // Cria um novo comentário
      Comentario.create({
        usuarioId: id,
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
});


module.exports = router;