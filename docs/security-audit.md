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

---

## SEC-003 — Configuración CORS permisiva en desarrollo

**Prioridad:** P0 — Auditoría de seguridad y privacidad
**Estado:** CLOSED — Corrección verificada
**Fecha de verificación:** 17/11/2026
**Entorno:** Backend Express / Desarrollo local

### 1. Descripción del hallazgo

Durante la auditoría se identificó que el backend
utilizaba `origin: allowedOrigins || true`.

En desarrollo, `allowedOrigins` era `null`, por lo
que CORS reflejaba cualquier origen recibido.

### 2. Evidencia inicial

Una solicitud con el origen
`https://sitio-no-autorizado.example`
recibió HTTP 200 y el encabezado:

`Access-Control-Allow-Origin: https://sitio-no-autorizado.example`

El backend escuchaba únicamente en `127.0.0.1:3000`.

No se confirmó exposición equivalente en producción.

### 3. Corrección implementada

Archivo modificado: `backend/src/app.js`.

Se reemplazó la configuración permisiva por listas
explícitas de orígenes autorizados.

Producción:
- `https://mfportfolio.com.ar`
- `https://www.mfportfolio.com.ar`

Desarrollo:
- `http://127.0.0.1:5500`
- `http://localhost:5500`

Se eliminó el comportamiento `origin: true`.

### 4. Resultados de verificación

| Control | Resultado |
|---|---|
| Validación de sintaxis JavaScript | PASS |
| Validación de formato Git | PASS |
| Reinicio del backend | PASS |
| Origen 127.0.0.1:5500 | PASS — Autorizado |
| Origen localhost:5500 | PASS — Autorizado |
| Origen externo no autorizado | PASS — Sin encabezado CORS |

Las tres comprobaciones HTTP devolvieron estado 200.

El origen externo no recibió el encabezado
`Access-Control-Allow-Origin`.

### 5. Alcance y limitaciones

La verificación funcional se realizó en desarrollo local.

La configuración de producción contiene una lista
explícita de dominios, pero no se ejecutó en este
control una prueba HTTP específica contra producción.

CORS no sustituye la autenticación, la autorización
ni otras medidas de protección de la API.

### 6. Resultado

SEC-003: CLOSED — Configuración CORS de desarrollo
restringida y verificada mediante tres solicitudes HTTP.

---

## SEC-004 — Validación insuficiente de nombres y apellidos

**Prioridad:** P0 — Auditoría de seguridad y privacidad
**Estado:** CLOSED — Corrección y regresión verificadas
**Fecha de verificación:** 17/11/2026
**Entorno:** Backend Node.js / Validadores de visitantes y contacto

### 1. Descripción del hallazgo

Durante la auditoría se identificó que el validador
compartido de nombres y apellidos permitía cadenas
compuestas exclusivamente por guiones o apóstrofes.

La expresión regular existente admitía letras Unicode,
espacios, guiones y apóstrofes, pero no exigía la
presencia de al menos una letra.

### 2. Evidencia inicial

Archivo afectado:
`backend/src/validators/person-name.validator.js`.

Resultados anteriores a la corrección:

| Entrada | Resultado inicial | Evaluación |
|---|---|---|
| `--` | true | FAIL |
| `''` | true | FAIL |

El defecto afectaba a los validadores que reutilizan
la función `isValidPersonName`.

No se confirmó explotación ni impacto sobre registros
existentes.

### 3. Corrección implementada

Se incorporó una comprobación adicional mediante
la expresión regular `/\p{L}/u`.

La validación exige ahora que el nombre:

- Sea una cadena de texto.
- Contenga entre 2 y 50 caracteres después de aplicar `trim()`.
- Utilice únicamente los caracteres permitidos.
- Contenga al menos una letra Unicode.

Se conservaron las reglas existentes de longitud
y compatibilidad con nombres internacionales.

### 4. Pruebas de regresión

Archivos de pruebas:

- `backend/tests/visitor.validator.test.js`
- `backend/tests/contact.validator.test.js`

Casos incorporados:

- `SEC-004`: rechazo de nombres y apellidos sin letras
  en el registro de visitantes.
- `CONTACT-014 / SEC-004`: rechazo de nombres y apellidos
  sin letras en el formulario de contacto.

Se verificaron cinco entradas inválidas en ambos
campos y en los dos flujos.

### 5. Resultados de verificación

| Control | Resultado |
|---|---|
| Comprobaciones puntuales del validador | 6/6 PASS |
| Pruebas automatizadas de visitantes y contacto | 24/24 PASS |
| Pruebas automatizadas fallidas | 0 |
| Rechazo de nombres sin letras | PASS |
| Compatibilidad con nombres Unicode | PASS |
| Conservación de pruebas existentes | PASS |

La ejecución automatizada se realizó con `node --test`.

### 6. Alcance y limitaciones

La corrección se verificó en el backend local.

No se realizó en este control una prueba HTTP
específica contra el entorno de producción.

Las pruebas confirman el comportamiento de los
validadores, pero no constituyen una auditoría
completa de todas las entradas de la aplicación.

### 7. Resultado

SEC-004: CLOSED — Validación de nombres y apellidos
corregida y regresión automatizada 24/24 PASS.