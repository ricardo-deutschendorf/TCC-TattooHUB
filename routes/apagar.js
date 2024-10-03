router.post("/apagar/:id", isAuthenticated, function (req, res) {
  const tatuadorId = req.params.id; // Obtém o ID do tatuador a ser apagado
  const currentUserId = req.user.id; // ID do usuário logado

  Tatuador.findByPk(tatuadorId).then(tatuador => {
    if (!tatuador) {
      return res.redirect("/tatuador/listar?erro=2"); // Tatuador não encontrado
    }

    if (tatuador.created_by !== currentUserId) {
      return res.redirect("/tatuador/listar?erro=3"); // Permissão negada
    }

    Tatuador.destroy({
      where: {
        id: tatuadorId
      }
    })
      .then(deleted => {
        if (deleted) {
          res.redirect("/tatuador/listar"); // Redireciona se a exclusão foi bem-sucedida
        } else {
          res.redirect("/tatuador/listar?erro=2"); // Tatuador não encontrado
        }
      })
      .catch(err => {
        console.error(err);
        res.redirect("/tatuador/listar?erro=1"); // Redireciona com erro se algo der errado
      });
  });
});