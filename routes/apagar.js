router.post("/apagar/:id", function (req, res) {
    const tatuadorId = req.params.id;
    const currentUserId = req.user.id; // Substitua com o ID do usuário logado
    
    Tatuador.findByPk(tatuadorId).then(tatuador => {
      if (tatuador.created_by === currentUserId) {
        Tatuador.destroy({
          where: {
            id: tatuadorId
          }
        }).then(() => {
          res.redirect("/listar"); // Redireciona para a lista de tatuadores após a exclusão
        }).catch(err => {
          console.error(err);
          res.redirect("/listar?erro=1"); // Redireciona com erro se algo der errado
        });
      } else {
        res.redirect("/listar?erro=2"); // Redireciona com erro de permissão
      }
    }).catch(err => {
      console.error(err);
      res.redirect("/listar?erro=1"); // Redireciona com erro se algo der errado
    });
  });