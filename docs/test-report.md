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

### Aclaración sobre el alcance histórico

Los resultados 18/18 PASS corresponden a la ejecución
histórica documentada del Sprint 1.

La biblioteca actual de casos de prueba en qa.html
conserva esos resultados históricos, pero identifica
verificaciones adicionales pendientes:

- TC-010: pendiente de medición de rendimiento.
- TC-011: verificación parcial de compatibilidad.

Estos estados no modifican retroactivamente los
resultados registrados en la ejecución original.

Las regresiones automatizadas posteriores se documentan
por separado, con sus respectivos alcances y resultados.

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

---

## Regresión funcional — Buscador global

**Requisito:** FR-011 — Global Search

**Referencia de origen:** BL-02
**Tipo:** Pruebas funcionales, navegación, teclado y diseño adaptable  
**Entorno:** Chrome, servidor local del portfolio  
**Ejecución:** Manual

### Resumen

| Métrica | Resultado |
|---|---:|
| Casos ejecutados | 17 |
| PASS | 17 |
| FAIL | 0 |
| BLOCKED | 0 |
| NOT EXECUTED | 0 |
| Tasa de aprobación | 100% |

### Casos ejecutados

| ID | Escenario | Estado |
|---|---|---|
| TC-SEARCH-001 | Búsquedas consecutivas sin recarga | PASS |
| TC-SEARCH-002 | Navegación mediante flechas | PASS |
| TC-SEARCH-003 | Enter sobre resultado seleccionado | PASS |
| TC-SEARCH-004 | Cierre mediante Escape | PASS |
| TC-SEARCH-005 | Búsqueda sin coincidencias | PASS |
| TC-SEARCH-006 | Selección mediante mouse | PASS |
| TC-SEARCH-007 | Navegación desde Home | PASS |
| TC-SEARCH-008 | Navegación desde CV | PASS |
| TC-SEARCH-009 | Navegación desde Frontend | PASS |
| TC-SEARCH-010 | Navegación desde Backend | PASS |
| TC-SEARCH-011 | Navegación desde QA | PASS |
| TC-SEARCH-012 | Navegación desde Gestión de Calidad | PASS |
| TC-SEARCH-013 | Diseño adaptable a 320 px | PASS |
| TC-SEARCH-014 | Diseño adaptable a 375 px | PASS |
| TC-SEARCH-015 | Diseño adaptable a 768 px | PASS |
| TC-SEARCH-016 | Diseño adaptable a 1440 px | PASS |
| TC-SEARCH-017 | Interacción móvil y teclado virtual | PASS |

### Defecto relacionado

**BUG-006 — Ruta incorrecta en el buscador**

- Problema: enlace a `qa-frontend.html` inexistente.
- Causa: el archivo real se llama `frontend.html`.
- Corrección: actualización de las rutas en `js/search.js`.
- Estado: CLOSED, tras verificación de navegación.

### Conclusión

Las 17 pruebas manuales del buscador global
finalizaron satisfactoriamente.

Se verificaron búsquedas consecutivas, navegación
entre páginas, interacción por teclado, resultados
sin coincidencias y diseño adaptable.

Los 17 casos manuales ejecutados finalizaron con PASS
y aportan evidencia de cumplimiento de los criterios
funcionales evaluados del requisito FR-011 — Global Search.

La funcionalidad se originó en BL-02, cuya referencia
se conserva para mantener la trazabilidad histórica.

Estos resultados corresponden exclusivamente a la
ejecución manual documentada y son independientes
de la regresión automatizada Selenium.


---

## Regresión automatizada Selenium — Buscador global — 30/10/2026

**Requisito principal:** FR-011 — Global Search

**Requisitos relacionados:** FR-006, FR-009, NFR-005

**Casos automatizados:** SEARCH-TC-001 a SEARCH-TC-038;
SEARCH-TC-040 a SEARCH-TC-044.

**Cantidad de escenarios:** 43.

**Referencia de casos:** `docs/test-cases.md`.

### Objetivo

Verificar el funcionamiento del buscador global del portfolio
mediante pruebas automatizadas de búsqueda, navegación,
internacionalización, interacción por teclado y tratamiento
de entradas especiales.

### Entorno de ejecución

- Sistema operativo: Windows.
- Navegadores: Google Chrome, Mozilla Firefox y Microsoft Edge.
- Herramienta: Selenium WebDriver con Node.js.
- Servidor local: http://127.0.0.1:5500.
- Archivo: `tests/selenium/global-search-navigation.test.js`.

### Comandos ejecutados

Las pruebas se ejecutaron con el mismo archivo y los mismos
43 casos en los tres navegadores.

**Google Chrome**

$env:TEST_BROWSER = "chrome"
node --test .\tests\selenium\global-search-navigation.test.js

**Mozilla Firefox**

$env:TEST_BROWSER = "firefox"
node --test .\tests\selenium\global-search-navigation.test.js

**Microsoft Edge**

$env:TEST_BROWSER = "MicrosoftEdge"
node --test .\tests\selenium\global-search-navigation.test.js


### Resultados

| Métrica | Chrome | Firefox | Edge | Total |
|---|---:|---:|---:|---:|
| Pruebas ejecutadas | 43 | 43 | 43 | 129 |
| Aprobadas | 43 | 43 | 43 | 129 |
| Fallidas | 0 | 0 | 0 | 0 |
| Canceladas | 0 | 0 | 0 | 0 |
| Omitidas | 0 | 0 | 0 | 0 |
| Tasa de aprobación | 100% | 100% | 100% | 100% |
| Duración (segundos) | 498,00 | 842,67 | 632,46 | 1973,13 |


**Resultado:** PASS — 129 ejecuciones satisfactorias de
43 casos automatizados en tres navegadores.

### Cobertura funcional

Las pruebas automatizadas incluyeron:

- Búsquedas consecutivas y actualización de resultados.
- Navegación entre páginas y secciones del portfolio.
- Navegación por teclado mediante flechas, Tab, Shift+Tab,
  Enter y Escape.
