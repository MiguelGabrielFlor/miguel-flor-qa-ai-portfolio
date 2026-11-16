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

## Verificación NFR-004 — Modularización de backend.html

**Fecha:** 13/11/2026

### Objetivo

Mejorar la mantenibilidad de backend.html mediante la
separación de CSS y JavaScript, la reutilización de
componentes y la eliminación de código duplicado,
conservando el comportamiento funcional y la
internacionalización ES/EN/PT.

### Refactorización realizada

- Extracción del CSS interno a css/backend/backend.css.
- Extracción de los laboratorios JavaScript a:
  - js/backend/http-guide.js
  - js/backend/api-lab.js
  - js/backend/validation-lab.js
  - js/backend/persistence-lab.js
- Incorporación de js/backend/translations-helper.js
  para las traducciones dinámicas.
- Reutilización de js/shared/navigation.js para el
  índice de contenidos y su interacción con el buscador.
- Reutilización de BackendResultRenderer.showRequest()
  para presentar las solicitudes enviadas.
- Eliminación de scripts de navegación duplicados.
- Conservación de los diccionarios ES/EN/PT.

### Verificación estructural

| Verificación | Resultado |
|---|---|
| Bloques CSS internos restantes | 0 |
| Scripts JavaScript internos restantes | 0 |
| Archivos CSS externos referenciados | 2 |
| Archivos JavaScript externos referenciados | 11 |
| Archivo backend.css | 37.372 bytes |
| Sintaxis de translations-helper.js | PASS |

### Verificación manual

**Navegador:** Google Chrome.

- Navegación compartida: PASS.
- Cierre del índice al seleccionar una sección: PASS.
- Cierre del índice al utilizar el buscador: PASS.
- Traducciones dinámicas ES/EN/PT: PASS.
- Presentación visual de componentes: PASS.
- Presentación responsive: PASS.
- Carga del CSS externo: PASS.

### Regresión automatizada multinavegador

**Herramienta:** Selenium WebDriver con Node.js.

| Caso | Chrome | Firefox | Edge |
|---|---|---|---|
| BACKEND-I18N-001 — Arquitectura API | PASS | PASS | PASS |
| BACKEND-I18N-002 — Validaciones | PASS | PASS | PASS |
| BACKEND-I18N-003 — Persistencia | PASS | PASS | PASS |
| BACKEND-I18N-004 — Pruebas automatizadas | PASS | PASS | PASS |
| BACKEND-I18N-005 — Guía HTTP | PASS | PASS | PASS |
| **Total** | **5/5** | **5/5** | **5/5** |

**Resumen de ejecución:**

- Ejecuciones: 15.
- PASS: 15.
- FAIL: 0.
- Navegadores: Chrome, Firefox y Microsoft Edge.
- Idiomas verificados: español, inglés y portugués.

Durante la ejecución inicial de Chrome se detectó
un conflicto entre las variables de entorno
TEST_BROWSER y SELENIUM_BROWSER.

Se eliminó SELENIUM_BROWSER de la sesión PowerShell
y se confirmó posteriormente la ejecución correcta
en Chrome.

En Edge aparecieron mensajes internos del navegador
relacionados con fallback_task_provider.cc, sin
provocar fallos en los casos Selenium ejecutados.

### Conclusión

La modularización de backend.html superó las
verificaciones estructurales, funcionales manuales
y automatizadas realizadas.

La separación de responsabilidades reduce la
duplicación de código y facilita su mantenimiento.

**Estado del módulo backend.html:** PASS dentro
del alcance verificado.

**Estado global de NFR-004:** PENDIENTE.
Continúa la auditoría de las demás páginas
del portfolio.

---

## Verificación NFR-004 — Mantenibilidad de quality-management.html

**Fecha:** 13/11/2026

### Objetivo

Mejorar la organización y mantenibilidad de
quality-management.html mediante la separación de
responsabilidades entre HTML, CSS y JavaScript,
conservando el comportamiento funcional y la
internacionalización ES/EN/PT.

### Refactorización realizada

- Extracción del CSS a
  css/quality-management/quality-management.css.
- Organización del JavaScript en módulos funcionales:
  requirements.js, stories.js, bdd.js,
  traceability.js, defects.js y cycles.js.
- Centralización de traducciones mediante
  js/quality-management/translations-helper.js.
- Reutilización de js/shared/navigation.js.
- Conservación de las funcionalidades interactivas
  y de los diccionarios ES/EN/PT.

### Verificación técnica

| Criterio | Resultado |
|---|---|
| Separación HTML, CSS y JavaScript | PASS |
| Organización por responsabilidad funcional | PASS |
| Declaraciones de funciones duplicadas por nombre | No detectadas en los módulos revisados |
| Llamadas directas entre módulos funcionales analizados | No detectadas |
| Reutilización de qmTranslate() | PASS |
| Lectura UTF-8 del traductor compartido | PASS |

Las verificaciones estáticas realizadas no constituyen
una auditoría exhaustiva de duplicación de lógica
ni de todas las dependencias globales.

### Regresión automatizada posterior a la refactorización

**Herramienta:** Selenium WebDriver con Node.js.

**Alcance:** nueve archivos de pruebas de Gestión
de Calidad, con 22 casos por navegador.

| Navegador | Ejecutadas | PASS | FAIL |
|---|---:|---:|---:|
| Google Chrome | 22 | 22 | 0 |
| Mozilla Firefox | 22 | 22 | 0 |
| Microsoft Edge | 22 | 22 | 0 |
| **Total** | **66** | **66** | **0** |

La regresión incluyó verificaciones de
internacionalización ES/EN/PT, requisitos,
historias de usuario, escenarios BDD,
trazabilidad, defectos, ciclos, backlog
y condiciones de cierre.

