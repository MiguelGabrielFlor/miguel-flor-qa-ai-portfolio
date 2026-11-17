
const { isValidPersonName } = require('./person-name.validator');

function validateContactMessage(contact) {
    const errors = [];

    const nombre = typeof contact?.nombre === 'string'
        ? contact.nombre.trim()
        : '';

    const apellido = typeof contact?.apellido === 'string'
        ? contact.apellido.trim()
        : '';

    const email = typeof contact?.email === 'string'
        ? contact.email.trim()
        : '';

    const telefono = typeof contact?.telefono === 'string'
        ? contact.telefono.trim()
        : '';

    const mensaje = typeof contact?.mensaje === 'string'
        ? contact.mensaje.trim()
        : '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s()-]+$/;
    const phoneDigits = telefono.replace(/\D/g, '');

    // Acceso directo: no requiere datos personales adicionales.
    const isGuest = !nombre && !apellido && !telefono;

    // Los visitantes registrados deben proporcionar datos válidos.
    if (!isGuest) {
        if (!isValidPersonName(nombre)) {
            errors.push('Ingresá un nombre válido de 2 a 50 caracteres.');
        }

        if (!isValidPersonName(apellido)) {
            errors.push('Ingresá un apellido válido de 2 a 50 caracteres.');
        }

        if (
            !telefono ||
            !phoneRegex.test(telefono) ||
            phoneDigits.length < 7 ||
            phoneDigits.length > 15
        ) {
            errors.push('Ingresá un teléfono válido de 7 a 15 dígitos.');
        }
    }

    // Obligatorios para ambas modalidades.
    if (!email || email.length > 254 || !emailRegex.test(email)) {
        errors.push('Ingresá un correo electrónico válido.');
    }

    if (!mensaje) {
        errors.push('El mensaje es obligatorio.');
    } else if (mensaje.length > 5000) {
        errors.push('El mensaje no puede superar los 5000 caracteres.');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

module.exports = { validateContactMessage };
