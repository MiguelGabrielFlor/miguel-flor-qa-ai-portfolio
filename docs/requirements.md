# Software Requirements Specification

## Project

Miguel Flor — QA & AI Portfolio

## Version

1.0

---

# 1. Purpose

El objetivo de esta aplicación es presentar el
portfolio profesional de Miguel Flor y permitir
a los visitantes acceder a información sobre
su experiencia, conocimientos en QA Testing,
automatización e Inteligencia Artificial.

La aplicación también funciona como proyecto
demostrativo de desarrollo y Quality Assurance.

---

# 2. Functional Requirements

## FR-001 — Visitor Registration

El sistema debe permitir que un visitante
ingrese los siguientes datos:

- Nombre
- Apellido
- Email
- Teléfono

---

## FR-002 — Required Fields

Los siguientes campos deben ser obligatorios:

- Nombre
- Apellido
- Email
- Teléfono

---

## FR-003 — Email Validation

El sistema debe validar que el formato del
email sea válido.

Ejemplo válido:

usuario@email.com

Ejemplo inválido:

usuario@

---

## FR-004 — Consent

El visitante debe aceptar el registro de sus
datos antes de acceder al portfolio.

---

## FR-005 — Portfolio Access

Cuando todos los datos sean válidos y el
visitante haya aceptado el consentimiento,
el sistema debe permitir el acceso al portfolio.

---

## FR-006 — Navigation

El portfolio debe permitir navegar entre:

- Home
- Sobre mí
- Experiencia
- QA
- IA
- Proyectos
- Contacto

---

## FR-007 — Responsive Design

La aplicación debe poder utilizarse
correctamente desde:

- Desktop
- Tablet
- Mobile

---

# 3. Non-Functional Requirements

## NFR-001 — Usability

La interfaz debe ser clara y permitir al
usuario comprender fácilmente qué acción
debe realizar.

---

## NFR-002 — Performance

La interfaz debe responder a las acciones
del usuario sin demoras perceptibles
durante el uso normal.

---

## NFR-003 — Compatibility

La aplicación debe ser compatible con
navegadores modernos.

---

## NFR-004 — Maintainability

El código debe estar organizado en:

- HTML
- CSS
- JavaScript

manteniendo responsabilidades separadas.

---

# 4. Future Requirements

Las siguientes funcionalidades serán
implementadas en futuras versiones:

- Persistencia de visitantes.
- Base de datos.
- API.
- API Testing.
- Selenium Automation.
- GitHub Actions.
- AI Applications.

# 5. Requirement Traceability Matrix

| Requirement | Description | Test Cases |
|---|---|---|
| FR-001 | Registro de visitante | TC-002 |
| FR-002 | Campos obligatorios | TC-001, TC-003 |
| FR-003 | Validación email | TC-004 |
| FR-004 | Consentimiento | TC-005 |
| FR-005 | Acceso al portfolio | TC-002 |
| FR-006 | Navegación | TC-006, TC-007 |
| FR-007 | Responsive | TC-008 |
| NFR-001 | Usabilidad | TC-009 |
| NFR-002 | Performance | TC-010 |
| NFR-003 | Compatibilidad | TC-011 |

---

## FR-008 — Phone Validation

El sistema debe validar el formato del teléfono.

El teléfono debe:

- contener entre 7 y 15 dígitos;
- permitir opcionalmente espacios;
- permitir el símbolo `+`;
- permitir guiones;
- permitir paréntesis.

Ejemplos válidos:

+54 9 11 1234 5678

011-1234-5678

(011) 1234-5678

Ejemplos inválidos:

abc

123

telefono123