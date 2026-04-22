const Message = require('../models/Message');
const User = require('../models/User');

exports.getContatos = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('contatos', 'username email');
        res.json(user.contatos);
    } catch (e) {
        res.status(500).json({ erro: 'Erro interno' });
    }
};

exports.adicionarContato = async (req, res) => {
    try {
        const { email } = req.body;

        const contato = await User.findOne({ email, verificado: true });
        if (!contato) return res.status(404).json({ erro: 'Usuário não encontrado' });

        if (contato._id.toString() === req.userId) {
            return res.status(400).json({ erro: 'Você não pode se adicionar' });
        }

        const user = await User.findById(req.userId);

        if (user.contatos.includes(contato._id)) {
            return res.status(400).json({ erro: 'Contato já adicionado' });
        }

        user.contatos.push(contato._id);
        await user.save();

        res.json({ mensagem: 'Contato adicionado!', contato: { id: contato._id, username: contato.username, email: contato.email } });
    } catch (e) {
        res.status(500).json({ erro: 'Erro interno' });
    }
};

exports.getConversa = async (req, res) => {
    try {
        const { contatoId } = req.params;
        const mensagens = await Message.find({
            $or: [
                { de: req.userId, para: contatoId },
                { de: contatoId, para: req.userId }
            ]
        }).sort({ criadoEm: 1 });

        res.json(mensagens);
    } catch (e) {
        res.status(500).json({ erro: 'Erro interno' });
    }
};

exports.enviarMensagem = async (req, res) => {
    try {
        const { contatoId, texto } = req.body;
        const mensagem = new Message({
            de: req.userId,
            para: contatoId,
            texto
        });
        await mensagem.save();
        res.status(201).json(mensagem);
    } catch (e) {
        res.status(500).json({ erro: 'Erro interno' });
    }
};