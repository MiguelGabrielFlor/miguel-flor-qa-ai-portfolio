# Auditoría y modularización de CSS — QA & AI Portfolio

## Alcance

Se revisó el `css/style.css` incluido en el ZIP del proyecto y se contrastaron sus selectores con las siete páginas HTML y los módulos JavaScript vinculados. Las siete páginas utilizaban `style.css`, **no solamente** `index.html` y `cv.html`. Frontend, Backend, QA y Gestión de Calidad además cargan hojas específicas. `home.html` sigue dependiendo de `style.css`.

## Entrega

- `css/style.css`: hoja compartida para `home.html`, `backend.html`, `frontend.html`, `qa.html` y `quality-management.html`.
- `css/index.css`: hoja independiente para `index.html`.
- `css/cv.css`: hoja independiente para `cv.html`.
- `index.html` y `cv.html`: solamente se cambia la ruta de la hoja de estilos.

No se requiere editar los otros cinco HTML.

## Estrategia conservadora

Se conservaron **el orden original, la especificidad, las declaraciones y las reglas responsive/reduced-motion**. Se excluyeron de cada hoja las reglas cuyos selectores de clase/ID no aparecen en la página ni en sus scripts vinculados. En la hoja compartida se retuvieron las reglas que podrían afectar a cualquiera de las otras cinco páginas. Las reglas sin clase ni ID se conservan como globales.

No se combinaron selectores repetidos ni se eliminaron propiedades sobrescritas a ciegas: hacerlo puede alterar la cascada, los estados interactivos o las variantes móviles. Se eliminaron de las hojas nuevas reglas de navegaciones antiguas que no encontraron referencias en el HTML/JS analizado. La detección estática no garantiza descubrir todas las clases construidas dinámicamente, por lo que se requiere regresión visual.

## Hallazgos

- El CSS original contiene 395 reglas de estilo (incluidas reglas en `@media`), 325 textos de selector distintos y 70 repeticiones exactas de textos de selector. Muchas repeticiones pertenecen a media queries o modificaciones deliberadas posteriores.
- Hay 36 bloques `@media` y un bloque `@keyframes` en el nivel principal.
- La mayor oportunidad de ahorro inmediato es no descargar estilos de otras páginas en la pantalla de acceso.
- No se ha minificado: los archivos siguen siendo legibles y auditables.
- No se ha modificado la lógica JavaScript ni las traducciones.

## Tamaños aproximados (sin compresión)

| Archivo | Tamaño |
|---|---:|
| `css/style.css` original | 72 KiB |
| `css/style.css` compartido | 48 KiB |
| `css/index.css` | 23 KiB |
| `css/cv.css` | 35 KiB |

Los tamaños no predicen una puntuación Lighthouse específica. La medición debe hacerse en el entorno real.

## Aplicación

1. Crear copia de seguridad o commit de los originales.
2. Copiar `css/style.css`, `css/index.css`, `css/cv.css` y los dos HTML desde este ZIP a las mismas rutas del proyecto.
3. No borrar `css/backend/backend.css`, `css/frontend/frontend.css`, `css/qa.css` ni `css/quality-management/quality-management.css`.
4. Comprobar `index.html` (tarjetas, formulario oculto, apertura del registro, ES/EN/PT, móvil) y `cv.html` (tarjetas, certificados, diálogo/visor, teclado, móvil y reduce-motion).
5. Verificar que el menú, buscador y pie de `home.html` y las otras páginas sigan funcionando.
6. Repetir Lighthouse móvil en incógnito y registrar Performance, FCP, LCP, CLS y TBT.

## Límites

Este paquete es una separación conservadora, **no una eliminación exhaustiva y demostrada de todo el CSS muerto**. La ausencia de coincidencias estáticas no descarta clases agregadas por código externo o futuras ampliaciones. La consolidación semántica de reglas duplicadas se recomienda como segunda etapa, con capturas de regresión por componente.

---

## Auditoría de rendimiento e internacionalización — 17/11/2026

**Proyecto:** Miguel Flor — QA & AI Portfolio
**Entorno:** Local — Live Server (`127.0.0.1:5500`)
**Navegador:** Google Chrome, modo incógnito
**Herramientas:** Lighthouse, DevTools y comprobaciones funcionales manuales
**Alcance:** `index.html`, `home.html` y migración de certificados de `cv.html`

### 1. Optimización de `index.html`

**Situación inicial:**
- Performance: 96/100 en modo incógnito.
- Accessibility: 100/100.
- Best Practices: 100/100.
- SEO: 100/100.
- FCP y LCP: 2,2 segundos.
- TBT: 10 ms.
- CLS: 0.

