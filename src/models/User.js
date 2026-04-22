const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true, lowercase: true },
    senha: { type: String, required: true },
    verificado: { type: Boolean, default: false },
    codigoVerificacao: { type: String },
    codigoExpira: { type: Date },
    contatos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);