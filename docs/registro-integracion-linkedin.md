Registro de trabajo: integración de LinkedIn en el portafolio QA + IA
Fecha del registro: 16/10/2026
Proyecto: miguel-flor-qa-ai-portfolio
Estado: trabajo experimental, sin decisión de conservarlo ni
eliminarlo todavía.
1. Objetivo original
La intención práctica era incorporar en la sección Home una tarjeta de
LinkedIn con un diseño propio, atractivo y coherente con el portafolio,
que permitiera visitar el perfil profesional mediante un enlace seguro.
Perfil de LinkedIn indicado: -
https://www.linkedin.com/in/miguelgabrielflor/
Datos de la tarjeta conversados: - Marca/concepto: Calidad
Estratégica. - Titular profesional: QA Automation Jr. | Calidad de
Software & UX | Consultor de IA & Marketing Digital | +10 años
transformando Procesos y Experiencia del Cliente. - Se compartió una
URL de foto de perfil durante la conversación original; no se reproduce
aquí porque no se recuperó de forma fiable en el resumen disponible.
También se exploró la posibilidad de mostrar automáticamente el perfil y
las cuatro publicaciones más recientes. La sincronización automática se
consideró solo si LinkedIn concedía los permisos necesarios.
2. Diferencia entre el objetivo y el trabajo realizado
El trabajo de OAuth/API comenzó a explorar una autenticación con
LinkedIn para obtener datos autorizados de la cuenta. Esto es más
complejo que crear una tarjeta estática con un enlace al perfil y no
es necesario para conseguir la funcionalidad básica original.
La tarjeta manual puede mostrar información que el usuario elija y
enlazar directamente al perfil público. La lectura automática de
publicaciones es un objetivo distinto y depende de permisos de API que
no deben darse por concedidos.
3. Trabajo realizado o configurado
Aplicación de LinkedIn
- Se configuró una aplicación de LinkedIn para Sign In with LinkedIn
  using OpenID Connect.
- Se registró la URI de redirección:
  http://localhost:3000/api/linkedin/callback
- Se configuraron en el archivo local .env variables para Client ID,
  Client Secret y Redirect URI.
- Los valores secretos no deben copiarse a documentación, chats, Git
  ni al frontend.
Variables de entorno
Se añadieron a .env variables con estos nombres: -
LINKEDIN_CLIENT_ID - LINKEDIN_CLIENT_SECRET -
LINKEDIN_REDIRECT_URI
También se modificó .env.example para documentar los nombres de las
variables usando valores de ejemplo. .gitignore incluye reglas para
excluir .env y permite mantener .env.example.
Código creado
Archivo nuevo: - backend/src/routes/linkedin.routes.js
Este archivo contiene una primera versión experimental con: -
GET /auth: genera un state aleatorio y redirige a la autorización de
LinkedIn. - GET /callback: recibe code y state, intercambia el
código por un token y consulta https://api.linkedin.com/v2/userinfo. -
Una respuesta JSON con nombre, nombre de pila, apellido y foto cuando
LinkedIn devuelve esos datos. - Una colección en memoria para estados
pendientes, con vencimiento de diez minutos.
Código modificado
Archivo: - backend/src/app.js
Se añadió el import:
const linkedinRoutes = require('./routes/linkedin.routes');
Y el montaje del router: app.use('/api/linkedin', linkedinRoutes);
Verificaciones conocidas
- node --check .\backend\src\routes\linkedin.routes.js no mostró
  errores de sintaxis.
- node --check .\backend\src\app.js no mostró errores de sintaxis.
- En la última ejecución de la suite del backend reportada en la
  conversación, 6 tests pasaron y 9 fallaron. Los fallos
  ocurrieron al crear la aplicación Express, con el error
  TypeError: argument handler must be a function en la línea del
  app.use de LinkedIn. La causa exacta aún debe confirmarse.
