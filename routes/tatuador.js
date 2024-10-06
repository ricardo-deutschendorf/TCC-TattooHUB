const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Comentario = require('../models/comentarios');
const createError = require('http-errors');

// Rota para listar todos os tatuadores
router.get('/', async (req, res, next) => {
  try {
    const tatuadores = await Usuario.findAll({ where: { tipo: 'tatuador' } });
    res.render('tatuadores', { title: 'Tatuadores Recentes', tatuadores, usuario: req.session.usuario });
  } catch (err) {
    console.error('Erro ao buscar os tatuadores:', err);
    next(createError(500, 'Erro ao buscar os tatuadores'));
  }
});

// Rota para exibir o perfil do tatuador
router.get('/:id', async (req, res, next) => {
  const id = parseInt(req.params.id, 10); // Converte o ID para um número inteiro
  if (isNaN(id)) {
    console.log(`ID inválido: ${req.params.id}`); // Log para verificar o ID inválido
    return next(createError(400, 'ID inválido'));
  }

  try {
    const tatuador = await Usuario.findByPk(id);
    if (!tatuador) {
      console.log(`Tatuador com ID ${id} não encontrado`); // Log para verificar se o tatuador foi encontrado
      return next(createError(404, 'Tatuador não encontrado'));
    }

    try {
      const comentarios = await Comentario.findAll({ where: { usuarioId: id } });
      console.log(`Comentários encontrados: ${comentarios.length}`); // Log para verificar a quantidade de comentários encontrados
      // Renderiza a view do perfil com os dados do tatuador e comentários
      res.render('perfil', { 
        title: 'Perfil', 
        tatuador, 
        usuario: req.session.usuario, 
        usuarioNome: req.session.usuario.nome,
        comentarios // Passa a variável comentarios para a view
      });
    } catch (err) {
      console.error('Erro ao buscar os comentários:', err);
      next(createError(500, 'Erro ao buscar os comentários'));
    }
  } catch (err) {
    console.error('Erro ao buscar o tatuador:', err);
    next(createError(500, 'Erro ao buscar o tatuador'));
  }

});

module.exports = router;