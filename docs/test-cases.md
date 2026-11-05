# Test Cases

## Project

Miguel Flor — QA & AI Portfolio

---

# TC-001 — Empty Registration Form

### Requirement

FR-002

### Priority

High

### Type

Negative Testing

### Preconditions

El usuario se encuentra en la pantalla
de registro.

### Steps

1. Abrir la aplicación.
2. No completar ningún campo.
3. Presionar "Ingresar al portfolio".

### Expected Result

El sistema debe mostrar mensajes de
validación para todos los campos obligatorios.

### Execution Status

PASS — Ejecución histórica documentada.

### Execution Reference

Consultar `docs/test-report.md` para el resultado
registrado durante la ejecución original.

Este estado no representa una nueva ejecución
del caso durante la auditoría actual.

---

# TC-002 — Successful Registration

### Requirement

FR-001
FR-005

### Priority

High

### Type

Positive Testing

### Preconditions

El usuario se encuentra en la pantalla
de registro.

### Test Data

Nombre: Miguel

Apellido: Flor

Email: valid@example.com

Teléfono: 1123456789

Consentimiento: Accepted

### Steps

1. Ingresar nombre.
2. Ingresar apellido.
3. Ingresar email.
4. Ingresar teléfono.
5. Aceptar consentimiento.
6. Presionar "Ingresar al portfolio".

### Expected Result

El sistema debe permitir acceder al
portfolio y mostrar el Home.

### Execution Status

PASS — Ejecución histórica documentada.

### Execution Reference

Consultar `docs/test-report.md` para el resultado
registrado durante la ejecución original.

Este estado no representa una nueva ejecución
del caso durante la auditoría actual.

---

# TC-003 — Required First Name

### Requirement

FR-002

### Priority

High

### Type

Negative Testing

### Steps

1. Dejar nombre vacío.
2. Completar los demás campos.
3. Aceptar consentimiento.
4. Presionar el botón.

### Expected Result

Debe mostrarse:

"El nombre es obligatorio."

### Execution Status

PASS — Ejecución histórica documentada.

### Execution Reference

Consultar `docs/test-report.md` para el resultado
registrado durante la ejecución original.

Este estado no representa una nueva ejecución
del caso durante la auditoría actual.

---

# TC-004 — Invalid Email

### Requirement

FR-003

### Priority

High

### Type

Negative Testing

### Test Data

Email:

miguel@

### Steps

1. Ingresar un email inválido.
2. Completar los demás campos.
3. Aceptar consentimiento.
4. Presionar el botón.

### Expected Result

Debe mostrarse:

"Ingresá un email válido."

### Execution Status

PASS — Ejecución histórica documentada.

### Execution Reference

Consultar `docs/test-report.md` para el resultado
registrado durante la ejecución original.

Este estado no representa una nueva ejecución
del caso durante la auditoría actual.

### Related Bug

BUG-004 — Email format validation.

### Complementary Automated Regression

**Archivo:** `tests/selenium/invalid-email-double-at.test.js`

**Fecha:** 30/10/2026

Se verificaron cinco formatos inválidos de correo
electrónico en Google Chrome, Mozilla Firefox
y Microsoft Edge.

**Resultado:** 15/15 PASS — 0 FAIL.

La regresión complementa el caso manual TC-004
y verifica el rechazo de cinco formatos inválidos
de correo electrónico.

BUG-004 fue reclasificado como una observación
de requisitos, originada por interpretar que la
validación del formato también debía comprobar
la existencia del correo electrónico.

FR-003 exige validar el formato, no verificar
la existencia del dominio o del buzón.

La evidencia histórica no confirmó un defecto
funcional de validación de formato.

Por tanto, los resultados 15/15 PASS acreditan
el comportamiento verificado mediante Selenium,
pero no constituyen evidencia de la corrección
de un defecto funcional histórico.

---

# TC-005 — Consent Required

### Requirement

FR-004

### Priority

High

### Type

Negative Testing

### Steps

1. Completar todos los campos correctamente.
2. No aceptar consentimiento.
3. Presionar el botón.

### Expected Result

El sistema debe impedir el acceso.

Debe mostrar:

"Debés aceptar el registro de tus datos."

### Execution Status

PASS — Ejecución histórica documentada.

### Execution Reference

Consultar `docs/test-report.md` para el resultado
registrado durante la ejecución original.

Este estado no representa una nueva ejecución
del caso durante la auditoría actual.

---

# TC-006 — Navigate to About

### Requirement

FR-006

### Priority

Medium

### Type

Functional Testing

### Preconditions

El usuario accedió al portfolio.

### Steps

1. Presionar "Sobre mí".

### Expected Result

La página debe desplazarse hasta
la sección "Sobre mí".


### Execution Status

PASS — Ejecución manual verificada el 20/10/2026.

### Execution Reference

Se ejecutó manualmente el escenario
TC-006 — Navegación a Sobre mí.

Verificaciones realizadas:

1. Acceso al portfolio: PASS.
2. Selección de "Sobre mí" en la navegación: PASS.
3. Desplazamiento hasta #about: PASS.
4. Visualización correcta de la sección: PASS.

Resultado: PASS.

Defectos reportados: ninguno.

Esta ejecución corresponde a la navegación actual
del portfolio y es independiente de la regresión Selenium.

---

# TC-007 — Navegación a Especialidades

### Requirement

FR-006

### Priority

High

### Type

Functional Testing

### Preconditions

El usuario accedió al portfolio.

### Steps

1. Seleccionar "Especialidades" en la navegación principal.
2. Comprobar la sección a la que se desplaza la página.

