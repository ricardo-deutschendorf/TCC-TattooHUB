// Usuario.js
const database = require("../db");
const { Sequelize, DataTypes } = require('sequelize');

const Usuario = database.define("usuario", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  nome: { type: Sequelize.STRING, allowNull: false },
  senha: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false },
  imagem: { type: Sequelize.STRING, allowNull: true },
  tipo: { type: Sequelize.ENUM("cliente", "tatuador"), allowNull: false },
  estudio: { type: Sequelize.STRING, allowNull: true },
  nome_artistico: { type: Sequelize.STRING, allowNull: true },
  estilo: { type: Sequelize.STRING, allowNull: true },
}, {
  timestamps: false
});

module.exports = Usuario;