require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

import { securityHeaders } from './src/middleware/securityHeaders.js';
const app = express();
app.use(securityHeaders);
const server = http.createServer(app);
import jwt from 'jsonwebtoken';
const io = new Server(server);

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

app.use(cors({ origin: '*', credentials: true }));
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