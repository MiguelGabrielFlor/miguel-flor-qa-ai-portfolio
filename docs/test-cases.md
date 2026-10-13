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

### Expected Status

PASS

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

### Expected Status

PASS

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

### Expected Status

PASS

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

### Expected Status

PASS

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

### Expected Status

PASS

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

### Expected Status

PASS

---

# TC-007 — Navigate to QA

### Requirement

FR-006

### Priority

High

### Type

Functional Testing

### Preconditions

El usuario accedió al portfolio.

### Steps

1. Presionar "QA".

### Expected Result

La página debe desplazarse hasta
la sección "QA Testing".

### Expected Status

PASS

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

### Expected Status

PASS

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

### Expected Status

PASS

---

# TC-010 — User Interaction Response

### Requirement

NFR-002

### Priority

Medium

### Type

Functional Testing

### Steps

1. Completar el formulario.
2. Presionar el botón.
3. Observar la respuesta.

### Expected Result

La interfaz debe responder correctamente
a la acción del usuario.

### Expected Status

PASS

---

# TC-011 — Browser Compatibility

### Requirement

NFR-003

### Priority

Medium

### Type

Compatibility Testing

### Browsers

- Chrome
- Firefox
- Edge

### Expected Result

La aplicación debe permitir utilizar
las funcionalidades principales.

### Expected Status

PASS

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

### Expected Status

PASS

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

### Expected Status

PASS

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

### Expected Status

PASS

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

### Expected Status

PASS

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

### Expected Status

PASS

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

### Expected Status

PASS

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

### Expected Status

PASS


---

# Sprint 2 — API Testing

## API-TC-001 — API Health Check

**Type:** API Testing
**Method:** GET
**Endpoint:** `/api/health`
**Expected Status:** 200 OK
**Actual Result:** La API respondió con `status: ok`.
**Status:** PASS

---

## API-TC-002 — Successful Visitor Registration

**Type:** API Testing
**Method:** POST
**Endpoint:** `/api/visitors`
**Test Data:** Visitante válido, con consentimiento aceptado.
**Expected Status:** 201 Created
**Actual Result:** Se creó el registro y la API devolvió el ID del visitante y su nombre.
**Status:** PASS

---

## API-TC-003 — Invalid Email

**Type:** Negative API Testing
**Method:** POST
**Endpoint:** `/api/visitors`
**Test Data:** `correo-invalido`
**Expected Status:** 400 Bad Request
**Actual Result:** La API rechazó el correo e indicó que debe ingresarse una dirección válida.
**Status:** PASS

---

## API-TC-004 — Invalid Phone

**Type:** Negative API Testing
**Method:** POST
**Endpoint:** `/api/visitors`
**Test Data:** `123abc`
**Expected Status:** 400 Bad Request
**Actual Result:** La API rechazó el teléfono inválido.
**Status:** PASS

---

## API-TC-005 — Consent Required

**Type:** Negative API Testing
**Method:** POST
**Endpoint:** `/api/visitors`
**Test Data:** `consentimiento: false`
**Expected Status:** 400 Bad Request
**Actual Result:** La API rechazó el registro e indicó que el consentimiento es obligatorio.
**Status:** PASS

---

## API-TC-006 — Visitor Data Persistence

**Type:** Database Testing
**Database:** SQLite
**Expected Result:** Los registros válidos deben conservarse en la base de datos.
**Actual Result:** Se consultaron dos registros persistidos, con IDs 1 y 2. Ambos tienen consentimiento aceptado.
**Status:** PASS