- Comportamiento del desplegable y atributo `aria-expanded`.
- Búsquedas sin coincidencias y recuperación posterior.
- Resultados en español, inglés y portugués.
- Consultas con y sin acentos.
- Normalización Unicode.
- Búsquedas parciales y por descripción.
- Consultas con varias palabras.
- Normalización de espacios internos y tabulaciones.
- Tratamiento de saltos de línea en el campo HTML.
- Consultas vacías y caracteres especiales.

### Defecto detectado y corregido

**BUG-SEARCH-001 — Espacios internos repetidos**

Caso relacionado: SEARCH-TC-031.

Defecto original:

La consulta `arquitectura   api` no encontraba resultados,
aunque `arquitectura api` funcionaba correctamente.

Causa:

La función `normalize` de `js/search.js` no normalizaba
los espacios internos consecutivos.

Corrección:

Se incorporaron las operaciones:

- `.replace(/\s+/g, " ")`
- `.trim()`

Verificación:

- SEARCH-TC-031: PASS.
- Regresión automatizada multinavegador: 129/129 PASS
  (43 casos en Chrome, Firefox y Edge).

Estado final: CLOSED.

### Compatibilidad de navegación por teclado — Firefox

Durante la primera ejecución completa en Mozilla Firefox
se registraron los siguientes resultados:

- 43 pruebas ejecutadas.
- 41 aprobadas.
- 2 fallidas: SEARCH-TC-018 y SEARCH-TC-019.

**Análisis**

Se identificó una diferencia de comportamiento en la
navegación mediante Tab.

Firefox incorporaba el contenedor desplazable
`#portfolio-search-results` a la secuencia de foco,
antes del primer enlace de resultados.

El diagnóstico confirmó:

- 9 resultados visibles.
- `overflowY: auto`.
- `clientHeight: 418`.
- `scrollHeight: 749`.
- Foco inicial en `DIV#portfolio-search-results`.

**Corrección**

Se adaptaron SEARCH-TC-018 y SEARCH-TC-019 para contemplar
el paso intermedio por el contenedor desplazable cuando
el navegador lo incorpora a la navegación mediante Tab.

Se conservaron las verificaciones de foco, navegación
inversa con Shift+Tab y apertura mediante Enter.

No fue necesario modificar `js/search.js` ni el HTML
de la aplicación.

**Verificación**

- SEARCH-TC-018: PASS en ejecución individual.
- SEARCH-TC-019: PASS en ejecución individual.
- Regresión completa Firefox: 43/43 PASS.
- Regresión completa Microsoft Edge: 43/43 PASS.
- Regresión completa Google Chrome: 43/43 PASS.

**Clasificación:** diferencia de comportamiento entre
navegadores contemplada en la automatización.

**Estado:** RESUELTO.

### Observaciones

- La regresión automatizada se ejecutó en Google Chrome,
  Mozilla Firefox y Microsoft Edge.
- Los resultados históricos de las pruebas manuales
  y de ejecuciones anteriores se conservan por separado.
- Los tiempos registrados corresponden a la ejecución
  de Selenium y no representan mediciones de rendimiento
  de la aplicación.
- SEARCH-TC-034 verifica la sanitización del campo HTML
  ante saltos de línea, no la recepción directa de dichos
  caracteres por la función de normalización.
- Las diferencias de navegación por teclado identificadas
  en Firefox se contemplaron en las pruebas automatizadas.
- La ejecución satisfactoria no constituye una auditoría
  integral de accesibilidad, seguridad o compatibilidad
  con todos los navegadores y versiones.  
- La regresión final de Google Chrome se repitió después
  de adaptar SEARCH-TC-018 y SEARCH-TC-019, obteniendo
  nuevamente 43/43 PASS.
- La suite contiene 43 casos automatizados identificados
  entre SEARCH-TC-001 y SEARCH-TC-044.
- El identificador SEARCH-TC-039 no está asignado
  a ningún caso en el archivo Selenium verificado.
- Esta discontinuidad de numeración no representa
  una prueba omitida, fallida ni pendiente de ejecución.
- Se conserva la numeración original para mantener
  la correspondencia con el código fuente y las
  evidencias de ejecución.

### Conclusión

La regresión automatizada multinavegador del buscador global
finalizó satisfactoriamente.

Se ejecutaron 43 casos en cada uno de los tres navegadores:

- Google Chrome: 43/43 PASS.
- Mozilla Firefox: 43/43 PASS.
- Microsoft Edge: 43/43 PASS.

**Resultado consolidado: 129/129 PASS — 100% de aprobación.**

El defecto BUG-SEARCH-001 permanece cerrado, con su
corrección verificada mediante SEARCH-TC-031.

Las diferencias de navegación mediante Tab y Shift+Tab
detectadas en Firefox fueron contempladas en la
automatización y verificadas mediante regresión completa.

**Estado final: PASS — Regresión automatizada
multinavegador completada.**

---

## Selenium Regression — Minimum Name Length

### Execution Date

30/10/2026

### Environment

- Operating System: Windows
- Browser: Google Chrome
- Framework: Selenium WebDriver
- Test Runner: Node.js Test Runner

### Scope

Verificación de la longitud mínima permitida
en los campos Nombre y Apellido del formulario
de acceso.

### Execution Results

| Test Case | Scenario | Result |
|---|---|---|
| UI-004 | Nombre demasiado corto (`M`) | PASS |
| UI-005 | Apellido demasiado corto (`F`) | PASS |

### Execution Summary

| Metric | Result |
|---|---:|
| Executed | 2 |
| Passed | 2 |
| Failed | 0 |
| Cancelled | 0 |
| Skipped | 0 |

### Conclusion

Las dos pruebas automatizadas finalizaron
satisfactoriamente.

Se verificó que el formulario muestra
los mensajes de validación correspondientes
y mantiene oculto el portfolio cuando
Nombre o Apellido tienen una longitud
inferior al mínimo permitido.

Esta ejecución verifica la longitud mínima.
No constituye una prueba específica del
rechazo de caracteres numéricos.

Los resultados históricos del Sprint 1
permanecen sin modificaciones.

---

## Selenium Regression — Name and Last Name Validation

### Execution Date

30/10/2026

### Environment

- Operating System: Windows
- Browsers: Google Chrome, Mozilla Firefox, Microsoft Edge
- Framework: Selenium WebDriver
- Test Runner: Node.js Test Runner

### Scope

Regresión automatizada de las validaciones
de Nombre y Apellido del formulario de acceso.