### Conclusión

La refactorización de quality-management.html
superó las verificaciones técnicas realizadas
y la regresión automatizada multinavegador.

Resultado: 66 PASS, 0 FAIL.

La evidencia respalda la mantenibilidad del
módulo revisado, pero no constituye una auditoría
integral del portfolio.

**Estado de NFR-004:** verificación del módulo
quality-management.html satisfactoria.
Revisión integral del proyecto pendiente.

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
## Regresión NAV-ALL — Arquitectura con Home independiente

**Fecha:** 12/11/2026
**Entorno:** Local — http://127.0.0.1:8000
**Herramientas:** Selenium WebDriver / Node.js Test Runner
**Archivo:** `tests/selenium/portfolio-navigation-all-directions.test.js`

### Objetivo

Validar la navegación integral después de separar la pantalla de acceso (`index.html`) de la página principal (`home.html`).

### Alcance

- Acceso a Home mediante el flujo de sesión existente o acceso como invitado.
- Navegación desde Home hacia las cinco páginas internas.
- Retorno mediante el logo a `home.html`.
- Verificación de los enlaces Volver y sus anclas.
- Navegación entre las seis páginas del portfolio.
- Persistencia del idioma ES/EN/PT.

### Resultados

| Navegador | Resultado | Duración |
|---|---|---|
| Google Chrome | PASS | 91,4 s |
| Mozilla Firefox | PASS | 317,8 s |
| Microsoft Edge | PASS | 128,5 s |
| **Total** | **3/3 PASS** | |

### Cobertura por navegador

- 15 verificaciones de retorno mediante el logo.
- 15 verificaciones de retorno mediante enlaces Volver.
- 90 recorridos dirigidos entre páginas distintas.
- **Total: 120 verificaciones internas por navegador.**

### Conclusión

**NAV-ALL: APROBADO en Chrome, Firefox y Edge.**

La prueba fue adaptada a la arquitectura actual y completó satisfactoriamente la regresión multinavegador.

La suite `LANG-NAV-006` no se volvió a ejecutar durante esta regresión. Sus resultados históricos se conservan por separado.

**Trazabilidad:** RF-05, RF-07, HU-002, HU-004, BDD-003, BDD-005, TC-019 y TC-020.

## Regresión FRONTEND-I18N — Modularización NFR-004

**Fecha:** 13/11/2026
**Página:** `frontend.html`
**Entorno:** Local
**Herramientas:** Selenium WebDriver / Node.js Test Runner

### Objetivo

Verificar el comportamiento del laboratorio de internacionalización después de extraer el JavaScript y CSS de `frontend.html` a módulos externos.

### Alcance

- Validación de campos vacíos en ES/EN/PT.
- Validación de datos inválidos en ES/EN/PT.
- Validación de datos válidos en ES/EN/PT.
- Revalidación dinámica al cambiar de idioma.
- Independencia entre el idioma del laboratorio y el idioma global del portfolio.

### Resultados

| Prueba | Chrome | Firefox | Edge |
|---|---|---|---|
| FRONTEND-I18N-002 — Validación vacía | PASS | PASS | PASS |
| FRONTEND-I18N-003 — Datos inválidos | PASS | PASS | PASS |
| FRONTEND-I18N-004 — Datos válidos | PASS | PASS | PASS |
| FRONTEND-I18N-005 — Revalidación dinámica | PASS | PASS | PASS |
| Independencia del laboratorio | PASS | PASS | PASS |
| **Total** | **5/5** | **5/5** | **5/5** |

**Resultado consolidado: 15/15 PASS — 0 FAIL.**

### Incidencias y correcciones

1. Se corrigieron las expectativas de datos válidos e inválidos en las pruebas Selenium para reflejar los escenarios ES/EN/PT.
2. Se actualizó `selenium-config.js` para utilizar el identificador `MicrosoftEdge`.
3. Se normalizó la comparación entre `edge` y `microsoftedge` en las cinco pruebas.
4. Los fallos iniciales de Firefox y Edge se resolvieron mediante correcciones de pruebas y configuración, sin confirmar defectos funcionales en `frontend.html`.

### Verificaciones complementarias

- Extracción de los scripts interactivos a `js/frontend/`.
- Extracción de estilos a `css/frontend/frontend.css`.
- Sin bloques JavaScript ni CSS internos en `frontend.html`.
- Verificación visual y responsive en Chrome a 375, 768 y 1440 px.
- Navegación, buscador y laboratorios interactivos comprobados manualmente en Chrome.

Estas verificaciones manuales se registran separadamente de las 15 ejecuciones Selenium.

### Conclusión

**FRONTEND-I18N: APROBADO — 15/15 PASS.**

La regresión específica de internacionalización de `frontend.html` se completó satisfactoriamente en Chrome, Firefox y Edge.

La modularización de esta página cuenta con evidencia funcional y estructural. El requisito NFR-004 permanece abierto a nivel global hasta completar la auditoría de las demás páginas del portfolio.

## CV-MOD-001 — Modularización de cv.html

### Regresión Selenium posterior a la modularización

**Fecha:** 13/11/2026

| Prueba | Chrome | Firefox | Edge |
|---|---|---|---|
| CV-I18N-001 — Trayectoria | PASS | No ejecutada en esta regresión | No ejecutada en esta regresión |
| CV-I18N-002 — Formación | PASS | No ejecutada en esta regresión | No ejecutada en esta regresión |
| CV-I18N-003 — Certificados | PASS | No ejecutada en esta regresión | No ejecutada en esta regresión |
| CV-I18N-004 — Galería abierta | PASS | PASS | PASS |

**Resultados:** 6 ejecuciones Selenium PASS, 0 FAIL finales.

