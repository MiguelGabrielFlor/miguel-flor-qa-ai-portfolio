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

test('Rechaza nombres y apellidos de menos de 2 caracteres', () => {
    for (const field of ['nombre', 'apellido']) {
        const result = validateVisitor({
            ...validVisitor,
            [field]: 'A'
        });

        assert.equal(result.valid, false, field);
    }
});

test('Rechaza nombres y apellidos de más de 50 caracteres', () => {
    for (const field of ['nombre', 'apellido']) {
        const result = validateVisitor({
            ...validVisitor,
            [field]: 'A'.repeat(51)
        });

        assert.equal(result.valid, false, field);
    }
});

test('Rechaza números y caracteres inválidos en nombres', () => {
    for (const value of ['Miguel123', 'Juan@', 'Ana_']) {
        const result = validateVisitor({
            ...validVisitor,
            nombre: value
        });

        assert.equal(result.valid, false, value);
    }
});

test('Acepta nombres Unicode y caracteres permitidos', () => {
    for (const value of [
        'María José',
        "O'Connor",
        'Ana-María',
        'Jo'
    ]) {
        const result = validateVisitor({
            ...validVisitor,
            nombre: value
        });

        assert.equal(result.valid, true, value);
    }
});

test('Acepta nombres de exactamente 50 caracteres', () => {
    const result = validateVisitor({
        ...validVisitor,
        nombre: 'A'.repeat(50),
        apellido: 'B'.repeat(50)
    });

    assert.equal(result.valid, true);
});

test('SEC-004: rechaza nombres y apellidos sin letras', () => {
    const invalidValues = ['--', "''", '---', "'-'", ' - '];

    for (const field of ['nombre', 'apellido']) {
        for (const value of invalidValues) {
            const result = validateVisitor({
                ...validVisitor,
                [field]: value
            });

            assert.equal(
                result.valid,
                false,
                `${field}: ${JSON.stringify(value)}`
            );
        }
    }
});