Se verificaron cuatro escenarios en tres navegadores.

### Test Results

| Test Case | Scenario | Chrome | Firefox | Edge |
|---|---|---|---|---|
| BUG-002 | Nombre con números (`sdfh567`) | PASS | PASS | PASS |
| BUG-003 | Apellido con números (`Flor567`) | PASS | PASS | PASS |
| UI-004 | Nombre demasiado corto (`M`) | PASS | PASS | PASS |
| UI-005 | Apellido demasiado corto (`F`) | PASS | PASS | PASS |

### Execution Summary

| Metric | Result |
|---|---:|
| Test scenarios | 4 |
| Browsers | 3 |
| Total executions | 12 |
| Passed | 12 |
| Failed | 0 |
| Skipped | 0 |
| Cancelled | 0 |

### Conclusion

Los cuatro escenarios finalizaron
satisfactoriamente en Chrome, Firefox y Edge.

Las pruebas confirmaron que:

- Los nombres con números son rechazados.
- Los apellidos con números son rechazados.
- Los nombres demasiado cortos son rechazados.
- Los apellidos demasiado cortos son rechazados.
- Los mensajes de validación correspondientes aparecen.
- El portfolio permanece oculto ante estas entradas inválidas.

BUG-002 y BUG-003 cuentan ahora con regresiones
automatizadas satisfactorias en tres navegadores.

Estas ejecuciones verifican el comportamiento
posterior a las correcciones históricas.

No constituyen evidencia de los defectos
antes de su corrección.

Los resultados históricos anteriores
permanecen sin modificaciones.

---

## Selenium Regression — Invalid Email Format

### Execution Date

30/10/2026

### Environment

- Operating System: Windows
- Browsers: Google Chrome, Mozilla Firefox, Microsoft Edge
- Framework: Selenium WebDriver
- Test Runner: Node.js Test Runner

### Scope

Verificación automatizada del rechazo de
un correo electrónico con formato inválido
en el formulario de acceso.

### Test Case

**ID:** UI-003

**Archivo:** `tests/selenium/invalid-email.test.js`

**Dato de prueba:** `correo-invalido`

### Execution Results

| Browser | Result |
|---|---|
| Google Chrome | PASS |
| Mozilla Firefox | PASS |
| Microsoft Edge | PASS |

### Execution Summary

| Metric | Result |
|---|---:|
| Test scenarios | 1 |
| Browsers | 3 |
| Total executions | 3 |
| Passed | 3 |
| Failed | 0 |
| Skipped | 0 |
| Cancelled | 0 |

### Conclusion

La prueba UI-003 finalizó satisfactoriamente
en Chrome, Firefox y Microsoft Edge.

Se verificó que:

- El correo `correo-invalido` es rechazado.
- Se muestra `Ingresá un email válido.`
- El portfolio permanece oculto.

La ejecución confirma este escenario específico
de validación del formato de email.

No constituye evidencia de todos los formatos
inválidos posibles ni del comportamiento
anterior a la corrección histórica de BUG-004.

Los resultados históricos anteriores
permanecen sin modificaciones.

---

## Selenium Regression — BUG-004 Email Format Validation

### Execution Date

30/10/2026

### Environment

- Operating System: Windows
- Browsers: Google Chrome, Mozilla Firefox, Microsoft Edge
- Framework: Selenium WebDriver
- Test Runner: Node.js Test Runner

### Scope

Verificación automatizada de cinco formatos
de correo electrónico inválidos en el
formulario de acceso al portfolio.

### Automated Test

**File:** `tests/selenium/invalid-email-double-at.test.js`

### Execution Results

| Invalid Email | Chrome | Firefox | Edge |
|---|---|---|---|
| `gabriel@@gmail.com` | PASS | PASS | PASS |
| `gabriel@` | PASS | PASS | PASS |
| `gabriel@prueba` | PASS | PASS | PASS |
| `@gmail.com` | PASS | PASS | PASS |
| `gabriel@gmail.` | PASS | PASS | PASS |

### Execution Summary

| Metric | Result |
|---|---:|
| Test scenarios | 5 |
| Browsers | 3 |
| Total executions | 15 |
| Passed | 15 |
| Failed | 0 |
| Skipped | 0 |
| Cancelled | 0 |

### Conclusion

Los cinco escenarios finalizaron
satisfactoriamente en Chrome, Firefox
y Microsoft Edge.

Para cada entrada inválida se verificó:

- La aparición de `Ingresá un email válido.`
- Que el portfolio permanece oculto.

Esta ejecución confirma el comportamiento
actual de validación para los cinco formatos
evaluados.

La prueba UI-003 constituye una verificación
complementaria independiente para el valor
`correo-invalido`, con 3/3 PASS.

Los resultados no constituyen evidencia
del comportamiento original anterior a
la corrección histórica de BUG-004.

Los reportes y resultados históricos
permanecen sin modificaciones.

---

## Regresión multinavegador — Validación del teléfono

**Fecha:** 30/10/2026  
**Módulo:** Formulario de acceso — Teléfono  
**Archivo:** `tests/selenium/phone-validation-boundaries.test.js`  
**Herramienta:** Selenium WebDriver / Node.js

### Objetivo

Verificar los valores límite, los caracteres permitidos y el rechazo de entradas inválidas en el campo Teléfono.

La validación establece un mínimo de 7 y un máximo de 15 dígitos numéricos, admitiendo determinados caracteres de formato.

### Escenarios ejecutados

| ID | Escenario | Resultado |
|---|---|---|
| PHONE-001 | Mínimo de 7 dígitos | PASS |
| PHONE-002 | Teléfono de 8 dígitos | PASS |
| PHONE-003 | Máximo de 15 dígitos | PASS |
| BUG-005 | Teléfono de 16 dígitos | PASS |
| BUG-001 | Teléfono con caracteres alfabéticos | PASS |
| PHONE-004 | Espacios permitidos | PASS |
| PHONE-005 | Guiones permitidos | PASS |
| PHONE-006 | Paréntesis permitidos | PASS |
| PHONE-007 | Prefijo internacional | PASS |
| PHONE-008 | Símbolo no permitido | PASS |
| PHONE-009 | Entrada compuesta únicamente por símbolos | PASS |

