const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function enviarCodigo(destinatario, codigo) {
    await transporter.sendMail({
        from: `"MeuZap" <${process.env.EMAIL_USER}>`,
        to: destinatario,
        subject: 'Seu código de verificação',
        html: `
            <div style="font-family: sans-serif; background: #0d0d0d; color: #e5e5e5; padding: 32px; border-radius: 12px;">
                <h2 style="color: #22c55e;">MeuZap</h2>
                <p>Seu código de verificação é:</p>
                <h1 style="letter-spacing: 8px; color: #22c55e;">${codigo}</h1>
                <p style="color: #555; font-size: 13px;">Expira em 10 minutos.</p>
            </div>
        `
    });
}

module.exports = { enviarCodigo };