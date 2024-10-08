  const express = require('express');
  const router = express.Router();
  const Usuario = require('../models/Usuario');
  const Comentario = require('../models/comentarios');
  const createError = require('http-errors');
  
  // Rota para exibir o perfil do tatuador
  router.get('/:id', async (req, res, next) => {
    const id = parseInt(req.params.id, 10); // Ensure id is an integer
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
          descricao: tatuador.descricao, // Passa a descrição do tatuador
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
  
  // Rota para atualizar a descrição do perfil
  router.post('/:id/descricao', async (req, res, next) => {
    const id = parseInt(req.params.id, 10); // Ensure id is an integer
    const { descricao } = req.body;
  
    if (req.session.usuario.id !== id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
  
    try {
      const tatuador = await Usuario.findByPk(id);
      if (!tatuador) {
        return res.status(404).json({ error: 'Tatuador não encontrado' });
      }
  
      // Atualize a descrição e salve a instância
      await Usuario.update({ descricao }, { where: { id } });
  
      res.json({ descricao });
    } catch (err) {
      console.error('Erro ao atualizar a descrição:', err);
      res.status(500).json({ error: 'Erro ao atualizar a descrição' });
    }
  });
  
  module.exports = router;