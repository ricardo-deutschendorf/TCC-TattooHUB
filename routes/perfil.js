var express = require("express");
var router = express.Router();
var Tatuador = require("../models/Usuario"); // Ajuste o caminho se necessário

router.post("/", function (req, res, next) {
  const idUser = req.body.idUser;

  // Busca o tatuador pelo ID enviado
  Tatuador.findByPk(idUser)
    .then((tatuador) => {
      if (!tatuador) {
        return res.status(404).render('error', { message: 'Tatuador não encontrado' });
      }
      // Renderiza a view do perfil com os dados do tatuador
      res.render("perfil", { title: "Perfil", tatuador });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).render('error', { message: 'Erro ao buscar o tatuador' });
    });
});

module.exports = router;