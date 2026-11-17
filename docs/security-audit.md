# Auditoría de seguridad — QA & AI Portfolio

## SEC-001 — Exposición HTTP de base de datos SQLite en desarrollo local

**Prioridad:** P0 — Crítica
**Estado:** CLOSED — Corrección verificada
**Fecha de verificación:** 17/11/2026
**Entorno:** Windows 10 / Node.js / VS Code
**Commit de corrección:** `5b9cc4a`

### 1. Descripción del hallazgo

Durante la auditoría de seguridad se detectó que Live Server permitía acceder mediante HTTP a la base de datos local `backend/database/portfolio.sqlite`.

La base contenía 618 registros de visitantes en el momento de la revisión.

### 2. Evidencia inicial

Solicitud:

`GET http://127.0.0.1:5500/backend/database/portfolio.sqlite`

Resultado obtenido: **HTTP 200 — FAIL**.

La configuración `liveServer.settings.ignoreFiles` no impidió la descarga del archivo.

### 3. Corrección implementada

Se incorporó `dev-server.cjs`, un servidor HTTP local basado en Node.js que:

- Utiliza una lista explícita de archivos y directorios públicos permitidos.
- Rechaza solicitudes a `backend/`, `.git/`, `.vscode/` y otros recursos no autorizados.
- Bloquea archivos SQLite y copias de seguridad identificadas.
- Escucha únicamente en `127.0.0.1:5500`.
- Conserva el acceso a las páginas y recursos públicos del portfolio.

No se eliminaron ni modificaron registros de SQLite durante la corrección.

### 4. Resultados de verificación

| Control | Resultado |
|---|---|
| Acceso HTTP directo a SQLite | PASS — 403 |
| Siete rutas sensibles | 7/7 PASS |
| Seis rutas alternativas | 6/6 PASS |
| Recursos públicos comprobados por HTTP | PASS |
| Copias de seguridad identificadas | 5/5 PASS — 403 |
| Documento original `docs/test-report.md` | PASS — 200 |
| Búsqueda de patrones sensibles en Markdown | Sin coincidencias |
| Aislamiento de red del puerto 5500 | PASS — Solo 127.0.0.1 |
| Validación de sintaxis y formato | PASS |
| Publicación y sincronización con GitHub | PASS |

### 5. Control de versiones

**Commit:** `5b9cc4a9774bb55765c3fc4a004dfd54ee7d5332`

**Mensaje:** `security: protect local development server from sensitive file exposure`

**Archivo incorporado:** `dev-server.cjs`

La sincronización entre `master` y `origin/master` fue confirmada.

### 6. Restricciones operativas

No utilizar Live Server para servir la raíz del proyecto mientras contenga archivos privados.

Para iniciar el frontend local:

`node dev-server.cjs`

Mantener separado el backend Express del puerto 3000.

El servidor de desarrollo no reemplaza Nginx ni debe utilizarse como servidor público de producción.

### 7. Alcance y limitaciones

El cierre de SEC-001 corresponde a la exposición HTTP identificada en el entorno local y a las rutas verificadas.

Este resultado no constituye una auditoría exhaustiva del código, de todos los archivos públicos ni de la infraestructura de producción.

La auditoría general P0-01 continúa hasta completar los controles restantes de privacidad y exposición de información.