### Resultados por navegador

| Navegador | Ejecutadas | PASS | FAIL |
|---|---:|---:|---:|
| Google Chrome | 11 | 11 | 0 |
| Mozilla Firefox | 11 | 11 | 0 |
| Microsoft Edge | 11 | 11 | 0 |
| **Total** | **33** | **33** | **0** |

### Observaciones de ejecución

La primera ejecución en Google Chrome obtuvo 4 PASS y 7 FAIL.

Los siete fallos se produjeron al comprobar la visibilidad del portfolio inmediatamente después de enviar formularios válidos.

La revisión del código confirmó que el acceso depende de una petición HTTP asíncrona a `POST /api/visitors`.

Se incorporó una espera explícita mediante `driver.wait()` y `until.elementIsVisible()` para sincronizar la comprobación con la finalización del proceso de acceso.

La segunda ejecución de Chrome obtuvo 11 PASS y 0 FAIL.

Posteriormente, la misma suite obtuvo 11 PASS en Firefox y 11 PASS en Edge, sin modificar los escenarios.

Los resultados iniciales se conservan como antecedente de ajuste de automatización y no se registran como defectos confirmados de la aplicación.

### Verificación de defectos históricos

**BUG-001 — Caracteres alfabéticos en el teléfono:** regresión satisfactoria en los tres navegadores.

**BUG-005 — Longitud máxima del teléfono:** regresión satisfactoria en los tres navegadores.

Estas ejecuciones verifican el comportamiento actual corregido, pero no constituyen evidencia de reproducción de los defectos originales.

### Resultado final

**33/33 PASS — 0 FAIL**

Regresión multinavegador satisfactoria para los 11 escenarios ejecutados.
## Regression Execution — TC-019 / TC-020

### Environment

- Operating System: Windows
- Automation: Selenium WebDriver
- Test Runner: Node.js Test Runner
- Test File: tests/selenium/portfolio-navigation.test.js
- Frontend: http://127.0.0.1:8000

### Execution Results

| Browser | TC-019 | TC-020 | Total | Status |
|---|---|---|---|---|
| Google Chrome | 2/2 PASS | 2/2 PASS | 4/4 | PASS |
| Mozilla Firefox | 2/2 PASS | 2/2 PASS | 4/4 | PASS |
| Microsoft Edge | 2/2 PASS | 2/2 PASS | 4/4 | PASS |

### Verification Scope

**TC-019 — Portfolio Navigation**
- Direct loading of five internal pages.
- Navigation through actual links from index.html.

**TC-020 — Return Navigation**
- Return to index.html through the logo.
- Return through navigation buttons.
- Verification of #about and #qa destinations.
- Verification that destination sections are displayed.

### Final Result

- Total automated test executions: 12
- Passed: 12
- Failed: 0
- Blocked: 0
- Status: PASS

### Conclusion

TC-019 and TC-020 passed automated regression testing
in Google Chrome, Mozilla Firefox and Microsoft Edge.

---

## Regresión multinavegador — Internacionalización de Gestión de Calidad

**Fecha:** 04/11/2026  
**Módulo:** quality-management.html  
**Herramienta:** Selenium WebDriver / Node.js Test Runner  
**Suite:** tests/selenium/qm-*.test.js  
**Idiomas:** Español (ES), Inglés (EN), Portugués (PT)  
**Sistema operativo:** Windows

### Objetivo

Verificar la internacionalización y el comportamiento dinámico de los componentes de Gestión de Calidad en Google Chrome, Mozilla Firefox y Microsoft Edge.

### Alcance

Las 22 pruebas automatizadas cubren:

- Épica y definición del alcance.
- Requisitos funcionales y no funcionales.
- Historias de usuario y criterios de aceptación.
- Escenarios BDD.
- Matriz de trazabilidad.
- Gestión de defectos.
- Sprints y etapas.
- Backlog.
- Resultados y condiciones de cierre.

Las verificaciones incluyen traducciones ES/EN/PT, actualización de contenido dinámico, navegación entre elementos, selección de registros y comprobaciones de persistencia definidas en la suite.

### Resultados por navegador

| Navegador | Ejecutadas | PASS | FAIL | Omitidas |
|---|---:|---:|---:|---:|
| Google Chrome | 22 | 22 | 0 | 0 |
| Mozilla Firefox | 22 | 22 | 0 | 0 |
| Microsoft Edge | 22 | 22 | 0 | 0 |
| **Total** | **66** | **66** | **0** | **0** |

### Duración de las ejecuciones finales

| Navegador | Duración |
|---|---:|
| Google Chrome | 163593.3465 ms |
| Mozilla Firefox | 719248.5985 ms |
| Microsoft Edge | 178824.1142 ms |

### Incidencia detectada y corregida

**Escenario:** BDD-005 — Persistencia del idioma.

En la primera ejecución de Chrome se registraron 21 PASS y 1 FAIL.

El fallo se produjo porque el resultado esperado en `tests/selenium/qm-bdd-i18n.test.js` no coincidía con el texto actualizado del diccionario de traducciones.

Se actualizaron los valores esperados del escenario BDD-005 para ES, EN y PT, conservando el estado de verificación parcial documentado.

La ejecución individual posterior obtuvo 1/1 PASS.

Después de la corrección, se ejecutó nuevamente la suite completa:

- Google Chrome: 22/22 PASS.
- Mozilla Firefox: 22/22 PASS.
- Microsoft Edge: 22/22 PASS.

La incidencia correspondía a un resultado esperado desactualizado en la automatización. No se confirmó un defecto funcional de la aplicación.

### Resultado final

**66/66 PASS — 0 FAIL — 0 OMITIDAS**

Estado: APROBADO.

La regresión multinavegador de la suite de internacionalización de `quality-management.html` finalizó satisfactoriamente en los tres navegadores.

### Limitaciones del alcance

Estos resultados corresponden exclusivamente a los 22 casos automatizados de Gestión de Calidad.

No constituyen una certificación de internacionalización completa de las otras cinco páginas del portfolio ni de aspectos que no estén cubiertos por las pruebas ejecutadas.

### Conclusión

Se confirma la ejecución satisfactoria de la regresión Selenium de Gestión de Calidad en Google Chrome, Mozilla Firefox y Microsoft Edge.

