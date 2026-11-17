# Fase 4 — Consolidación de CSS

Este paquete contiene **solo un instalador**, para trabajar sobre los CSS reales de tu proyecto y no reemplazarlos por copias antiguas.

## Requisitos

- La corrección del footer de Fase 3 debe estar aplicada y validada.
- `css/style.css` debe contener `.cv-bottom-bar` y `.cv-bottom-bar .cv-back-button`.
- `css/cv-extraido.css` ya no debe contener los estilos compartidos del footer.
- `cv.html` y `qa.html` deben cargar sus hojas extraídas **antes** de sus hojas específicas.

## Instalación

Abrir PowerShell en la raíz del portfolio y ejecutar:

```powershell
python "C:\RUTA\consolidacion_css_fase4\instalar_fase4.py"
```

El instalador primero valida las condiciones. Si alguna no se cumple, **se detiene sin modificar archivos**.

Si se cumplen, guarda un respaldo completo en `css_backup_fase4_FECHA_HORA`, antepone el contenido de cada hoja extraída al CSS específico correspondiente, retira las referencias temporales de los dos HTML y elimina los dos CSS extraídos. El CSS compartido y Home no se modifican.

## Validación

Comprobar `cv.html` (trayectoria, formación, galería, visor, footer) y `qa.html` (bibliotecas, tarjetas, navegación, footer) en escritorio y móvil. Revisar en DevTools que solo carguen `style.css` + `cv.css` o `style.css` + `qa.css` respectivamente. Si todo funciona, mover el respaldo fuera del repositorio antes del commit.

## Reversión

Copiar de la carpeta `css_backup_fase4_FECHA_HORA` los archivos `cv.html`, `qa.html`, `css/cv.css`, `css/qa.css`, `css/cv-extraido.css` y `css/qa-extraido.css` a sus rutas originales, sobrescribiendo los modificados.
