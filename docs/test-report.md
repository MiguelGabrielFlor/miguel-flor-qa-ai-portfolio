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
