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


## FR-009 — Language Selection and Cross-Page Internationalization

El sistema debe permitir al visitante seleccionar
el idioma de la aplicación entre:

- Español (es).
- Inglés (en).
- Portugués (pt).

El idioma seleccionado debe aplicarse a todas
las páginas del portfolio, incluyendo:

- Pantalla de acceso y Home.
- Trayectoria profesional (CV).
- Backend y laboratorios de API.
- QA y evidencia verificable.
- Quality Management.
- Otras páginas incorporadas al proyecto.

La internacionalización debe contemplar:

- Encabezados, navegación y menús.
- Títulos, descripciones y contenido informativo.
- Formularios, etiquetas y mensajes de validación.
- Botones, CTA y pies de página.
- Componentes interactivos y sus estados.
- Textos técnicos y documentación presentada
  dentro de la interfaz, cuando corresponda.

Criterios de aceptación:

1. El visitante puede seleccionar ES, EN o PT.
2. Los textos traducibles se muestran en el idioma elegido.
3. El idioma se conserva al navegar entre páginas.
4. La preferencia permanece durante la sesión.
5. El atributo lang del documento refleja el idioma activo.
6. Los componentes dinámicos respetan el idioma seleccionado.
7. Los textos pendientes de traducción utilizan un idioma
   de respaldo definido, sin generar errores de interfaz.

Estado de implementación:

- Selector de idioma ES/EN/PT: implementado.
- Internacionalización entre páginas: implementada.
- Persistencia de preferencia de idioma: implementada.
- Traducción de componentes estáticos y dinámicos: implementada con cobertura de pruebas documentada por módulo.

Estado de verificación: PARCIAL.

Se registraron pruebas automatizadas y verificaciones manuales de internacionalización en diferentes módulos y navegadores.

Los resultados PASS acreditan los escenarios ejecutados, pero no constituyen una auditoría exhaustiva de todos los contenidos dinámicos, estados de interfaz y recorridos posibles.


---

## FR-010 — Contact Form

El portfolio debe permitir que los visitantes envíen
mensajes mediante el formulario de contacto,
tanto si accedieron mediante registro como si
ingresaron directamente como invitados.

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

Verificación manual en producción (12/11/2026):

- Acceso mediante ventana de incógnito.
- Ingreso al portfolio como invitado, sin registro.
- Formulario de contacto completado correctamente.
- Envío del mensaje confirmado: PASS.

Resultado: el formulario permite enviar mensajes
sin exigir un registro previo.

Cobertura automatizada actual:

- UI-010: envío válido y confirmación de éxito.
- UI-011: validación de mensaje vacío.

La cobertura automatizada es parcial y no demuestra
por sí sola todos los comportamientos enumerados.

---

## FR-011 — Global Search

El sistema debe proporcionar un buscador global
que permita localizar contenidos y navegar hacia
las diferentes páginas y secciones del portfolio.

El buscador debe:

- Estar disponible en las páginas del portfolio donde se encuentra implementado, conforme a la   cobertura funcional documentada.
- Permitir búsquedas por títulos, descripciones,
  tecnologías y palabras clave.
- Mostrar resultados relacionados con la consulta.
- Ordenar los resultados según su relevancia textual.
- Permitir seleccionar resultados mediante mouse.
- Permitir navegar mediante teclado.
- Admitir las teclas ArrowDown, ArrowUp, Tab,
  Shift+Tab, Enter y Escape según corresponda.
- Informar cuando no existan coincidencias.
- Permitir realizar búsquedas consecutivas.
- Normalizar mayúsculas, acentos y espacios
  internos consecutivos.
- Mantener los mensajes y resultados traducibles
  en español, inglés y portugués.
- Comunicar el estado del componente mediante
  los atributos accesibles correspondientes.
- Permitir navegar hacia páginas, secciones
  y elementos internos del portfolio.

### Acceptance Criteria

1. El buscador permite encontrar contenidos
   mediante términos relevantes.
2. Los resultados permiten acceder al destino
   correspondiente.
3. La navegación mediante teclado funciona
   correctamente.
4. Las búsquedas sin coincidencias muestran
   un mensaje informativo.
