# Diagnóstico inicial de arquitectura CSS — QA & AI Portfolio

Fuente: `miguel-flor-qa-ai-portfolio(4).zip`, recibido el 17/11/2026. Este documento registra hallazgos estáticos, no resultados de pruebas de navegador.

## Referencias reales de CSS

| HTML | Hojas cargadas, en orden |
|---|---|
| index.html | css/index.css |
| home.html | css/style.css |
| cv.html | css/cv.css |
| backend.html | css/style.css → css/backend/backend.css |
| frontend.html | css/style.css → css/frontend/frontend.css |
| qa.html | css/style.css → css/qa.css |
| quality-management.html | css/style.css → css/quality-management/quality-management.css |

## Tamaños de los archivos del ZIP (bytes, sin comprimir)

| CSS | Bytes |
|---|---:|
| style.css | 48.752 |
| index.css | 4.147 |
| cv.css | 8.131 |
| backend/backend.css | 24.968 |
| frontend/frontend.css | 23.129 |
| qa.css | 35.632 |
| quality-management/quality-management.css | 101.699 |

## Hallazgos verificables

1. `style.css` contiene estilos globales (`:root`, `body`), de navegación (`.navbar`, `.portfolio-search`), y específicos de páginas (`.access-page`, `.cv-bottom-bar`). La distribución no está totalmente modularizada.
2. `index.css` y `cv.css` no contienen las reglas base `:root` ni `body` que aparecen en `style.css`. Además, sus HTML no cargan `style.css`. Por lo tanto, no es seguro borrar o mover reglas entre archivos sin revisar las dependencias de la cascada y las referencias HTML.
3. Las otras cinco páginas ya usan `style.css` como base; cuatro añaden una hoja específica y `home.html` depende únicamente de la hoja global.
4. La cadena literal inválida `*background*` no aparece en los tres CSS revisados del ZIP (`style.css`, `index.css`, `cv.css`): el ZIP ya difiere del fragmento de CSS mostrado anteriormente.
5. Hay JavaScript específico de navegación, búsqueda, certificados, laboratorios, QA e internacionalización. Los selectores dinámicos y los estados de interfaz deben mantenerse aunque Coverage no los marque como utilizados en una sola carga.

## Plan conservador

1. Inventariar los selectores de los siete CSS y sus usos en los siete HTML y en los JS propios (sin contar `node_modules`).
2. Separar los estilos globales verdaderos de los estilos exclusivos de cada página; conservar grupos compartidos que dependan de una misma cascada.
3. Revisar expresamente el caso `index.html` y `cv.html` antes de cambiar el orden de hojas CSS; registrar los cambios HTML necesarios.
4. Preservar `@media`, `:focus-visible`, `prefers-reduced-motion`, estados ocultos, clases añadidas por JS y reglas de componentes dinámicos.
5. Entregar un ZIP final con los siete CSS, los HTML modificados si fueran necesarios y un registro de reglas trasladadas. Comparar el aspecto y las interacciones en Chrome, Firefox y Edge antes de declarar la migración validada.

## Estado

**Diagnóstico preliminar realizado. Migración CSS y pruebas de regresión todavía pendientes.** No aplicar automáticamente el ZIP de depuración anterior: fue preparado sin la información de carga de hojas CSS de este proyecto completo.
