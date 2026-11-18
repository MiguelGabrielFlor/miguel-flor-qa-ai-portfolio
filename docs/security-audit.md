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

---

## SEC-005 — Ausencia de política explícita de caché en la API

**Prioridad:** P0 — Auditoría de seguridad y privacidad
**Estado:** CLOSED — Corrección verificada
**Fecha de verificación:** 17/11/2026
**Entorno:** Backend Express / Desarrollo local

### 1. Descripción del hallazgo

Durante la auditoría se identificó que las respuestas
de la API no incluían una política explícita para
impedir su almacenamiento en caché.

El endpoint de visitantes puede devolver información
relacionada con registros personales.

### 2. Evidencia inicial

La respuesta de GET /api/health no incluía:

- Cache-Control
- Pragma

La ausencia de estas cabeceras motivó la revisión
de la política de caché de la API.

No se confirmó almacenamiento indebido de datos
personales por parte de navegadores o intermediarios.

### 3. Corrección implementada

Archivo modificado: backend/src/app.js.

Se incorporó un middleware para todas las rutas
bajo /api que establece:

- Cache-Control: no-store
- Pragma: no-cache

La modificación no altera las reglas de validación,
CORS ni las operaciones de SQLite.

### 4. Resultados de verificación

| Control | Resultado |
|---|---|
| Sintaxis JavaScript | PASS |
| Reinicio del backend | PASS |
| GET /api/health | HTTP 200 |
| POST /api/visitors con datos inválidos | HTTP 400 |
| Content-Type de respuesta de validación | application/json |
| Cache-Control | no-store — PASS |
| Pragma | no-cache — PASS |
| Cabeceras de Helmet | Conservadas |

### 5. Alcance y limitaciones

Las comprobaciones HTTP se realizaron en desarrollo local.

No se verificó en este control el comportamiento
de caché del entorno de producción.

La directiva no-store solicita a los clientes y
cachés compatibles que no almacenen la respuesta,
pero no sustituye otros controles de privacidad.

No se ejecutaron solicitudes válidas que generaran
nuevos registros personales durante esta verificación.

### 6. Resultado

SEC-005: CLOSED — Política de caché incorporada
y verificada mediante respuestas HTTP reales.
---

## SEC-006 — Ausencia de Content Security Policy restrictiva

**Prioridad:** P0 — Auditoría de seguridad y privacidad
**Estado:** CLOSED — Corrección verificada
**Fecha de verificación:** 17/11/2026 (Argentina)
**Entorno:** Desarrollo local y producción — Nginx / HTTPS

### 1. Descripción del hallazgo

Durante la auditoría se identificó que el frontend no disponía de una política Content Security Policy (CSP) restrictiva que limitara la ejecución de scripts y la carga de recursos.

Se identificaron scripts y estilos inline que requerían adaptación antes de aplicar una política restrictiva.

### 2. Evidencia inicial

Las respuestas HTTP del sitio público no incluían una cabecera Content-Security-Policy.

Se verificó la ausencia de esta cabecera en las páginas index.html, qa.html y backend.html.

La ausencia de CSP representaba una debilidad de defensa en profundidad, pero no constituye por sí sola evidencia de explotación.

### 3. Corrección implementada

Se realizaron las siguientes modificaciones:

- Extracción del script inline de rendimiento de index.html hacia js/performance-cls.js.
- Sustitución de estilos inline por clases CSS en backend.html y frontend.html.
- Eliminación de asignaciones dinámicas de estilos inline en los módulos JavaScript del laboratorio backend.
- Corrección de la resolución de imágenes Markdown en js/qa/qa-markdown.js, restringiendo sus URLs al mismo origen.
- Incorporación de CSP restrictiva al servidor local de desarrollo.
- Configuración de cabeceras de seguridad en Nginx para producción.

La política de producción establece:

- default-src 'self'
- script-src 'self' https://cdn.jsdelivr.net
- style-src 'self'
- img-src 'self' data:
- font-src 'self' data:
- connect-src 'self' https://cdn.jsdelivr.net
- object-src 'none'
- base-uri 'self'
- frame-ancestors 'none'
- form-action 'self'

También se incorporó:

- X-Content-Type-Options: nosniff

La configuración de Nginx se respaldó y validó antes de aplicar los cambios.

### 4. Resultados de verificación

