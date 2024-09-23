const bcrypt = require("bcryptjs");
const express = require("express");
const formidable = require("formidable");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const Usuario = require("../models/Usuario");
var saltRounds = 10;

router.get("/", function (req, res) {
  res.render("registro", {
    title: "cadastro",
  });
});

router.post("/", async function (req, res) {
  try {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.redirect("/cadastro?erro=1");
      }

      const senha = fields["senha"][0];
      const rsenha = fields["rsenha"][0];
      const estilo = fields["estilo"][0];
      const estudio = fields["estudio"][0];
      const nome_artistico = fields["nome_artistico"][0];

      if (
        senha.length == 0 ||
        fields.email[0].length == 0 ||
        fields.nome[0].length == 0
      ) {
        return res.redirect("/cadastro?erro=5");
      }
      if (senha !== rsenha) {
        console.error("As senhas não coincidem.");
        return res.redirect("/cadastro?erro=2");
      }

      const existeUser = await Usuario.findOne({
        where: { email: fields["email"][0] },
      });
      if (existeUser) {
        console.error("Email já cadastrado.");
        return res.redirect("/cadastro?erro=3");
      }

      const hashedPassword = await bcrypt.hash(senha, saltRounds);

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
          return res.redirect("/cadastro?erro=4");
        }

        const nomeimg = hash + "." + files.imagem[0].mimetype.split("/")[1];
        const newpath = path.join(__dirname, "../public/imagens/", nomeimg);

        fs.rename(files.imagem[0].filepath, newpath, function (err) {
          if (err) {
            console.error(err);
            return res.redirect("/cadastro?erro=1");
          }
          console.log("Arquivo de imagem enviado com sucesso");
          if (fields["tipo"][0] === "tatuador") {
            Usuario.create({
              nome: fields["nome"][0],
              senha: hashedPassword,
              email: fields["email"][0],
              imagem: nomeimg,
              tipo: fields["tipo"][0],
              estilo: estilo,
              estudio: estudio,
              nome_artistico: nome_artistico,
            });
          } else {
            Usuario.create({
              nome: fields["nome"][0],
              senha: hashedPassword,
              email: fields["email"][0],
              imagem: nomeimg,
              tipo: fields["tipo"][0],
              estilo: null,
              estudio: null,
              nome_artistico: null,
            });
          }
          return res.redirect("/login?erro=0");
        });
      } else {
        console.log("Nenhum arquivo de imagem foi enviado");

        if (fields["tipo"][0] === "tatuador") {
          Usuario.create({
            nome: fields["nome"][0],
            senha: hashedPassword,
            email: fields["email"][0],
            imagem: null,
            tipo: fields["tipo"][0],
            estilo: estilo,
            estudio: estudio,
            nome_artistico: nome_artistico,
          });
        } else {
          Usuario.create({
            nome: fields["nome"][0],
            senha: hashedPassword,
            email: fields["email"][0],
            imagem: null,
            tipo: fields["tipo"][0],
            estilo: null,
            estudio: null,
            nome_artistico: null,
          });
        }

        return res.redirect("/login?erro=0");
      }
    });
  } catch (err) {
    console.error(err);
    res.redirect("/cadastro?erro=1");
  }
});

module.exports = router;
