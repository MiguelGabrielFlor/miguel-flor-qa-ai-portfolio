
const { DatabaseSync } = require('node:sqlite');
const { createApp } = require('../../backend/src/app');

const db = new DatabaseSync(':memory:');

db.exec(`
    CREATE TABLE visitors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        email TEXT NOT NULL,
        telefono TEXT NOT NULL,
        consentimiento INTEGER NOT NULL CHECK (consentimiento = 1),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
`);

const emailService = {
    isConfigured: () => true,
    
    
    sendContactMessage: async (details) => {
        const errorSimulado =
            process.env.MOCK_EMAIL_FAILURE === 'true' ||
            details.mensaje === 'Prueba Selenium: error HTTP 500 simulado.';

        if (errorSimulado) {
            throw new Error('Fallo simulado del proveedor SMTP');
        }

        // Simulación: no se envían correos reales.
        console.log('Contacto simulado:', details.mensaje);
    }


};

const app = createApp(db, emailService);

const PORT = 3000;

const server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`API simulada disponible en http://localhost:${PORT}`);
});

server.on('error', (error) => {
    console.error('No se pudo iniciar la API simulada:', error.message);
    db.close();
    process.exitCode = 1;
});

function shutdown() {
    server.close(() => {
        db.close();
    });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
