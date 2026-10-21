# Test Execution Report

## Project

Miguel Flor — QA & AI Portfolio

## Version

1.0

## Environment

* OS: Windows
* Browser: Google Chrome

---

## Execution Summary

| Metric           | Result |
| ---------------- | -----: |
| Total Test Cases |     18 |
| Passed           |     18 |
| Failed           |      0 |
| Blocked          |      0 |
| Not Executed     |      0 |

---

## Defects

| ID      | Severity | Priority | Status |
| ------- | -------- | -------- | ------ |
| BUG-001 | Medium   | High     | CLOSED |

---

## Failed Tests

No failed tests remain after correcting BUG-001 and executing the reported regression tests.

---

## Regression Testing

* TC-012 — Invalid Phone: PASS
* TC-013 — Empty Phone: PASS
* TC-014 — Phone with Mixed Letters and Numbers: PASS
* TC-015 — Phone Below Minimum Length: PASS
* TC-016 — Phone at Minimum Length: PASS
* TC-017 — Phone with Prefix and Separators: PASS
* TC-018 — Phone Above Maximum Length: PASS

TC-001 through TC-011 were also reported as PASS.

---

## Smoke Testing — Sprint 1.5

| Test Case | Description             | Status |
| --------- | ----------------------- | ------ |
| SM-001    | Application Launch      | PASS   |
| SM-002    | Registration Form       | PASS   |
| SM-003    | Successful Registration | PASS   |
| SM-004    | Main Navigation         | PASS   |
| SM-005    | Responsive Layout       | PASS   |

### Execution Notes

* SM-001: La aplicación abrió correctamente.
* SM-002: El formulario mostró las advertencias esperadas para campos vacíos o incorrectos.
* SM-003: El registro con datos válidos permitió acceder al Home.
* SM-004: La navegación entre las áreas del portfolio funcionó correctamente.
* SM-005: El menú y el contenido se ajustaron correctamente a la pantalla móvil; los textos y botones fueron legibles y no se observó desplazamiento horizontal.

### Smoke Testing Summary

* Total test cases: 5
* Passed: 5
* Failed: 0 reported


---

## Conclusion

The reported test cases passed in the recorded execution. BUG-001 is closed following the correction of phone validation and the successful execution of the reported regression tests.

Sprint 1.5 smoke testing was completed with five reported PASS results. Documentation for BUG-002 through BUG-005 remains unresolved and must be recovered or clarified separately.


---

## Next Steps

1. Recover or clarify the documentation for BUG-002 through BUG-005.
2. Review repository changes and determine which backup and auxiliary files to retain.
3. Continue with the next sprint in the project roadmap.


---

# Sprint 2 — Backend, API y persistencia

## 1. Pruebas automatizadas

**Herramienta:** Node.js Test Runner
**Resultado:** PASS

| Métrica            | Resultado |
| ------------------ | --------: |
| Pruebas ejecutadas |        11 |
| Aprobadas          |        11 |
| Fallidas           |         0 |

Las pruebas automatizadas verificaron el funcionamiento de la API, las validaciones de visitantes y las operaciones de la base de datos SQLite.

## 2. Pruebas manuales de API

**Herramienta:** Postman
**Entorno:** Local
**Base URL:** `http://localhost:3000`

| ID         | Escenario                      | Resultado esperado   | Estado |
| ---------- | ------------------------------ | -------------------- | ------ |
| API-TC-001 | Consulta de estado de la API   | HTTP 200 OK          | PASS   |
| API-TC-002 | Registro de visitante válido   | HTTP 201 Created     | PASS   |
| API-TC-003 | Registro con correo inválido   | HTTP 400 Bad Request | PASS   |
| API-TC-004 | Registro con teléfono inválido | HTTP 400 Bad Request | PASS   |
| API-TC-005 | Registro sin consentimiento    | HTTP 400 Bad Request | PASS   |
| API-TC-006 | Persistencia de visitantes en SQLite | Registros válidos conservados y recuperables | PASS |

**Resumen de pruebas de API y persistencia:** 6 casos documentados, 6 aprobados y 0 fallidos.