La incidencia BDD-005 quedó corregida en el script de automatización y la suite finalizó sin fallos.
---

## Regresión multinavegador — Internacionalización del formulario de acceso

**Fecha:** 04/11/2026  
**Módulo:** index.html  
**Herramienta:** Selenium WebDriver / Node.js Test Runner  
**Suite:** tests/selenium/access-*-i18n.test.js y tests/selenium/access-errors-language-switch.test.js  
**Idiomas:** Español (ES), Inglés (EN), Portugués (PT)  
**Sistema operativo:** Windows

### Objetivo

Verificar la internacionalización del formulario de acceso al portfolio, incluyendo etiquetas, placeholders, mensajes de validación y actualización dinámica de errores en Google Chrome, Mozilla Firefox y Microsoft Edge.

### Alcance

Se ejecutaron cuatro casos de prueba automatizados:

| Caso | Descripción |
|---|---|
| ACCESS-I18N-001 | Traducción de etiquetas y placeholders del formulario. |
| ACCESS-I18N-002 | Validación de mensajes de campos obligatorios en ES/EN/PT. |
| ACCESS-I18N-003 | Actualización de errores visibles al cambiar de idioma sin reenviar el formulario. |
| ACCESS-I18N-004 | Traducción de errores de formato inválido y conservación de valores ingresados. |

Las pruebas incluyen la secuencia ES → EN → PT → ES y verifican la identidad real del navegador mediante las capacidades de Selenium WebDriver.

### Resultados por navegador

| Navegador | Ejecutadas | PASS | FAIL | Omitidas |
|---|---:|---:|---:|---:|
| Google Chrome | 4 | 4 | 0 | 0 |
| Mozilla Firefox | 4 | 4 | 0 | 0 |
| Microsoft Edge | 4 | 4 | 0 | 0 |
| **Total** | **12** | **12** | **0** | **0** |

### Resultados por caso

| Caso | Chrome | Firefox | Edge |
|---|---|---|---|
| ACCESS-I18N-001 | PASS | PASS | PASS |
| ACCESS-I18N-002 | PASS | PASS | PASS |
| ACCESS-I18N-003 | PASS | PASS | PASS |
| ACCESS-I18N-004 | PASS | PASS | PASS |

### Duración de las ejecuciones finales

| Caso | Chrome | Firefox | Edge |
|---|---:|---:|---:|
| ACCESS-I18N-001 | 12,16 s | 43,55 s | 22,34 s |
| ACCESS-I18N-002 | 30,05 s | 70,97 s | 24,68 s |
| ACCESS-I18N-003 | 17,89 s | 51,88 s | 12,40 s |
| ACCESS-I18N-004 | 13,58 s | 43,35 s | 14,09 s |

### Defecto detectado y corregido

**Caso relacionado:** ACCESS-I18N-003.

**Descripción:** Los mensajes de error del formulario de acceso permanecían en el idioma anterior cuando el usuario cambiaba el selector de idioma después de generar los errores.

**Resultado esperado:** Los mensajes visibles deben actualizarse al idioma seleccionado sin necesidad de reenviar el formulario.

**Resultado inicial:** FAIL en Google Chrome. El mensaje `firstNameError` no se actualizó al cambiar de español a inglés.

**Causa identificada:** La función `applyLanguage()` no actualizaba explícitamente los mensajes de error ya visibles del formulario de acceso.

**Corrección:** Se incorporó en `js/app.js` la actualización de los errores visibles mediante las claves de traducción correspondientes, contemplando mensajes obligatorios y de formato inválido.

**Regresión posterior:**

- Google Chrome: PASS.
- Mozilla Firefox: PASS.
- Microsoft Edge: PASS.

**Estado del defecto:** CORREGIDO Y VERIFICADO.

### Resultado final

**12/12 PASS — 0 FAIL — 0 OMITIDAS**

Estado: APROBADO.

### Limitaciones del alcance

Los resultados corresponden exclusivamente a los cuatro casos automatizados de internacionalización del formulario de acceso.

No constituyen una certificación de cobertura funcional completa de `index.html` ni de internacionalización de las demás páginas del portfolio.

### Conclusión

La regresión multinavegador de internacionalización del formulario de acceso finalizó satisfactoriamente en Google Chrome, Mozilla Firefox y Microsoft Edge.

Se verificaron las traducciones de etiquetas, placeholders, mensajes obligatorios y errores de formato, incluyendo su actualización dinámica.

El defecto detectado durante ACCESS-I18N-003 fue corregido en `js/app.js` y validado mediante pruebas de regresión en los tres navegadores.
### Ampliación de cobertura — ACCESS-I18N-005

**Fecha:** 04/11/2026  
**Caso:** ACCESS-I18N-005 — Persistencia del idioma ES/EN/PT  
**Archivo:** `tests/selenium/access-language-persistence.test.js`

**Objetivo:** Verificar que la preferencia de idioma se conserve al recargar la página de acceso, iniciar una sesión y navegar a una página técnica del portfolio.

**Verificaciones realizadas:**

- Almacenamiento de `portfolioLanguage` en `localStorage`.
- Persistencia del idioma después de recargar `index.html`.
- Acceso válido al portfolio en ES, EN y PT.
- Almacenamiento de `portfolioSession.language` en `sessionStorage`.
- Traducción del saludo personalizado.
- Conservación del idioma al navegar a `frontend.html`.
- Identificación del navegador mediante Selenium WebDriver.

**Resultados:**

| Navegador | Ejecutadas | PASS | FAIL | Omitidas |
|---|---:|---:|---:|---:|
| Google Chrome | 1 | 1 | 0 | 0 |
| Mozilla Firefox | 1 | 1 | 0 | 0 |
| Microsoft Edge | 1 | 1 | 0 | 0 |
| **Total** | **3** | **3** | **0** | **0** |

**Duraciones finales:**

- Google Chrome: 15122.4901 ms.
- Mozilla Firefox: 115891.3495 ms.
- Microsoft Edge: 55159.5171 ms.

**Incidencia durante la preparación:**

La primera ejecución en Chrome falló porque la prueba intentaba seleccionar español cuando ya era el valor predeterminado, sin producir necesariamente un evento de cambio.

