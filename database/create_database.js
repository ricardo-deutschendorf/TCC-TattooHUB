// create_database.js
var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Conectado!");

  var createDbSql = "CREATE DATABASE IF NOT EXISTS tattoohub";
  con.query(createDbSql, function (err, result) {
    if (err) throw err;

    if (result.warningCount === 0) {
      console.log("Base de dados criada");
    } else {
      console.log("Erro ao criar o banco de dados");
    }

    // Conectar ao banco de dados criado
    con.changeUser({ database: 'tattoohub' }, function (err) {
      if (err) throw err;

      // Criar tabela Comentarios
      var createTableSql = `
        CREATE TABLE IF NOT EXISTS Comentarios (
          id INT AUTO_INCREMENT PRIMARY KEY,
          usuarioId INT NOT NULL,
          texto VARCHAR(255) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (usuarioId) REFERENCES Usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE
        )
      `;
      con.query(createTableSql, function (err, result) {
        if (err) throw err;
        console.log("Tabela Comentarios criada");
        con.end();
      });
    });
  });
});