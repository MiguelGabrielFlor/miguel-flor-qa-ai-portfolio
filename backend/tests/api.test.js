const { test } = require('node:test');
const assert = require('node:assert/strict');
const { DatabaseSync } = require('node:sqlite');
const { createApp } = require('../src/app');

async function withApi(
    callback,
    emailService = {
        isConfigured: () => false,
        sendContactMessage: async () => {}
    }
) {
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

    const app = createApp(db, emailService);
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
const validContact = {
    nombre: 'Miguel',
    apellido: 'Prueba QA',
    email: 'miguel.qa@example.com',
    telefono: '1234567',
    mensaje: 'Quisiera conversar sobre una oportunidad laboral.'
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

test('API informa cuando el servicio de correo no está configurado', async () => {
    await withApi(async (baseUrl) => {
        const response = await fetch(`${baseUrl}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(validContact)
        });

        const body = await response.json();

        assert.equal(response.status, 503);
        assert.equal(
            body.message,
            'El servicio de correo no está configurado.'
        );
    });
});


test('API envía los datos al servicio de correo configurado', async () => {
    const sentMessages = [];

    const emailService = {
        isConfigured: () => true,
        sendContactMessage: async (details) => {
            sentMessages.push(details);
        }
    };

    await withApi(async (baseUrl) => {
        const response = await fetch(`${baseUrl}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(validContact)
        });

        const body = await response.json();

        assert.equal(response.status, 200);
        assert.equal(body.message, 'Mensaje enviado correctamente.');
        assert.deepEqual(sentMessages, [validContact]);
    }, emailService);
});

test('API rechaza un mensaje de contacto vacío', async () => {
    await withApi(async (baseUrl) => {
        const response = await fetch(`${baseUrl}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...validContact,
                mensaje: '   '
            })
        });

        const body = await response.json();

        assert.equal(response.status, 400);
        assert.equal(
            body.message,
            'Los datos del contacto no son válidos.'
        );
    });
});

test('API informa un error si falla el envío del correo', async () => {
    const emailService = {
        isConfigured: () => true,
        sendContactMessage: async () => {
            throw new Error('Fallo simulado del proveedor SMTP');
        }
    };

    await withApi(async (baseUrl) => {
        const response = await fetch(`${baseUrl}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(validContact)
        });

        const body = await response.json();

        assert.equal(response.status, 500);
        assert.equal(
            body.message,
            'No se pudo enviar el mensaje. Intentá nuevamente más tarde.'
        );
    }, emailService);
});