5. El buscador permite iniciar nuevas consultas
   después de cerrar o seleccionar resultados.
6. Las consultas equivalentes producen resultados
   consistentes independientemente de mayúsculas,
   acentos o espacios repetidos.
7. Los textos del componente respetan el idioma
   seleccionado.
8. El componente mantiene su funcionalidad en
   los navegadores y resoluciones evaluados.

### Implementation Status

IMPLEMENTED.

### Verification Status

Automated Selenium regression — 30/10/2026.

- Google Chrome: 43 PASS.
- Mozilla Firefox: 43 PASS.
- Microsoft Edge: 43 PASS.

Total: 129 PASS / 0 FAIL.

Manual functional regression:

- 17 PASS / 0 FAIL.

Related defects:

- BUG-006 — CLOSED.
- BUG-SEARCH-001 — CLOSED.

Verification scope:

Los resultados acreditan los escenarios ejecutados,
pero no representan una auditoría integral de
accesibilidad, rendimiento o compatibilidad visual.

---

## FR-012 — First Name and Last Name Validation

El sistema debe validar el formato de los campos
Nombre y Apellido del formulario de acceso.

Ambos campos deben:

- Contener entre 2 y 50 caracteres.
- Admitir letras, incluyendo caracteres Unicode.
- Permitir espacios, apóstrofes y guiones.
- Rechazar caracteres numéricos.
- Rechazar símbolos no permitidos.
- Rechazar valores que no cumplan las reglas establecidas.

Cuando un campo sea inválido, el sistema debe
mostrar el mensaje de validación correspondiente
e impedir el acceso al portfolio.

### Criterios de aceptación

1. Un nombre con números debe ser rechazado.
2. Un apellido con números debe ser rechazado.
3. Un nombre de menos de 2 caracteres debe ser rechazado.
4. Un apellido de menos de 2 caracteres debe ser rechazado.
5. Los errores deben mostrarse en el campo correspondiente.
6. El portfolio debe permanecer oculto cuando exista
   un nombre o apellido inválido.


### Evidencia de verificación

**Tipo:** Regresión automatizada Selenium.

**Fecha:** 30/10/2026.

| Escenario | Archivo Selenium | Validación |
|---|---|---|
| UI-004 | `invalid-first-name.test.js` | Nombre demasiado corto (`M`) |
| UI-005 | `invalid-last-name.test.js` | Apellido demasiado corto (`F`) |
| BUG-002 | `invalid-first-name-numeric.test.js` | Nombre con números (`sdfh567`) |
| BUG-003 | `invalid-last-name-numeric.test.js` | Apellido con números (`Flor567`) |

**Resultados por navegador:**

| Navegador | PASS | FAIL |
|---|---:|---:|
| Google Chrome | 4 | 0 |
| Mozilla Firefox | 4 | 0 |
| Microsoft Edge | 4 | 0 |
| **Total** | **12** | **0** |

**Resultado:** 12/12 PASS — 0 FAIL.

### Alcance de la verificación

Los escenarios ejecutados verifican:
- Rechazo de nombres demasiado cortos.
- Rechazo de apellidos demasiado cortos.
- Rechazo de nombres con caracteres numéricos.
- Rechazo de apellidos con caracteres numéricos.

La ejecución no constituye una cobertura exhaustiva
de FR-012.

Quedan pendientes de verificación específica:
- Longitud máxima de 50 caracteres.
- Rechazo de valores superiores a 50 caracteres.
- Aceptación de letras Unicode.
- Aceptación de espacios, apóstrofes y guiones.
- Rechazo de otros símbolos no permitidos.

**Defectos relacionados:** BUG-002 y BUG-003.

**Documentación complementaria:**
- `docs/test-cases.md`
- `docs/bug-reports.md`
- `docs/test-report.md`

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

Estado de verificación (21/10/2026):

- Google Chrome: 12 pruebas Selenium PASS, 0 FAIL, 0 SKIP.
- Mozilla Firefox: 12 pruebas Selenium PASS, 0 FAIL, 0 SKIP.
- Microsoft Edge: 12 pruebas Selenium PASS, 0 FAIL, 0 SKIP.