| Control | Resultado |
|---|---|
| Sintaxis de Nginx | PASS |
| Respaldo independiente de configuración | PASS |
| Publicación de código compatible | PASS — Commit bd8b11e |
| Archivos JavaScript publicados | HTTP 200 — PASS |
| CSP Report-Only en producción | PASS |
| Regresión previa con Report-Only | 21/21 PASS |
| CSP restrictiva en producción | PASS |
| Bloqueo efectivo de script inline | PASS |
| Regresión final en Chrome | 7/7 PASS |
| Regresión final en Firefox | 7/7 PASS |
| Regresión final en Edge | 7/7 PASS |
| Regresión final multinavegador | 21/21 PASS |
| X-Content-Type-Options: nosniff | PASS |

Las pruebas funcionales multinavegador fueron realizadas manualmente.

La prueba de bloqueo confirmó que el navegador rechazó la ejecución de un script inline no autorizado y que la variable de prueba permaneció sin definir.
5. Alcance y limitaciones
Las verificaciones se realizaron sobre siete páginas del portfolio:
- index.html
- home.html
- cv.html
- frontend.html
- backend.html
- qa.html
- quality-management.html
Se verificaron funcionalidades representativas y la ausencia de bloqueos CSP que impidieran su funcionamiento durante las pruebas.

La política permite cargar scripts desde cdn.jsdelivr.net, una dependencia externa autorizada. No elimina todos los riesgos de inyección ni sustituye la sanitización de contenido, las validaciones del backend o los controles de acceso.

La advertencia de compatibilidad de layout-shift observada durante las pruebas no corresponde a una infracción CSP.

La configuración de Nginx se mantiene fuera del repositorio Git del portfolio.
6. Resultado
SEC-006: CLOSED — CSP restrictiva implementada y activada en producción, bloqueo de scripts inline verificado y regresión funcional multinavegador 21/21 PASS.

---

## SEC-007 — Exposición de detalles internos en respuestas API

**Prioridad:** P0 — Auditoría de seguridad y privacidad
**Estado:** CLOSED — Correcciones implementadas y verificadas en desarrollo y producción
**Fecha de última verificación:** 18/11/2026 (Argentina)
**Entorno:** Desarrollo local y producción — Node.js / Express / Nginx / HTTPS

### 1. Descripción del hallazgo

Durante la auditoría de las respuestas públicas de la API se identificaron dos situaciones:

- Las rutas `/api/*` inexistentes devolvían una página HTML generada por Express.
- El endpoint `POST /api/visitors` exponía metadatos internos de persistencia SQLite en sus respuestas.

No se observaron trazas de errores, rutas internas del sistema operativo ni datos personales de terceros en las respuestas examinadas.

### 2. Evidencia inicial

La solicitud `GET /api/ruta-inexistente` devolvía HTTP 404 con contenido HTML y el mensaje `Cannot GET /api/ruta-inexistente`.

La solicitud `POST /api/visitors` con un objeto JSON vacío devolvía HTTP 400 e incluía:

- `persistencia.insercionEjecutada`
- `persistencia.motivo`

También se identificaron metadatos de persistencia en la respuesta de registro exitoso mediante revisión del código fuente.

### 3. Correcciones implementadas

#### 3.1. Respuestas controladas para rutas API inexistentes

Se incorporó un manejador para rutas `/api/*` inexistentes al final de `backend/src/app.js`.

El manejador devuelve HTTP 404 con una respuesta JSON controlada:

```json
{
  "message": "El recurso solicitado no existe."
}
```

Se agregó una prueba de integración en `backend/tests/api.test.js`.

También se adaptó la ruta auxiliar de `backend/tests/security.test.js` para conservar la verificación del limitador de solicitudes.

**Commit:** `b8db0f7` — `fix: return JSON 404 for unknown API routes`

**Estado:** Implementado, publicado y verificado en producción.

#### 3.2. Eliminación de metadatos internos de persistencia

Se modificó `POST /api/visitors` en `backend/src/app.js` para eliminar el objeto `persistencia` de las respuestas públicas.

**Registro válido — HTTP 201:**

```json
{
  "message": "Registro creado correctamente.",
  "visitor": {
    "id": 1,
    "nombre": "QA Demo"
  }
}
```

El identificador y el nombre son valores ilustrativos del formato de respuesta.

La implementación conserva la inserción SQLite y comprueba internamente la existencia del registro y su consentimiento.

**Registro inválido — HTTP 400:**

