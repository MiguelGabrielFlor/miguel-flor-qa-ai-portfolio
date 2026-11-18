
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname);
const HOST = '127.0.0.1';
const PORT = 5500;

const PUBLIC_DIRECTORIES = new Set([
    'assets',
    'css',
    'js',
    'docs'
]);

const PUBLIC_FILES = new Set([
    'index.html',
    'home.html',
    'cv.html',
    'backend.html',
    'frontend.html',
    'qa.html',
    'quality-management.html',
    'favicon.svg'
]);

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.md': 'text/markdown; charset=utf-8',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

const ALLOWED_EXTENSIONS = new Set(
    Object.keys(MIME_TYPES)
);

const CSP_REPORT_ONLY = [
    "default-src 'self'",
    "script-src 'self' https://cdn.jsdelivr.net",
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "connect-src 'self' http://127.0.0.1:3000 http://localhost:3000 https://cdn.jsdelivr.net",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'"
].join('; ');
function respond(res, status, message) {
    res.writeHead(status, {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-store'
    });

    res.end(message);
}

const server = http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        return respond(res, 405, 'Method Not Allowed');
    }

    let pathname;

    try {
        pathname = decodeURIComponent(
            new URL(req.url, `http://${HOST}:${PORT}`).pathname
        );
    } catch {
        return respond(res, 400, 'Bad Request');
    }

    if (pathname === '/') {
        pathname = '/index.html';
    }

    if (
        pathname.includes('\0') ||
        pathname.includes('\\') ||
        pathname.split('/').includes('..')
    ) {
        return respond(res, 403, 'Forbidden');
    }

    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0) {
        return respond(res, 404, 'Not Found');
    }
    const first = segments[0];
    const extension = path.extname(pathname).toLowerCase();

    // Impedir la descarga de copias de seguridad,
    // incluso cuando tengan extensiones públicas como .md.
    const isBackup = segments.some(segment =>
        /(?:^|[._-])backup(?:$|[._-])/i.test(segment)
    );

    if (isBackup) {
        return respond(res, 403, 'Forbidden');
    }
    const allowed =
        (segments.length === 1 && PUBLIC_FILES.has(first)) ||
        (PUBLIC_DIRECTORIES.has(first) &&
            ALLOWED_EXTENSIONS.has(extension));

    if (!allowed) {
        return respond(res, 403, 'Forbidden');
    }

    const filePath = path.resolve(ROOT, `.${pathname}`);

    if (
        !filePath.startsWith(ROOT + path.sep) ||
        !ALLOWED_EXTENSIONS.has(extension)
    ) {
        return respond(res, 403, 'Forbidden');
    }

    fs.realpath(filePath, (realError, realPath) => {
        if (realError) {
            return respond(res, 404, 'Not Found');
        }

        if (!realPath.startsWith(ROOT + path.sep)) {
            return respond(res, 403, 'Forbidden');
        }

        fs.stat(realPath, (statError, stats) => {
            if (statError || !stats.isFile()) {
                return respond(res, 404, 'Not Found');
            }

            const headers = {
                'Content-Type': MIME_TYPES[extension],
                'X-Content-Type-Options': 'nosniff',
                'Cache-Control': 'no-store'
            };

            if (extension === '.html') {
                headers['Content-Security-Policy'] = CSP_REPORT_ONLY;
            }

            res.writeHead(200, headers);

            if (req.method === 'HEAD') {
                return res.end();
            }

            const stream = fs.createReadStream(realPath);

            stream.on('error', () => {
                res.destroy();
            });

            stream.pipe(res);
        });
    });
});

server.listen(PORT, HOST, () => {
    console.log(
        `Servidor seguro: http://${HOST}:${PORT}`
    );
});
