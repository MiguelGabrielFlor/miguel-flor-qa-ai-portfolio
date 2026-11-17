
const { test } = require('node:test');
const assert = require('node:assert/strict');

const {
    validateContactMessage
} = require('../src/validators/contact.validator');

const registered = {
    nombre: 'Miguel',
    apellido: 'Tester',
    email: 'miguel@example.com',
    telefono: '1123456789',
    mensaje: 'Consulta de prueba'
};

const guest = {
    nombre: '',
    apellido: '',
    email: 'invitado@example.com',
    telefono: '',
    mensaje: 'Consulta de prueba'
};

test('CONTACT-001: acepta visitante registrado válido', () => {
    const result = validateContactMessage(registered);
    assert.equal(result.valid, true);
});

test('CONTACT-002: acepta visitante directo válido', () => {
    const result = validateContactMessage(guest);
    assert.equal(result.valid, true);
});

test('CONTACT-003: rechaza invitado sin email', () => {
    const result = validateContactMessage({
        ...guest,
        email: ''
    });

    assert.equal(result.valid, false);
});

test('CONTACT-004: rechaza invitado sin mensaje', () => {
    const result = validateContactMessage({
        ...guest,
        mensaje: ''
    });

    assert.equal(result.valid, false);
});

test('CONTACT-005: rechaza registrado con teléfono inválido', () => {
    const result = validateContactMessage({
        ...registered,
        telefono: 'abc'
    });

    assert.equal(result.valid, false);
});

test('CONTACT-006: rechaza datos personales incompletos', () => {
    const result = validateContactMessage({
        ...registered,
        apellido: ''
    });

    assert.equal(result.valid, false);
});

test('CONTACT-007: rechaza nombre registrado de un carácter', () => {
    const result = validateContactMessage({
        ...registered,
        nombre: 'A'
    });

    assert.equal(result.valid, false);
});

test('CONTACT-008: rechaza apellido registrado de más de 50 caracteres', () => {
    const result = validateContactMessage({
        ...registered,
        apellido: 'A'.repeat(51)
    });

    assert.equal(result.valid, false);
});

test('CONTACT-009: rechaza caracteres inválidos en nombres', () => {
    const result = validateContactMessage({
        ...registered,
        nombre: 'Miguel123'
    });

    assert.equal(result.valid, false);
});

test('CONTACT-010: acepta nombres Unicode válidos', () => {
    const result = validateContactMessage({
        ...registered,
        nombre: 'María José',
        apellido: "O'Connor"
    });

    assert.equal(result.valid, true);
});

test('CONTACT-011: rechaza mensajes de más de 5000 caracteres', () => {
    const result = validateContactMessage({
        ...guest,
        mensaje: 'A'.repeat(5001)
    });

    assert.equal(result.valid, false);
});

test('CONTACT-012: acepta mensajes de exactamente 5000 caracteres', () => {
    const result = validateContactMessage({
        ...guest,
        mensaje: 'A'.repeat(5000)
    });

    assert.equal(result.valid, true);
});

test('CONTACT-013: rechaza datos personales parciales', () => {
    const result = validateContactMessage({
        ...guest,
        nombre: 'Miguel'
    });

    assert.equal(result.valid, false);
});
