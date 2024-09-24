var express = require("express");
var router = express.Router();
const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tattoohub",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Conectado!");
});

router.post("/", function (req, res) {
  req.session.amigoid = req.body["idUser"];
  const amigoid = req.body["idUser"];
  console.log("Amigo: " + amigoid);

  // Consulta para obter informações do tatuador
  const sql = "SELECT * FROM usuarios WHERE id = ?";
  con.query(sql, amigoid, (err, result) => {
    if (err) throw err;

    // Supondo que você tenha apenas um resultado
    const tatuador = result[0];
    res.render("chat", {
      amigoid: amigoid,
      title: "Chat",
      imagem: tatuador.imagem,
      nome: tatuador.nome_artistico, // Nome do tatuador
      estilo: tatuador.estilo, // Estilo do tatuador
      descricao: tatuador.descricao // Descrição do tatuador
    });
  });
});

router.post("/recebemensagens", function (req, res) {
  const usuario_logado = req.session.passport.user.id;
  const amigo = req.session.amigoid;

  const sql =
    "INSERT INTO chats (enviou_id, recebeu_id, mensagem, lida) VALUES ?";
  const values = [[usuario_logado, amigo, req.body["mensagem"], 0]];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Número de registros inseridos: " + result.affectedRows);
  });
  res.send("Mensagem salva");
});

router.post("/buscamensagens", function (req, res) {
  const usuario_logado = req.session.passport.user.id;
  const amigo = req.session.amigoid;
  console.log("Amigo: " + amigo);
  let retorno = "";
  
  const sql = "SELECT * FROM usuarios WHERE id = ?";
  con.query(sql, amigo, function (err, result) {
    if (err) throw err;
    
    const foto_amigo = result[0]["imagem"];
    const valores = [usuario_logado, amigo, amigo, usuario_logado];

    const sql2 =
      "SELECT * FROM chats WHERE (enviou_id = ? AND recebeu_id = ?) OR (enviou_id = ? AND recebeu_id = ?) ORDER BY id LIMIT 500;";
    
    con.query(sql2, valores, function (err, mensagens) {
      if (err) throw err;

      if (mensagens.length > 0) {
        const sql3 = "UPDATE chats SET lida = 1 WHERE id <= ? AND recebeu_id = ?";
        const valores = [mensagens[mensagens.length - 1]["id"], usuario_logado];
        con.query(sql3, valores, function (err) {
          if (err) throw err;
        });
      } else {
        console.log("Não há mensagens disponíveis");
      }

      mensagens.forEach(function (dados) {
        if (usuario_logado == dados["enviou_id"]) {
          retorno += `
            <div class='media media-chat media-chat-reverse'>
              <img class='avatar' src=${foto_logado}>
              <div class='media-body'>
                <p>${dados["mensagem"]}</p>
              </div>
            </div>
            <div class='media media-meta-day'></div>`;
        } else {
          retorno += `
            <div class='media media-chat'>
              <img class='avatar' src=${foto_amigo}>
              <div class='media-body'>
                <p>${dados["mensagem"]}</p>
              </div>
            </div>
            <div class='media media-meta-day'></div>`;
        }
      });
      res.send(JSON.stringify(retorno));
    });
  });
});

module.exports = router;