**Incidencia durante la ejecución:** CV-I18N-004 presentó inicialmente `ElementClickInterceptedError` en Chrome.

**Corrección:** se incorporaron espera de visibilidad, desplazamiento centrado y comprobación de interacción en `cv-gallery-live-i18n.test.js`.

**Reejecución:** PASS en Chrome, Firefox y Edge.

**Observación:** no fue necesario modificar el código de `cv.html`. Las pruebas manuales y automatizadas se registran por separado.


**Fecha:** 13/11/2026
**Página:** `cv.html`
**Tipo:** Verificación estructural y regresión manual multinavegador
**Requisito:** NFR-004

### Cambios realizados

- Eliminación de dos bloques JavaScript internos.
- Reutilización de `js/shared/navigation.js`.
- Conservación de las funcionalidades de navegación, búsqueda, certificados e internacionalización ES/EN/PT.

### Verificación estructural

- JavaScript interno: 0.
- CSS interno: 0.
- JavaScript externo: 5.
- Módulo compartido de navegación: presente.

### Regresión manual

| Funcionalidad | Chrome | Firefox | Edge |
|---|---|---|---|
| Índice de contenidos | PASS | PASS | PASS |
| Buscador | PASS | PASS | PASS |
| Certificados | PASS | PASS | PASS |
| Internacionalización ES/EN/PT | PASS | PASS | PASS |

**Resultado: 12/12 PASS — 0 FAIL.**

### Conclusión

CV-MOD-001: APROBADO.

La extracción del JavaScript interno no produjo regresiones en las funcionalidades verificadas.

La auditoría integral de NFR-004 continúa pendiente.

---

## HOME-MOD-001 — Regresión de navegación tras modularización

**Fecha:** 13/11/2026  
**Requisito:** NFR-004 — Mantenibilidad del código  
**Página:** home.html  
**Módulo:** js/shared/navigation.js  
**Prueba:** tests/selenium/home-navigation-index.test.js

### Alcance

Verificación de los dos métodos de acceso y del comportamiento del índice de contenidos después de la extracción del JavaScript interno a un módulo compartido.

### Escenarios verificados

1. Acceso directo y redirección a Home.
2. Acceso registrado mediante formulario y redirección a Home.
3. Cierre del índice al seleccionar una sección.
4. Cierre del índice al enfocar el buscador.
5. Cierre del índice al introducir texto en el buscador.

### Resultados Selenium

| Navegador | Acceso directo | Acceso registrado | Total |
|---|---|---|---|
| Chrome | PASS | PASS | 2/2 PASS |
| Firefox | PASS | PASS | 2/2 PASS |
| Edge | PASS | PASS | 2/2 PASS |
| **Total** | **3/3 PASS** | **3/3 PASS** | **6/6 PASS** |

- Comprobaciones funcionales: 24/24 PASS.
- Pruebas fallidas: 0.
- Pruebas bloqueadas: 0.
- Regresión manual previa HOME-MOD-001: 12/12 PASS.
- Verificación estructural: 0 bloques JavaScript internos y 0 bloques CSS internos.
- Resultado: PASS.

**Conclusión:** La navegación de Home conserva los comportamientos verificados después de la modularización. La auditoría integral de NFR-004 continúa pendiente.

---

## QA-MOD-001 — Modularización de QA

**Requisito:** NFR-004 — Mantenibilidad del código  
**Página:** qa.html  
**Estado:** PASS  
**Navegadores:** Chrome, Firefox y Edge  
**Idiomas:** ES, EN y PT

### Cambios realizados

- Externalización del CSS a css/qa.css.
- Externalización de JavaScript a módulos específicos de QA.
- Reutilización de js/shared/navigation.js.
- Corrección del orden de carga de las dependencias Markdown.
- Eliminación de bloques CSS y JavaScript internos.

### Evidencia automatizada

- QA-I18N-001 a QA-I18N-005: 15/15 PASS.
- QA-MOD-001-MD: 36/36 PASS.
- Total: 51/51 verificaciones reportadas.

### Evidencia manual

QA-VISUAL-MOD-001:

- Chrome: 4/4 PASS.
- Firefox: 4/4 PASS.
- Edge: 4/4 PASS.
- Total: 12/12 PASS.

Se verificaron presentación visual, cambio de idioma ES/EN/PT,
despliegue de información y visualización del contenido.

### Resultado

Modularización de qa.html validada funcional y visualmente.
Sin defectos funcionales detectados en las pruebas realizadas.

---

## NFR-004-AUDIT-001 — Auditoría integral de mantenibilidad

**Fecha:** 13/11/2026  
**Requisito:** NFR-004 — Mantenibilidad del código  
**Estado:** PASS en los controles ejecutados.

### Alcance

Auditoría estructural de las siete páginas principales,
los módulos JavaScript y las hojas CSS del portfolio.

### Resultados

| Control | Resultado |
|---|---|
| Páginas sin CSS/JS interno | 7/7 PASS |
| Referencias locales CSS/JS existentes | 61/61 PASS |
| Archivos JavaScript con sintaxis válida | 30/30 PASS |
| Archivos CSS con llaves y comentarios equilibrados | 5/5 PASS |
| Archivos JavaScript idénticos | 0 detectados |
| Nombres repetidos de funciones tradicionales | 0 detectados |
| Nombres repetidos de funciones flecha identificadas | 0 detectados |

### Evidencia funcional

Se conservan las regresiones documentadas de Backend,
Gestión de Calidad, Frontend, CV, Home y QA.

QA-MOD-001:
- Regresión Selenium existente: 15/15 PASS.
- Visor Markdown: 36/36 PASS.
- Revisión visual manual: 12/12 PASS.

### Limitaciones

Las búsquedas de duplicación mediante expresiones regulares
no garantizan ausencia de código funcionalmente equivalente.

