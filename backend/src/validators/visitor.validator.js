
const { isValidPersonName } = require('./person-name.validator');

function validateVisitor(visitor) {
    const errors = [];

    const nombre = typeof visitor?.nombre === 'string'
        ? visitor.nombre.trim()
        : '';

    const apellido = typeof visitor?.apellido === 'string'
        ? visitor.apellido.trim()
        : '';

    const email = typeof visitor?.email === 'string'
        ? visitor.email.trim()
        : '';

    const telefono = typeof visitor?.telefono === 'string'
        ? visitor.telefono.trim()
        : '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s()-]+$/;
    const phoneDigits = telefono.replace(/\D/g, '');

    if (!isValidPersonName(nombre)) {
        errors.push('Ingresá un nombre válido de 2 a 50 caracteres.');
    }

    if (!isValidPersonName(apellido)) {
        errors.push('Ingresá un apellido válido de 2 a 50 caracteres.');
    }

    if (!email || email.length > 254 || !emailRegex.test(email)) {
        errors.push('Ingresá un correo electrónico válido.');
    }

    if (
        !telefono ||
        !phoneRegex.test(telefono) ||
        phoneDigits.length < 7 ||
        phoneDigits.length > 15
    ) {
        errors.push('Ingresá un teléfono válido de 7 a 15 dígitos.');
    }

    if (
        visitor?.consentimiento !== true &&
        visitor?.consentimiento !== 1
    ) {
        errors.push('El consentimiento es obligatorio.');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

module.exports = { validateVisitor };