```json
{
  "message": "Los datos enviados no son válidos.",
  "errors": []
}
```

El arreglo `errors` contiene los errores de validación correspondientes al caso ejecutado.

En ninguno de los dos formatos se devuelve el objeto `persistencia`.

#### 3.3. Adaptación del laboratorio QA

Se actualizó `js/backend/persistence-lab.js` para conservar la evidencia visual del laboratorio de `backend.html` sin depender de los metadatos internos anteriormente expuestos.

El laboratorio utiliza:

- HTTP 201 e identificador del visitante para representar el registro exitoso.
- HTTP 400 y errores de validación para representar el rechazo.
- Paneles de evidencia para ambos escenarios.
- Actualización de textos ES/EN/PT sin repetir solicitudes POST al cambiar el idioma.

La evidencia visual se mantiene como demostración QA. La persistencia real se verifica adicionalmente mediante las pruebas de integración del backend.

#### 3.4. Configuración CORS para pruebas locales

Se incorporaron los orígenes `http://127.0.0.1:8000` y `http://localhost:8000` a la configuración CORS de desarrollo.

Esta modificación permite ejecutar el laboratorio desde el servidor HTTP utilizado por Selenium.

Se conservaron los orígenes del puerto 5500 y la lista de orígenes autorizados en producción.

### 4. Resultados de verificación

| Control | Resultado |
|---|---|
| Rutas API inexistentes — HTTP 404 JSON | PASS |
| Primera corrección desplegada en producción | PASS |
| Commit `b8db0f7` publicado en GitHub | PASS |
| Respuestas locales sin objeto `persistencia` | PASS |
| Registro válido y comprobación SQLite | PASS |
| Rechazo sin consentimiento | PASS |
| Laboratorio QA adaptado | PASS |
| CORS local para puerto 8000 | PASS |
| BACKEND-I18N-003 — Chrome | PASS |
| BACKEND-I18N-003 — Firefox | PASS |
| BACKEND-I18N-003 — Edge | PASS |
| Regresión Selenium multinavegador | 3/3 PASS |
| Regresión completa del backend | 43/43 PASS |
| Fallos backend | 0 |
| Despliegue de eliminación de metadatos | PENDIENTE |
| Verificación de segunda corrección en producción | PENDIENTE |

**Observaciones:**

- Las advertencias de SQLite experimental no representan fallos de las pruebas.
- El error SMTP simulado corresponde a un escenario negativo esperado.
- La regresión multinavegador se ejecutó en desarrollo local.

### 5. Dependencias resueltas

El laboratorio de persistencia y la prueba `BACKEND-I18N-003` dependían originalmente del objeto `persistencia`.

Se actualizaron ambos componentes para utilizar las respuestas públicas revisadas.

Se corrigió además la comparación del nombre de navegador de Microsoft Edge, cuyo identificador devuelto por Selenium es `microsoftedge`.

Las verificaciones posteriores finalizaron correctamente en Chrome, Firefox y Edge.

### 6. Cierre y verificaciones finales

- Commit `cacb6f7` publicado en GitHub y desplegado en el VPS.
- Servicio `portfolio-backend` activo después del reinicio.
- HTTP 400 en producción sin objeto `persistencia`: PASS.
- HTTP 404 en producción con respuesta JSON: PASS.
- Regresión backend: 43/43 PASS.
- Selenium Chrome, Firefox y Edge: 3/3 PASS.
- No se identificaron bloqueos pendientes dentro del alcance verificado de SEC-007.

### 7. Resultado

Las respuestas públicas de la API ya no incluyen los metadatos internos de persistencia identificados en SEC-007.

Las rutas API inexistentes devuelven HTTP 404 con contenido JSON.

Las correcciones fueron verificadas localmente y desplegadas en producción mediante el commit `cacb6f7`.

**SEC-007 — CLOSED**

---

## SEC-008 — Gestión de sesión, cierre de acceso y privacidad

**Fecha:** 18 de noviembre de 2026
**Estado:** CLOSED
**Tipo:** Seguridad, privacidad, funcionalidad y accesibilidad
**Alcance:** Frontend, almacenamiento del navegador, buscador global y política de privacidad.

### 1. Objetivo

Verificar que el visitante pueda finalizar su sesión desde las opciones disponibles en el portfolio, que los datos temporales de sesión se eliminen correctamente y que la información de privacidad sea accesible en español, inglés y portugués.

### 2. Implementaciones verificadas