### Expected Result

La página debe desplazarse hasta la sección
"Especialidades" (#specialties).

### Execution Status

PASS — Ejecución manual verificada el 20/10/2026.

### Execution Reference

Se ejecutó manualmente el escenario actualizado
TC-007 — Navegación a Especialidades.

Verificaciones realizadas:

1. Acceso al portfolio mediante el formulario.
2. Selección de "Especialidades" en la navegación principal.
3. Desplazamiento correcto hasta #specialties.
4. Visualización de la sección sin errores aparentes.

Resultado: PASS.

Defectos observados: ninguno durante esta ejecución.

El escenario anterior "Navigate to QA" conserva
su referencia histórica independiente.

---

# TC-008 — Mobile Responsive

### Requirement

FR-007

### Priority

High

### Type

Responsive Testing

### Steps

1. Abrir Chrome DevTools.
2. Activar Device Toolbar.
3. Seleccionar un dispositivo móvil.
4. Abrir la aplicación.
5. Navegar por las diferentes secciones.

### Expected Result

La aplicación debe adaptarse correctamente
al tamaño de pantalla.

### Execution Status

PASS — Ejecución histórica documentada.

### Execution Reference

Consultar `docs/test-report.md` para el resultado
registrado durante la ejecución original.

Este estado no representa una nueva ejecución
del caso durante la auditoría actual.

### Complementary Responsive Verification — 05/11/2026

Se realizó una revisión manual responsive posterior
sobre las seis páginas del portfolio.

**Navegadores:** Chrome, Firefox y Microsoft Edge.

**Resultado:** PASS — Sin desbordamientos de texto
ni problemas visuales pendientes observados.

**Referencia:** docs/test-report.md,
sección "Verificación manual responsive y compatibilidad visual".

Esta comprobación complementa el resultado histórico
de TC-008 sin modificarlo.


---

# TC-009 — UI Readability

### Requirement

NFR-001

### Priority

Medium

### Type

UI Testing

### Steps

1. Abrir la aplicación.
2. Revisar títulos.
3. Revisar botones.
4. Revisar formularios.
5. Revisar navegación.

### Expected Result

Los elementos deben ser claramente visibles
y comprensibles.

### Execution Status

PASS — Ejecución histórica documentada.

### Execution Reference

Consultar `docs/test-report.md` para el resultado
registrado durante la ejecución original.

Este estado no representa una nueva ejecución
del caso durante la auditoría actual.

---

# TC-010 — User Interaction Performance

### Requirement

NFR-002

### Priority

Medium

### Type

Performance Testing

### Preconditions

La aplicación se encuentra disponible
en un entorno de prueba definido.

### Steps

1. Abrir la aplicación en Chrome.
2. Abrir Chrome DevTools.
3. Registrar el tiempo de carga inicial.
4. Completar el formulario de acceso.
5. Ejecutar la acción de ingreso.
6. Medir el tiempo hasta la respuesta visual.
7. Registrar las solicitudes HTTP relacionadas.

### Expected Result

La aplicación debe responder a las acciones
del usuario de acuerdo con los umbrales
de rendimiento establecidos.

### Evidence Required

- Navegador y versión.
- Entorno de ejecución.
- Herramienta de medición.
- Tiempos observados en milisegundos.
- Umbrales de aceptación.
- Resultado de la comparación.

### Execution Status

Pendiente de medición.

### Observations

Los resultados históricos del caso original
se conservan en los informes de ejecución.

La ausencia de umbrales definidos impide
determinar actualmente un PASS o FAIL
objetivo para este caso de rendimiento.

---

# TC-011 — Browser Compatibility

### Requirement

NFR-003

### Priority

Medium

### Type

Compatibility Testing

### Browsers

- Google Chrome
- Mozilla Firefox
- Microsoft Edge

### Preconditions

La aplicación se encuentra disponible
en el entorno de prueba.

### Steps

1. Abrir la aplicación en el navegador seleccionado.
2. Verificar la visualización del formulario de acceso.
3. Comprobar las validaciones de los campos obligatorios.
4. Completar un registro válido.
5. Verificar el acceso al portfolio.
6. Comprobar la navegación entre secciones.
7. Verificar el selector de idioma ES/EN/PT.
8. Repetir el procedimiento en los demás navegadores.

### Expected Result

Las funcionalidades principales deben
comportarse correctamente en cada navegador,
sin errores funcionales ni problemas visuales
que impidan su utilización.

### Evidence Required

- Navegador y versión.
- Sistema operativo.
- Fecha de ejecución.
- Escenarios ejecutados.
- Resultados PASS/FAIL.
- Capturas de los defectos encontrados, si corresponde.


### Execution Status

VERIFICACIÓN PARCIAL — Actualizada el 21/10/2026.

Regresión automatizada Selenium:

- Google Chrome: 12 PASS, 0 FAIL, 0 SKIP.
- Mozilla Firefox: 12 PASS, 0 FAIL, 0 SKIP.
- Microsoft Edge: 12 PASS, 0 FAIL, 0 SKIP.

**Total: 36 PASS, 0 FAIL, 0 SKIP.**

### Observations

Se ejecutaron 12 escenarios automatizados en cada uno
de los tres navegadores.

La cobertura incluye:

- Formulario de acceso y validaciones.
- Consentimiento obligatorio.
- Registro válido.
- Selector de idioma ES/EN/PT.
- Envío exitoso del formulario de contacto.
- Validación de mensaje de contacto vacío.
- Manejo de error HTTP 500 mediante API simulada.

Los resultados confirman el funcionamiento de los
escenarios cubiertos por Selenium en los tres navegadores.


### Actualización de cobertura visual — 05/11/2026

Se completó la revisión manual responsive de las seis páginas
del portfolio en Google Chrome, Mozilla Firefox y Microsoft Edge.

No se observaron desbordamientos de texto pendientes ni
anomalías visuales relevantes durante el recorrido final.

Esta verificación complementa las regresiones automatizadas
Selenium documentadas en docs/test-report.md.

**Estado de la revisión visual:** PASS.

**Estado general de TC-011:** VERIFICACIÓN PARCIAL.

La revisión visual no sustituye la ejecución integral de
todos los pasos funcionales de TC-011 ni constituye una
auditoría exhaustiva de compatibilidad.

La regresión histórica del 20/10/2026 conserva
sus 33 PASS independientes.

Consultar `docs/test-report.md` para la ejecución
del 21/10/2026 y sus limitaciones.

---

# TC-012 — Invalid Phone

### Requirement

FR-008

### Priority

High

### Type

Negative Testing

### Test Data

Phone:

abc

### Steps

1. Ingresar nombre válido.
2. Ingresar apellido válido.
3. Ingresar email válido.
4. Ingresar "abc" como teléfono.
5. Aceptar consentimiento.
6. Presionar el botón.

### Expected Result

El sistema debe rechazar el teléfono
y mostrar un mensaje de validación.

### Execution Status

PASS — Ejecución histórica documentada.

### Execution Reference

Consultar `docs/test-report.md` para el resultado
registrado durante la ejecución original.

Este estado no representa una nueva ejecución
del caso durante la auditoría actual.

### Related Bug

BUG-001


---

# TC-013 — Empty Phone

### Requirement

FR-008

### Priority

High

### Type

Negative Testing

### Test Data

Phone: (empty)

### Steps

1. Ingresar nombre válido.
2. Ingresar apellido válido.
3. Ingresar email válido.
4. Dejar el teléfono vacío.
5. Aceptar consentimiento.
6. Presionar el botón.

### Expected Result

El sistema debe rechazar el registro y mostrar
el mensaje de teléfono obligatorio.

### Execution Status

PASS — Ejecución histórica documentada.

### Execution Reference

Consultar `docs/test-report.md` para el resultado
registrado durante la ejecución original.

Este estado no representa una nueva ejecución
del caso durante la auditoría actual.

---

# TC-014 — Phone with Mixed Letters and Numbers

### Requirement

FR-008

### Priority

High

### Type

Negative Testing

### Test Data

Phone: `jdhfadg246`

### Steps

1. Ingresar nombre válido.
2. Ingresar apellido válido.
3. Ingresar email válido.
4. Ingresar `jdhfadg246` como teléfono.
5. Aceptar consentimiento.
6. Presionar el botón.

### Expected Result

El sistema debe rechazar el teléfono y mostrar
un mensaje de validación.

### Execution Status

PASS — Ejecución histórica documentada.

### Execution Reference

Consultar `docs/test-report.md` para el resultado
registrado durante la ejecución original.

Este estado no representa una nueva ejecución
del caso durante la auditoría actual.

---

# TC-015 — Phone Below Minimum Length

### Requirement

FR-008

### Priority

High

### Type

Negative Testing

### Test Data

Phone: `123456`

### Steps

1. Ingresar nombre válido.
2. Ingresar apellido válido.
3. Ingresar email válido.
4. Ingresar `123456` como teléfono.
5. Aceptar consentimiento.
6. Presionar el botón.

### Expected Result

El sistema debe rechazar el teléfono porque
contiene menos de 7 dígitos.

### Execution Status

PASS — Ejecución histórica documentada.

### Execution Reference

Consultar `docs/test-report.md` para el resultado
registrado durante la ejecución original.

Este estado no representa una nueva ejecución
del caso durante la auditoría actual.

---

# TC-016 — Phone at Minimum Length

### Requirement

FR-008

### Priority

Medium

### Type

Positive Testing

### Test Data

Phone: `1234567`

### Steps

1. Ingresar nombre válido.
2. Ingresar apellido válido.
3. Ingresar email válido.
4. Ingresar `1234567` como teléfono.
5. Aceptar consentimiento.
6. Presionar el botón.

### Expected Result

El sistema debe aceptar el teléfono y permitir
continuar si los demás campos son válidos.

### Execution Status

PASS — Ejecución histórica documentada.

### Execution Reference

Consultar `docs/test-report.md` para el resultado
registrado durante la ejecución original.

Este estado no representa una nueva ejecución
del caso durante la auditoría actual.

---

# TC-017 — Phone with Prefix and Separators

### Requirement

FR-008

### Priority

Medium

### Type

Positive Testing

### Test Data

Phone: `+54 9 2996299558`

### Steps

1. Ingresar nombre válido.
2. Ingresar apellido válido.
3. Ingresar email válido.
4. Ingresar `+54 9 2996299558` como teléfono.
5. Aceptar consentimiento.
6. Presionar el botón.

### Expected Result

El sistema debe aceptar el teléfono con prefijo
internacional y espacios si los demás campos son válidos.

### Execution Status

PASS — Ejecución histórica documentada.

### Execution Reference

Consultar `docs/test-report.md` para el resultado
registrado durante la ejecución original.

Este estado no representa una nueva ejecución
del caso durante la auditoría actual.

---


# TC-018 — Phone Above Maximum Length

### Requirement

FR-008

### Priority

High

### Type

Negative Testing

### Test Data

Phone: `1234567890123456`

### Steps

1. Ingresar nombre válido.
2. Ingresar apellido válido.
3. Ingresar email válido.
4. Ingresar `1234567890123456` como teléfono.
5. Aceptar consentimiento.
6. Presionar el botón.

### Expected Result

El sistema debe rechazar el teléfono porque
contiene más de 15 dígitos.

### Execution Status

PASS — Ejecución histórica documentada.

### Execution Reference

Consultar `docs/test-report.md` para el resultado
registrado durante la ejecución original.

Este estado no representa una nueva ejecución
del caso durante la auditoría actual.

### Related Bug

BUG-005 — Phone above maximum length.

### Complementary Automated Regression

**Archivo:** `tests/selenium/phone-validation-boundaries.test.js`

**Escenario:** BUG-005.

**Dato de prueba:** `1234567890123456`.

**Fecha:** 30/10/2026.

**Resultados por navegador:**

- Google Chrome: 1 PASS.
- Mozilla Firefox: 1 PASS.
- Microsoft Edge: 1 PASS.

**Resultado del escenario:** 3/3 PASS — 0 FAIL.

La regresión confirma que el sistema rechaza
un teléfono de 16 dígitos después de la corrección.

El escenario forma parte de una suite más amplia
de validación telefónica, cuyo resultado fue
33/33 PASS en los tres navegadores.

La ejecución histórica de TC-018 se conserva
independiente de esta regresión automatizada.

---

# Sprint 2 — API Testing

## API-TC-001 — API Health Check

**Requirement:** API-001

**Type:** API Testing
**Method:** GET
**Endpoint:** `/api/health`
**Expected Status:** 200 OK
**Actual Result:** La API respondió con `status: ok`.
**Execution Status:** PASS — Ejecución histórica documentada.

---

## API-TC-002 — Successful Visitor Registration

**Requirement:** API-002

**Type:** API Testing
**Method:** POST
**Endpoint:** `/api/visitors`
**Test Data:** Visitante válido, con consentimiento aceptado.
**Expected Status:** 201 Created
**Actual Result:** Se creó el registro y la API devolvió el ID del visitante y su nombre.
**Execution Status:** PASS — Ejecución histórica documentada.

---

## API-TC-003 — Invalid Email

**Requirement:** API-003

**Type:** Negative API Testing
**Method:** POST
**Endpoint:** `/api/visitors`
**Test Data:** `correo-invalido`
**Expected Status:** 400 Bad Request
**Actual Result:** La API rechazó el correo e indicó que debe ingresarse una dirección válida.
**Execution Status:** PASS — Ejecución histórica documentada.

---

## API-TC-004 — Invalid Phone

**Requirement:** API-004

**Type:** Negative API Testing
**Method:** POST
**Endpoint:** `/api/visitors`
**Test Data:** `123abc`
**Expected Status:** 400 Bad Request
**Actual Result:** La API rechazó el teléfono inválido.
**Execution Status:** PASS — Ejecución histórica documentada.

---

## API-TC-005 — Consent Required

**Requirement:** API-005

**Type:** Negative API Testing
**Method:** POST
**Endpoint:** `/api/visitors`
**Test Data:** `consentimiento: false`
**Expected Status:** 400 Bad Request
**Actual Result:** La API rechazó el registro e indicó que el consentimiento es obligatorio.
**Execution Status:** PASS — Ejecución histórica documentada.

---

## API-TC-006 — Visitor Data Persistence

**Requirement:** API-006

**Type:** Database Testing
**Database:** SQLite
**Expected Result:** Los registros válidos deben conservarse en la base de datos.
**Actual Result:** Se consultaron dos registros persistidos, con IDs 1 y 2. Ambos tienen consentimiento aceptado.
**Execution Status:** PASS — Ejecución histórica documentada.

---

## API-TC-007 — Contact Service Not Configured

**Requirement:** API-007

**Type:** Negative API Testing  
**Method:** POST  
**Endpoint:** `/api/contact`  
**Precondition:** El servicio de correo no está configurado.  
**Expected Status:** 503 Service Unavailable  
**Expected Result:** La API informa que el servicio de correo no está configurado.  
**Execution Status:** PASS — Ejecución histórica documentada.

---

## API-TC-008 — Successful Contact Message Submission

**Requirement:** API-007

**Type:** API Testing  
**Method:** POST  
**Endpoint:** `/api/contact`  
**Precondition:** El servicio de correo está configurado y el envío se simula mediante un servicio de prueba.  
**Expected Status:** 200 OK  
**Expected Result:** La API confirma que el mensaje fue enviado correctamente.  
**Execution Status:** PASS — Ejecución histórica documentada.

---

## API-TC-009 — Empty Contact Message

**Requirement:** API-007

**Type:** Negative API Testing  
**Method:** POST  
**Endpoint:** `/api/contact`  
**Test Data:** Mensaje vacío.  
**Expected Status:** 400 Bad Request  
**Expected Result:** La API rechaza el mensaje de contacto no válido.  
**Execution Status:** PASS — Ejecución histórica documentada.

---

## API-TC-010 — Contact Email Sending Failure

**Requirement:** API-007

**Type:** Negative API Testing  
**Method:** POST  
**Endpoint:** `/api/contact`  
**Precondition:** El servicio de correo está configurado, pero el proveedor SMTP simula un fallo de envío.  
**Expected Status:** 500 Internal Server Error  
**Expected Result:** La API informa que no pudo enviar el mensaje y solicita intentar nuevamente más tarde.  
**Execution Status:** PASS — Ejecución histórica documentada.

---


# Sprint 3 — Selenium UI Testing

## Casos de prueba automatizados

**Fecha de regresión base documentada:** 21/10/2026 
**Herramienta:** Selenium WebDriver  
**Navegadores:** Chrome, Firefox y Microsoft Edge  
**Resultado:** 36 PASS, 0 FAIL, 0 SKIP.

| ID | Escenario | Archivo |
|---|---|---|
| UI-001 | Apertura del formulario de acceso | `access-page.test.js` |
| UI-002 | Formulario de acceso vacío | `empty-form.test.js` |
| UI-003 | Validación de email inválido | `invalid-email.test.js` |
| UI-004 | Nombre inválido | `invalid-first-name.test.js` |
| UI-005 | Apellido inválido | `invalid-last-name.test.js` |
| UI-006 | Validación de teléfono inválido | `invalid-phone.test.js` |
| UI-007 | Consentimiento obligatorio | `missing-consent.test.js` |
| UI-008 | Registro válido y acceso al portfolio | `valid-registration.test.js` |
| UI-009 | Selector de idioma ES/EN/PT | `language-selector.test.js` |
| UI-010 | Envío válido del formulario de contacto | `contact-valid.test.js` |
| UI-011 | Rechazo del mensaje de contacto vacío | `contact-empty.test.js` |
| UI-015 | Manejo de error HTTP 500 | `contact-server-error.test.js` |

## Resultado de ejecución

### Regresión base — 21/10/2026

Se ejecutaron 12 escenarios Selenium en cada navegador:

- Chrome: 12 PASS, 0 FAIL, 0 SKIP.
- Firefox: 12 PASS, 0 FAIL, 0 SKIP.
- Microsoft Edge: 12 PASS, 0 FAIL, 0 SKIP.

**Total: 36 ejecuciones satisfactorias.**

La regresión incluye UI-015, que verifica el manejo
del error HTTP 500 mediante una API simulada.

UI-010 y UI-015 finalizaron con PASS en los tres
navegadores, sin interferencias observadas.

### Regresión histórica — 20/10/2026

- Chrome: 11 PASS.
- Firefox: 11 PASS.
- Microsoft Edge: 11 PASS.

**Total histórico: 33 PASS, 0 FAIL, 0 SKIP.**

Los resultados históricos se conservan como evidencia
de la evolución de la cobertura automatizada.

## Regresión complementaria — BUG-002

**Defecto:** BUG-002 — Nombre con caracteres numéricos.

**Requisito principal:** FR-012 — Validación de Nombre y Apellido.

**Requisito complementario:** FR-002 — Campos obligatorios.

**Archivo Selenium:** `tests/selenium/invalid-first-name-numeric.test.js`

**Dato de prueba:** `sdfh567`

**Resultado esperado:**
- Rechazar el nombre que contiene números.
- Mostrar el mensaje de validación correspondiente.
- Impedir el acceso al portfolio.

**Fecha de ejecución:** 30/10/2026.

### Resultados por navegador

| Navegador | PASS | FAIL |
|---|---:|---:|
| Google Chrome | 1 | 0 |
| Mozilla Firefox | 1 | 0 |
| Microsoft Edge | 1 | 0 |
| **Total** | **3** | **0** |

**Estado:** PASS — Defecto corregido y regresión satisfactoria.

### Relación con UI-004

UI-004 (`invalid-first-name.test.js`) verifica
un nombre demasiado corto (`M`).

La prueba de BUG-002 verifica específicamente
un nombre que contiene números (`sdfh567`).

Ambos escenarios corresponden a FR-012,
pero comprueban condiciones diferentes.

La regresión de BUG-002 no sustituye
ni modifica los resultados históricos de UI-004.

## Regresión complementaria — BUG-003

**Defecto:** BUG-003 — Apellido con caracteres numéricos.

**Requisito principal:** FR-012 — Validación de Nombre y Apellido.

**Requisito complementario:** FR-002 — Campos obligatorios.

**Archivo Selenium:** `tests/selenium/invalid-last-name-numeric.test.js`

**Dato de prueba:** `Flor567`

**Resultado esperado:**
- Rechazar el apellido que contiene números.
- Mostrar el mensaje de validación correspondiente.
- Impedir el acceso al portfolio.

**Fecha de ejecución:** 30/10/2026.

### Resultados por navegador

| Navegador | PASS | FAIL |
|---|---:|---:|
| Google Chrome | 1 | 0 |
| Mozilla Firefox | 1 | 0 |
| Microsoft Edge | 1 | 0 |
| **Total** | **3** | **0** |

**Estado:** PASS — Defecto corregido y regresión satisfactoria.

### Relación con UI-005

UI-005 (`invalid-last-name.test.js`) verifica
un apellido demasiado corto (`F`).

La prueba de BUG-003 verifica específicamente
un apellido que contiene números (`Flor567`).

Ambos escenarios corresponden a FR-012,
pero comprueban condiciones diferentes.

La regresión de BUG-003 no sustituye
ni modifica los resultados históricos de UI-005.


## Alcance y limitaciones

Las pruebas automatizadas verifican los escenarios
implementados en Selenium.

Las pruebas que requieren comunicación con el backend
utilizan un servidor de API simulado y una base SQLite
en memoria. El escenario de contacto exitoso no
demuestra la entrega real de correos mediante SMTP.

La regresión no equivale a una auditoría integral de
compatibilidad visual, rendimiento o accesibilidad.

Para consultar los resultados completos y sus
limitaciones, revisar `docs/test-report.md`.

Para consultar los escenarios interactivos,
revisar la sección de automatización en `qa.html`.

---

# Pruebas manuales complementarias — Formulario de contacto

## FR-010 — Validaciones y envío

**Fecha de ejecución:** 21/10/2026  
**Tipo:** Pruebas funcionales manuales  
**Entorno:** Aplicación local y Chrome DevTools

| ID | Escenario | Resultado |
|---|---|---|
| CT-001 | Límite de 5000 caracteres mediante escritura | PASS |
| CT-002 | Límite de 5000 caracteres mediante pegado | PASS |
| CT-003 | Mensaje compuesto únicamente por espacios | PASS |
| CT-004 | Doble clic rápido en Enviar mensaje | PASS |
| CT-005 | Envío exitoso y limpieza del formulario | PASS |

## Evidencia de CT-004 y CT-005

Endpoint: `POST http://localhost:3000/api/contact`

Código HTTP: `200 OK`

Respuesta:

`{"message":"Mensaje enviado correctamente."}`

Durante la comprobación del doble clic se observó
una única solicitud POST en Chrome DevTools.

La respuesta HTTP exitosa explica la limpieza
del formulario mediante `contactForm.reset()`.

No se verificó mediante esta prueba la entrega
efectiva del correo en la bandeja del destinatario.

## Alcance

Estos cinco resultados corresponden a comprobaciones
manuales complementarias.

No forman parte de las 33 ejecuciones Selenium
documentadas el 20/10/2026.

## CT-006 — Servidor inaccesible

**Requisito:** FR-010  
**Tipo:** Prueba funcional negativa  
**Fecha:** 21/10/2026  
**Resultado:** PASS — Ejecución manual.

### Precondiciones

- Portfolio abierto en el navegador.
- Backend Node.js detenido.

### Pasos

1. Ingresar un mensaje válido.
2. Presionar "Enviar mensaje".
3. Verificar el mensaje de error.
4. Comprobar que el texto ingresado se conserva.
5. Intentar nuevamente el envío.

### Resultado esperado

- Mostrar el mensaje de error de conexión.
- Conservar el contenido del campo.
- Habilitar nuevamente el botón de envío.
- Permitir un nuevo intento.

### Resultado obtenido

PASS.

Se mostró el mensaje:

"No se pudo conectar con el servidor. Intentá nuevamente."

El texto ingresado permaneció en el formulario.

Se realizó un segundo intento de envío y volvió a
mostrarse el error, sin perder el contenido.

No se observaron defectos durante esta ejecución.

### Evidencia

Verificación visual del formulario y solicitud
a `http://localhost:3000/api/contact`
desde Chrome DevTools.

## CT-007 — Manejo de error HTTP 500

**Requisito:** FR-010  
**Tipo:** Prueba funcional negativa  
**Fecha:** 21/10/2026  
**Resultado:** PASS — Ejecución manual.

### Precondiciones

- Portfolio disponible en Chrome.
- API simulada ejecutándose en el puerto 3000.
- Variable `MOCK_EMAIL_FAILURE=true`.
- Servicio de correo configurado para simular un fallo SMTP.

### Pasos

1. Ingresar un mensaje válido en el formulario de contacto.
2. Presionar "Enviar mensaje".
3. Inspeccionar la solicitud POST en Chrome DevTools.
4. Verificar el código HTTP y el mensaje mostrado.
5. Comprobar que el texto ingresado se conserva.
6. Volver a presionar "Enviar mensaje".
7. Verificar que se permite reintentar y que la API devuelve nuevamente HTTP 500.

### Resultado esperado

- La API devuelve HTTP 500.
- Se muestra el mensaje:
  "No se pudo enviar el mensaje. Intentá nuevamente más tarde."
- El contenido del formulario se conserva.
- El botón vuelve a habilitarse.
- Se permite realizar otro intento.

### Resultado obtenido

PASS.

La API simulada devolvió HTTP 500 Internal Server Error.

El frontend mostró correctamente el mensaje esperado.

El contenido del campo permaneció intacto.

El botón volvió a habilitarse y permitió realizar
un segundo intento, que también recibió HTTP 500.

### Evidencia

Chrome DevTools — Network → Fetch/XHR.

Endpoint: `POST http://localhost:3000/api/contact`

Respuesta HTTP: `500 Internal Server Error`.

Se utilizó un fallo SMTP simulado.
No se enviaron correos reales.

---

# Casos de prueba — Buscador global

**Referencia:** BL-02  
**Módulo:** Buscador global del portfolio  
**Tipo de ejecución:** Manual  
**Entorno:** Chrome y portfolio local  
**Estado:** 17 PASS / 0 FAIL

## Pruebas funcionales y de teclado

| ID | Escenario | Resultado esperado | Estado |
|---|---|---|---|
| TC-SEARCH-001 | Búsquedas consecutivas | GitHub, LinkedIn y formación accesibles sin recargar la página | PASS |
| TC-SEARCH-002 | Navegación con flechas | La selección avanza y retrocede entre resultados | PASS |
| TC-SEARCH-003 | Enter sobre selección | Se abre el resultado seleccionado | PASS |
| TC-SEARCH-004 | Tecla Escape | Se cierra el panel y puede iniciarse otra búsqueda | PASS |
| TC-SEARCH-005 | Sin coincidencias | Se informa que no existen resultados y el buscador no se bloquea | PASS |
| TC-SEARCH-006 | Selección con mouse | Se abre el destino y se cierra el panel | PASS |

## Navegación entre páginas

| ID | Origen | Búsqueda | Destino esperado | Estado |
|---|---|---|---|---|
| TC-SEARCH-007 | Home | credenciales | CV · Formación | PASS |
| TC-SEARCH-008 | CV | sqlite | Backend | PASS |
| TC-SEARCH-009 | Frontend | gherkin | Gestión de Calidad · BDD | PASS |
| TC-SEARCH-010 | Backend | regresión | QA · Regresión y bugs | PASS |
| TC-SEARCH-011 | QA | marketing | CV · Formación | PASS |
| TC-SEARCH-012 | Gestión de Calidad | github | Home · Tarjeta GitHub | PASS |

## Pruebas de diseño adaptable

| ID | Resolución o entorno | Resultado esperado | Estado |
|---|---|---|---|
| TC-SEARCH-013 | 320 px | Encabezado compacto sin superposiciones | PASS |
| TC-SEARCH-014 | 375 px | Encabezado de dos filas y buscador funcional | PASS |
| TC-SEARCH-015 | 768 px | Resultados visibles y sin desbordamiento | PASS |
| TC-SEARCH-016 | 1440 px | Logo, buscador y menú correctamente alineados | PASS |
| TC-SEARCH-017 | Móvil con teclado virtual | Búsqueda y navegación táctil funcionales | PASS |

## Criterios de aceptación verificados

- El buscador está disponible en las seis páginas del portfolio.
- Permite buscar por títulos, tecnologías y palabras clave.
- Los resultados se ordenan por relevancia textual.
- Permite navegar mediante mouse y teclado.
- Cierra y reinicia correctamente después de seleccionar resultados.
- Navega a páginas, secciones y tarjetas internas.
- Funciona en las resoluciones evaluadas.
- No se reportaron fallos en los 17 casos ejecutados.

## Resultado de ejecución

**17 PASS / 0 FAIL / 0 BLOCKED**

Referencia de resultados: `docs/test-report.md`.

---

# Regresión automatizada Selenium — Buscador global

**Requirement:** FR-011 — Global Search

**Related Requirements:** FR-006, FR-009, NFR-005

**Test File:** `tests/selenium/global-search-navigation.test.js`

**Tool:** Selenium WebDriver — Node.js Test Runner

**Execution Date:** 30/10/2026

**Browsers:** Google Chrome, Mozilla Firefox, Microsoft Edge

**Total Test Cases:** 43

**Total Executions:** 129

**Execution Result:** 129 PASS / 0 FAIL

## Automated Test Cases

Los casos siguientes documentan los escenarios
automatizados del buscador global.

Las implementaciones se encuentran en el archivo
Selenium indicado anteriormente.

Los resultados detallados de ejecución se conservan
en `docs/test-report.md`.

### Búsquedas, resultados y navegación — SEARCH-TC-001 a SEARCH-TC-010

| ID | Escenario | Resultado esperado | Requisito |
|---|---|---|---|
| SEARCH-TC-001 | Búsquedas consecutivas sin recargar | Permite realizar varias consultas, actualiza los resultados y cierra el panel al limpiar el campo. | FR-011 |
| SEARCH-TC-002 | Navegación con teclado | ArrowDown selecciona un resultado y Enter permite abrir su destino. | FR-011 |
| SEARCH-TC-003 | Cerrar resultados con Escape | Escape limpia la consulta, cierra el panel y permite iniciar otra búsqueda. | FR-011 |
| SEARCH-TC-004 | Búsqueda sin resultados ES/EN/PT | Muestra el mensaje correspondiente al idioma y no presenta enlaces seleccionables. | FR-011, FR-009 |
| SEARCH-TC-005 | Búsqueda con y sin acentos | Las consultas equivalentes con y sin acentos encuentran el mismo destino. | FR-011 |
| SEARCH-TC-006 | Resultados traducidos ES/EN/PT | Los títulos y descripciones coinciden con las traducciones esperadas en los tres idiomas. | FR-011, FR-009 |
| SEARCH-TC-007 | Cierre y reapertura por foco | Al hacer clic fuera se cierra el panel sin borrar la consulta y al recuperar el foco reaparecen los resultados. | FR-011 |
| SEARCH-TC-008 | Navegación con ArrowUp y ArrowDown | Permite avanzar y retroceder entre resultados y abrir el seleccionado mediante Enter. | FR-011 |
| SEARCH-TC-009 | Abrir segundo resultado con teclado | Permite seleccionar el segundo resultado y navegar al destino correcto mediante Enter. | FR-011 |
| SEARCH-TC-010 | Búsqueda con espacios adicionales | Los espacios al inicio y al final no impiden encontrar el resultado ni navegar a su destino. | FR-011 |

### Normalización, integridad y navegación — SEARCH-TC-011 a SEARCH-TC-020

| ID | Escenario | Resultado esperado | Requisito |
|---|---|---|---|
| SEARCH-TC-011 | Búsqueda sin distinguir mayúsculas y minúsculas | Las consultas en minúsculas, mayúsculas y combinadas encuentran el mismo resultado. | FR-011 |
| SEARCH-TC-012 | Limpiar consulta y cerrar resultados | Al vaciar el campo desaparecen los resultados y aria-expanded cambia a false. | FR-011, NFR-005 |
| SEARCH-TC-013 | Búsqueda con caracteres especiales | Una consulta sin coincidencias muestra el mensaje correspondiente y no genera resultados seleccionables. | FR-011 |
| SEARCH-TC-014 | Actualización de resultados al cambiar consulta | Los resultados anteriores desaparecen y se muestran únicamente los correspondientes a la nueva búsqueda. | FR-011 |
| SEARCH-TC-015 | Seleccionar segundo resultado con clic | El segundo resultado permite navegar a Especialidades y conserva el ancla #specialties. | FR-011, FR-006 |
| SEARCH-TC-016 | Buscar después de navegar a otra página | El buscador continúa funcionando después de navegar entre Gestión de Calidad y Backend. | FR-011, FR-006 |
| SEARCH-TC-017 | Verificar orden de resultados | La búsqueda de QA muestra primero Evidencia verificable y después Especialidades. | FR-011 |
| SEARCH-TC-018 | Navegación con Tab y Enter | Tab permite enfocar el primer resultado y Enter abre la página QA. | FR-011, NFR-005 |
| SEARCH-TC-019 | Navegación inversa con Shift + Tab | Permite avanzar al segundo resultado, regresar al primero y abrirlo mediante Enter. | FR-011, NFR-005 |
| SEARCH-TC-020 | Recorrido de resultados con flechas | ArrowDown y ArrowUp permiten recorrer tres resultados sin provocar una navegación inesperada. | FR-011, NFR-005 |

### Accesibilidad, integridad y recuperación — SEARCH-TC-021 a SEARCH-TC-030

| ID | Escenario | Resultado esperado | Requisito |
|---|---|---|---|
| SEARCH-TC-021 | Escape desde un resultado seleccionado | Escape cierra el desplegable, oculta los resultados y no provoca una navegación inesperada. | FR-011, NFR-005 |
| SEARCH-TC-022 | Nueva búsqueda después de Escape desde un resultado | Después de cerrar el desplegable con Escape, permite realizar otra consulta y mostrar nuevos resultados. | FR-011, NFR-005 |
| SEARCH-TC-023 | Estado aria-expanded del buscador | El atributo aria-expanded refleja correctamente los estados cerrado, abierto y reabierto del componente. | FR-011, NFR-005 |
| SEARCH-TC-024 | Integridad de enlaces y títulos | Cada resultado dispone de texto visible y un enlace válido que apunta al portfolio. | FR-011 |
| SEARCH-TC-025 | Verificar resultados sin destinos duplicados | Una búsqueda no presenta enlaces con destinos duplicados. | FR-011 |
| SEARCH-TC-026 | Eliminar resultados anteriores cuando no hay coincidencias | Al cambiar a una consulta sin coincidencias, desaparecen los enlaces anteriores y se muestra el mensaje correspondiente. | FR-011 |
| SEARCH-TC-027 | Recuperación después de una búsqueda sin resultados | Después de una consulta sin coincidencias, una nueva búsqueda válida vuelve a mostrar el resultado esperado. | FR-011 |
| SEARCH-TC-028 | Búsqueda por término parcial | Una consulta parcial encuentra el contenido correspondiente y permite navegar a su destino. | FR-011 |
| SEARCH-TC-029 | Búsqueda por descripción | Una palabra incluida en la descripción permite encontrar el resultado y navegar a la sección correspondiente. | FR-011 |
| SEARCH-TC-030 | Búsqueda con varias palabras | Una consulta compuesta por varias palabras encuentra el resultado esperado y permite abrirlo. | FR-011 |

### Normalización avanzada y navegación entre secciones — SEARCH-TC-031 a SEARCH-TC-044

| ID | Escenario | Resultado esperado | Requisito |
|---|---|---|---|
| SEARCH-TC-031 | Búsqueda con espacios internos repetidos | La consulta "arquitectura   api" encuentra Arquitectura de la API y mantiene abierto el desplegable. | FR-011 |
| SEARCH-TC-032 | Búsqueda con tabulaciones entre palabras | Las tabulaciones se normalizan y permiten encontrar Arquitectura de la API. | FR-011 |
| SEARCH-TC-033 | Normalización de caracteres Unicode | Las variantes Unicode equivalentes permiten encontrar Internacionalización en frontend.html. | FR-011 |
| SEARCH-TC-034 | Tratamiento de saltos de línea en el input | El buscador procesa el valor real del campo después de que el navegador elimina el salto de línea. | FR-011 |
| SEARCH-TC-035 | Consulta compuesta únicamente por espacios | Una consulta sin caracteres significativos se trata como vacía y mantiene cerrado el desplegable. | FR-011 |
| SEARCH-TC-036 | Caracteres especiales combinados con texto válido | Una consulta sin coincidencias como "arquitectura@@@" muestra el mensaje correspondiente sin resultados seleccionables. | FR-011 |
| SEARCH-TC-037 | Recuperación tras caracteres especiales | Después de una consulta con símbolos sin coincidencias, una búsqueda válida vuelve a mostrar resultados. | FR-011 |
| SEARCH-TC-038 | Navegación a Arquitectura | La búsqueda permite abrir backend.html#arquitectura y visualizar la sección sin quedar oculta detrás de la cabecera. | FR-011, FR-006 |
| SEARCH-TC-040 | Navegación a Casos de prueba | La búsqueda permite abrir qa.html#casos-prueba y visualizar correctamente la sección. | FR-011, FR-006 |
| SEARCH-TC-041 | Navegación a Trazabilidad | La búsqueda permite abrir quality-management.html#trazabilidad y visualizar correctamente la sección. | FR-011, FR-006 |
| SEARCH-TC-042 | Navegación a Persistencia | La búsqueda permite abrir backend.html#persistencia y visualizar correctamente la sección. | FR-011, FR-006 |
| SEARCH-TC-043 | Navegación a Internacionalización | La búsqueda permite abrir frontend.html#internacionalizacion y visualizar correctamente la sección. | FR-011, FR-006 |
| SEARCH-TC-044 | Navegación a Regresión y bugs | La búsqueda permite abrir qa.html#regresion-bugs y visualizar correctamente la sección. | FR-011, FR-006 |
