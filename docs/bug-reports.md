# Bug Reports

## BUG-001 — El campo teléfono acepta caracteres no numéricos

### Severity
Medium

### Priority
High

### Environment

- Browser: Google Chrome
- OS: Windows
- Version: Portfolio v0.1

### Preconditions

El usuario se encuentra en la pantalla
de acceso al portfolio.

### Steps to reproduce

1. Ingresar nombre válido.
2. Ingresar apellido válido.
3. Ingresar email válido.
4. Ingresar `abc` en el campo teléfono.
5. Aceptar el registro.
6. Presionar "Ingresar al portfolio".

### Expected Result

El sistema debe rechazar el teléfono
y mostrar un mensaje indicando que
debe ingresar un número válido.

### Actual Result

El sistema permite continuar.

### Status

OPEN