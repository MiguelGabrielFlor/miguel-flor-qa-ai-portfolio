const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const databasePath = path.join(__dirname, 'portfolio.sqlite');
const db = new DatabaseSync(databasePath);

db.exec(`
    CREATE TABLE IF NOT EXISTS visitors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        email TEXT NOT NULL,
        telefono TEXT NOT NULL,
        consentimiento INTEGER NOT NULL CHECK (consentimiento = 1),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
`);

module.exports = db;
