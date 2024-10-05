const express = require("express");
const router = express.Router();
const Comentario = require("../models/comentarios");
const Usuario = require("../models/Usuario");
const createError = require('http-errors');

// Rota para adicionar comentários via AJAX
router.post("/adicionar", function (req, res, next) {
  const { usuarioNome, texto, usuarioId } = req.body;
  console.log(`Dados recebidos: usuarioNome=${usuarioNome}, texto=${texto}, usuarioId=${usuarioId}`); // Log para verificar os dados recebidos

  // Verifica se o usuarioId existe na tabela Usuario
  Usuario.findByPk(usuarioId)
    .then((usuario) => {
      if (!usuario) {
        console.log(`Usuário com ID ${usuarioId} não encontrado`);
        return next(createError(404, 'Usuário não encontrado'));
      }

      // Cria um novo comentário
      Comentario.create({ usuarioNome, texto, usuarioId })
        .then((comentario) => {
          // Retorna o comentário criado em formato JSON
          res.json(comentario);
        })
        .catch((err) => {
          console.error("Erro ao adicionar o comentário:", err);
          next(createError(500, 'Erro ao adicionar o comentário'));
        });
    })
    .catch((err) => {
      console.error("Erro ao buscar o usuário:", err);
      next(createError(500, 'Erro ao buscar o usuário'));
    });
});

module.exports = router;