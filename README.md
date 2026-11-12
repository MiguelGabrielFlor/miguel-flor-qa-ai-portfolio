# Miguel Flor — QA & AI Portfolio

Portfolio profesional y laboratorio técnico desarrollado para demostrar competencias en **Quality Assurance, automatización de pruebas, desarrollo web, APIs e Inteligencia Artificial**.

El proyecto integra una aplicación funcional con documentación de calidad, pruebas automatizadas y evidencias verificables.

## Objetivo

Este proyecto funciona simultáneamente como:

- Portfolio profesional.
- Aplicación web bajo prueba.
- Laboratorio de QA manual y automatizado.
- Entorno de pruebas de APIs y persistencia de datos.
- Espacio de desarrollo y experimentación con Inteligencia Artificial.

## Tecnologías

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Node.js
- Express
- SQLite
- API REST

**Quality Assurance**
- Selenium WebDriver
- Node.js Test Runner
- Postman
- Pruebas funcionales y de regresión
- Pruebas de internacionalización
- Pruebas de compatibilidad multinavegador

**Control de versiones**
- Git
- GitHub


## Estructura del portfolio

| Página | Funcionalidad |
|---|---|
| `index.html` | Formulario de acceso y entrada directa como invitado |
| `home.html` | Página principal y navegación del portfolio |
| `cv.html` | Trayectoria, formación y certificados |
| `frontend.html` | Interfaz bajo prueba y laboratorios interactivos |
| `backend.html` | APIs, validaciones y persistencia |
| `qa.html` | Casos de prueba, automatización y evidencias |
| `quality-management.html` | Requisitos, historias de usuario, BDD y gestión de calidad |


## Quality Assurance

El portfolio se utiliza como aplicación bajo prueba y dispone de documentación técnica para:

- Requisitos funcionales y no funcionales.
- Historias de usuario y criterios de aceptación.
- Escenarios BDD.
- Casos de prueba.
- Reportes de defectos.
- Pruebas funcionales y de interfaz.
- Pruebas de API y persistencia.
- Automatización con Selenium.
- Regresión y compatibilidad multinavegador.
- Matriz de trazabilidad y gestión de calidad.

La documentación se encuentra en el directorio `docs/`.

## Automatización

Se implementaron pruebas automatizadas utilizando **Selenium WebDriver y Node.js Test Runner**.

La cobertura incluye validaciones de formularios, navegación, componentes interactivos, internacionalización y pruebas de regresión.

Los navegadores utilizados para las verificaciones multinavegador son:

- Google Chrome
- Mozilla Firefox
- Microsoft Edge

Los resultados de ejecución se documentan en `docs/test-report.md`.

## Internacionalización

**Estado: Internacionalización ES/EN/PT implementada en el portfolio, con pruebas automatizadas y verificaciones manuales documentadas.**

La cobertura de internacionalización se valida por módulo y tipo de interacción. Los resultados indicados a continuación corresponden a las ejecuciones registradas y no implican una certificación integral de todos los contenidos dinámicos.

La aplicación dispone de soporte para:

- Español (ES).
- Inglés (EN).
- Portugués (PT).

La internacionalización contempla contenidos estáticos y dinámicos, formularios, mensajes de validación, componentes interactivos y persistencia de preferencias de idioma.

### Resultados automatizados destacados

| Módulo | Resultado |
|---|---|
| Acceso al portfolio | 15/15 PASS |
| Laboratorio Frontend | 15/15 PASS |
| Quality Management | 66/66 PASS |
| CV | 12/12 PASS |
| QA | 15/15 PASS |

Los resultados corresponden a las suites de internacionalización documentadas, ejecutadas en Chrome, Firefox y Edge.

Las pruebas estáticas y otras verificaciones complementarias se documentan por separado.

## Backend y APIs

El proyecto incorpora un backend desarrollado con Node.js, Express y SQLite.

Entre sus funcionalidades se encuentran:

- Verificación de disponibilidad de la API.
- Registro de visitantes.
- Validación de datos.
- Consentimiento obligatorio.
- Persistencia de registros.
- Procesamiento de mensajes de contacto.

Las pruebas de API se documentan mediante Node.js Test Runner y Postman.

### Seguridad del backend

El backend incorpora medidas de protección para su funcionamiento en producción:

- Limitación de solicitudes a los endpoints públicos de registro y contacto: 30 solicitudes cada 15 minutos por IP.
- Cabeceras HTTP de seguridad mediante Helmet.
- Restricción de orígenes CORS en producción.
- Límite de 10 KB para solicitudes JSON.
- Desactivación de la cabecera `X-Powered-By`.
- Acceso al backend mediante proxy inverso Nginx, sin exposición pública directa del puerto 3000.
- Restricción de acceso HTTP a archivos internos, bases de datos y archivos de configuración.

Las protecciones fueron verificadas mediante pruebas automatizadas y comprobaciones HTTP en producción.

Estas medidas reducen la superficie de exposición, pero no sustituyen una auditoría integral de seguridad.


## Inteligencia Artificial

El portfolio incluye un área profesional dedicada a Inteligencia Artificial, con formación y especialización en herramientas, automatización, agentes y aplicaciones de IA.

La incorporación de nuevos proyectos prácticos de IA continúa en desarrollo.


## Estado del proyecto

**En desarrollo — Funcionalidades principales implementadas y publicadas en producción.**

### Completado

- Estructura principal del portfolio con siete páginas HTML.
- Frontend y backend funcionales.
- Publicación en producción con dominio propio y HTTPS.
- Acceso directo como invitado y acceso mediante registro.
- Navegación principal verificada en producción.
- Formulario de contacto con envío y recepción verificados.
- Documentación y laboratorios de QA.
- Automatización de pruebas con Selenium y Node.js Test Runner.
- Internacionalización ES/EN/PT con pruebas documentadas por módulo.
- Verificaciones de compatibilidad en Chrome, Firefox y Edge.
- Verificaciones responsive de Quality Management en producción.
- Protección de endpoints mediante limitación de solicitudes y cabeceras HTTP de seguridad.
- Registro de resultados y evidencias de pruebas.

### Pendiente

- Revisión responsive de las secciones que aún no cuentan con validación completa.
- Auditoría final de requisitos y trazabilidad.
- Regresión funcional integral multinavegador.
- Ampliación de proyectos y aplicaciones de Inteligencia Artificial.


## Evidencias

Los casos de prueba, defectos, resultados de ejecución y documentación técnica pueden consultarse en el directorio `docs/` y en la sección de QA del portfolio.

## Autor

**Miguel Flor**

QA Tester Automation | AI Consultant