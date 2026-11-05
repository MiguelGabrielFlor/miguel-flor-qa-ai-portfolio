# Test Plan

## Project

Miguel Flor — QA & AI Portfolio

## Version

1.0

---

# 1. Objective

Verificar que el portfolio funcione de acuerdo
con los requisitos definidos y que los usuarios
puedan acceder y navegar correctamente por
la aplicación.

---

# 2. Scope

## In Scope

Se probarán:

- Formulario de registro
- Validaciones
- Consentimiento
- Acceso al portfolio
- Navegación
- Responsive design
- Interfaz de usuario
- Compatibilidad básica

---

## Out of Scope

En esta versión no se probarán:

- Base de datos
- API
- Autenticación real
- Selenium
- Integraciones externas
- Aplicaciones de IA

Estas funcionalidades serán incorporadas
en futuras versiones.

**Nota de alcance histórico:** Las exclusiones anteriores
corresponden exclusivamente a la versión inicial del proyecto.
En etapas posteriores se incorporaron API, persistencia SQLite,
automatización Selenium y pruebas multinavegador, documentadas
en las secciones correspondientes del plan y del reporte de ejecución.

## Sprint 2 — Backend, API y persistencia

### In Scope

* API de estado: `GET /api/health`.
* Registro de visitantes: `POST /api/visitors`.
* Validación de nombre, apellido, email, teléfono y consentimiento.
* Persistencia y recuperación de registros mediante SQLite.
* Pruebas automatizadas con Node.js Test Runner.
* Pruebas manuales de API con Postman.
* Verificación de respuestas HTTP y rechazo de datos inválidos.

### Test Environment

* Runtime: Node.js.
* Backend: Express.
* Base de datos: SQLite.
* API testing: Postman.
* Automated testing: Node.js Test Runner.

### Exit Criteria

* Las pruebas automatizadas se ejecutan sin fallos.
* Las pruebas manuales documentadas tienen resultados registrados.
* La persistencia de los registros válidos queda verificada.
* Los resultados se documentan en `docs/test-cases.md` y `docs/test-report.md`.

---

# 3. Testing Types

Se realizarán:

- Functional Testing
- UI Testing
- Negative Testing
- Positive Testing
- Regression Testing
- Responsive Testing
- Compatibility Testing

---

# 4. Test Environment

## Operating System

Windows

## Browser

Google Chrome

## Additional Browsers

Firefox
Microsoft Edge

---

# 5. Test Levels

## Smoke Testing

Verificación rápida de que la aplicación
puede abrirse y utilizarse.

## Functional Testing

Validación de las funcionalidades definidas
en los requisitos.

## Regression Testing

Verificación de que los cambios realizados
no rompan funcionalidades existentes.

---

# 6. Entry Criteria

Las pruebas comenzarán cuando:

- La aplicación pueda abrirse.
- El formulario sea accesible.
- Las funcionalidades estén disponibles.
- La versión a probar esté identificada.

---

# 7. Exit Criteria

La ejecución finalizará cuando:

- Todos los casos críticos hayan sido ejecutados.
- Los defectos críticos hayan sido corregidos.
- Se haya realizado regression testing.
- Se haya generado el reporte final.

---

# 8. Defect Severity

## Critical

Impide utilizar la aplicación.

## High

Impide utilizar una funcionalidad importante.

## Medium

La funcionalidad funciona parcialmente
o existe un problema relevante.

## Low

Problema menor de interfaz o comportamiento.

---

# 9. Defect Priority

## High

Debe corregirse inmediatamente.

## Medium

Debe corregirse en el ciclo actual.

## Low

Puede corregirse posteriormente.

---

# 10. Deliverables

Los entregables serán:

- Test Plan
- Test Cases
- Test Data
- Bug Reports
- Test Report
- Evidence / Screenshots

---

# 11. Responsive & Cross-Browser Visual Testing

## Objective

Verificar que las seis páginas del portfolio mantengan una presentación visual adecuada en diferentes tamaños de pantalla y en los navegadores seleccionados.

## Scope

Páginas incluidas:

- index.html
- cv.html
- frontend.html
- backend.html
- qa.html
- quality-management.html

## Test Environment

- Sistema operativo: Windows.
- Navegadores: Google Chrome, Mozilla Firefox y Microsoft Edge.
- Herramientas: DevTools y revisión visual manual.
- Resoluciones de referencia: 375 px, 768 px y vistas de escritorio.

## Test Procedure

1. Abrir cada página del portfolio.
2. Ajustar el ancho de pantalla mediante DevTools.
3. Recorrer visualmente todas las secciones.
4. Verificar que los textos permanezcan dentro de sus contenedores.
5. Comprobar que los componentes no se superpongan indebidamente.
6. Revisar la distribución responsive de tarjetas, columnas y botones.
7. Verificar la presentación de navegación, buscador y footer.
8. Comprobar los componentes desplegables e interactivos relevantes.
9. Repetir la revisión en Chrome, Firefox y Edge.
10. Registrar los resultados y las correcciones realizadas.

## Acceptance Criteria

- No se observan desbordamientos horizontales no previstos.
- Los textos y controles permanecen legibles.
- Los elementos interactivos son accesibles visualmente.
- Las tarjetas y columnas se reorganizan según el ancho disponible.
- La navegación y el footer mantienen una distribución adecuada.
- Los componentes con desplazamiento horizontal intencional permanecen contenidos dentro de su sección.
- No se identifican defectos visuales pendientes que impidan utilizar la interfaz.

## Exit Criteria

- Las seis páginas han sido revisadas visualmente.
- Los tres navegadores cuentan con resultados registrados.
- Los problemas visuales identificados durante la revisión han sido corregidos o documentados.
- Los resultados se incorporan a docs/test-report.md.

## Limitations

Las verificaciones responsive son manuales y no sustituyen las pruebas automatizadas Selenium.

La revisión no constituye una auditoría exhaustiva de accesibilidad, rendimiento ni compatibilidad con todas las resoluciones, dispositivos o versiones de navegador.

## Evidence

Los resultados de la revisión responsive y las correcciones realizadas se documentan en:

`docs/test-report.md`

---