**Cambios aplicados:**
- Incorporación de `defer` a `js/i18n/es.js`, `js/translations.js` y `js/app.js`.
- Conservación del orden de ejecución y del mecanismo de carga dinámica de idiomas.
- Sin modificaciones en las validaciones ni en la estructura del acceso.

**Resultado posterior:**
- Performance: **99/100**.
- Accessibility: **100/100**.
- Best Practices: **100/100**.
- SEO: **100/100**.

**Estado:** Optimización aplicada. Resultado Lighthouse registrado.

### 2. Optimización de `home.html`

**Situación inicial:**
- Performance: 76/100.
- Accessibility: 100/100.
- Best Practices: 100/100.
- SEO: 100/100.
- FCP: 4,1 segundos.
- LCP: 4,2 segundos.
- TBT: 0 ms.
- CLS: 0,028.
- Speed Index: 4,1 segundos.

**Problema identificado:**

La página cargaba simultáneamente los diccionarios completos de español, inglés y portugués, con una transferencia conjunta aproximada de 519 KB.

**Cambios aplicados:**
- Eliminación de la carga inicial obligatoria de `en.js` y `pt.js`.
- Conservación de `es.js` como idioma de respaldo.
- Incorporación de `defer` a los scripts externos.
- Utilización de `loadPortfolioLanguage()` para cargar el idioma necesario.
- Corrección de `home.js` para esperar la descarga del diccionario antes de aplicar las traducciones.
- Conservación de la preferencia de idioma mediante `localStorage` y sincronización con `sessionStorage`.

**Resultados observados:**

| Métrica | Inicial | Primera medición optimizada |
|---|---:|---:|
| Performance | 76 | 93 |
| FCP | 4,1 s | 1,1 s |
| LCP | 4,2 s | 2,8 s |
| TBT | 0 ms | 190 ms |
| CLS | 0,028 | 0,028 |
| Speed Index | 4,1 s | 1,2 s |

**Mediciones Lighthouse posteriores:** 75, 95, 93 y 96 puntos.

**Última medición:**
- Performance: **96/100**.
- Accessibility: **100/100**.
- Best Practices: **100/100**.
- SEO: **100/100**.

La variabilidad entre ejecuciones queda registrada. No se establece una puntuación definitiva hasta realizar mediciones comparables y calcular su mediana.

### 3. Regresión de internacionalización

**Incidencia detectada:**

Después de eliminar la carga simultánea de los diccionarios, `home.html` no aplicaba correctamente el idioma seleccionado en `index.html`.

**Causa:**

`home.js` intentaba aplicar las traducciones antes de finalizar la descarga del diccionario solicitado.

**Corrección:**
- Inicialización asíncrona.
- Espera de `loadPortfolioLanguage()` antes de aplicar las traducciones.
- Manejo de errores y conservación del idioma anterior ante fallos de carga.
- Actualización de la preferencia y de la sesión después de aplicar el idioma.

**Verificación manual reportada:**
- Español: PASS.
- Inglés: PASS.
- Portugués: PASS.
- Persistencia del idioma entre `index.html` y `home.html`: PASS.

**Estado:** Regresión resuelta según comprobación manual. No se registra ejecución automatizada para esta corrección.

### 4. Migración de certificados — `cv.html`

**Cambios realizados:**
- Sustitución de vistas previas PDF por imágenes JPG/JPEG.
- Conservación de las cinco categorías de certificados.
- Visualización de miniaturas y ampliación de imágenes.
- Apertura de certificados en otra pestaña.
- Retiro de archivos PDF del proyecto, conservando respaldo.
- Eliminación de referencias a PDF.js en `certificates.js` y `cv.html`.

**Verificación manual reportada:**
- Miniaturas y ampliación: PASS.
- Solicitudes relacionadas con PDF en Network: ninguna detectada.

**Estado:** Migración funcional comprobada manualmente. Auditoría Lighthouse específica de `cv.html` pendiente.

### 5. Hallazgos pendientes

- Evaluar el LCP restante de `home.html`.
- Revisar las oportunidades de minificación de JavaScript y CSS sin eliminar reglas dinámicas necesarias.
- Evaluar la compresión HTTP en producción mediante Nginx.
- Continuar con Lighthouse en `cv.html`, `backend.html`, `frontend.html`, `qa.html` y `quality-management.html`.
- Completar la regresión funcional y multinavegador correspondiente a
