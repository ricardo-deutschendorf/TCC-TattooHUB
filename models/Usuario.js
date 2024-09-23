const database = require("../db");
const Sequelize = require("sequelize");
const Chat = require("./Chat");
const Tatuagem = require("./Tatuagem");

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
});

Usuario.hasMany(Chat, { foreignKey: "enviou_id"});
Usuario.hasMany(Chat, { foreignKey: "recebeu_id"});

Chat.belongsTo(Usuario, { foreignKey: "enviou_id"});
Chat.belongsTo(Usuario, { foreignKey: "recebeu_id",});

Usuario.hasMany(Tatuagem, { foreignKey: "tatuador"});
Tatuagem.belongsTo(Usuario, { foreignKey: "tatuador"});


module.exports = Usuario;
