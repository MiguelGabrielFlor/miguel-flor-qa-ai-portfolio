# Test Cases

## TC-001 — Validación de campos obligatorios

### Objective

Verificar que el sistema no permita
enviar el formulario vacío.

### Preconditions

El usuario se encuentra en la pantalla
de acceso.

### Steps

1. Abrir el portfolio.
2. No completar ningún campo.
3. Presionar "Ingresar al portfolio".

### Expected Result

El sistema debe mostrar mensajes
de validación para todos los campos
obligatorios.

### Actual Result

Los mensajes de validación son mostrados.

### Status

PASS

---

## TC-002 — Acceso exitoso al portfolio

### Objective

Verificar que un usuario pueda acceder al
portfolio ingresando datos válidos.

### Preconditions

El usuario se encuentra en la pantalla
de acceso.

### Test Data

- Nombre: Miguel
- Apellido: Flor
- Email: email válido
- Teléfono: 123456789
- Consentimiento: aceptado

### Steps

1. Ingresar nombre válido.
2. Ingresar apellido válido.
3. Ingresar email válido.
4. Ingresar teléfono válido.
5. Aceptar consentimiento.
6. Presionar "Ingresar al portfolio".

### Expected Result

El formulario desaparece y se muestra
el Home del portfolio.

### Status

PASS


---

## TC-003 — Nombre obligatorio

### Objective

Verificar que el nombre sea obligatorio.

### Steps

1. Dejar nombre vacío.
2. Completar los demás campos.
3. Aceptar consentimiento.
4. Presionar el botón.

### Expected Result

Se muestra:

"El nombre es obligatorio."

### Status

PASS


---

## TC-004 — Validación de email

### Objective

Verificar que el sistema rechace
un email inválido.

### Test Data

Email:

miguel@

### Expected Result

Se muestra:

"Ingresá un email válido."

### Status

PASS


---

## TC-005 — Consentimiento obligatorio

### Objective

Verificar que el usuario no pueda
acceder sin aceptar el consentimiento.

### Steps

1. Completar todos los campos correctamente.
2. No seleccionar consentimiento.
3. Presionar el botón.

### Expected Result

Se muestra:

"Debés aceptar el registro de tus datos."

### Status

PASS


---

## TC-006 — Navegación a Sobre mí

### Objective

Verificar que el menú permita navegar
a la sección Sobre mí.

### Steps

1. Acceder al portfolio.
2. Presionar "Sobre mí".

### Expected Result

La página se desplaza hasta la sección
"Sobre mí".

### Status

PASS


---

## TC-007 — Navegación a QA

### Objective

Verificar que el menú permita acceder
a la sección QA.

### Steps

1. Acceder al portfolio.
2. Presionar "QA".

### Expected Result

La página se desplaza hasta la sección
"QA Testing".

### Status

PASS