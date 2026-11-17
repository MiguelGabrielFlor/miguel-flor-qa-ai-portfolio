# Fase 3 — Modularización CSS conservadora

Se parte exactamente del `css/style.css` auditado y validado inicialmente.

## Instalación
1. Descomprimir este paquete en una carpeta temporal (NO reemplazar archivos manualmente).
2. Abrir PowerShell en la raíz del repositorio.
3. Ejecutar `python "RUTA_AL_PAQUETE\instalar_fase3.py"` (sustituir ruta).
4. El instalador crea un respaldo local de `css/style.css`, `home.html`, `cv.html`, `qa.html`, copia los 4 CSS y agrega links solo donde corresponde. Si el SHA-256 de style.css difiere, no realiza cambios.

## Distribución
- `css/style.css`: 207 reglas o grupos compartidos/no atribuibles con certeza. Se conserva también lo específico de acceso, frontend, backend y quality-management cuando no es seguro extraerlo.
- `css/home.css`: 67 reglas exclusivas de Home.
- `css/cv-extraido.css`: 33 reglas CV provenientes de style.css. **No reemplaza** tu `css/cv.css` consolidado y validado.
- `css/qa-extraido.css`: 12 reglas QA provenientes de style.css. **No reemplaza** `css/qa.css`.

## Advertencia de cascada
El orden de reglas entre archivos puede variar respecto del original. Esta entrega requiere nueva validación visual, especialmente de Home, CV y QA. Las demás páginas conservan sus hojas específicas. No se declaran PASS sin ejecución real.

## Pendiente
Tras validar, integrar `cv-extraido.css` dentro de `cv.css` y `qa-extraido.css` dentro de `qa.css` usando las versiones actuales de esos archivos, sin duplicar reglas. `index.html` no cargaba style.css en el ZIP de referencia; no se altera ese comportamiento.
