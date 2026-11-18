// PUNTO 02 — LABORATORIO DE VALIDACIONES            

            const casosValidacionVisitante = {
                nombre: {
                    nombre: ' ',
                    apellido: 'Tester',
                    email: 'qa.validacion@example.com',
                    telefono: '1123456789',
                    consentimiento: true
                },
                apellido: {
                    nombre: 'QA',
                    apellido: ' ',
                    email: 'qa.validacion@example.com',
                    telefono: '1123456789',
                    consentimiento: true
                },
                'email-visitante': {
                    nombre: 'QA',
                    apellido: 'Tester',
                    email: 'correo-invalido',
                    telefono: '1123456789',
                    consentimiento: true
                },
                'telefono-visitante': {
                    nombre: 'QA',
                    apellido: 'Tester',
                    email: 'qa.validacion@example.com',
                    telefono: 'abc',
                    consentimiento: true
                },
                consentimiento: {
                    nombre: 'QA',
                    apellido: 'Tester',
                    email: 'qa.validacion@example.com',
                    telefono: '1123456789',
                    consentimiento: false
                }
            };

            const casosValidacionContacto = {
                'mensaje-vacio': {
                    nombre: 'QA',
                    apellido: 'Tester',
                    email: 'qa.validacion@example.com',
                    telefono: '1123456789',
                    mensaje: ''
                },
                'mensaje-largo': {
                    nombre: 'QA',
                    apellido: 'Tester',
                    email: 'qa.validacion@example.com',
                    telefono: '1123456789',
                    mensaje: 'A'.repeat(5001)
                },
                'email-contacto': {
                    nombre: 'QA',
                    apellido: 'Tester',
                    email: 'correo-invalido',
                    telefono: '1123456789',
                    mensaje: 'Prueba de validación del contacto.'
                },
                'telefono-contacto': {
                    nombre: 'QA',
                    apellido: 'Tester',
                    email: 'qa.validacion@example.com',
                    telefono: 'abc',
                    mensaje: 'Prueba de validación del contacto.'
                }
            };

            async function solicitarValidacion(url, datos) {
                const resultado = await window.BackendAPI.post(url, datos);

                const cuerpo = resultado.data;

                return {
                    http: resultado.status,
                    ok: resultado.status === 400 &&
                        Array.isArray(cuerpo.errors) &&
                        cuerpo.errors.length > 0,
                    cuerpo
                };
            }
            // Conserva los resultados de ambos laboratorios de validación.
            const ultimasValidaciones = new Map();

            async function ejecutarValidacion(
                boton,
                contenedor,
                obtenerDatos,
                endpoint
            ) {
                boton.disabled = true;
                contenedor.replaceChildren();

                const progreso = document.createElement('p');
                progreso.classList.add('backend-progreso');
                progreso.textContent = backendText("backendDynamic061", "Ejecutando validación...");
                contenedor.appendChild(progreso);

                try {
                    const datosEnviados = obtenerDatos();

                    const resultado = await solicitarValidacion(
                        endpoint,
                        datosEnviados
                    );

                    // Guardar el resultado para actualizar su idioma
                    // sin realizar otra solicitud a la API.
                    ultimasValidaciones.set(contenedor.id, {
                        endpoint,
                        datosEnviados,
                        resultado
                    });

                    window.BackendResultRenderer.render(
                        contenedor,
                        resultado.ok,
                        `HTTP ${resultado.http}`,
                        resultado.cuerpo
                    );
                    window.BackendResultRenderer.showRequest(
                        contenedor,
                        endpoint,
                        datosEnviados,
                        backendText("backendDynamic053", "Ver solicitud enviada")
                    );

                } catch (error) {
                    window.BackendResultRenderer.render(
                        contenedor,
                        false,
                        backendText("backendDynamic062", "HTTP sin respuesta"),
                        {
                            error: backendText("backendDynamic059", "No se pudo conectar con la API."),
                            detalle: error.message,
                            indicacion:
                                backendText("backendDynamic060", "Verificá que el backend esté iniciado en localhost:3000.")
                        }
                    );
                
                } finally {
                    boton.disabled = false;

                    // NFR-005 — Recuperar el foco del botón
                    // después de ejecutar la validación.
                    if (boton.isConnected) {
                        boton.focus();
                    }
                }

            }
            // Actualizar los resultados de validación al cambiar de idioma,
            // sin volver a enviar solicitudes HTTP.
            function actualizarIdiomaValidaciones() {

                ultimasValidaciones.forEach((datosGuardados, idContenedor) => {

                    const contenedor = document.getElementById(idContenedor);

                    if (!contenedor) return;

                    const { endpoint, datosEnviados, resultado } = datosGuardados;

                    window.BackendResultRenderer.render(
                        contenedor,
                        resultado.ok,
                        `HTTP ${resultado.http}`,
                        resultado.cuerpo
                    );

                    window.BackendResultRenderer.showRequest(
                        contenedor,
                        endpoint,
                        datosEnviados,
                        backendText("backendDynamic053", "Ver solicitud enviada")
                    );
                });
            }

            // Escuchar los cambios de idioma de la página.
            document.addEventListener(
                "portfolio:languagechange",
                actualizarIdiomaValidaciones
            );


            // 02.1 — Registro de visitantes

            const selectorVisitante = document.getElementById('qa-caso');
            const botonVisitante = document.getElementById('qa-ejecutar');
            const resultadoVisitante = document.getElementById('qa-resultado');

            if (selectorVisitante && botonVisitante && resultadoVisitante) {
                botonVisitante.addEventListener('click', () => {
                    const caso = selectorVisitante.value;

                    ejecutarValidacion(
                        botonVisitante,
                        resultadoVisitante,
                        () => casosValidacionVisitante[caso],
                        '/api/visitors'
                    );
                });
            }

            // 02.2 — Formulario de contacto

            const selectorContacto = document.getElementById('contacto-qa-caso');
            const botonContacto = document.getElementById('contacto-qa-ejecutar');
            const resultadoContacto = document.getElementById('contacto-qa-resultado');

            if (selectorContacto && botonContacto && resultadoContacto) {
                botonContacto.addEventListener('click', () => {
                    const caso = selectorContacto.value;

                    ejecutarValidacion(
                        botonContacto,
                        resultadoContacto,
                        () => casosValidacionContacto[caso],
                        '/api/contact'
                    );
                });
            }