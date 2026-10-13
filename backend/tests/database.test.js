const { test } = require('node:test');
const assert = require('node:assert/strict');
const { DatabaseSync } = require('node:sqlite');

function createTestDatabase() {
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

    return db;
}

test('SQLite permite guardar y recuperar un visitante', () => {
    const db = createTestDatabase();

    try {
        db.prepare(`
            INSERT INTO visitors
                (nombre, apellido, email, telefono, consentimiento)
            VALUES (?, ?, ?, ?, ?)
        `).run('Miguel', 'Prueba', 'miguel@example.com', '1234567', 1);

        const visitor = db.prepare(
            'SELECT id, nombre, apellido FROM visitors WHERE email = ?'
        ).get('miguel@example.com');

        assert.ok(visitor);
        assert.equal(visitor.id, 1);
        assert.equal(visitor.nombre, 'Miguel');
        assert.equal(visitor.apellido, 'Prueba');
    } finally {
        db.close();
    }
});

test('SQLite rechaza un visitante sin consentimiento', () => {
    const db = createTestDatabase();

    try {
        assert.throws(() => {
            db.prepare(`
                INSERT INTO visitors
                    (nombre, apellido, email, telefono, consentimiento)
                VALUES (?, ?, ?, ?, ?)
            `).run('Prueba', 'QA', 'prueba@example.com', '1234567', 0);
        }, /CHECK constraint failed/);
    } finally {
        db.close();
    }
});