## 3. Verificación de persistencia

**Base de datos:** SQLite
**Tabla:** `visitors`
**Resultado:** PASS

Se consultaron dos registros persistidos en la base de datos. Ambos contienen el consentimiento aceptado (`consentimiento = 1`).

La verificación confirma que los registros válidos se almacenan y pueden recuperarse desde SQLite.

## 4. Incidencias y observaciones

* BUG-001 continúa cerrado según el registro de Sprint 1.
* Las pruebas negativas de API confirmaron que se rechazan los datos inválidos y los registros sin consentimiento.
* Node.js mostró una advertencia informativa sobre el carácter experimental de `node:sqlite`. Las pruebas finalizaron correctamente.
* Las solicitudes manuales se ejecutaron en Postman. La colección reutilizable `Miguel Flor - Portfolio API` fue creada, validada e importada correctamente. Contiene cinco solicitudes para las pruebas API-TC-001 a API-TC-005.

## 5. Estado de los resultados de Sprint 2

| Área                                      | Resultado |
| ----------------------------------------- | --------- |
| Pruebas automatizadas de backend          | 11 PASS   |
| Pruebas manuales de API                   | 5 PASS    |
| Persistencia en SQLite                    | PASS      |
| Validación de datos                       | PASS      |
| Registro de visitantes con consentimiento | PASS      |

**Estado del Sprint 2:** COMPLETADO.

Las 11 pruebas automatizadas finalizaron con PASS y 0 fallos. Las cinco solicitudes manuales documentadas en Postman finalizaron con PASS. La persistencia y recuperación de visitantes mediante SQLite también quedaron verificadas con resultado PASS.

Los resultados están documentados en `docs/test-cases.md`, `docs/test-plan.md` y `docs/test-report.md`.

---

# Sprint 2.3 — Integración frontend-backend

## Objetivo

Verificar la comunicación entre el formulario de registro del frontend y la API, incluyendo el tratamiento de errores de conexión.

## Resultados

| ID | Escenario | Resultado |
|---|---|---|
| INT-001 | Registro válido enviado desde el frontend a la API | PASS |
| INT-002 | Acceso al portfolio después de un registro exitoso | PASS |
| INT-003 | Error de conexión cuando la API no está disponible | PASS |
| AUTO-001 | Suite automatizada del backend | 11 PASS, 0 FAIL |

## Observaciones

- El frontend envía los datos del visitante mediante `POST /api/visitors`.
- El portfolio se muestra después de recibir una respuesta satisfactoria.
- Si la API no está disponible, se muestra un mensaje de error y el portfolio permanece oculto.
- La suite automatizada se ejecutó nuevamente y finalizó con 11 pruebas aprobadas y ninguna fallida.
- Node.js mostró una advertencia informativa sobre la funcionalidad experimental de SQLite; no impidió la ejecución de las pruebas.

## Conclusión

La integración frontend-backend quedó implementada y sus escenarios manuales registrados finalizaron con PASS. La suite automatizada del backend también fue aprobada.
---

# Verificación de regresión — Saludo personalizado multilingüe

## Objetivo

Verificar que, después de completar correctamente el formulario de acceso, el portfolio muestre un saludo personalizado en el idioma seleccionado y utilice únicamente el nombre ingresado.

## Resultados

| ID | Escenario | Resultado |
|---|---|---|
| UI-REG-001 | Registro válido y saludo personalizado en español | PASS |
| UI-REG-002 | Registro válido y saludo personalizado en inglés | PASS |
| UI-REG-003 | Registro válido y saludo personalizado en portugués | PASS |

## Evidencia y observaciones

- Se completó el formulario con datos válidos en los tres idiomas.
- En los tres casos, el acceso al Home se realizó correctamente.
- El saludo se mostró en el idioma correspondiente.
- El nombre ingresado apareció en mayúsculas.
- Durante la verificación visual, el saludo no mostró el apellido, el email ni el teléfono.

## Conclusión

La verificación manual del flujo feliz y del saludo personalizado multilingüe finalizó con **3 pruebas PASS y 0 FAIL**.

---

# Verificación actual del backend y del servicio de contacto

