var express = require("express");
var router = express.Router();
var Tatuador = require("../models/Usuario");
var Tatuagem = require("../models/Tatuagem");
var formidable = require("formidable");
var crypto = require("crypto");
var path = require("path");
var fs = require("fs");

router.get("/cadastroTatuagem", function (req, res, next) {
  res.render("cadastroTatuagem", {});
});

router.get("/listar", function (req, res, next) {
  // Encontre apenas com o tipo tatuador
  Tatuador.findAll({ where: { tipo: "tatuador" } }).then((tatuadores) => {
    res.render("tatuadores", { tatuadores });
  });
});

router.post("/cadastroTatuagem", async function (req, res, next) {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.redirect("/cadastroTatuagem?erro=1");
      }

      const imagem = files["imagem"][0];

      if (imagem.size == 0) {
        return res.redirect("/cadastroTatuagem?erro=5");
      }

      if (files.imagem[0] && files.imagem[0].size > 0) {
        const file = files.imagem[0];

        const hash = crypto
          .createHash("md5")
          .update(Date.now().toString())
          .digest("hex");

        console.log(file.mimetype);
        const fileExt = file.mimetype.toLowerCase();

        if (
          ![
            "image/jpg",
            "image/webp",
            "image/jpeg",
            "image/png",
            "image/gif",
          ].includes(fileExt)
        ) {
          console.log("O arquivo de imagem não possui uma extensão válida");
          return res.redirect("/cadastroTatuagem?erro=4");
        }

        const nomeimg = hash + "." + files.imagem[0].mimetype.split("/")[1];
        const newpath = path.join(
          __dirname,
          "../public/imagens/tatuagens/",
          nomeimg
        );

        fs.rename(files.imagem[0].filepath, newpath, function (err) {
          if (err) {
            console.error(err);
            return res.redirect("/cadastroTatuagem?erro=1");
          }
          console.log("Arquivo de imagem enviado com sucesso");
          Tatuagem.create({
            imagem: nomeimg,
            descricao: fields.descricao[0],
            preco: fields.preco[0],
            tatuador: req.session.passport.user.id,
          });
          return res.redirect("/");
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.redirect("/cadastroTatuagem?erro=1");
  }
});

router.get("/:id", function (req, res, next) {
  Tatuador.findByPk(req.params.id).then((tatuador) => {
    Tatuagem.findAll({ where: { tatuador: req.params.id } }).then((tatuagens) => {
      res.render("paginaTatuador", { tatuador, tatuagens });
    });
  });
});

router.post("/apagar/:id", function (req, res) {
  const tatuadorId = req.params.id; // Obtém o ID do tatuador a ser apagado

  Tatuador.destroy({
    where: {
      id: tatuadorId
    }
  })
    .then(deleted => {
      if (deleted) {
        // Redireciona para a lista de tatuadores se a exclusão foi bem-sucedida
        res.redirect("/tatuador/listar");
      } else {
        // Se nenhum tatuador foi encontrado, redirecione com erro
        res.redirect("/tatuador/listar?erro=2"); // Tatuador não encontrado
      }
    })
    .catch(err => {
      console.error(err);
      res.redirect("/tatuador/listar?erro=1"); // Redireciona com erro se algo der errado
    });
});



module.exports = router;
