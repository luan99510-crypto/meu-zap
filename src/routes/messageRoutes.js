const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const messageController = require('../controllers/messageController');

router.get('/contatos', auth, messageController.getContatos);
router.post('/contatos/adicionar', auth, messageController.adicionarContato);
router.get('/conversa/:contatoId', auth, messageController.getConversa);
router.post('/enviar', auth, messageController.enviarMensagem);

module.exports = router;