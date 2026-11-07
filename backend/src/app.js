const express = require('express');

const cors = require('cors');
const defaultDb = require('../database/connection');
const { validateVisitor } = require('./validators/visitor.validator');
const { validateContactMessage } = require('./validators/contact.validator');
const { createEmailService } = require('./services/email.service');

function createApp(db = defaultDb, emailService = createEmailService()) {
    const app = express();

    const allowedOrigins = process.env.NODE_ENV === 'production'
        ? [
            'https://mfportfolio.com.ar',
            'https://www.mfportfolio.com.ar'
        ]
        : null;

    app.use(cors({
        origin: allowedOrigins || true
    }));
    app.use(express.json({ limit: '10kb' }));
    
    app.get('/api/health', (req, res) => {
        res.status(200).json({
            status: 'ok',
            message: 'API disponible'
        });
    });

    app.post('/api/visitors', (req, res) => {
        const validation = validateVisitor(req.body);

        if (!validation.valid) {
            return res.status(400).json({
                message: 'Los datos enviados no son válidos.',
                errors: validation.errors,
                persistencia: {
                    insercionEjecutada: false,
                    motivo: 'La validación rechazó la solicitud antes de ejecutar INSERT.'
                }
            });
        }

        const { nombre, apellido, email, telefono } = req.body;

        try {
            const result = db.prepare(`
                INSERT INTO visitors
                    (nombre, apellido, email, telefono, consentimiento)
                VALUES (?, ?, ?, ?, 1)
            `).run(
                nombre.trim(),
                apellido.trim(),
                email.trim(),
                telefono.trim()
            );
            const visitorId = Number(result.lastInsertRowid);

            const registroVerificado = db.prepare(`
                SELECT id, consentimiento, created_at
                FROM visitors
                WHERE id = ?
            `).get(visitorId);

            if (!registroVerificado) {
                throw new Error('No se pudo verificar el registro en SQLite.');
            }

            return res.status(201).json({
                message: 'Registro creado correctamente.',
                visitor: {
                    id: visitorId,
                    nombre: nombre.trim()
                },
                persistencia: {
                    verificada: true,
                    motor: 'SQLite',
                    registroId: registroVerificado.id,
                    consentimiento: registroVerificado.consentimiento === 1,
                    fechaRegistro: registroVerificado.created_at
                }
            });
        } catch (error) {
            console.error('Error al guardar el visitante:', error.message);

            return res.status(500).json({
                message: 'No se pudo guardar el registro.'
            });
        }
    });

    app.post('/api/contact', async (req, res) => {
        const validation = validateContactMessage(req.body);

        if (!validation.valid) {
            return res.status(400).json({
                message: 'Los datos del contacto no son válidos.',
                errors: validation.errors
            });
        }

        if (!emailService.isConfigured()) {
            return res.status(503).json({
                message: 'El servicio de correo no está configurado.'
            });
        }

        const { nombre, apellido, email, telefono, mensaje } = req.body;

        try {
            await emailService.sendContactMessage({
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                email: email.trim(),
                telefono: telefono.trim(),
                mensaje: mensaje.trim()
            });

            return res.status(200).json({
                message: 'Mensaje enviado correctamente.'
            });
        } catch (error) {
            console.error('Error al enviar el mensaje de contacto:', error.message);

            return res.status(500).json({
                message: 'No se pudo enviar el mensaje. Intentá nuevamente más tarde.'
            });
        }
    });

    return app;
}

module.exports = { createApp };