const express = require('express');
const cors = require('cors');
const defaultDb = require('../database/connection');
const { validateVisitor } = require('./validators/visitor.validator');

function createApp(db = defaultDb) {
    const app = express();

    app.use(cors());
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

            return res.status(201).json({
                message: 'Registro creado correctamente.',
                visitor: {
                    id: Number(result.lastInsertRowid),
                    nombre: nombre.trim()
                }
            });
        } catch (error) {
            console.error('Error al guardar el visitante:', error.message);

            return res.status(500).json({
                message: 'No se pudo guardar el registro.'
            });
        }
    });

    return app;
}

module.exports = { createApp };
