const database = require("../db");
const Sequelize = require("sequelize");

const Tatuagem = database.define("tatuagens", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  imagem: { type: Sequelize.STRING, allowNull: false },
  descricao: { type: Sequelize.STRING, allowNull: false },
  preco: { type: Sequelize.FLOAT, allowNull: false },
  tatuador: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "usuarios",
      key: "id",
    },
  },
});

module.exports = Tatuagem;
