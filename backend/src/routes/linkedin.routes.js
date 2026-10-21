const express = require('express');
const crypto = require('node:crypto');

const router = express.Router();
const pendingStates = new Map();

const STATE_TTL_MS = 10 * 60 * 1000;

const AUTHORIZATION_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const USERINFO_URL = 'https://api.linkedin.com/v2/userinfo';

function getConfig() {
    const {
        LINKEDIN_CLIENT_ID,
        LINKEDIN_CLIENT_SECRET,
        LINKEDIN_REDIRECT_URI
    } = process.env;

    if (
        !LINKEDIN_CLIENT_ID ||
        !LINKEDIN_CLIENT_SECRET ||
        !LINKEDIN_REDIRECT_URI
    ) {
        return null;
    }

    return {
        clientId: LINKEDIN_CLIENT_ID,
        clientSecret: LINKEDIN_CLIENT_SECRET,
        redirectUri: LINKEDIN_REDIRECT_URI
    };
}

function cleanupStates() {
    const now = Date.now();

    for (const [state, expiresAt] of pendingStates) {
        if (expiresAt <= now) {
            pendingStates.delete(state);
        }
    }
}

router.get('/auth', (req, res) => {
    const config = getConfig();

    if (!config) {
        return res.status(503).json({
            message: 'La integración de LinkedIn no está configurada.'
        });
    }

    cleanupStates();

    const state = crypto.randomBytes(32).toString('hex');

    pendingStates.set(state, Date.now() + STATE_TTL_MS);

    const authorizationUrl = new URL(AUTHORIZATION_URL);

    authorizationUrl.searchParams.set('response_type', 'code');
    authorizationUrl.searchParams.set('client_id', config.clientId);
    authorizationUrl.searchParams.set(
        'redirect_uri',
        config.redirectUri
    );
    authorizationUrl.searchParams.set('scope', 'openid profile');
    authorizationUrl.searchParams.set('state', state);

    return res.redirect(authorizationUrl.toString());
});

router.get('/callback', async (req, res) => {
    const config = getConfig();

    if (!config) {
        return res.status(503).json({
            message: 'La integración de LinkedIn no está configurada.'
        });
    }

    const { code, state, error } = req.query;

    if (error) {
        return res.status(400).json({
            message: 'La autorización de LinkedIn fue cancelada o rechazada.'
        });
    }

    if (
        typeof code !== 'string' ||
        typeof state !== 'string'
    ) {
        return res.status(400).json({
            message: 'La respuesta de autorización no es válida.'
        });
    }

    const expiresAt = pendingStates.get(state);

    if (!expiresAt || expiresAt <= Date.now()) {
        pendingStates.delete(state);

        return res.status(400).json({
            message: 'El estado de autorización no es válido o ha caducado.'
        });
    }

    // El estado se consume una sola vez.
    pendingStates.delete(state);

    try {
        const tokenResponse = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                client_id: config.clientId,
                client_secret: config.clientSecret,
                redirect_uri: config.redirectUri
            })
        });

        if (!tokenResponse.ok) {
            return res.status(502).json({
                message: 'No se pudo completar la autorización con LinkedIn.'
            });
        }

        const tokenData = await tokenResponse.json();

        if (
            typeof tokenData.access_token !== 'string' ||
            !tokenData.access_token
        ) {
            return res.status(502).json({
                message: 'LinkedIn no devolvió un token válido.'
            });
        }

        const profileResponse = await fetch(USERINFO_URL, {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`
            }
        });

        if (!profileResponse.ok) {
            return res.status(502).json({
                message: 'No se pudo obtener el perfil autorizado.'
            });
        }

        const profile = await profileResponse.json();

        res.set('Cache-Control', 'no-store');

        return res.status(200).json({
            message: 'Perfil de LinkedIn obtenido correctamente.',
            profile: {
                name: profile.name || null,
                given_name: profile.given_name || null,
                family_name: profile.family_name || null,
                picture: profile.picture || null
            }
        });
    } catch {
        return res.status(502).json({
            message: 'No se pudo conectar con LinkedIn. Intentá nuevamente.'
        });
    }
});

module.exports = router;