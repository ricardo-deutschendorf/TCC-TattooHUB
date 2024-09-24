var express = require("express");
var router = express.Router();
var Tatuador = require("../models/Usuario"); // Certifique-se de que o caminho está correto

router.get("/", function (req, res, next) {
  Tatuador.findAll({ where: { tipo: "tatuador" } }) // Busca todos os tatuadores
    .then((tatuadores) => {
      res.render("menu", { title: "Express", tatuadores }); // Passa tatuadores para o EJS
    })
    .catch((err) => {
      console.error(err); // Log de erro
      res.render("menu", { title: "Express", tatuadores: [] }); // Passa um array vazio em caso de erro
    });
});

module.exports = router;
