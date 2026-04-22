const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function enviarCodigo(destinatario, codigo) {
    await resend.emails.send({
        from: 'MeuZap <onboarding@resend.dev>',
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