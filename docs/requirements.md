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

La navegación principal del portfolio debe permitir
al visitante desplazarse entre las siguientes
secciones:

- Sobre mí (#about).
- Especialidades (#specialties).
- Proyectos (#projects).
- Contacto (#contact).

Al seleccionar un enlace, la aplicación debe
desplazarse hasta la sección correspondiente.

La navegación hacia páginas específicas del
portfolio técnico se documentará por separado,
según los enlaces implementados.

---

## FR-007 — Responsive Design

La aplicación debe poder utilizarse
correctamente desde:

- Desktop
- Tablet
- Mobile

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

---

---

## FR-009 — Language Selection

El sistema debe permitir al visitante seleccionar
el idioma de la pantalla de acceso entre:

- Español (es)
- Inglés (en)
- Portugués (pt)

Al seleccionar un idioma, los textos de la interfaz
que cuentan con traducción deben actualizarse
al idioma elegido.

El saludo de bienvenida debe mostrar el texto
correspondiente al idioma seleccionado.

---

## FR-010 — Contact Form

El portfolio debe permitir al visitante registrado
enviar un mensaje mediante el formulario de contacto.

El formulario debe:

- Exigir que el mensaje no esté vacío.
- Permitir mensajes de hasta 5000 caracteres.
- Enviar los datos del visitante y el mensaje
  al endpoint POST /api/contact.
- Mostrar una confirmación cuando la API
  informe que el envío fue exitoso.
- Informar al usuario cuando ocurra un error
  durante el envío.
- Evitar envíos repetidos mientras se procesa
  la solicitud.
- Limpiar el mensaje después de un envío exitoso.

Cobertura automatizada actual:

- UI-010: envío válido y confirmación de éxito.
- UI-011: validación de mensaje vacío.

La cobertura automatizada es parcial y no demuestra
por sí sola todos los comportamientos enumerados.

---

# 3. Non-Functional Requirements

## NFR-001 — Usability

La interfaz debe ser clara y permitir al
usuario comprender fácilmente qué acción
debe realizar.

---

## NFR-002 — Performance

La aplicación debe proporcionar una respuesta
visual ante las interacciones del usuario.

La evaluación del rendimiento debe contemplar:

- Tiempo de carga inicial de la aplicación.
- Tiempo de respuesta de las interacciones.
- Tiempo de respuesta de las solicitudes HTTP.

Las mediciones deben registrar:

- Herramienta utilizada.
- Navegador y entorno de ejecución.
- Tiempo observado en milisegundos.
- Criterio de aceptación establecido.

Estado de verificación:
Pendiente de medición y definición de umbrales
de aceptación.

La aprobación de pruebas funcionales no constituye
por sí misma evidencia de cumplimiento
de este requisito de rendimiento.

---

## NFR-003 — Browser Compatibility

La aplicación debe permitir utilizar sus
funcionalidades principales en los siguientes
navegadores de escritorio:

- Google Chrome.
- Mozilla Firefox.
- Microsoft Edge.

La verificación debe contemplar:

- Visualización de la pantalla de acceso.
- Validaciones del formulario.
- Registro válido y acceso al portfolio.
- Navegación entre secciones.
- Selector de idioma ES/EN/PT.

Para cada navegador se debe registrar:

- Navegador y versión.
- Sistema operativo.
- Casos ejecutados.
- Resultados PASS/FAIL.
- Evidencias de los defectos detectados.


Estado de verificación (20/10/2026):

- Google Chrome: 11 pruebas Selenium PASS, 0 FAIL.
- Mozilla Firefox: 11 pruebas Selenium PASS, 0 FAIL.
- Microsoft Edge: 11 pruebas Selenium PASS, 0 FAIL.

Resultado de regresión automatizada:

- Escenarios distintos: 11.
- Ejecuciones totales: 33.
- PASS: 33.
- FAIL: 0.
- SKIP: 0.

Los resultados verifican los comportamientos cubiertos
por la suite Selenium en los tres navegadores.

Estado del requisito: verificación parcial.

Queda pendiente completar la comprobación integral
de navegación, presentación visual y demás
funcionalidades no cubiertas por la suite automatizada.

La ejecución satisfactoria de Selenium no demuestra
por sí sola la compatibilidad completa de la aplicación.

---

## NFR-004 — Code Maintainability

El proyecto debe mantener una estructura
de código organizada y comprensible,
facilitando su mantenimiento y evolución.

La evaluación debe contemplar:

- Separación de responsabilidades entre
  HTML, CSS y JavaScript.
- Organización del backend en módulos
  según sus responsabilidades.
- Identificación clara de archivos,
  funciones y componentes.
- Reducción de duplicación innecesaria.
- Posibilidad de modificar funcionalidades
  sin afectar comportamientos relacionados.

Criterios de verificación:

- Revisar la estructura de directorios.
- Inspeccionar la distribución de
  responsabilidades entre archivos.
- Identificar duplicaciones relevantes.
- Ejecutar pruebas de regresión después
  de cambios funcionales.

Estado de verificación:

- Última regresión Selenium multinavegador (21/10/2026):
  12 escenarios automatizados ejecutados en Chrome,
  Firefox y Microsoft Edge.
- Resultado total: 36 PASS, 0 FAIL, 0 SKIP.
- Revisión integral de mantenibilidad: pendiente.

La ejecución satisfactoria de las pruebas
aporta evidencia de estabilidad funcional,
pero no demuestra por sí sola que el código
cumpla todos los criterios de mantenibilidad.
Es necesario revisar la organización del proyecto,
la separación de responsabilidades y las posibles
duplicaciones de código.

---

# API Requirements

## API-001 — API Health Check

La API debe proporcionar un endpoint `GET /api/health` que permita comprobar su disponibilidad.

**Expected response:** HTTP `200 OK`, con el estado `ok`.

---

## API-002 — Visitor Registration Through API

La API debe permitir registrar visitantes mediante `POST /api/visitors` cuando los datos sean válidos y el consentimiento haya sido aceptado.

**Expected response:** HTTP `201 Created`, con información del visitante registrado.

---

## API-003 — API Email Validation

La API debe rechazar los registros que contengan una dirección de email inválida.

**Expected response:** HTTP `400 Bad Request`. El visitante no debe guardarse en la base de datos.

---

## API-004 — API Phone Validation

La API debe rechazar los registros que contengan un teléfono inválido, de acuerdo con las reglas de validación definidas para el proyecto.

**Expected response:** HTTP `400 Bad Request`. El visitante no debe guardarse en la base de datos.

---

## API-005 — Mandatory Consent

La API debe rechazar los registros cuando el visitante no haya aceptado el consentimiento obligatorio.

**Expected response:** HTTP `400 Bad Request`. El visitante no debe guardarse en la base de datos.

---

## API-006 — Visitor Data Persistence

La API debe almacenar en SQLite los registros válidos de visitantes y permitir recuperar los datos persistidos.

**Expected result:** los registros válidos permanecen almacenados y pueden consultarse en la base de datos.

---

## API-007 — Contact Message Submission

La API debe proporcionar el endpoint
`POST /api/contact` para procesar mensajes
enviados desde el formulario de contacto.

El endpoint debe:

- Aceptar mensajes válidos y procesar su envío
  mediante el servicio de correo configurado.
- Rechazar mensajes vacíos o inválidos.
- Informar cuando el servicio de correo
  no esté configurado.
- Gestionar los errores del proveedor de correo
  sin confirmar un envío fallido como exitoso.

Respuestas HTTP esperadas:

- 200 OK: mensaje procesado y envío confirmado
  por el servicio de correo.
- 400 Bad Request: mensaje inválido.
- 503 Service Unavailable: servicio de correo
  no configurado.
- 500 Internal Server Error: error durante
  el envío del mensaje.

Las pruebas automatizadas de envío satisfactorio
utilizan un servicio de correo simulado.
Su resultado PASS no demuestra por sí mismo
la entrega de un correo real.

---

# 4. Implementation Status and Future Requirements

## Implemented Functionalities


### Selenium Automation

La aplicación cuenta con 11 escenarios automatizados
de interfaz mediante Selenium WebDriver y Node.js
Test Runner.

La suite fue ejecutada en tres navegadores:
Google Chrome, Mozilla Firefox y Microsoft Edge.

Última regresión verificada: 20/10/2026.

Resultados por navegador:

- Chrome: 11 PASS, 0 FAIL, 0 SKIP.
- Firefox: 11 PASS, 0 FAIL, 0 SKIP.
- Edge: 11 PASS, 0 FAIL, 0 SKIP.

Resultado consolidado:

- Escenarios distintos: 11.
- Ejecuciones totales: 33.
- PASS: 33.
- FAIL: 0.
- SKIP: 0.

La cobertura automatizada incluye:

- Visualización del formulario de acceso.
- Validación de campos obligatorios.
- Validación de nombre, apellido, email y teléfono.
- Consentimiento obligatorio.
- Registro válido y acceso al portfolio.
- Selección de idioma ES/EN/PT.
- Envío válido del formulario de contacto.
- Validación de mensaje de contacto vacío.

Las pruebas de contacto utilizan una API Express
con SQLite en memoria y un servicio de correo
simulado, sin realizar envíos SMTP reales.

Estos resultados corresponden a ejecuciones
verificadas y no representan monitoreo continuo
ni cobertura completa de todas las funcionalidades.

## Future Requirements

Las siguientes funcionalidades permanecen
planificadas para futuras etapas:

- GitHub Actions.
- AI Applications.

# 5. Requirement Traceability Matrix

| Requirement | Description | Test Cases |
|---|---|---|

| FR-001 | Registro de visitante | TC-002, UI-001, UI-008 |
| FR-002 | Campos obligatorios | TC-001, TC-003, UI-002, UI-004, UI-005 |
| FR-003 | Validación email | TC-004, UI-003 |
| FR-004 | Consentimiento | TC-005, UI-007 |
| FR-005 | Acceso al portfolio | TC-002, UI-008 |
| FR-006 | Navegación | TC-006, TC-007 |
| FR-007 | Responsive | TC-008 |
| FR-008 | Validación del teléfono | TC-012, TC-013, TC-014, TC-015, TC-016, TC-017, TC-018, UI-006 |
| FR-009 | Selección de idioma ES/EN/PT | UI-009 |
| FR-010 | Formulario de contacto: validación, envío y confirmación | UI-010, UI-011 |
| NFR-001 | Usabilidad | TC-009 |
| NFR-002 | Performance | TC-010 |
| NFR-003 | Compatibilidad | TC-011 |
| NFR-004 | Mantenibilidad del código | Revisión técnica pendiente |
| API-001 | Estado de la API | API-TC-001 |
| API-002 | Registro de visitantes mediante API | API-TC-002 |
| API-003 | Validación de email en la API | API-TC-003 |
| API-004 | Validación de teléfono en la API | API-TC-004 |
| API-005 | Consentimiento obligatorio en la API | API-TC-005 |
| API-006 | Persistencia de visitantes en SQLite | API-TC-006 |
| API-007 | Envío de mensajes de contacto y gestión de errores | API-TC-007, API-TC-008, API-TC-009, API-TC-010 |

---