Se ajustó la preparación del test para realizar una transición real entre idiomas antes de comprobar `localStorage`.

La ejecución posterior aprobó. No fue necesario modificar el código funcional de la aplicación.

**Resultado consolidado de internacionalización del formulario de acceso:**

- Casos automatizados: 5.
- Navegadores: 3.
- Ejecuciones finales: 15.
- PASS: 15.
- FAIL: 0.
- Omitidas: 0.

**Estado: APROBADO — 15/15 PASS.**

La cobertura de persistencia queda verificada para `index.html` y la navegación hacia `frontend.html`. No se extiende automáticamente a todas las páginas técnicas del portfolio.
---

## Regresión multinavegador — Internacionalización del laboratorio Frontend

**Fecha:** 04/11/2026  
**Página:** `frontend.html`  
**Módulo:** Laboratorio interactivo de internacionalización  
**Tecnología:** Selenium WebDriver + Node.js Test Runner  
**Idiomas:** Español (ES), Inglés (EN), Portugués (PT)  
**Navegadores:** Google Chrome, Mozilla Firefox y Microsoft Edge

### Objetivo

Verificar el funcionamiento de la internacionalización del laboratorio interactivo, incluyendo independencia del idioma global, validaciones, mensajes de error, mensajes de éxito y revalidación dinámica.

### Casos automatizados

| ID | Caso de prueba | Resultado |
|---|---|---|
| FRONTEND-I18N-001 | Independencia del idioma del laboratorio respecto del portfolio | PASS |
| FRONTEND-I18N-002 | Validación de formulario vacío y traducción de errores | PASS |
| FRONTEND-I18N-003 | Validación de datos inválidos y conservación de valores | PASS |
| FRONTEND-I18N-004 | Validación de datos válidos y traducción del mensaje de éxito | PASS |
| FRONTEND-I18N-005 | Revalidación dinámica al corregir o introducir errores | PASS |

### Resultados por navegador

| Navegador | Ejecutadas | PASS | FAIL | Omitidas |
|---|---:|---:|---:|---:|
| Google Chrome | 5 | 5 | 0 | 0 |
| Mozilla Firefox | 5 | 5 | 0 | 0 |
| Microsoft Edge | 5 | 5 | 0 | 0 |
| **Total** | **15** | **15** | **0** | **0** |

### Cobertura verificada

- Cambio independiente de idioma ES/EN/PT.
- Conservación del idioma global del portfolio.
- Validación de campos vacíos.
- Validación de formatos inválidos.
- Conservación de datos al cambiar de idioma.
- Traducción de mensajes de error y éxito.
- Actualización de atributos `aria-invalid`.
- Revalidación automática mediante eventos `input`.
- Eliminación de errores al corregir los campos.
- Aparición de nuevos errores sin volver a presionar el botón de validación.
- Identificación real del navegador mediante Selenium WebDriver.

### Incidencias de ejecución

Durante la primera ejecución de FRONTEND-I18N-001 en Microsoft Edge se produjo un timeout del navegador.

La repetición de la prueba finalizó correctamente sin modificaciones del código funcional.

No se confirmó un defecto de internacionalización asociado a esa incidencia.

### Resultado final

**15/15 PASS — APROBADO.**

La cobertura documentada corresponde al laboratorio interactivo de internacionalización de `frontend.html`. No implica cobertura integral de todos los componentes de la página.
## Regresión multinavegador — Internacionalización del laboratorio Backend

**Fecha:** 04/11/2026  
**Página:** `backend.html`  
**Herramienta:** Selenium WebDriver / Node.js Test Runner  
**Idiomas:** Español (ES), Inglés (EN), Portugués (PT)  
**Navegadores:** Google Chrome, Mozilla Firefox y Microsoft Edge

### Objetivo

Verificar la internacionalización y el comportamiento dinámico de los componentes del laboratorio Backend en los tres navegadores.

### Casos automatizados

| ID | Área verificada | Resultado |
|---|---|---|
| BACKEND-I18N-001 | Arquitectura de la API | PASS |
| BACKEND-I18N-002 | Validaciones y reglas | PASS |
| BACKEND-I18N-003 | Persistencia SQLite | PASS |
| BACKEND-I18N-004 | Pruebas automatizadas | PASS |
| BACKEND-I18N-005 | Guía interactiva de códigos HTTP | PASS |

### Resultados por navegador

| Navegador | Ejecutadas | PASS | FAIL | Omitidas |
|---|---:|---:|---:|---:|
| Google Chrome | 5 | 5 | 0 | 0 |
| Mozilla Firefox | 5 | 5 | 0 | 0 |
| Microsoft Edge | 5 | 5 | 0 | 0 |
| **Total** | **15** | **15** | **0** | **0** |

### Verificaciones de la guía HTTP — BACKEND-I18N-005

- Traducción de las cinco familias HTTP: 1xx, 2xx, 3xx, 4xx y 5xx.
- Traducción de títulos, descripciones y ejemplos.
- Conservación de los códigos HTTP durante los cambios de idioma.
- Actualización dinámica ES → EN → PT → ES.
- Conservación de la familia seleccionada al cambiar de idioma.
- Apertura y cierre del panel interactivo.

### Incidencias durante la preparación

La prueba BACKEND-I18N-005 presentó inicialmente errores de comparación debido a índices incorrectos en el script Selenium.

Se corrigieron los rangos de claves `backendDynamic000–033` utilizados para construir los resultados esperados.

No fue necesario modificar `backend.html` ni `translations.js` para resolver estos errores de automatización.

La ejecución final de BACKEND-I18N-005 obtuvo PASS en los tres navegadores.

### Resultado final

**15/15 PASS — 0 FAIL — 0 OMITIDAS.**

**Estado: APROBADO.**

La cobertura documentada corresponde a los cinco casos automatizados de internacionalización del laboratorio Backend. No constituye una certificación integral de todas las funcionalidades de `backend.html`.

---

## Regresión multinavegador — Internacionalización CV y QA

**Fecha:** 04/11/2026  
**Módulos:** cv.html y qa.html  
**Herramientas:** Selenium WebDriver / Node.js Test Runner  
**Idiomas:** Español (ES), Inglés (EN), Portugués (PT)  
**Navegadores:** Google Chrome, Mozilla Firefox y Microsoft Edge

