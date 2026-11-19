# Cierre de etapa 1 — QA & AI Portfolio

**Proyecto:** Miguel Flor — QA & AI Portfolio  
**Fecha de corte:** 19/11/2026  
**Estado:** cierre administrativo y documental de la etapa QA; quedan verificaciones técnicas pendientes.  
**Motivo:** priorizar la búsqueda laboral y trasladar las conclusiones ampliadas a una segunda etapa junto con el desarrollo de consultoría de IA.

## 1. Resumen ejecutivo

El proyecto combina un portfolio profesional con una aplicación web utilizada como laboratorio de aseguramiento de calidad. Se implementaron interfaces navegables, registro y acceso de visitantes, formularios y validaciones, servicios API, persistencia SQLite, internacionalización ES/EN/PT y documentación de pruebas, defectos y trazabilidad. Se practicaron pruebas manuales, de API y automatizadas con Selenium.

El hito más reciente fue recuperar **26 de los 26 archivos de pruebas Selenium que habían fallado inicialmente en Chrome**, mediante correcciones y ejecuciones individuales posteriores. Esta cifra describe el **bloque de recuperación**, no certifica una ejecución integral simultánea de toda la suite ni una regresión completa en otros navegadores.

## 2. Alcance y arquitectura conocida

- **Frontend:** HTML, CSS y JavaScript; páginas de acceso (`index.html`), inicio (`home.html`), trayectoria (`cv.html`), laboratorio de frontend (`frontend.html`), backend (`backend.html`), evidencia (`qa.html`) y gestión de calidad (`quality-management.html`).
- **Internacionalización:** español, inglés y portugués; traducciones por claves, selector de idioma y persistencia de preferencias.
- **Backend:** Node.js y Express; endpoints `GET /api/health`, `POST /api/visitors` y `POST /api/contact`; validaciones y gestión de errores.
- **Datos:** SQLite para visitantes; consentimiento asociado al registro.
- **Pruebas:** `node:test`, Selenium WebDriver, pruebas funcionales, negativas, de navegación, API, internacionalización y regresión.
- **Infraestructura:** repositorio Git/GitHub y VPS con Ubuntu/Nginx en preparación/despliegue. La configuración productiva completa no se certifica en este cierre.

## 3. Evidencias registradas hasta la fecha

| Actividad | Resultado informado | Límite de la evidencia |
|---|---|---|
| Sprint inicial de interfaz | TC-001 a TC-018: 18/18 PASS | Reporte histórico, no ejecución nueva de hoy |
| Pruebas backend | 15/15 PASS | Resultado histórico informado |
| Pruebas integradas de API/contacto | 9/9 PASS | Resultado histórico informado |
| Recuperación de archivos Selenium inicialmente fallidos en Chrome | 26/26 archivos recuperados | Ejecuciones individuales; no equivalen a toda la suite en una sola corrida |
| `portfolio-navigation.test.js` | 4 tests, 4 PASS, 0 FAIL | Ejecución Chrome informada el 19/11/2026 |
| `qm-closure-i18n.test.js` | 2 tests, 2 PASS, 0 FAIL | Ejecución Chrome informada el 19/11/2026 |
| `qa-bugs-i18n.test.js` | 1 test PASS | Ejecución Chrome informada el 19/11/2026 |
| `qa-evidence-i18n.test.js` | 1 test PASS | Ejecución Chrome informada el 19/11/2026 |
| `qa-selenium-library-i18n.test.js` | 1 test PASS | Ejecución Chrome informada el 19/11/2026 |
| Regresión integral Edge y Firefox | NO EJECUTADA en esta etapa | Script preparado, sin resultados reportados |

Los resultados anteriores deben mantenerse asociados a sus registros originales y no sumarse como si fueran casos únicos sin revisar duplicidades.

## 4. Incidencias y decisiones recientes

- Se corrigieron pruebas que dependían de rutas, controles de acceso y estados de sesión que habían cambiado con la evolución del portfolio.
- En `portfolio-navigation.test.js`, el caso TC-019 necesitó contemplar la redirección automática al inicio cuando ya existía sesión activa. La última ejecución reportó 4/4 PASS.
- En `qm-closure-i18n.test.js`, se actualizó la expectativa del enlace de evidencia desde `qa.html` hacia `qa.html#evidencia`, que era el destino real. La última ejecución reportó 2/2 PASS.
- Se preservó la distinción entre **fallos del script de prueba** y **defectos funcionales de la aplicación**.
- No se declara resuelta una incidencia sin evidencia de ejecución satisfactoria.

## 5. Estado del producto y riesgos abiertos

Este cierre es **documental y de fase**, no una declaración de producción plenamente auditada. Permanecen abiertos o requieren verificación consolidada:

1. Regresión integral completa en Chrome, Edge y Firefox con resultados archivados por archivo/caso.
2. Auditoría final de seguridad y privacidad, especialmente tratamiento de datos personales y consentimiento.
3. Auditoría de internacionalización dinámica y consistencia de traducciones ES/EN/PT.
4. Revisión final de trazabilidad RF/RNF–HU–BDD–TC–defectos y consistencia de reportes.
5. Consolidación y verificación del estado de BUG-002 a BUG-005.
6. Accesibilidad, comportamiento responsive, `prefers-reduced-motion`, rendimiento y mantenimiento.
7. Verificación final de configuración y operación productiva.
8. Experiencia del reclutador, explorador de proyectos QA y materiales de presentación profesional.

## 6. Decisión de cierre y segunda etapa

**Decisión del responsable del proyecto:** suspender nuevas ejecuciones y mejoras de la etapa 1 a partir del 19/11/2026, preservar los resultados alcanzados y dedicar el esfuerzo inmediato a las postulaciones laborales.

**Etapa 2:** retomar los pendientes de QA, completar la regresión multinavegador y la evaluación integral, y desarrollar el área de consultoría de IA. Las conclusiones generales y el cierre técnico definitivo se emitirán entonces con nueva evidencia.

## 7. Presentación profesional verificable

> Desarrollé un portfolio web que también funciona como laboratorio práctico de QA. Implementé y probé flujos de navegación, formularios, validaciones, APIs y persistencia de datos, con soporte en español, inglés y portugués. Documenté casos de prueba, defectos y evidencias, y trabajé con Selenium WebDriver, Node.js, Express, SQLite y Git. En la etapa más reciente recuperé los 26 archivos de pruebas Selenium que habían presentado fallos en Chrome. La regresión integral multinavegador y las auditorías finales quedaron planificadas para una segunda etapa.

## 8. Control de versiones

**Archivo de cierre propuesto:** `docs/CIERRE_ETAPA_QA_2026-11-19.md`  
**Mensaje de commit propuesto:** `docs: cierre documental etapa QA al 2026-11-19`

Antes de confirmar el commit, revisar `git status`, `git diff --cached` y evitar agregar `.env`, bases SQLite con datos reales, credenciales, logs sensibles o archivos temporales. El commit debe identificar el estado real del código y la documentación; no implica una nueva ejecución de pruebas.
