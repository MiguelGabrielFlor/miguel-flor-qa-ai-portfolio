const express = require('express');

const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const defaultDb = require('../database/connection');
const { validateVisitor } = require('./validators/visitor.validator');
const { validateContactMessage } = require('./validators/contact.validator');
const { createEmailService } = require('./services/email.service');

function createApp(db = defaultDb, emailService = createEmailService()) {
    const app = express();
    if (process.env.NODE_ENV === 'production') {
        app.set('trust proxy', 'loopback');
    }

    app.disable('x-powered-by');

    app.use(helmet({
        contentSecurityPolicy: false
    }));

    // Evitar el almacenamiento en caché de respuestas de la API.
    app.use('/api', (req, res, next) => {
        res.set({
            'Cache-Control': 'no-store',
            'Pragma': 'no-cache'
        });

        next();
    });

    const publicApiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 30,
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        message: {
            message: 'Demasiadas solicitudes. Intentá nuevamente en 15 minutos.'
        }
    });
    const allowedOrigins = process.env.NODE_ENV === 'production'
        ? [
            'https://mfportfolio.com.ar',
            'https://www.mfportfolio.com.ar'
        ]
        : [
            'http://127.0.0.1:5500',
            'http://localhost:5500',
            'http://127.0.0.1:8000',
            'http://localhost:8000'
        ];

    app.use(cors({
        origin: allowedOrigins
    }));

    app.use(express.json({ limit: '10kb' }));
    
    app.get('/api/health', (req, res) => {
        res.status(200).json({
            status: 'ok',
            message: 'API disponible'
        });
    });
    
    app.post('/api/visitors', publicApiLimiter, (req, res) => {
        const validation = validateVisitor(req.body);

        if (!validation.valid) {
            return res.status(400).json({
                message: 'Los datos enviados no son válidos.',
                errors: validation.errors
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
                SELECT id, consentimiento
                FROM visitors
                WHERE id = ?
            `).get(visitorId);

            if (
                !registroVerificado ||
                registroVerificado.consentimiento !== 1
            ) {
                throw new Error(
                    'No se pudo verificar el registro del visitante.'
                );
            }

            return res.status(201).json({
                message: 'Registro creado correctamente.',
                visitor: {
                    id: visitorId,
                    nombre: nombre.trim()
                }
            });
        } catch (error) {
            console.error(
                'Error al guardar el visitante:',
                error.message
            );

            return res.status(500).json({
                message: 'No se pudo guardar el registro.'
            });
        }
    });

    app.post('/api/contact', publicApiLimiter, async (req, res) => {
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

        // SEC-007: respuesta controlada para rutas API inexistentes.
        app.use('/api', (req, res) => {
            return res.status(404).json({
                message: 'El recurso solicitado no existe.'
            });
        });

        return app;
    }

    module.exports = { createApp };