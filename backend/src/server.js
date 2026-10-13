const { createApp } = require('./app');
const db = require('../database/connection');

const app = createApp(db);
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`API disponible en http://localhost:${PORT}`);
});

function shutdown() {
    server.close(() => {
        db.close();
    });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
