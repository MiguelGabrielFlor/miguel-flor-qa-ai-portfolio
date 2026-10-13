const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateVisitor } = require('../src/validators/visitor.validator');

const validVisitor = {
    nombre: 'Miguel',
    apellido: 'Prueba',
    email: 'miguel@example.com',
    telefono: '1234567',
    consentimiento: true
};

test('Validador acepta un visitante válido', () => {
    const result = validateVisitor(validVisitor);

    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, []);
});

test('Validador rechaza un correo inválido', () => {
    const result = validateVisitor({
        ...validVisitor,
        email: 'correo-invalido'
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(error => error.includes('correo')));
});

test('Validador rechaza un teléfono inválido', () => {
    const result = validateVisitor({
        ...validVisitor,
        telefono: '123abc'
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(error => error.includes('teléfono')));
});

test('Validador rechaza un registro sin consentimiento', () => {
    const result = validateVisitor({
        ...validVisitor,
        consentimiento: false
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(error => error.includes('consentimiento')));
});
