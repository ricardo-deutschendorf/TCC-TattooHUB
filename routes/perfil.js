var express = require("express");
var router = express.Router();
var Tatuador = require("../models/Usuario"); // Ajuste o caminho se necessário

// Rota para acessar o perfil
router.get("/", function (req, res, next) {
  // Busca o usuário logado
  const userId = req.session.passport.user.id;

  // Busca os tatuadores
  Tatuador.findAll({ where: { tipo: "tatuador" } })
    .then((tatuadores) => {
      // Renderiza a view passando o usuário logado e a lista de tatuadores
      res.render("perfil", { title: "Perfil", tatuadores, userId });
    })
    .catch((err) => {
      console.error(err); // Log de erro
      res.render("perfil", { title: "Perfil", tatuadores: [], userId });
    });
});

module.exports = router;