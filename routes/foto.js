const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Usuario = require('../models/Usuario');
const Imagem = require('../models/Imagem'); // Importa o modelo de imagem

// Configuração do multer para armazenar imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/imagens')); // Diretório onde a imagem será salva
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome único para a imagem
  }
});

const upload = multer({ storage: storage });

// Rota para fazer o upload da imagem
router.post('/upload', upload.single('imagem'), async (req, res) => {
  const usuarioId = req.session.usuario.id;

  console.log('Arquivo recebido:', req.file); // Adicione esta linha

  try {
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const imagen = req.file.filename; // A imagem agora deve ser obtida corretamente
    await Imagem.create({ imagen, usuario_id: usuarioId });

    res.json({ imagen });
  } catch (err) {
    console.error('Erro no upload da imagem:', err);
    res.status(500).json({ error: 'Erro ao fazer o upload da imagem' });
  }
});

module.exports = router;
