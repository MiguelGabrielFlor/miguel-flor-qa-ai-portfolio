
/**
 * Cliente HTTP compartido para los laboratorios del backend.
 * Centraliza la configuración de solicitudes y la lectura
 * de respuestas, sin evaluar resultados de negocio.
 */

const BACKEND_API_URL = 'http://localhost:3000';

async function backendRequest(path, options = {}) {
    const response = await fetch(
        `${BACKEND_API_URL}${path}`,
        options
    );

    const text = await response.text();

    let data;

    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        data = { respuesta: text };
    }

    return {
        response,
        status: response.status,
        data
    };
}

async function backendPost(path, payload) {
    return backendRequest(path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

window.BackendAPI = Object.freeze({
    baseUrl: BACKEND_API_URL,
    request: backendRequest,
    post: backendPost
});