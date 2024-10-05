  const express = require('express');
  const router = express.Router();
  const Usuario = require('../models/Usuario');
  const Comentario = require('../models/comentarios');
  const createError = require('http-errors');
  
  // Rota para exibir o perfil do tatuador
  router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    console.log(`ID recebido: ${id}`); // Log para verificar o ID recebido
  
    try {
      const tatuador = await Usuario.findByPk(id);
      if (!tatuador) {
        console.log(`Tatuador com ID ${id} não encontrado`); // Log para verificar se o tatuador foi encontrado
        return next(createError(404, 'Tatuador não encontrado'));
      }
  
      try {
        const comentarios = await Comentario.findAll({ where: { usuarioId: id } });
        // Renderiza a view do perfil com os dados do tatuador e comentários
        res.render('perfil', { 
          title: 'Perfil', 
          usuario: tatuador, // Passa o tatuador como usuario
          nome_artistico: tatuador.nome_artistico, // Passa o nome artístico do tatuador
          usuarioNome: tatuador.nome, // Passa o nome do tatuador
          estilo: tatuador.estilo, // Passa o estilo do tatuador
          comentarios, // Passa a variável comentarios para a view
          usuarioLogado: req.session.usuario // Passa o usuário logado para a view
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