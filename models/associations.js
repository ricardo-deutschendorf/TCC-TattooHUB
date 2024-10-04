// associations.js
const Usuario = require('./Usuario');
const Chat = require("./Chat");
const Tatuagem = require("./Tatuagem");
const Comentario = require('./Comentario');

Usuario.hasMany(Chat, { foreignKey: "enviou_id"});
Usuario.hasMany(Chat, { foreignKey: "recebeu_id"});

Chat.belongsTo(Usuario, { foreignKey: "enviou_id"});
Chat.belongsTo(Usuario, { foreignKey: "recebeu_id",});

Usuario.hasMany(Tatuagem, { foreignKey: "tatuador"});
Tatuagem.belongsTo(Usuario, { foreignKey: "tatuador"});

Usuario.hasMany(Comentario, { foreignKey: 'usuarioId' });
Comentario.belongsTo(Usuario, { foreignKey: 'usuarioId' });

module.exports = {
    Usuario,
    Chat,
    Tatuagem,
    Comentario
};
