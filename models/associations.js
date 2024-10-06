const Usuario = require('./Usuario');
const Chat = require("./Chat");
const Comentarios = require("./comentarios");

// Definição das associações entre os modelos
Usuario.hasMany(Chat, { foreignKey: "enviou_id", as: "enviou" });
Usuario.hasMany(Chat, { foreignKey: "recebeu_id", as: "recebeu" });

Chat.belongsTo(Usuario, { foreignKey: "enviou_id", as: "enviou" });
Chat.belongsTo(Usuario, { foreignKey: "recebeu_id", as: "recebeu" });

Usuario.hasMany(Comentarios, { foreignKey: "usuarioId" });
Comentarios.belongsTo(Usuario, { foreignKey: "usuarioId" });

module.exports = {
    Usuario,
    Chat,
    Comentarios
};