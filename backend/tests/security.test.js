
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { rateLimit } = require('express-rate-limit');
const { createApp } = require('../src/app');

test('SEC-001: devuelve HTTP 429 al superar el límite', async () => {
    const app = createApp();

    const limiter = rateLimit({
        windowMs: 60 * 1000,
        limit: 3,
        standardHeaders: 'draft-8',
        legacyHeaders: false
    });

    // Ruta exclusiva para esta prueba.
    app.get('/api/security-test', limiter, (req, res) => {
        res.status(200).json({ status: 'ok' });
    });

    const server = await new Promise((resolve, reject) => {
        const instance = app.listen(0, '127.0.0.1');

        instance.once('listening', () => resolve(instance));
        instance.once('error', reject);
    });

    try {
        const address = server.address();
        const url = `http://127.0.0.1:${address.port}/api/security-test`;

        for (let i = 0; i < 3; i++) {
            const response = await fetch(url);
            assert.equal(response.status, 200);
            await response.arrayBuffer();
        }

        const blocked = await fetch(url);

        assert.equal(blocked.status, 429);
        await blocked.arrayBuffer();
    } finally {
        if (server.listening) {
            await new Promise((resolve, reject) => {
                server.close(error => error ? reject(error) : resolve());
            });
        }
    }
});

test('SEC-002: los endpoints públicos incluyen cabeceras del limitador', async () => {
    const app = createApp();

    const server = await new Promise((resolve, reject) => {
        const instance = app.listen(0, '127.0.0.1');
        instance.once('listening', () => resolve(instance));
        instance.once('error', reject);
    });

    try {
        const url = `http://127.0.0.1:${server.address().port}`;

        for (const endpoint of ['/api/visitors', '/api/contact']) {
            const response = await fetch(`${url}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });

            assert.equal(response.status, 400);
            assert.ok(
                response.headers.has('ratelimit'),
                `${endpoint} no incluye la cabecera RateLimit`
            );

            await response.arrayBuffer();
        }
    } finally {
        if (server.listening) {
            await new Promise((resolve, reject) => {
                server.close(error => error ? reject(error) : resolve());
            });
        }
    }
});

