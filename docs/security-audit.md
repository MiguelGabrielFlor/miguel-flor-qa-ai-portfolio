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

---

## SEC-002 — Permisos de acceso a SQLite en Windows

**Prioridad:** P0 — Protección de datos personales
**Estado:** CLOSED — Corrección verificada
**Fecha de verificación:** 17/11/2026
**Entorno:** Windows 10 / NTFS / Node.js / SQLite

### 1. Descripción del hallazgo

Durante la auditoría de permisos locales se identificó que
`backend/database/portfolio.sqlite` heredaba permisos de
lectura y ejecución (RX) para el grupo
`ALL APPLICATION PACKAGES`.

La base contenía 618 registros de visitantes.

No se identificaron permisos explícitos para `Everyone`
ni para el grupo general `Usuarios`.

### 2. Evidencia inicial

La consulta mediante `icacls` confirmó que tanto la
carpeta `backend/database` como sus archivos heredaban
permisos de sus directorios superiores.

El grupo `ALL APPLICATION PACKAGES` tenía autorización
de lectura y ejecución.

### 3. Respaldo previo

Antes de modificar las ACL se ejecutó:

`icacls ".\backend\database" /save "$env:TEMP\portfolio-database-acl.txt" /T`

Resultado: 3 elementos procesados, 0 errores.

El respaldo fue verificado con un tamaño de 820 bytes.

### 4. Corrección aplicada

Con el backend detenido se ejecutaron:

`icacls ".\backend\database" /inheritance:d`

`icacls ".\backend\database" /remove:g "*S-1-15-2-1"`

La corrección deshabilitó la herencia de permisos en
`backend/database` y eliminó la autorización de
`ALL APPLICATION PACKAGES`.

No se modificaron las ACL generales del proyecto.

### 5. Resultados de verificación

| Control | Resultado |
|---|---|
| ACL de `backend/database` | PASS |
| ACL de `portfolio.sqlite` | PASS |
| ACL de `connection.js` | PASS |
| Permisos de `ALL APPLICATION PACKAGES` eliminados | PASS |
| Acceso de MIGUEL, SYSTEM y Administradores conservado | PASS |
| Integridad SQLite | PASS — ok |
| Registros conservados | PASS — 618 |
| Reinicio del backend Express | PASS |
| GET /api/health | PASS — HTTP 200 |
| Respuesta JSON de salud | PASS |

El backend inició correctamente en `127.0.0.1:3000`.

La limpieza automática de privacidad informó cero
registros vencidos eliminados.

### 6. Alcance y limitaciones

La corrección se aplicó al entorno local Windows.

No modifica los permisos de SQLite en producción,
que se administran de forma independiente en el VPS.

La verificación del endpoint de salud confirma la
disponibilidad de la API, pero no sustituye las pruebas
funcionales de lectura y escritura de SQLite.

El respaldo ACL permanece en la carpeta temporal de
Windows y debe conservarse hasta finalizar la auditoría.

### 7. Resultado

SEC-002: CLOSED — Permisos locales restringidos,
integridad de SQLite conservada y backend operativo.