La comprobación CSS verifica el equilibrio de llaves y
comentarios, pero no sustituye un validador CSS completo.

La verificación de referencias locales no comprueba la
disponibilidad de dependencias CDN externas.

### Conclusión

Auditoría estructural NFR-004-AUDIT-001 aprobada dentro
del alcance definido, sin incidencias detectadas en
los controles ejecutados.

---

## NFR-005-ACCESS-001 — Selector de idioma accesible

**Fecha:** 13/11/2026
**Requisito:** NFR-005 — Accesibilidad e interacción
**Página:** index.html
**Elemento:** languageSelect
**Navegador:** Google Chrome
**Resultado:** 3/3 PASS

### Incidencia detectada

El selector de idioma no disponía de un nombre
accesible explícito en el HTML.

### Corrección

Se incorporaron los atributos aria-label y
data-i18n-aria-label, junto con las traducciones
correspondientes en español, inglés y portugués.

### Validación

| Idioma | Nombre accesible | Resultado |
|---|---|---|
| ES | Seleccionar idioma | PASS |
| EN | Select language | PASS |
| PT | Selecionar idioma | PASS |

La comprobación se realizó en Chrome mediante
la lectura del atributo aria-label después de
cada cambio de idioma.

### Conclusión

Corrección validada: 3/3 PASS.

Pendiente: auditoría integral NFR-005,
incluidas verificaciones adicionales de
accesibilidad y compatibilidad.

---

## NFR-005-ACCESS-002 — Selector de idioma de Quality Management

**Fecha:** 13/11/2026
**Requisito:** NFR-005 — Accesibilidad e interacción
**Página:** quality-management.html
**Elemento:** cv-language-select
**Navegador:** Google Chrome
**Resultado:** 3/3 PASS

### Incidencia

El atributo aria-label permanecía en español al
seleccionar inglés o portugués.

Resultado inicial: 1/3 PASS.

### Corrección

Se incorporó data-i18n-aria-label con la clave
qmLanguageSelectorAria y sus traducciones ES/EN/PT.

### Regresión funcional

| Idioma | Nombre accesible | Resultado |
|---|---|---|
| ES | Seleccionar idioma | PASS |
| EN | Select language | PASS |
| PT | Selecionar idioma | PASS |

### Conclusión

Corrección validada mediante consola de Chrome.
Resultado final: 3/3 PASS.

NFR-005 continúa abierto hasta completar la
auditoría integral de accesibilidad.

---

## NFR-005-ACCESS-003 — Interacción y navegación mediante teclado

**Fecha:** 13/11/2026
**Requisito:** NFR-005 — Accesibilidad e interacción
**Alcance:** Siete páginas HTML y 30 archivos JavaScript
**Navegador de comprobación dinámica:** Google Chrome

### Auditoría estática

- Cinco atributos tabindex encontrados; ninguno positivo.
- Cero elementos div/span con onclick declarado en HTML.
- 67 referencias JavaScript revisadas como candidatos de interacción.
- No se confirmaron defectos en los fragmentos inspeccionados.

### Biblioteca de casos QA

- 20 controles examinados con etiqueta button.
- Atributo aria-expanded presente.
- Foco programático: PASS.
- Activación mediante Enter: PASS (manual).
- Activación mediante Espacio: PASS (manual).
- Apertura y cierre correctos en el control probado.

### Otros componentes

- Tarjetas de acceso: botones internos disponibles.
- Tarjetas de formación: tabindex, role y manejo de teclado implementados.
- Buscador: sin incidencia evidente en el fragmento revisado.

### Conclusión

PASS en las comprobaciones realizadas.

La prueba manual de Enter y Espacio corresponde al
control TC-001 de la biblioteca QA.

NFR-005 permanece abierto hasta completar la
auditoría integral de accesibilidad.

---

## NFR-005-ACCESS-004 — Indicadores visibles de foco

**Fecha:** 13/11/2026
**Requisito:** NFR-005 — Accesibilidad e interacción
**Página:** qa.html
**Archivo corregido:** css/qa.css
**Navegador:** Google Chrome
**Resultado:** PASS

### Incidencia

La navegación mediante Tab funcionaba en las
secciones 02 y 03, pero los controles no
presentaban indicadores visuales suficientemente
perceptibles.

### Corrección

Se incorporaron estilos :focus-visible y
:focus-within para destacar los controles y
sus contenedores.

- Sección 02: indicador azul.
- Sección 03: indicador rojo.
- Se conservaron los estilos generales del portfolio.
- No se modificó la lógica JavaScript.

### Regresión manual

| Comprobación | Resultado |
|---|---|
| Sección 02: foco visible | PASS |
| Sección 02: abrir y cerrar con Enter | PASS |
| Sección 03: foco visible | PASS |
| Sección 03: abrir y cerrar con Enter | PASS |
| Sección 03: enlaces con foco visible | PASS |

### Evidencia

Verificación visual mediante capturas de Chrome
y comprobación manual de navegación con teclado.

### Conclusión

Incidencia corregida en el alcance comprobado.

NFR-005 continúa abierto hasta completar
la auditoría integral de accesibilidad.

---

## NFR-005-ACCESS-005 — Accesibilidad del modal de certificados

**Fecha:** 13/11/2026
**Requisito:** NFR-005 — Accesibilidad e interacción
**Página:** cv.html
**Componente:** Galería de certificados
**Navegador:** Google Chrome
**Resultado:** 4/4 PASS

### Implementación verificada

- Elemento HTML nativo dialog.
- Apertura mediante showModal().
- Nombre accesible mediante aria-labelledby.
- Botón de cierre con etiqueta traducible ES/EN/PT.
- Tarjetas activables mediante Enter y Espacio.

