
require('dotenv').config({
    path: require('node:path').resolve(__dirname, '../../.env')
});

const { createApp } = require('./app');
const db = require('../database/connection');
const {
    deleteExpiredVisitors
} = require('./services/visitor-retention.service');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

const CLEANUP_INTERVAL_MS =
    Number(process.env.CLEANUP_INTERVAL_MS) || 24 * 60 * 60 * 1000;

function cleanupExpiredVisitors() {
    try {
        const deleted = deleteExpiredVisitors(db);

        console.log(
            `[Privacidad] Limpieza completada. Registros vencidos eliminados: ${deleted}`
        );
    } catch (error) {
        console.error(
            '[Privacidad] Error durante la limpieza de registros:',
            error.message
        );
    }
}

// Primera limpieza al iniciar el servidor.
cleanupExpiredVisitors();

const app = createApp(db);

const server = app.listen(PORT, HOST, () => {
    console.log(`API disponible en http://${HOST}:${PORT}`);
});

// Limpieza periódica cada 24 horas.
const cleanupInterval = setInterval(
    cleanupExpiredVisitors,
    CLEANUP_INTERVAL_MS
);

function shutdown() {
    clearInterval(cleanupInterval);

    server.close(() => {
        db.close();
    });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