## Objetivo

Registrar el estado actual de las pruebas automatizadas del backend y documentar los escenarios de la API de contacto incorporados después de Sprint 2.

## Resultados de las pruebas automatizadas

| Métrica | Resultado |
|---|---:|
| Pruebas ejecutadas | 15 |
| Aprobadas | 15 |
| Fallidas | 0 |

**Herramienta:** Node.js Test Runner.

## Escenarios de contacto cubiertos

| ID | Escenario | Resultado |
|---|---|---|
| API-TC-007 | Servicio de correo no configurado | PASS |
| API-TC-008 | Envío simulado de mensaje de contacto | PASS |
| API-TC-009 | Mensaje de contacto vacío | PASS |
| API-TC-010 | Fallo simulado del envío SMTP | PASS |

## Observaciones

- Los escenarios de contacto se verificaron mediante pruebas automatizadas.
- El envío satisfactorio se comprobó con un servicio de correo simulado.
- El error SMTP se reprodujo de forma controlada para verificar la respuesta de la API.
- Estos resultados no modifican los resultados históricos documentados en Sprint 2.
- La autenticación SMTP se verificó por separado; esa comprobación no equivale a confirmar la recepción de un correo real.

## Conclusión

La última ejecución registrada de la suite automatizada finalizó con 15 pruebas aprobadas y 0 fallidas. Los escenarios de contacto documentados cubren la falta de configuración del servicio, el envío simulado, el rechazo de mensajes vacíos y el tratamiento de errores de envío.

---

## Regresión Selenium multinavegador — 20/10/2026

### Objetivo

Verificar los nueve escenarios automatizados de acceso,
validaciones e idioma en Google Chrome, Mozilla Firefox
y Microsoft Edge.

### Comando ejecutado

Suite `npm.cmd run test:selenium` ejecutada con la variable
`TEST_BROWSER` configurada para cada navegador.

### Resultados

| Navegador | Ejecutadas | PASS | FAIL | SKIP |
|---|---:|---:|---:|---:|
| Google Chrome | 9 | 9 | 0 | 0 |
| Mozilla Firefox | 9 | 9 | 0 | 0 |
| Microsoft Edge | 9 | 9 | 0 | 0 |
| **Total** | **27** | **27** | **0** | **0** |

### Alcance

Se verificaron los nueve escenarios Selenium existentes:
apertura de la pantalla de acceso, validaciones de datos,
consentimiento obligatorio, selección de idioma ES/EN/PT
y registro válido.

### Observaciones

Los nueve escenarios se ejecutaron satisfactoriamente
en los tres navegadores.

La cobertura corresponde a las funcionalidades automatizadas
de la pantalla de acceso. No incluye todavía el formulario
de contacto ni la navegación integral del portfolio.

Los tiempos de ejecución de Selenium no representan
mediciones de rendimiento de la aplicación.

### Estado

PASS — Regresión automatizada multinavegador.

---

## Regresión Selenium multinavegador — 20/10/2026 — Ampliación de cobertura

### Objetivo

Verificar los once escenarios automatizados de acceso, validaciones, internacionalización y formulario de contacto en Google Chrome, Mozilla Firefox y Microsoft Edge.

### Entorno de pruebas

- Selenium WebDriver con Node.js.
- Navegadores: Chrome, Firefox y Microsoft Edge.
- Backend Express con SQLite en memoria y servicio de correo simulado.
- Envío de correos reales deshabilitado durante las pruebas de contacto.

### Comando ejecutado

Suite `npm.cmd run test:selenium` ejecutada con la variable `TEST_BROWSER` configurada para cada navegador.

### Resultados

| Navegador | Ejecutadas | PASS | FAIL | SKIP |
|---|---:|---:|---:|---:|
| Google Chrome | 11 | 11 | 0 | 0 |
| Mozilla Firefox | 11 | 11 | 0 | 0 |
| Microsoft Edge | 11 | 11 | 0 | 0 |
| **Total** | **33** | **33** | **0** | **0** |

### Cobertura

Se ejecutaron los nueve escenarios Selenium previamente existentes y dos escenarios nuevos:

