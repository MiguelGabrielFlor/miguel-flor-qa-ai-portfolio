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

    if (!nombre) {
        errors.push('El nombre es obligatorio.');
    }

    if (!apellido) {
        errors.push('El apellido es obligatorio.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || email.length > 254 || !emailRegex.test(email)) {
        errors.push('Ingresá un correo electrónico válido.');
    }

    const phoneRegex = /^\+?[0-9\s()-]+$/;
    const phoneDigits = telefono.replace(/\D/g, '');

    if (
        !telefono ||
        !phoneRegex.test(telefono) ||
        phoneDigits.length < 7 ||
        phoneDigits.length > 15
    ) {
        errors.push('Ingresá un teléfono válido de 7 a 15 dígitos.');
    }

    if (visitor?.consentimiento !== true && visitor?.consentimiento !== 1) {
        errors.push('El consentimiento es obligatorio.');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

module.exports = { validateVisitor };