- Se pidió ejecutar
  Get-Content .\backend\src\routes\linkedin.routes.js -Tail 5, pero
  el usuario informó que no hubo salida. No se ha confirmado por qué.
4. Límites y precauciones técnicas
- La implementación actual es experimental y no debe considerarse
  lista para producción.
- La validación del parámetro state es un comienzo, pero no
  reemplaza la validación completa de OpenID Connect.
- El código no valida completamente el id_token (firma, emisor,
  audiencia, expiración y nonce). No se debe realizar una
  integración pública basada en esta versión sin corregir esos
  aspectos.
- Los estados se guardan en memoria del proceso; no es una solución
  persistente o distribuida.
- La respuesta del callback es JSON. Todavía no hay una integración
  que pinte automáticamente los datos en la tarjeta del Home.
- La obtención del nombre/foto mediante openid profile no garantiza
  acceso al titular profesional ni a publicaciones.
- La lectura de publicaciones personales requiere permisos adicionales
  de LinkedIn; no se debe asumir que la aplicación los tiene. La
  opción de mostrar las cuatro publicaciones no quedó implementada ni
  verificada.
- No se debe borrar ni sobrescribir trabajo del formulario de
  contacto, correo SMTP, registro de visitantes, SQLite, validadores,
  tests o documentación general del proyecto al retirar la integración
  de LinkedIn.
5. Inventario para una eventual retirada
Si se decide abandonar OAuth y volver a la tarjeta manual, revisar
cuidadosamente estos elementos:
1. Eliminar backend/src/routes/linkedin.routes.js (archivo creado
   específicamente para OAuth).
2. Editar backend/src/app.js: retirar solo el
   require('./routes/linkedin.routes') y
   app.use('/api/linkedin', linkedinRoutes). Conservar el resto de
   rutas y servicios.
3. Editar .env: retirar solo las tres variables LINKEDIN_*. No
   compartir ni registrar los valores actuales.
4. Editar .env.example: retirar solo las tres líneas de ejemplo
   LINKEDIN_* si ya no se usará OAuth.
5. Revisar la configuración de la aplicación en LinkedIn. Si se decide
   definitivamente no usarla, se podrá dejar sin uso o eliminar desde
   el portal de desarrolladores; hacerlo es una decisión separada de
   borrar el código local.
6. Buscar referencias residuales en el proyecto con una búsqueda de
   LINKEDIN_, /api/linkedin, linkedin.routes y
   api.linkedin.com.
7. Ejecutar npm.cmd test --prefix backend después de los cambios y
   revisar git status antes de preparar cualquier commit.
No borrar automáticamente .env completo, backend/src/app.js
completo, carpetas backend/src/routes completas,
backend/src/services, ni los archivos del formulario de contacto.
Pueden contener trabajo ajeno a LinkedIn.
6. Próximo enfoque recomendado
Primero confirmar el estado del archivo y corregir o aislar el fallo de
los tests sin tocar funcionalidades existentes. Después decidir
explícitamente si se conserva el experimento OAuth.
Para el objetivo original, la ruta más directa es volver a la tarjeta
manual de LinkedIn en Home: - mostrar la identidad profesional y el
diseño acordado; - incluir un enlace directo a
https://www.linkedin.com/in/miguelgabrielflor/; - abrir el perfil en
una pestaña nueva con target="_blank" y rel="noopener noreferrer"; -
añadir manualmente hasta cuatro publicaciones seleccionadas mediante
enlaces directos a cada publicación, si se desea una vista tipo
carrusel.
Esta alternativa no requiere Client ID, Client Secret, callback OAuth ni
permisos de lectura de publicaciones. La sincronización automática puede
evaluarse más adelante como un proyecto separado, si LinkedIn concede
los permisos correspondientes.
7. Estado de decisión
No se ha eliminado nada en este registro. La integración queda
documentada para que pueda revisarse y, si se decide, retirarse de forma
selectiva sin afectar las funciones previas del portafolio.