Resultado de la última regresión general:

- Escenarios distintos: 12.
- Ejecuciones totales: 36.
- PASS: 36.
- FAIL: 0.
- SKIP: 0.

Cobertura verificada:

- Formulario de acceso y validaciones.
- Consentimiento obligatorio.
- Registro válido.
- Selector de idioma ES/EN/PT.
- Envío del formulario de contacto con servicio simulado.
- Validación de mensaje de contacto vacío.
- Manejo de error HTTP 500 mediante API simulada.

Evidencia adicional (30/10/2026):

- Regresión Selenium del buscador global.
- 43 escenarios ejecutados en cada navegador.
- Chrome: 43 PASS.
- Firefox: 43 PASS.
- Edge: 43 PASS.
- Total: 129 PASS, 0 FAIL.

Estas ejecuciones corresponden a suites con alcances
diferentes y se documentan por separado en
docs/test-report.md.

Estado del requisito: VERIFICACIÓN PARCIAL.

Queda pendiente una evaluación integral de
compatibilidad visual, diseño responsive,
navegación y funcionalidades no cubiertas
por las suites automatizadas.

Los resultados PASS acreditan los escenarios
ejecutados, pero no demuestran por sí solos
la compatibilidad completa del portfolio.

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

- Regresión Selenium de acceso y contacto (21/10/2026):
  12 escenarios automatizados ejecutados en Chrome,
  Firefox y Microsoft Edge.
- Resultado: 36 PASS, 0 FAIL, 0 SKIP.

- Regresión Selenium del buscador global (30/10/2026):
  43 escenarios automatizados ejecutados en Chrome,
  Firefox y Microsoft Edge.
- Resultado: 129 PASS, 0 FAIL, 0 SKIP.

- Revisión integral de mantenibilidad: pendiente.


La ejecución satisfactoria de las pruebas
aporta evidencia de estabilidad funcional,
pero no demuestra por sí sola que el código
cumpla todos los criterios de mantenibilidad.
Es necesario revisar la organización del proyecto,
la separación de responsabilidades y las posibles
duplicaciones de código.

---

## NFR-005 — Accessibility and Interaction

El portfolio debe proporcionar una interfaz accesible,
comprensible y operable mediante diferentes métodos
de interacción, incluyendo teclado y tecnologías
de asistencia.

La accesibilidad debe contemplarse en todas las
páginas, formularios, menús, tarjetas interactivas
y componentes dinámicos del proyecto.

### Criterios de aceptación

1. Los enlaces, botones, formularios y controles
   interactivos deben poder utilizarse mediante teclado.

2. Los elementos interactivos deben presentar un
   indicador de foco visible y claramente identificable.

3. Los formularios deben disponer de etiquetas
   accesibles asociadas a sus campos.

4. Los mensajes de error y confirmación deben
   comunicarse mediante mecanismos accesibles,
   como role="alert", role="status" o aria-live,
   según corresponda.

5. Los textos y componentes visuales deben mantener
   un contraste suficiente respecto de sus fondos.

6. Las páginas deben utilizar una estructura HTML
   semántica, con encabezados y regiones de
   navegación correctamente organizados.

7. Los controles desplegables deben comunicar
   adecuadamente su función y estado.

8. Los elementos exclusivamente decorativos no
   deben introducir información innecesaria
   para las tecnologías de asistencia.

9. Las animaciones y transiciones deben respetar
   la preferencia prefers-reduced-motion.

10. La información y las funcionalidades principales
    deben permanecer disponibles cuando se reduzcan
    o eliminen los efectos de movimiento.

11. Los componentes deben mantener su operabilidad
    y legibilidad en diferentes tamaños de pantalla.

### Verificaciones previstas

- Navegación completa mediante teclado.
- Revisión de indicadores de foco.
- Validación de etiquetas y mensajes accesibles.
- Comprobación de estructura semántica.
- Evaluación de contraste.
- Verificación de controles desplegables.
- Pruebas con movimiento reducido.
- Evaluación mediante herramientas de accesibilidad
  y comprobaciones manuales.

### Estado de implementación

