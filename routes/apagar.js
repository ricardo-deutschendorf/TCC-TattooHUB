router.post("/apagar/:id", function (req, res) {
    Tatuador.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        res.redirect("/listar"); // Redireciona para a lista de tatuadores após a exclusão
    }).catch(err => {
        console.error(err);
        res.redirect("/listar?erro=1"); // Redireciona com erro se algo der errado
    });
});