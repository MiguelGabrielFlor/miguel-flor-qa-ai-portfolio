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

La verificación de compatibilidad continúa siendo PARCIAL,
porque todavía no se realizó una auditoría visual integral,
responsive ni de navegación completa en los tres navegadores.

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

**Fecha de regresión actual:** 21/10/2026  
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

### Regresión actual — 21/10/2026

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
