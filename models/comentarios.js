const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Comentario = sequelize.define('Comentario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  usuarioNome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  texto: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
});

module.exports = Comentario;