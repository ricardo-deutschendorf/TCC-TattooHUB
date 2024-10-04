const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db'); // Ajuste o caminho para o arquivo correto
const Usuario = require('./Usuario'); // Ajuste o caminho se necessário

const Comentario = sequelize.define('Comentario', {
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario, // Referência ao modelo Usuario
      key: 'id'
    }
  },
  texto: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true // Adiciona campos createdAt e updatedAt automaticamente
});

Comentario.belongsTo(Usuario, { foreignKey: 'usuarioId' });

module.exports = Comentario;