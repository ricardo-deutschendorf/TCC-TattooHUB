const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Imagem extends Model {}

Imagem.init({
  imagen: {
    type: DataTypes.STRING,
    allowNull: false
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuarios', // Garanta que isso corresponde ao nome correto da tabela no banco de dados
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Imagem',
  tableName: 'imagem' // Nome da tabela no banco de dados
});

module.exports = Imagem;
