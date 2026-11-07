require('dotenv').config({ path: require('node:path').resolve(__dirname, '../../.env') });

const { createApp } = require('./app');
const db = require('../database/connection');

const app = createApp(db);
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

const server = app.listen(PORT, HOST, () => {
    console.log(`API disponible en http://${HOST}:${PORT}`);
});

function shutdown() {
    server.close(() => {
        db.close();
    });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
