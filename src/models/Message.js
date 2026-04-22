const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    de: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    para: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    texto: { type: String, required: true },
    lida: { type: Boolean, default: false },
    criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);