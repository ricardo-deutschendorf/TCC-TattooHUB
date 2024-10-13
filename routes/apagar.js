const express = require('express');
const Usuario = require('../models/Usuario'); // Importação do modelo Usuario
const Imagem = require('../models/Imagem'); // Importação do modelo Imagem
const { isAuthenticated } = require('../auth'); // Importação da função isAuthenticated

const router = express.Router();

router.post("/:id", isAuthenticated, async (req, res) => { // Rota para apagar usuário
  const usuarioId = parseInt(req.params.id, 10); // Obtém o ID do usuário a ser apagado e garante que é um número
  const currentUserId = req.user.id; // ID do usuário logado
  const referer = req.headers.referer || '/'; // Obtém a URL de referência ou define como raiz

  console.log(`Tentando apagar usuário com ID: ${usuarioId} pelo usuário logado com ID: ${currentUserId}`);

  try {
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      console.log(`Erro: Usuário com ID: ${usuarioId} não encontrado`);
      return res.redirect(`${referer}?erro=2`); // Usuário não encontrado
    }

    // Verifica se o campo created_by existe e se corresponde ao currentUserId
    if (usuario.created_by !== currentUserId) {
      console.log(`Erro: Usuário logado com ID: ${currentUserId} não tem permissão para apagar o usuário com ID: ${usuarioId}`);
      return res.redirect(`${referer}?erro=3`); // Permissão negada
    }

    console.log(`Usuário encontrado. Tentando apagar o usuário com ID: ${usuarioId}`);

    // Delete related records in the `imagem` table
    await Imagem.destroy({
      where: {
        usuario_id: usuarioId
      }
    });

    // Delete the user record
    const deleted = await Usuario.destroy({
      where: {
        id: usuarioId
      }
    });

    if (deleted) {
      console.log(`Usuário com ID: ${usuarioId} apagado com sucesso`);
      
      // Destroy the session to log out the user
      req.session.destroy(err => {
        if (err) {
          console.error(`Erro ao tentar destruir a sessão do usuário com ID: ${currentUserId}`, err);
          return res.redirect(`${referer}?erro=1`); // Redireciona com erro se algo der errado
        }

        res.clearCookie('connect.sid'); // Limpa o cookie de sessão
        res.redirect('/login'); // Redireciona para a página de login após deslogar
      });
    } else {
      console.log(`Erro: Usuário com ID: ${usuarioId} não encontrado para exclusão`);
      res.redirect(`${referer}?erro=2`); // Usuário não encontrado
    }
  } catch (err) {
    console.error(`Erro ao tentar apagar o usuário com ID: ${usuarioId}`, err.message);
    console.error(err); // Log completo do erro
    res.redirect(`${referer}?erro=1`); // Redireciona com erro se algo der errado
  }
});

module.exports = router;