- Cierre de sesión desde el menú principal y el footer.
- Eliminación de `portfolioSession` de `sessionStorage`.
- Redirección a `index.html` mediante `window.location.replace()`.
- Conservación de `portfolioLanguage` en `localStorage`.
- Incorporación de «Salir del portfolio» al buscador global.
- Incorporación de la Política de privacidad al buscador global.
- Búsqueda cruzada entre español, inglés y portugués.
- Navegación de resultados mediante teclado.
- Indicador visual al pasar el mouse sobre el botón X de la política.
- Adaptación responsive de los controles de salida.

### 3. Resultados de pruebas manuales

| Verificación | Resultado |
|---|---|
| Salida desde menú principal | PASS |
| Salida desde footer | PASS |
| Eliminación de `portfolioSession` | PASS |
| Redirección a página de acceso | PASS |
| Persistencia del idioma seleccionado | PASS |
| Búsqueda multilingüe ES/EN/PT | PASS |
| Búsqueda de salida: salir, exit y sair | PASS |
| Búsqueda de Política de privacidad en ES/EN/PT | PASS |
| Navegación con Tab y flechas | PASS |
| Apertura de la política desde el buscador | PASS |
| Efecto hover del botón X | PASS |
| Responsive a 375 px y 768 px | PASS |

**Tipo de evidencia:** pruebas manuales reportadas durante la auditoría.

Los resultados anteriores no representan ejecuciones automatizadas de Selenium.

### 4. Consideraciones de privacidad

El cierre de sesión elimina la entrada `portfolioSession` del almacenamiento de sesión del navegador.

La preferencia de idioma `portfolioLanguage` permanece almacenada en `localStorage`.

El cierre de sesión no elimina los registros de visitantes conservados en SQLite ni los mensajes enviados mediante el formulario de contacto.

La conservación y eliminación de los datos del servidor se rigen por los mecanismos y plazos documentados en la Política de privacidad.

### 5. Regresión automatizada Selenium

**Archivo:** `tests/selenium/sec-008-session-privacy.test.js`
**Entorno:** Local
**Idiomas:** Español (ES), inglés (EN) y portugués (PT).

Se ejecutaron pruebas automatizadas para verificar:

- Acceso a la Política de privacidad desde el buscador global.
- Apertura de la política mediante clic y mediante Enter.
- Cierre del diálogo mediante Escape.
- Conservación de la sesión al consultar la política.
- Cierre de sesión desde el buscador global.
- Cierre de sesión desde el menú principal.
- Cierre de sesión desde el footer.
- Eliminación de `portfolioSession` al finalizar el acceso.
- Redirección a `index.html`.
- Persistencia de `portfolioLanguage` después del cierre de sesión.

#### Resultados por navegador

| Navegador | PASS | FAIL | Resultado |
|---|---:|---:|---|
| Google Chrome | 15 | 0 | PASS |
| Mozilla Firefox | 15 | 0 | PASS |
| Microsoft Edge | 15 | 0 | PASS |
| **Total** | **45** | **0** | **PASS** |

**Resultado:** 45/45 PASS.

Las pruebas complementarias de menú, footer y acceso mediante Enter fueron incorporadas después de la primera ejecución de regresión.

Durante su desarrollo se corrigieron interacciones del código de automatización relacionadas con la visibilidad del menú, el desplazamiento al footer y la selección de resultados del buscador.

Las ejecuciones finales de los escenarios corregidos finalizaron satisfactoriamente en los tres navegadores.

Los resultados corresponden a verificaciones locales. No constituyen evidencia de ejecución en producción.

#### Verificación de conservación y respaldos

Se revisó la implementación de conservación de visitantes y la configuración de respaldos del VPS.

- Conservación de visitantes SQLite: 90 días.
- Limpieza al iniciar el backend y periódicamente durante su funcionamiento.
- Respaldo automático diario mediante `portfolio-backup.timer`, programado a las 03:00 UTC.
- Script de respaldo: `/usr/local/lib/portfolio/backup-sqlite.cjs`.
- Destino de los respaldos: `/var/lib/portfolio/backups`, fuera del directorio público.
- Permisos de los archivos de respaldo: `0600`.
- Comprobación de integridad mediante `PRAGMA integrity_check`.
- Retención configurada de respaldos automáticos: 7 días.
- Rotación diaria de registros Nginx, con 14 rotaciones configuradas.

