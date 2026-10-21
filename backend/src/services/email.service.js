
const nodemailer = require('nodemailer');

function createEmailService() {
    function isConfigured() {
        return Boolean(
            process.env.SMTP_HOST &&
            process.env.SMTP_PORT &&
            process.env.SMTP_USER &&
            process.env.SMTP_PASS &&
            process.env.CONTACT_EMAIL
        );
    }

    async function sendContactMessage({
        nombre,
        apellido,
        email,
        telefono,
        mensaje
    }) {
        if (!isConfigured()) {
            throw new Error('El servicio de correo no está configurado.');
        }

        const port = Number(process.env.SMTP_PORT);

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port,
            secure: port === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        return transporter.sendMail({
            from: `"Portfolio QA & AI" <${process.env.SMTP_USER}>`,
            to: process.env.CONTACT_EMAIL,
            replyTo: email,
            subject: `Nuevo mensaje de contacto de ${nombre} ${apellido}`,
            text: [
                'Nuevo mensaje recibido desde el portfolio.',
                '',
                `Nombre: ${nombre}`,
                `Apellido: ${apellido}`,
                `Email: ${email}`,
                `Teléfono: ${telefono}`,
                '',
                'Mensaje:',
                mensaje
            ].join('\n')
        });
    }

    return {
        isConfigured,
        sendContactMessage
    };
}

module.exports = { createEmailService };