### Objetivo

Verificar que las páginas CV y QA traduzcan correctamente sus
contenidos estáticos y dinámicos, manteniendo el comportamiento
de los componentes interactivos durante los cambios de idioma.

Secuencia de validación: ES → EN → PT → ES.

### Resultados — CV

| ID | Escenario | Chrome | Firefox | Edge |
|---|---|---|---|---|
| CV-I18N-001 | Trayectoria profesional | PASS | PASS | PASS |
| CV-I18N-002 | Formación y desarrollo | PASS | PASS | PASS |
| CV-I18N-003 | Galería de certificados | PASS | PASS | PASS |
| CV-I18N-004 | Cambio de idioma con galería abierta | PASS | PASS | PASS |
| **Total** | **4 casos** | **4/4** | **4/4** | **4/4** |

**Resultado CV: 12/12 PASS — 0 FAIL.**

### Resultados — QA

| ID | Escenario | Chrome | Firefox | Edge |
|---|---|---|---|---|
| QA-I18N-001 | Interfaz estática | PASS | PASS | PASS |
| QA-I18N-002 | Biblioteca de casos de prueba | PASS | PASS | PASS |
| QA-I18N-003 | Biblioteca Selenium | PASS | PASS | PASS |
| QA-I18N-004 | Regresión y bugs | PASS | PASS | PASS |
| QA-I18N-005 | Evidencia verificable | PASS | PASS | PASS |
| **Total** | **5 casos** | **5/5** | **5/5** | **5/5** |

**Resultado QA: 15/15 PASS — 0 FAIL.**

### Resumen consolidado

| Métrica | Resultado |
|---|---:|
| Casos automatizados | 9 |
| Navegadores verificados | 3 |
| Ejecuciones totales | 27 |
| PASS | 27 |
| FAIL | 0 |
| BLOCKED | 0 |
| Porcentaje de aprobación | 100% |

### Defecto detectado y corregido — CV-I18N-004

Durante la ejecución inicial de CV-I18N-004 se detectó
que los enlaces de la galería de certificados no
actualizaban su idioma cuando el usuario cambiaba
el selector con el diálogo abierto.

Se corrigió js/certificates.js para actualizar
los contenidos de la galería al recibir el evento
portfolio:languagechange.

La prueba de regresión posterior obtuvo PASS en
Chrome, Firefox y Edge.

El fallo inicial se conserva como antecedente del
defecto corregido y no se incluye entre los fallos
de las ejecuciones finales aprobadas.

### Alcance de la validación

Los resultados corresponden a los nueve casos
automatizados definidos para la internacionalización
de cv.html y qa.html.

La cobertura incluye traducciones, componentes
interactivos, conservación del estado, atributos
accesibles y enlaces, según el alcance de cada caso.

Los resultados no sustituyen las pruebas funcionales,
de API, rendimiento o compatibilidad documentadas
en otras secciones del reporte.

### Conclusión

**27/27 PASS — 0 FAIL**

La regresión de internacionalización planificada
para cv.html y qa.html finalizó satisfactoriamente
en los tres navegadores.

---

## Verificación manual responsive y compatibilidad visual — 05/11/2026

### Objetivo

Verificar la adaptación visual de las seis páginas del portfolio en diferentes tamaños de pantalla, identificando desbordamientos de texto, superposiciones y problemas de distribución de los componentes.

### Entorno

- Sistema operativo: Windows.
- Navegadores: Google Chrome, Mozilla Firefox y Microsoft Edge.
- Herramienta: DevTools y revisión visual manual.
- Resoluciones de referencia: 375 px, 768 px y vistas de escritorio.
- Tipo de prueba: Manual — Responsive Testing / Cross-Browser Visual Testing.

### Resultados

| Página | Chrome | Firefox | Edge |
|---|---|---|---|
| index.html | PASS | PASS | PASS |
| cv.html | PASS | PASS | PASS |
| frontend.html | PASS | PASS | PASS |
| backend.html | PASS | PASS | PASS |
| qa.html | PASS | PASS | PASS |
| quality-management.html | PASS | PASS | PASS |

### Ajustes realizados

- **index.html:** adaptación de navegación, buscador, elementos visuales y footer.
- **cv.html:** adaptación de navegación, buscador y footer.
- **frontend.html:** reorganización de columnas, navegación y footer.
- **backend.html:** distribución responsive de tarjetas API, posicionamiento de botones de persistencia y reorganización de la biblioteca de pruebas automatizadas.
- **qa.html:** desplazamiento horizontal de la biblioteca TC-001 a TC-018, conservando el diseño de los libros y su interacción.
- **quality-management.html:** reorganización del footer para pantallas pequeñas.

### Observaciones

- No se observaron desbordamientos de texto pendientes durante la revisión visual final.
- Los componentes ajustados presentaron el comportamiento visual esperado en las verificaciones realizadas.
- El selector nativo de idioma puede desplegar sus opciones fuera del área visible cuando DevTools reduce la altura disponible. No se confirmó un defecto funcional asociado.
- Las comprobaciones corresponden a observaciones manuales y no constituyen una auditoría exhaustiva de accesibilidad ni de todas las resoluciones posibles.

### Resultado final

**PASS — Revisión visual responsive finalizada para las seis páginas.**

La verificación se realizó manualmente en Chrome, Firefox y Edge.

Estos resultados se registran de manera independiente de las regresiones automatizadas Selenium documentadas anteriormente.

---
## Regresión multinavegador — Navegación integral y persistencia del idioma

### Información de ejecución

- **Proyecto:** Miguel Flor — QA & AI Portfolio
- **Fecha:** 05/11/2026
- **Sistema operativo:** Windows
- **Herramientas:** Selenium WebDriver / Node.js Test Runner
- **Navegadores:** Google Chrome, Mozilla Firefox y Microsoft Edge
- **Idiomas:** Español (ES), Inglés (EN) y Portugués (PT)
- **Entorno:** http://127.0.0.1:8000

### Objetivo

Verificar la navegación integral entre las seis páginas del portfolio, el comportamiento del logo y los botones de retorno, así como la selección y persistencia del idioma durante el acceso, la navegación y la recarga.

### Suites ejecutadas

