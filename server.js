require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Banco conectado'))
    .catch(err => console.error('❌ Erro no banco:', err));

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api', require('./src/routes/messageRoutes'));

io.on('connection', (socket) => {
    console.log('usuário conectado:', socket.id);

    socket.on('join', (userId) => {
        socket.join(userId);
    });

    socket.on('mensagem-privada', async (data) => {
        const { para, de, texto } = data;
        io.to(para).emit('nova-mensagem', { de, texto, criadoEm: new Date() });
    });

    socket.on('disconnect', () => {
        console.log('usuário desconectou:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});