### Prueba manual de teclado

| Comprobación | Resultado |
|---|---|
| Enter abre el modal | PASS |
| Tab permite navegar dentro del modal | PASS |
| Escape cierra el modal | PASS |
| El foco regresa a la tarjeta original | PASS |

### Conclusión

No se detectaron incidencias en el escenario
manual comprobado.

No fue necesario modificar código.

NFR-005 continúa abierto hasta completar
la auditoría integral de accesibilidad.

---

## NFR-005-ACCESS-006 — Asociación accesible de errores

**Fecha:** 13/11/2026
**Requisito:** NFR-005 — Accesibilidad e interacción
**Página:** index.html
**Archivo corregido:** js/app.js
**Navegador:** Google Chrome
**Resultado:** PASS

### Incidencia

Los cinco campos del formulario mostraban mensajes
de validación, pero carecían de aria-invalid y de
asociaciones programáticas con sus errores.

Resultado inicial: 5/5 REVISAR.

### Corrección

- showError() incorpora aria-invalid="true".
- Los errores se asocian mediante aria-describedby.
- Se conservan las descripciones accesibles previas.
- clearErrors() elimina los atributos de error.
- El consentimiento utiliza el mismo mecanismo.
- Se conservan las traducciones ES/EN/PT existentes.

### Regresión

| Comprobación | Resultado |
|---|---|
| Cinco campos con aria-invalid y error asociado | 5/5 PASS |
| Nueva validación conserva asociaciones | 5/5 PASS |
| Limpieza de mensajes y atributos de error | 5/5 PASS |


### Alcance

Las verificaciones iniciales se realizaron mediante
la consola de Google Chrome.

La limpieza de errores se comprobó sin enviar datos
al backend.

### Validación con lector de pantalla

**Fecha:** 14/11/2026
**Herramienta:** Narrador de Windows 10
**Navegador:** Google Chrome
**Página:** index.html
**Caso:** NFR-005-ACCESS-006-SR-001

Se generaron errores dejando vacíos los campos
obligatorios del formulario de registro y sin
marcar la casilla de consentimiento.

Al regresar a cada control, Narrador anunció
su etiqueta, el mensaje de error asociado y
el estado inválido.

| Control | Etiqueta | Error asociado | Estado inválido |
|---|---|---|---|
| Nombre | PASS | PASS | PASS |
| Apellido | PASS | PASS | PASS |
| Email | PASS | PASS | PASS |
| Teléfono | PASS | PASS | PASS |
| Consentimiento | PASS | PASS | PASS |

**Resultado: 15/15 PASS.**

Narrador también anunció que la casilla de
consentimiento estaba desactivada (sin marcar).

### Conclusión de la validación adicional

La asociación accesible de errores y el anuncio
del estado inválido funcionan correctamente en
los cinco controles evaluados.

NFR-005-ACCESS-006: PASS con Narrador en el
entorno y alcance comprobados.

Esta prueba no constituye una certificación
integral de conformidad WCAG.

### Conclusión

Incidencia corregida en el alcance comprobado.

NFR-005 continúa abierto hasta completar
la auditoría integral de accesibilidad.

---

## NFR-005-ACCESS-007 — Accesibilidad de enlaces en nuevas pestañas

**Fecha:** 13/11/2026  
**Requisito:** NFR-005 — Accesibilidad e interacción  
**Páginas:** home.html, qa.html, quality-management.html  
**Navegadores:** Google Chrome, Mozilla Firefox y Microsoft Edge
**Alcance multinavegador:** 12 enlaces de qa.html
**Alcance adicional en Chrome:** 4 enlaces de home.html y quality-management.html
**Resultado:** PASS en las verificaciones ejecutadas 

### Objetivo

Verificar que los enlaces que abren nuevas pestañas tengan
nombres accesibles, protección de seguridad y una descripción
adicional traducida a español, inglés y portugués.

### Implementación

- Se incorporó la clave `newTabNotice` en los diccionarios ES/EN/PT.
- Se creó `js/shared/new-tab-accessibility.js`.
- Se incorporó el módulo a las tres páginas correspondientes.
- Se agregó una descripción compartida mediante `aria-describedby`.
- Se conservaron los nombres, destinos y atributos `rel` existentes.
- Se implementó la actualización del aviso según el idioma del documento.

### Resultados

| Página | Enlaces | Nombre no vacío | Aviso asociado | noopener | Resultado |
|---|---:|---:|---:|---:|---|
| home.html | 2 | 2/2 | 2/2 | 2/2 | PASS |
| qa.html | 12 | 12/12 | 12/12 | 12/12 | PASS |
| quality-management.html | 2 | 2/2 | 2/2 | 2/2 | PASS |
| **Total** | **16** | **16/16** | **16/16** | **16/16** | **PASS** |

### Internacionalización

Prueba programática realizada en `qa.html`:

| Idioma | Texto esperado | Enlaces asociados | Resultado |
|---|---|---:|---|
| ES | Se abre en una nueva pestaña | 12/12 | PASS |
| EN | Opens in a new tab | 12/12 | PASS |
| PT | Abre em uma nova aba | 12/12 | PASS |

**Resultado:** 3/3 PASS.

### Seguridad

- 16/16 enlaces contienen `rel="noopener"`.
- 12/16 enlaces contienen adicionalmente `noreferrer`.
- Los cuatro enlaces sin `noreferrer` no requieren una corrección obligatoria para esta comprobación.

### Regresión multinavegador

Se verificó la accesibilidad programática de los enlaces
de evidencias de `qa.html` en tres navegadores.

