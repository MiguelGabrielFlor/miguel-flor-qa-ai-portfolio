const { test } = require('node:test');
const assert = require('node:assert/strict');
const { DatabaseSync } = require('node:sqlite');
const { createApp } = require('../src/app');

async function withApi(callback) {
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

    const app = createApp(db);
    const server = app.listen(0);

    await new Promise((resolve, reject) => {
        server.once('listening', resolve);
        server.once('error', reject);
    });

    const address = server.address();
    const baseUrl = `http://127.0.0.1:${address.port}`;

    try {
        await callback(baseUrl, db);
    } finally {
        await new Promise((resolve, reject) => {
            server.close(error => error ? reject(error) : resolve());
        });
        db.close();
    }
}

const validVisitor = {
    nombre: 'Miguel',
    apellido: 'Prueba QA',
    email: 'miguel.qa@example.com',
    telefono: '1234567',
    consentimiento: true
};

test('API responde correctamente en /api/health', async () => {
    await withApi(async baseUrl => {
        const response = await fetch(`${baseUrl}/api/health`);
        const body = await response.json();

        assert.equal(response.status, 200);
        assert.equal(body.status, 'ok');
    });
});

test('API registra un visitante válido', async () => {
    await withApi(async (baseUrl, db) => {
        const response = await fetch(`${baseUrl}/api/visitors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validVisitor)
        });

        const body = await response.json();
        const saved = db.prepare(
            'SELECT COUNT(*) AS total FROM visitors'
        ).get();

        assert.equal(response.status, 201);
        assert.equal(body.visitor.nombre, 'Miguel');
        assert.equal(saved.total, 1);
    });
});

test('API rechaza un correo inválido sin guardar el visitante', async () => {
    await withApi(async (baseUrl, db) => {
        const response = await fetch(`${baseUrl}/api/visitors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...validVisitor,
                email: 'correo-invalido'
            })
        });

        const saved = db.prepare(
            'SELECT COUNT(*) AS total FROM visitors'
        ).get();

        assert.equal(response.status, 400);
        assert.equal(saved.total, 0);
    });
});

test('API rechaza un teléfono inválido sin guardar el visitante', async () => {
    await withApi(async (baseUrl, db) => {
        const response = await fetch(`${baseUrl}/api/visitors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...validVisitor,
                telefono: '123abc'
            })
        });

        const saved = db.prepare(
            'SELECT COUNT(*) AS total FROM visitors'
        ).get();

        assert.equal(response.status, 400);
        assert.equal(saved.total, 0);
    });
});

test('API rechaza el registro sin consentimiento', async () => {
    await withApi(async (baseUrl, db) => {
        const response = await fetch(`${baseUrl}/api/visitors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...validVisitor,
                consentimiento: false
            })
        });

        const saved = db.prepare(
            'SELECT COUNT(*) AS total FROM visitors'
        ).get();

        assert.equal(response.status, 400);
        assert.equal(saved.total, 0);
    });
});
