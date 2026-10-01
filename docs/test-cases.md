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

NOT EXECUTED

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

FAIL

### Related Bug

BUG-001