| Navegador | Enlaces | Nombres | Avisos | noopener | Resultado |
|---|---:|---:|---:|---:|---|
| Chrome | 12 | 12/12 | 12/12 | 12/12 | PASS |
| Firefox | 12 | 12/12 | 12/12 | 12/12 | PASS |
| Edge | 12 | 12/12 | 12/12 | 12/12 | PASS |

**Resultado:** 3/3 navegadores PASS.

En Edge, la identificación mediante `navigator.userAgent`
devolvió `Otro`. Se confirmó Microsoft Edge 157 mediante
`navigator.userAgentData.brands`.

Las verificaciones funcionales fueron satisfactorias.
No se detectaron defectos de accesibilidad en el alcance
comprobado.


### Validación mediante selector de idioma

Se verificó el cambio de idioma mediante el selector real
de `qa.html` en Google Chrome.

| Idioma | Traducción correcta | Enlaces asociados | Resultado |
|---|---|---:|---|
| ES | Sí | 12/12 | PASS |
| EN | Sí | 12/12 | PASS |
| PT | Sí | 12/12 | PASS |

**Resultado:** 3/3 PASS.

### Limitaciones y pendientes

- No se realizó una prueba con lector de pantalla.
- La regresión multinavegador se completó para los 12 enlaces de `qa.html`.
- Los cuatro enlaces restantes de `home.html` y `quality-management.html` se verificaron únicamente en Chrome.
- Estas verificaciones no constituyen una certificación integral de conformidad WCAG.


### Estado

NFR-005-ACCESS-007: PASS en el alcance verificado.

NFR-005 permanece abierto hasta completar la auditoría
integral de accesibilidad.

---

## NFR-005-ACCESS-008 — Accesibilidad del buscador global

### Objetivo

Corregir el uso indebido de `aria-expanded` en el campo
de búsqueda global y verificar que el panel de resultados
mantenga su comportamiento funcional y accesible.

### Requisitos relacionados

- FR-011 — Búsqueda global.
- NFR-005 — Accesibilidad.

### Corrección implementada

- Eliminación de `aria-expanded` del campo de búsqueda.
- Eliminación de las actualizaciones dinámicas del atributo
  en `js/search.js`.
- Conservación de `aria-controls`.
- Utilización de la propiedad `hidden` para controlar
  la visibilidad del panel de resultados.
- Conservación de la navegación mediante teclado.

### Auditoría automática

Herramienta: axe DevTools.
Navegador: Google Chrome.

| Alcance | Resultado |
|---|---|
| index.html | 0 incidencias automáticas |
| home.html | 0 incidencias automáticas |
| cv.html | 0 incidencias automáticas |
| backend.html | 0 incidencias automáticas |
| frontend.html | 0 incidencias automáticas |
| qa.html | 0 incidencias automáticas |
| quality-management.html | 0 incidencias automáticas |

Resultado: 7/7 páginas sin incidencias automáticas
en los estados evaluados.

### Regresión funcional manual

Página: home.html.

| Verificación | Resultado |
|---|---|
| Mostrar resultados al escribir | PASS |
| Seleccionar resultados con ArrowDown | PASS |
| Cerrar resultados con Escape | PASS |
| Realizar una nueva búsqueda | PASS |

Resultado: 4/4 PASS.

### Regresión automatizada Selenium

Archivo: tests/selenium/global-search-navigation.test.js.

Casos actualizados y ejecutados:

- SEARCH-TC-003
- SEARCH-TC-012
- SEARCH-TC-021
- SEARCH-TC-022
- SEARCH-TC-023
- SEARCH-TC-027
- SEARCH-TC-028
- SEARCH-TC-030
- SEARCH-TC-031
- SEARCH-TC-032
- SEARCH-TC-033
- SEARCH-TC-034
- SEARCH-TC-035
- SEARCH-TC-036
- SEARCH-TC-037

| Métrica | Resultado |
|---|---:|
| Casos ejecutados | 15 |
| PASS | 15 |
| FAIL finales | 0 |
| Bloqueados | 0 |

Durante la actualización se detectaron fallos en
SEARCH-TC-022 y SEARCH-TC-028 debido a comprobaciones
antiguas de `aria-expanded`.

Ambos casos fueron corregidos y ejecutados nuevamente
con resultado PASS.

### Verificación estática de Selenium

Se revisaron 16 referencias a `aria-expanded`
en el archivo de pruebas.

Las 16 comprueban que el atributo está ausente (`null`).

No quedaron comprobaciones que esperen los valores
anteriores `true` o `false`.

### Limitaciones

- Las 15 pruebas actualizadas se ejecutaron en Chrome.
- No se repitió la batería completa de búsqueda.
- No se realizó una prueba con lector de pantalla.
- Los resultados de axe DevTools corresponden a los
  estados inspeccionados y no constituyen una
  certificación integral WCAG.

### Estado

NFR-005-ACCESS-008: PASS en el alcance verificado.

NFR-005 permanece abierto hasta completar la auditoría
integral de accesibilidad.

---

## NFR-005-ACCESS-009 — Navegación semántica de home.html

**Fecha:** 14/11/2026
**Requisito:** NFR-005 — Accesibilidad e interacción
**Página:** home.html
**Navegador:** Google Chrome
**Lector de pantalla:** Narrador de Windows 10
**Resultado:** PASS en el alcance verificado

### Incidencia

La página no contenía una región semántica main,
lo que dificultaba identificar el contenido principal
mediante la navegación por puntos de referencia.

### Corrección

Se incorporó un elemento main con id="main-content"
para envolver las secciones principales de home.html.

Se conservaron los identificadores, las clases,
el contenido y las traducciones ES/EN/PT existentes.

### Validación con lector de pantalla

| Comprobación | Resultado |
|---|---|
| Reconocimiento del encabezado (banner) | PASS |
| Reconocimiento de la región de búsqueda | PASS |
| Reconocimiento de la región principal | PASS |
| Reconocimiento del pie de página | PASS |
| Identificación del selector de idioma | PASS |
| Lectura continua del contenido | PASS |
| Navegación entre encabezados | PASS |

