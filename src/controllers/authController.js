const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { enviarCodigo } = require('../email');

function gerarCodigo() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.cadastro = async (req, res) => {
    try {
        const { username, email, senha } = req.body;

        if (!username || !email || !senha) {
            return res.status(400).json({ erro: 'Preencha todos os campos' });
        }

        const emailExiste = await User.findOne({ email });
        if (emailExiste) return res.status(400).json({ erro: 'Email já cadastrado' });

        const hash = await bcrypt.hash(senha, 12);
        const codigo = gerarCodigo();
        const expira = new Date(Date.now() + 10 * 60 * 1000);

        const user = new User({
            username,
            email,
            senha: hash,
            codigoVerificacao: codigo,
            codigoExpira: expira
        });

        await user.save();
        await enviarCodigo(email, codigo);

        res.status(201).json({ mensagem: 'Código enviado para seu email!' });
    } catch (e) {
        res.status(400).json({ erro: 'Usuário ou email já existe' });
    }
};

exports.verificar = async (req, res) => {
    try {
        const { email, codigo } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });

        if (user.codigoVerificacao !== codigo) {
            return res.status(400).json({ erro: 'Código inválido' });
        }

        if (user.codigoExpira < new Date()) {
            return res.status(400).json({ erro: 'Código expirado' });
        }

        user.verificado = true;
        user.codigoVerificacao = null;
        user.codigoExpira = null;
        await user.save();

        res.json({ mensagem: 'Conta verificada! Faça login.' });
    } catch (e) {
        res.status(500).json({ erro: 'Erro interno' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ erro: 'Credenciais inválidas' });

        if (!user.verificado) {
            return res.status(401).json({ erro: 'Conta não verificada. Verifique seu email.' });
        }

        const senhaCorreta = await bcrypt.compare(senha, user.senha);
        if (!senhaCorreta) return res.status(401).json({ erro: 'Credenciais inválidas' });

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        res.json({ accessToken, refreshToken, username: user.username, id: user._id });
    } catch (e) {
        res.status(500).json({ erro: 'Erro interno' });
    }
};