- UI-010: envío válido del formulario de contacto, confirmación visual, limpieza del mensaje y rehabilitación del botón.
- UI-011: validación HTML5 de mensaje obligatorio y ausencia de confirmación de envío.

### Observaciones

Los once escenarios finalizaron satisfactoriamente en los tres navegadores.

UI-010 utiliza las rutas reales de Express con un servicio de correo simulado. No verifica la entrega de correos electrónicos mediante SMTP real.

UI-011 verifica la invalidez del campo vacío, pero no incorpora todavía una comprobación explícita de ausencia de solicitudes HTTP.

Los tiempos registrados corresponden a la ejecución de las pruebas Selenium y no constituyen mediciones de rendimiento de la aplicación.

La cobertura no incluye todavía una automatización integral de todas las páginas y funcionalidades del portfolio.

### Estado

**PASS — 33 ejecuciones satisfactorias, 0 fallos, 0 omitidas.**

---

## Reejecución manual — TC-007

**Fecha:** 20/10/2026

**Caso:** TC-007 — Navegación a Especialidades

**Requisito:** FR-006

**Tipo:** Functional Testing

**Resultado:** PASS

### Objetivo

Verificar que el enlace "Especialidades" de la
navegación principal permita desplazarse
correctamente hasta la sección #specialties.

### Verificaciones realizadas

1. Acceso al portfolio mediante el formulario: PASS.
2. Selección del enlace "Especialidades": PASS.
3. Desplazamiento hasta #specialties: PASS.
4. Visualización de la sección sin errores aparentes: PASS.

### Defectos observados

No se observaron defectos durante esta ejecución.

### Trazabilidad

Esta ejecución corresponde al escenario actualizado
TC-007 — Navegación a Especialidades.

El escenario histórico "Navigate to QA" fue
reemplazado en la documentación funcional.

Esta ejecución manual es independiente de la
regresión Selenium del 20/10/2026, cuyo resultado
permanece en 33 PASS, 0 FAIL y 0 SKIP.

---

## Ejecución manual — TC-006

**Fecha:** 20/10/2026

**Caso:** TC-006 — Navegación a Sobre mí

**Requisito:** FR-006

**Tipo:** Functional Testing

**Resultado:** PASS

### Objetivo

Verificar que el enlace "Sobre mí" de la navegación
principal permita desplazarse correctamente
hasta la sección #about.

### Verificaciones realizadas

1. Acceso al portfolio: PASS.
2. Selección del enlace "Sobre mí": PASS.
3. Desplazamiento hasta #about: PASS.
4. Visualización correcta de la sección: PASS.

### Defectos observados

No se reportaron defectos durante esta ejecución.

### Trazabilidad

Esta ejecución corresponde al escenario
TC-006 — Navegación a Sobre mí.

Es independiente de la ejecución manual de TC-007
y de la regresión automatizada Selenium.

La regresión Selenium del 20/10/2026 permanece
en 33 PASS, 0 FAIL y 0 SKIP.

---

## Regresión Selenium multinavegador — 21/10/2026

### Objetivo

Verificar los 12 escenarios automatizados de acceso,
validaciones, internacionalización y formulario de contacto,
incluyendo el manejo de errores HTTP 500.

### Entorno

- Sistema operativo: Windows.
- Herramienta: Selenium WebDriver con Node.js.
- Navegadores: Google Chrome, Mozilla Firefox y Microsoft Edge.
- API Express simulada con SQLite en memoria.
- Servicio de correo simulado, sin envíos reales.

### Comando ejecutado

`npm.cmd run test:selenium`

Variable `TEST_BROWSER` configurada para cada navegador:

- `chrome`
- `firefox`
- `MicrosoftEdge`

### Resultados

| Navegador | Ejecutadas | PASS | FAIL | SKIP | Duración |
|---|---:|---:|---:|---:|---:|
| Google Chrome | 12 | 12 | 0 | 0 | 68,18 s |
| Mozilla Firefox | 12 | 12 | 0 | 0 | 613,99 s |
| Microsoft Edge | 12 | 12 | 0 | 0 | 83,87 s |
| **Total** | **36** | **36** | **0** | **0** | **766,04 s** |

