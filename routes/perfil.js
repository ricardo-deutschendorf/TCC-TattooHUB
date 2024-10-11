const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Comentario = require('../models/comentarios');
const Imagem = require('../models/Imagem');
const createError = require('http-errors');

// Rota para exibir o perfil do tatuador
router.get('/:id', async (req, res, next) => {
  const id = parseInt(req.params.id, 10); // Verifica se o ID é um número inteiro
  console.log(`ID recebido: ${id}`); // Log para verificar o ID recebido

  try {
    // Busca o tatuador pelo ID
    const tatuador = await Usuario.findByPk(id);

    if (!tatuador) {
      console.log(`Tatuador com ID ${id} não encontrado`);
      return next(createError(404, 'Tatuador não encontrado'));
    }

    try {
      // Busca os comentários associados ao tatuador
      const comentarios = await Comentario.findAll({ where: { usuarioId: id } });

      // Busca as imagens associadas ao tatuador
      const imagens = await Imagem.findAll({ where: { usuario_id: id } });

      // Renderiza a view do perfil com os dados do tatuador, comentários e imagens
      res.render('perfil', { 
        title: 'Perfil', 
        usuario: tatuador, // Passa o tatuador como usuário
        nome_artistico: tatuador.nome_artistico, // Nome artístico
        usuarioNome: tatuador.nome, // Nome do tatuador
        estilo: tatuador.estilo, // Estilo de arte do tatuador
        descricao: tatuador.descricao, // Descrição do tatuador
        comentarios, // Lista de comentários
        imagens, // Lista de imagens do tatuador
        usuarioLogado: req.session.usuario // Usuário logado
      });
    } catch (err) {
      console.error('Erro ao buscar os comentários e imagens:', err);
      next(createError(500, 'Erro ao buscar os comentários e imagens'));
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