**NAV-ALL — Navegación integral**

Archivo: `tests/selenium/portfolio-navigation-all-directions.test.js`

Alcance:

- Navegación entre las seis páginas del portfolio.
- Verificación de las 30 combinaciones dirigidas entre páginas distintas, utilizando Home como intermediario cuando corresponde.
- Retorno al inicio de Home mediante el logo.
- Retorno a las secciones correspondientes mediante los botones Volver.
- Verificación de los destinos y anclas.
- Conservación del idioma ES/EN/PT durante la navegación.

**LANG-NAV-006 — Internacionalización y persistencia**

Archivo: `tests/selenium/portfolio-language-navigation-persistence.test.js`

Alcance:

- Selección de ES/EN/PT.
- Persistencia mediante `localStorage`.
- Conservación del idioma en `sessionStorage` durante la sesión de acceso.
- Verificación del saludo traducido.
- Navegación por las seis páginas.
- Persistencia después de recargar.
- Retorno a Home mediante el logo.
- Comparación de textos visibles traducidos en ES/EN/PT.

### Resultados por navegador

| Navegador | NAV-ALL | LANG-NAV-006 | Resultado |
|---|---|---|---|
| Google Chrome | PASS | PASS | APROBADO |
| Mozilla Firefox | PASS | PASS | APROBADO |
| Microsoft Edge | PASS | PASS | APROBADO |
| **Total** | **3/3 PASS** | **3/3 PASS** | **6/6 PASS** |

### Cobertura de navegación

La suite NAV-ALL ejecutó satisfactoriamente, por navegador:

- 15 verificaciones de retorno mediante el logo.
- 15 verificaciones de retorno mediante los botones Volver.
- 90 recorridos dirigidos entre páginas distintas.

Total: **120 verificaciones internas por navegador**, distribuidas entre los tres idiomas.

### Verificación de traducciones visibles

La suite LANG-NAV-006 identificó las siguientes claves con textos visibles diferenciados en ES, EN y PT:

| Página | Claves |
|---|---:|
| index.html | 65 |
| cv.html | 47 |
| frontend.html | 99 |
| backend.html | 103 |
| qa.html | 316 |
| quality-management.html | 227 |
| **Total** | **857** |

Los mismos resultados se registraron en Chrome, Firefox y Edge.

### Trazabilidad relacionada

- **RF-05:** Selección y persistencia del idioma.
- **HU-002:** Navegación por el portfolio.
- **HU-004:** Persistencia del idioma.
- **BDD-003:** Navegación por el portfolio.
- **BDD-005:** Persistencia del idioma.
- **TC-019:** Navegación entre páginas.
- **TC-020:** Navegación de retorno.

La actualización formal de los vínculos se realizará en la matriz de trazabilidad.

### Limitaciones

Las seis ejecuciones corresponden a dos suites automatizadas, una por navegador para cada suite. Las verificaciones internas no se contabilizan como suites independientes.

La comprobación de 857 claves demuestra traducciones visibles diferenciadas, pero no constituye una auditoría exhaustiva de todos los textos del portfolio.

### Conclusión

Las pruebas de navegación integral y persistencia del idioma finalizaron satisfactoriamente en Google Chrome, Mozilla Firefox y Microsoft Edge.

Suites ejecutadas: 6

PASS: 6

FAIL: 0

Omitidas: 0

Estado: APROBADO — REGRESIÓN MULTINAVEGADOR CERRADA.

La evidencia obtenida permite completar el respaldo de navegación y persistencia del idioma de BDD-003 y BDD-005, sujeto a la actualización de sus referencias documentales.
## Reejecución de regresión Selenium — Buscador global — 12/11/2026

**Requisito:** FR-011 — Global Search  
**Herramienta:** Selenium WebDriver / Node.js Test Runner  
**Archivo:** `tests/selenium/global-search-navigation.test.js`  
**Entorno:** Windows — `http://127.0.0.1:5500`

### Objetivo

Verificar nuevamente los 43 casos automatizados del buscador global en Google Chrome, Mozilla Firefox y Microsoft Edge, después de las correcciones de navegación y configuración de Selenium.

### Resultados finales

| Navegador | Casos | PASS | FAIL | Modalidad |
|---|---:|---:|---:|---|
| Google Chrome | 43 | 43 | 0 | Suite completa |
| Mozilla Firefox | 43 | 43 | 0 | Ejecuciones parciales |
| Microsoft Edge | 43 | 43 | 0 | Suite completa |
| **Total** | **129** | **129** | **0** | |

**Resultado consolidado: 129/129 PASS.**

### Incidencias y correcciones

**1. Configuración de Firefox**

La ejecución integral inicial de Firefox registró 36 PASS y 7 FAIL.

Seis fallos correspondían a intentos de Selenium Manager de descargar Firefox, debido a que determinados casos no utilizaban la configuración explícita del navegador.

Se sustituyó la construcción original de WebDriver por la función compartida `crearDriver()`.

**Verificación posterior:** seis casos ejecutados, seis PASS.

**2. Inicialización de Marionette**

SEARCH-TC-015 registró inicialmente un error `Failed to read marionette port`.

La ejecución individual posterior confirmó la selección del segundo resultado mediante clic y la navegación correcta a `home.html#specialties`.

**Verificación posterior:** SEARCH-TC-015 — PASS.

**3. Navegación y selección de resultados**

Los ocho casos previamente corregidos se verificaron en Chrome, Firefox y Edge.

**Resultado:** 24/24 PASS.

### Observaciones

- Chrome y Edge finalizaron ejecuciones completas de 43 casos.
- Firefox alcanzó 43 casos satisfactorios mediante ejecuciones parciales posteriores al diagnóstico.
- No se registra una nueva ejecución integral satisfactoria de Firefox en esta fecha.
- Los fallos de inicialización del navegador no constituyen defectos funcionales confirmados del buscador.
- Se eliminaron los mensajes temporales de diagnóstico del código Selenium.
- Los resultados históricos del 30/10/2026 permanecen independientes de esta reejecución.

### Conclusión

Los 43 escenarios del buscador global cuentan con resultados satisfactorios en los tres navegadores.

**Estado: APROBADO — 129/129 PASS, con validación parcial consolidada en Firefox.**