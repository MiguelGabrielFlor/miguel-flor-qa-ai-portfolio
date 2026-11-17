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

const {
    RETENTION_DAYS,
    deleteExpiredVisitors
} = require('../src/services/visitor-retention.service');

test('La conservación de datos está configurada en 90 días', () => {
    assert.equal(RETENTION_DAYS, 90);
});

test('SQLite elimina únicamente los visitantes con más de 90 días', () => {
    const db = createTestDatabase();

    try {
        const insert = db.prepare(`
            INSERT INTO visitors
                (nombre, apellido, email, telefono, consentimiento, created_at)
            VALUES (?, ?, ?, ?, 1, datetime('now', ?))
        `);

        insert.run('Antiguo', 'Prueba', 'antiguo@example.com', '1234567', '-91 days');
        insert.run('Vigente', 'Prueba', 'vigente@example.com', '1234567', '-89 days');
        insert.run('Actual', 'Prueba', 'actual@example.com', '1234567', '-1 day');

        const deleted = deleteExpiredVisitors(db);

        assert.equal(deleted, 1);

        const visitors = db.prepare(`
            SELECT email FROM visitors ORDER BY id
        `).all();

        assert.deepEqual(
            visitors.map(visitor => visitor.email),
            ['vigente@example.com', 'actual@example.com']
        );
    } finally {
        db.close();
    }
});

test('SQLite no elimina registros cuando ninguno superó los 90 días', () => {
    const db = createTestDatabase();

    try {
        db.prepare(`
            INSERT INTO visitors
                (nombre, apellido, email, telefono, consentimiento)
            VALUES (?, ?, ?, ?, 1)
        `).run('Nuevo', 'Visitante', 'nuevo@example.com', '1234567');

        const deleted = deleteExpiredVisitors(db);

        assert.equal(deleted, 0);

        const total = db.prepare(`
            SELECT COUNT(*) AS total FROM visitors
        `).get();

        assert.equal(total.total, 1);
    } finally {
        db.close();
    }
});

test('La limpieza de registros puede ejecutarse repetidamente', () => {
    const db = createTestDatabase();

    try {
        db.prepare(`
            INSERT INTO visitors
                (nombre, apellido, email, telefono, consentimiento, created_at)
            VALUES (?, ?, ?, ?, 1, datetime('now', '-120 days'))
        `).run('Antiguo', 'Visitante', 'repetido@example.com', '1234567');

        assert.equal(deleteExpiredVisitors(db), 1);
        assert.equal(deleteExpiredVisitors(db), 0);
    } finally {
        db.close();
    }
});

test('La limpieza rechaza una conexión SQLite inválida', () => {
    assert.throws(
        () => deleteExpiredVisitors(null),
        /conexión SQLite válida/
    );
});