- Estructura semántica y atributos accesibles:
  parcialmente implementados.
- Navegación mediante teclado:
  pendiente de verificación integral.
- Contraste y tecnologías de asistencia:
  pendientes de evaluación.
- Movimiento reducido:
  implementado en algunos componentes;
  pendiente de revisión global.

### Estado de verificación

PENDIENTE — Requiere evaluación integral.

La presencia de atributos ARIA y elementos HTML
semánticos no demuestra por sí sola el cumplimiento
de los criterios de accesibilidad.

---

## NFR-006 — Visual Consistency and Component Design

El portfolio debe mantener una identidad visual coherente
en todas sus páginas y componentes de navegación.

El sistema de diseño debe tomar como referencia
la estética oscura del proyecto, inspirada en VS Code,
y los componentes de navegación aprobados
en el área QA.

Alcance:

- Menú principal del Home.
- Menús e índices de navegación de páginas internas.
- Botones de los pies de página.
- Enlaces y botones de llamada a la acción (CTA).
- Tarjetas interactivas y elementos informativos.
- Estados de interacción y adaptación responsive.

Criterios de aceptación:

1. Los componentes equivalentes utilizan tipografía,
   colores, bordes, radios y espaciados coherentes.
2. Las tarjetas que redirigen a otra página o sección
   presentan movimiento suave e iluminación del borde
   al pasar el cursor sobre ellas.
3. Las tarjetas exclusivamente informativas presentan
   únicamente iluminación del borde, sin desplazamiento,
   escalado ni movimiento decorativo.
4. El movimiento de las tarjetas navegables debe ser
   sutil, uniforme y coherente con la identidad visual
   del portfolio.
5. La iluminación debe utilizar los colores definidos
   en el sistema visual, evitando efectos diferentes
   entre componentes equivalentes.
6. La navegación conserva una presentación coherente
   en escritorio, tablet y móvil.
7. Los estilos compartidos se centralizan, cuando
   corresponda, en css/style.css.
8. Las modificaciones visuales no alteran
   la navegación ni las funcionalidades existentes.
9. Las animaciones respetan la preferencia
   de movimiento reducido del usuario.

Estado de implementación:

- Estética general del portfolio: implementada.
- Unificación de menú Home, CTA y pies de página:
  pendiente.
- Centralización de componentes visuales:
  pendiente de revisión.

Estado de verificación: pendiente.

La aceptación del requisito requiere una revisión
visual y funcional de los componentes afectados
en las diferentes páginas y tamaños de pantalla.

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
| FR-011 | Buscador global: consultas, resultados, navegación, teclado e internacionalización | Manuales: TC-SEARCH-001 a TC-SEARCH-017; Selenium: SEARCH-TC-001 a SEARCH-TC-038 y SEARCH-TC-040 a SEARCH-TC-044 |
| FR-012 | Validación de Nombre y Apellido: longitud y caracteres permitidos | UI-004, UI-005; Selenium: invalid-first-name-numeric.test.js, invalid-last-name-numeric.test.js |
| NFR-001 | Usabilidad | TC-009 |
| NFR-002 | Performance | TC-010 |
| NFR-003 | Compatibilidad | TC-011 |
| NFR-004 | Mantenibilidad del código | Revisión técnica pendiente |
| NFR-005 | Accesibilidad e interacción | Cobertura parcial: pruebas de navegación mediante teclado y atributos accesibles del buscador global (SEARCH-TC); auditoría integral pendiente |
| NFR-006 | Consistencia visual y diseño de componentes | Revisión visual y funcional integral pendiente |
| API-001 | Estado de la API | API-TC-001 |
| API-002 | Registro de visitantes mediante API | API-TC-002 |
| API-003 | Validación de email en la API | API-TC-003 |
| API-004 | Validación de teléfono en la API | API-TC-004 |
| API-005 | Consentimiento obligatorio en la API | API-TC-005 |
| API-006 | Persistencia de visitantes en SQLite | API-TC-006 |
| API-007 | Envío de mensajes de contacto y gestión de errores | API-TC-007, API-TC-008, API-TC-009, API-TC-010 |

---