### Nueva cobertura — UI-015

**Caso:** UI-015 — Manejo de error HTTP 500.

**Archivo:** `tests/selenium/contact-server-error.test.js`

**Requisito:** FR-010.

**Resultado:** PASS en Chrome, Firefox y Edge.

Verificaciones automatizadas:

1. Visualización del mensaje de error esperado.
2. Conservación del contenido ingresado.
3. Rehabilitación del botón de envío.

El error HTTP 500 se generó mediante un fallo controlado
del servicio de correo de la API simulada.

### Verificación de regresión

UI-010 (envío exitoso) y UI-015 (error simulado)
finalizaron con PASS en los tres navegadores.

No se detectaron regresiones en los escenarios
automatizados existentes.

### Observaciones

- Firefox presentó un tiempo de ejecución superior
  al de Chrome y Edge.
- Edge mostró mensajes internos relacionados con
  SSL handshake y Renderer fallback.
- Estos mensajes no provocaron fallos en Selenium.
- Los tiempos corresponden a la ejecución completa
  de las pruebas, no al rendimiento de la aplicación.
- La prueba UI-015 verifica el comportamiento visible
  del frontend; no inspecciona directamente el código
  HTTP mediante Selenium.
- La regresión no constituye una auditoría integral
  de compatibilidad visual, rendimiento o accesibilidad.
- No se enviaron correos electrónicos reales.

### Estado

**PASS — 36 ejecuciones satisfactorias,
0 fallidas y 0 omitidas.**

La regresión anterior del 20/10/2026,
con 33 PASS, se conserva como evidencia histórica.

---

## Verificación NFR-004 — Mantenibilidad del backend.html

**Fecha:** 21/10/2026

### Objetivo

Reducir la duplicación de código JavaScript en backend.html,
centralizando las solicitudes HTTP y la presentación de resultados
de los laboratorios interactivos.

### Refactorización realizada

- Incorporación de js/backend/api-client.js para centralizar
  solicitudes HTTP y procesamiento de respuestas JSON.
- Incorporación de js/backend/result-renderer.js para unificar
  la presentación de resultados PASS/FAIL.
- Eliminación de funciones duplicadas de presentación.
- Eliminación de configuraciones repetidas de la URL de la API.
- Conservación de las reglas de validación y de los resultados
  independientes de cada laboratorio.

### Verificación funcional

| Área | Pruebas | Resultado |
|---|---:|---|
| Arquitectura de la API | 4 | PASS |
| Validaciones | 9 | PASS |
| Persistencia | 2 | PASS |

Los 15 laboratorios interactivos devolvieron los resultados
esperados durante la verificación manual posterior a la
refactorización.

### Regresión automatizada posterior a NFR-004

**Herramienta:** Selenium WebDriver con Node.js.

**Entorno:** API Express de pruebas, SQLite en memoria
y servicio de correo simulado, sin envíos reales.

| Navegador | Ejecutadas | PASS | FAIL | SKIP |
|---|---:|---:|---:|---:|
| Google Chrome | 12 | 12 | 0 | 0 |
| Mozilla Firefox | 12 | 12 | 0 | 0 |
| Microsoft Edge | 12 | 12 | 0 | 0 |
| **Total** | **36** | **36** | **0** | **0** |

La regresión verificó los escenarios automatizados existentes,
incluyendo el envío satisfactorio del formulario de contacto
y el tratamiento del error HTTP 500 simulado.

### Verificación estática

- node --check ejecutado satisfactoriamente sobre ambos
  archivos JavaScript nuevos.
- git diff --check finalizado sin advertencias.
- Revisión del diff de backend.html completada.
- Estructuras try/catch/finally conservadas.

### Conclusión

La refactorización NFR-004 superó las verificaciones
funcionales y la regresión automatizada multinavegador,
sin fallos detectados en los escenarios ejecutados.

La centralización del código reduce la duplicación
y facilita el mantenimiento de los laboratorios.

Estos resultados no constituyen una medición cuantitativa
de mantenibilidad ni una auditoría integral del portfolio.