**Resultado: 7/7 PASS.**

Las dos últimas comprobaciones corresponden a
verificaciones manuales realizadas previamente
durante la misma auditoría.

### Conclusión

NFR-005-ACCESS-009: PASS en el alcance comprobado.

La página permite identificar sus regiones principales
mediante Narrador y acceder a su contenido textual.

La auditoría integral NFR-005 permanece abierta.
Estas verificaciones no constituyen una certificación
integral de conformidad WCAG.

---

## NFR-005-ACCESS-010 — Enlaces de salto al contenido principal

**Fecha:** 14/11/2026
**Requisito:** NFR-005 — Accesibilidad e interacción
**Páginas:** 7 páginas del portfolio
**Navegador:** Google Chrome
**Resultado:** PASS

### Objetivo

Permitir que los usuarios que navegan mediante
teclado omitan los controles repetitivos del
encabezado y accedan directamente al contenido
principal de cada página.

### Implementación

Se incorporó un enlace de salto al comienzo
del body de las siete páginas.

Los enlaces utilizan:

- Clase CSS compartida: skip-link.
- Internacionalización: skipToMainContent.
- Traducciones completas ES/EN/PT.
- Visibilidad al recibir el foco del teclado.
- Destinos asociados a la región main.

Se conservaron los identificadores existentes
de index.html y cv.html.

### Destinos

| Página | Destino |
|---|---|
| index.html | #accessPage |
| home.html | #main-content |
| cv.html | #cv |
| backend.html | #main-content |
| frontend.html | #main-content |
| qa.html | #main-content |
| quality-management.html | #main-content |

### Regresión funcional

| Página | Resultado |
|---|---|
| index.html | PASS |
| home.html | PASS |
| cv.html | PASS |
| backend.html | PASS |
| frontend.html | PASS |
| qa.html | PASS |
| quality-management.html | PASS |

**Resultado: 7/7 PASS.**

Se verificó manualmente:

- Visibilidad del enlace al recibir el foco.
- Activación mediante Enter.
- Salto al contenido principal.
- Continuidad de la navegación mediante Tab.

### Internacionalización

Se verificó en home.html:

| Idioma | Resultado |
|---|---|
| Español | PASS |
| Inglés | PASS |
| Portugués | PASS |

**Resultado: 3/3 PASS.**

Las demás páginas reutilizan la misma clave
de internacionalización.

### Limitaciones

La regresión funcional se realizó en Chrome.

No se ejecutó una regresión específica de estos
enlaces en Firefox ni Microsoft Edge.

Estas verificaciones no constituyen una
certificación integral de conformidad WCAG.

### Estado

NFR-005-ACCESS-010: PASS en el alcance verificado.

NFR-005 permanece abierto hasta completar la
auditoría integral de accesibilidad.

---

---

## NFR-005-ACCESS-011 — Movimiento reducido en home.html

**Requisito:** NFR-005 — Accesibilidad e interacción.

**Criterios relacionados:**
- Criterio 1: operabilidad mediante teclado.
- Criterio 2: indicador de foco visible.
- Criterio 9: respeto de prefers-reduced-motion.
- Criterio 10: disponibilidad de funcionalidades sin movimiento.

**Entorno:** Chrome, home.html.

**Configuración:** DevTools → Rendering →
prefers-reduced-motion: reduce.

### Hallazgo inicial

Se detectaron desplazamientos animados en las tarjetas
QA y Áreas profesionales a pesar de estar activada
la preferencia de movimiento reducido.

### Correcciones

Archivo: css/style.css.

- Se ajustó la especificidad de las reglas de movimiento
  reducido para las tarjetas QA.
- Se desactivaron las transiciones y desplazamientos
  interactivos de la tarjeta Áreas profesionales.
- Se conservó su posición original mediante
  translateY(-75px).
- Se mantuvieron los efectos de iluminación y foco.

### Resultados

| Verificación | Resultado |
|---|---|
| Preferencia de movimiento reducido detectada | PASS |
| Transiciones de Áreas profesionales desactivadas | PASS |
| Posición original de Áreas profesionales conservada | PASS |
| Tarjetas QA sin desplazamiento | PASS |
| Tarjetas de navegación comprobadas sin desplazamiento | PASS |
| Iluminación conservada | PASS |
| Navegación mediante Tab sin desplazamiento | PASS |
| Contorno de foco visible | PASS |

**Resultado:** PASS dentro del alcance verificado.

**Limitaciones:**
- Comprobación realizada en Chrome.
- No constituye una auditoría global de todas las
  animaciones y transiciones del portfolio.
- Pendiente verificar movimiento reducido en las
  demás páginas y navegadores.
- No se verificó el funcionamiento de todos los
  componentes dinámicos con movimiento reducido.