**Evidencia de ejecución del respaldo:**

| Fecha UTC | Resultado |
|---|---|
| 17/11/2026 20:52:13 | PASS |
| 18/11/2026 03:00:04 | PASS |

Las dos ejecuciones registraron un respaldo verificado y finalizaron correctamente.

La eliminación de copias vencidas está implementada, pero no se observó una eliminación efectiva en los registros consultados.

### 6. Validación en producción

**Fecha:** 18 de noviembre de 2026
**Entorno:** Producción — https://mfportfolio.com.ar
**Navegador:** Google Chrome
**Tipo:** Pruebas manuales funcionales
**Resultado:** PASS

#### 6.1. Cierre de sesión desde el menú

| Comprobación | Resultado |
|---|---|
| Cierre de sesión desde el menú de navegación | PASS |
| Acceso a home.html después del cierre | PASS |
| Persistencia del idioma seleccionado | PASS |

El cierre elimina la sesión del navegador y permite regresar a la página de acceso. La preferencia de idioma permanece disponible.

#### 6.2. Cierre de sesión desde el footer

| Comprobación | ES | EN | PT |
|---|---|---|---|
| Cierre de sesión | PASS | PASS | PASS |
| Redirección a index.html | PASS | PASS | PASS |
| Persistencia del idioma | PASS | PASS | PASS |

#### 6.3. Cierre de sesión mediante el buscador

| Comprobación | ES | EN | PT |
|---|---|---|---|
| Búsqueda de la opción de cierre | PASS | PASS | PASS |
| Selección mediante Enter | PASS | PASS | PASS |
| Cierre de sesión y redirección | PASS | PASS | PASS |
| Persistencia del idioma | PASS | PASS | PASS |

#### 6.4. Política de privacidad

| Comprobación | ES | EN | PT |
|---|---|---|---|
| Búsqueda de la política | PASS | PASS | PASS |
| Apertura mediante Enter | PASS | PASS | PASS |
| Visualización de las 13 secciones | PASS | PASS | PASS |
| Desplazamiento del contenido | PASS | PASS | PASS |
| Cierre mediante Escape | PASS | PASS | PASS |
| Cierre mediante botón X | PASS | PASS | PASS |
| Conservación de la sesión | PASS | PASS | PASS |

Las comprobaciones anteriores corresponden a pruebas manuales realizadas en producción y reportadas durante la validación de SEC-008.

### 7. Publicación y despliegue

**Repositorio:** MiguelGabrielFlor/miguel-flor-qa-ai-portfolio
**Rama:** master
**Commit:** f870fd1
**Mensaje:** SEC-008: session logout, privacy policy and QA regression

**Resultados:**

- Publicación en GitHub: PASS.
- Actualización del repositorio del VPS: PASS.
- Coincidencia de HEAD, master y origin/master con f870fd1: PASS.
- Validación funcional en producción: PASS.

### 8. Alcance y limitaciones

- La regresión Selenium local finalizó con 45/45 PASS en Chrome, Firefox y Edge.
- La validación funcional de producción se realizó manualmente en Chrome.
- No se ejecutó una nueva regresión Selenium contra producción.
- La estructura de la política de privacidad fue comprobada en ES, EN y PT, con 13 secciones y 36 párrafos por idioma. Esto no constituye una auditoría lingüística completa.
- El control de sesión del frontend no equivale a una restricción de acceso del lado del servidor.
- La eliminación de respaldos vencidos está implementada, pero no se observó una eliminación efectiva en los registros consultados.
- La eliminación de mensajes de contacto conservados en servicios externos requiere procedimientos y verificaciones independientes.

Estas limitaciones quedan documentadas y no se presentan como verificaciones aprobadas.

### 9. Resultado final

**SEC-008 — CLOSED**

La implementación y la regresión funcional previstas para SEC-008 se completaron.

**Evidencia consolidada:**

- Regresión automatizada local: 45/45 PASS.
- Validación manual de cierre de sesión en producción: PASS.
- Validación manual del buscador en ES/EN/PT: PASS.
- Validación manual de la política de privacidad en ES/EN/PT: PASS.
- Conservación y respaldos SQLite: configuración y ejecuciones verificadas.
- Publicación en GitHub y despliegue en VPS: PASS.

**Conclusión:** SEC-008 se declara cerrado dentro del alcance funcional y técnico documentado, conservando las limitaciones indicadas en la sección 8.
