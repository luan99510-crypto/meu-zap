import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';

// Imports dos seus arquivos locais (precisa ter .js no final)
import { securityHeaders } from './src/middleware/securityHeaders.js';
import authRoutes from './src/routes/authRoutes.js';
import messageRoutes from './src/routes/messageRoutes.js';

const app = express();

app.use(securityHeaders);
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.static('public'));

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// Socket.IO authentication middleware
io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Token ausente'));
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = payload.id;
        next();
    } catch (err) {
        next(new Error('Token inválido'));
    }
});

// Conexão com o Banco
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Banco conectado'))
    .catch(err => console.error('❌ Erro no banco:', err));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api', messageRoutes);

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
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});