**Estado de NFR-005:** ABIERTO.
```

**Guardá el archivo y respondeme «listo».**

Después continuaremos con la auditoría de movimiento reducido en las demás páginas, aprovechando las pruebas existentes y sin repetir las comprobaciones aprobadas.

---

## NFR-005-ACCESS-012 — Regresión manual de navegación por teclado

**Requisito:** NFR-005 — Accesibilidad e interacción.

**Fecha:** 16/11/2026.

**Entorno:** Windows, Google Chrome.

**Tipo:** Pruebas manuales funcionales y de accesibilidad por teclado.

### Objetivo

Verificar la navegación, activación de controles y visibilidad del foco mediante teclado en las páginas del portfolio revisadas recientemente.

### Resultados

| ID | Página | Verificación | Resultado |
|---|---|---|---|
| FRONTEND-KEYBOARD-001 | frontend.html | Tab, Shift+Tab, Enter, Espacio y Escape en controles interactivos | PASS |
| QM-KEYBOARD-001 | quality-management.html | Navegación directa e inversa mediante teclado | PASS |
| QM-KEYBOARD-002 | quality-management.html | Apertura y cierre de controles interactivos | PASS |
| QM-NAV-001 | quality-management.html | Enlace directo a qa.html#reportes mediante Enter | PASS |
| INDEX-KEYBOARD-001 | index.html | Navegación mediante Tab y Shift+Tab | PASS |
| INDEX-KEYBOARD-002 | index.html | Activación de tarjetas de acceso y selector de idioma | PASS |
| INDEX-KEYBOARD-003 | index.html | Selección y deselección del consentimiento mediante Espacio | PASS |
| INDEX-KEYBOARD-004 | index.html | Navegación del formulario de contacto | PASS |
| INDEX-KEYBOARD-005 | index.html | Activación del acceso, apertura del registro y gestión del foco | PASS |

### Defecto corregido

**QM-NAV-001 — Destino incorrecto del enlace de evidencias.**

Comportamiento inicial:

El enlace «Consultar evidencia verificable» abría qa.html desde el comienzo de la página.

Corrección:

Se actualizó el destino a qa.html#reportes.

Regresión manual:

La activación mediante Enter dirige correctamente a la sección 04.

**Estado: CORREGIDO Y VERIFICADO.**

### Observaciones

- Se confirmó navegación directa e inversa mediante Tab y Shift+Tab.
- Los controles revisados respondieron a las teclas correspondientes.
- El foco permaneció visible durante los recorridos comprobados.
- El selector de idioma nativo se conservó sin modificaciones.
- Las verificaciones se realizaron manualmente en Chrome.
- No se ejecutó una nueva regresión automatizada para estos nueve registros.
- Los resultados no sustituyen las pruebas específicas con lectores de pantalla ni la auditoría de movimiento reducido.

### Conclusión

Las nueve verificaciones manuales registradas finalizaron con PASS.

**Resultado: 9/9 PASS — 0 FAIL.**

NFR-005-ACCESS-012: CERRADO dentro del alcance verificado.

**Estado global de NFR-005: ABIERTO.**

Continúa pendiente completar la auditoría de movimiento reducido y las comprobaciones de accesibilidad que todavía no cuentan con evidencia suficiente.

---

## Cierre consolidado NFR-005 — Accesibilidad e interacción

**Fecha:** 16/11/2026  
**Estado:** PASS dentro del alcance auditado  
**Tipo de evidencia:** revisión estática, comprobaciones manuales en Chrome, Narrador de Windows, inspección de contraste y pruebas responsive históricas y actuales.

### Trazabilidad de los criterios

| Criterios NFR-005 | Evidencia consolidada | Resultado |
|---|---|---|
| 1–2. Teclado y foco visible | ACCESS-003 a ACCESS-005, ACCESS-008, ACCESS-010 y ACCESS-012; pruebas manuales documentadas | PASS en alcance |
| 3–4. Etiquetas, errores y confirmaciones | ACCESS-001, ACCESS-002, ACCESS-012 y ACCESS-014; anuncios de errores en home.html y resultados dinámicos de backend.html comprobados con Narrador | PASS en alcance |
| 5. Contraste | NFR-005-CONTRAST-001; inspecciones Chrome DevTools y correcciones en home.html | PASS en elementos corregidos |
| 6–7. Semántica y controles desplegables | Auditorías ACCESS y pruebas de interacción registradas | PASS en alcance |
| 8. Elementos decorativos | ACCESS-013; revisión estática de siete páginas, con comprobación manual adicional de la imagen de perfil | PASS preliminar estático; revisión manual focalizada |
| 9–10. Movimiento reducido y conservación de funciones | Verificaciones manuales con prefers-reduced-motion; cv.html, qa.html y quality-management.html entre los componentes confirmados | PASS en alcance |
| 11. Legibilidad y operabilidad responsive | 18 verificaciones históricas reportadas; index.html y home.html a 375 y 768 px en Chrome | PASS en alcance |

### Correcciones de contraste — home.html

| Componente | Antes | Después | Resultado |
|---|---:|---:|---|
| LinkedIn | 3,15:1 | 7,1:1 | PASS |
| GitHub | 3,98:1 | 7,1:1 | PASS |
| Títulos y numeración violeta comprobados | 4,16:1 | 7,71:1 | PASS |
| EN EVOLUCIÓN y PLANIFICADO | 3,67:1 | 6,8:1 | PASS |

Se corrigieron reglas CSS existentes cuando fue posible, evitando duplicaciones. Las capturas de Chrome DevTools documentan los valores finales.

### Verificación responsive complementaria

- **index.html:** Chrome, 375 px y 768 px — PASS manual.
- **home.html:** Chrome, 375 px y 768 px — PASS manual.
- **Criterios observados:** ausencia de desbordamiento visible de texto y distribución incorrecta de información.
- Los PASS históricos de otras páginas y navegadores no se atribuyen automáticamente a diseños modificados con posterioridad.

### Limitaciones y conclusión

Las verificaciones estáticas no equivalen a una revisión manual completa con tecnologías de asistencia. Las pruebas documentadas no cubren necesariamente todos los estados dinámicos, navegadores, dispositivos ni combinaciones de idioma. No se declara certificación WCAG integral.

**Conclusión:** NFR-005 aprobado dentro del alcance auditado. No se registran defectos confirmados abiertos en los escenarios corregidos y vueltos a comprobar.

Mantener esta evidencia vinculada al requisito en la matriz de trazabilidad y conservar sin cambios los resultados históricos de otras suites.
