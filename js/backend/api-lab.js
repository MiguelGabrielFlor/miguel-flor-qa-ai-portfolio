const apiResultado = document.getElementById('api-resultado');
            const tarjetasPrueba = document.querySelectorAll('[data-api-prueba]');

            let ultimaPruebaAPI = null;

            const casosVisitante = {
                nombre: {
                    nombre: '   ',
                    apellido: 'Tester',
                    email: 'qa.demo@example.com',
                    telefono: '1123456789',
                    consentimiento: true
                }
            };

            const casosContacto = {
                'mensaje-vacio': {
                    nombre: 'QA Demo',
                    apellido: 'Tester',
                    email: 'qa.demo@example.com',
                    telefono: '1123456789',
                    mensaje: ''
                }
            };

            async function ejecutarSolicitud(url, opciones = {}) {
                const baseUrl = window.BackendAPI.baseUrl;

                const path = url.startsWith(baseUrl)
                    ? url.slice(baseUrl.length)
                    : url;

                const resultado = await window.BackendAPI.request(
                    path,
                    opciones
                );

                return {
                    respuesta: resultado.response,
                    datos: resultado.data
                };
            }

            async function probarHealth() {
                const resultado = await ejecutarSolicitud('/api/health');

                return {
                    ...resultado,
                    aprobado: resultado.respuesta.ok &&
                        resultado.datos.status === 'ok'
                };
            }

            async function probarVisitantes() {
                const resultado = await ejecutarSolicitud(
                    '/api/visitors',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(casosVisitante.nombre)
                    }
                );

                return {
                    ...resultado,
                    aprobado: resultado.respuesta.status === 400 &&
                        Array.isArray(resultado.datos.errors) &&
                        resultado.datos.errors.length > 0
                };
            }

            async function probarContacto() {
                const resultado = await ejecutarSolicitud(
                    '/api/contact',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(casosContacto['mensaje-vacio'])
                    }
                );

                return {
                    ...resultado,
                    aprobado: resultado.respuesta.status === 400 &&
                        Array.isArray(resultado.datos.errors) &&
                        resultado.datos.errors.length > 0
                };
            }

            async function probarIntegracion() {
                const health = await probarHealth();
                const visitante = await probarVisitantes();

                return {
                    aprobado: health.aprobado && visitante.aprobado,
                    respuesta: visitante.respuesta,
                    datos: {
                        disponibilidad: {
                            aprobado: health.aprobado,
                            http: health.respuesta.status,
                            respuesta: health.datos
                        },
                        rechazoVisitanteInvalido: {
                            aprobado: visitante.aprobado,
                            http: visitante.respuesta.status,
                            respuesta: visitante.datos
                        }
                    }
                };
            }
            function obtenerInterpretacionQA(tipo, resultado) {
                const interpretaciones = {
                    health: {
                        titulo: backendText("backendDynamic034", "Disponibilidad de la API"),
                        aprobado: backendText("backendDynamic035", "El servicio respondió correctamente y confirmó su disponibilidad."),
                        fallido: backendText("backendDynamic036", "La respuesta no cumplió las condiciones esperadas para comprobar la disponibilidad."),
                        esperado: backendText("backendDynamic037", "HTTP 200 y status igual a ok.")
                    },

                    visitors: {
                        titulo: backendText("backendDynamic038", "Validación del registro"),
                        aprobado: backendText("backendDynamic039", "La API rechazó correctamente un visitante con el nombre vacío."),
                        fallido: backendText("backendDynamic040", "La API no devolvió el rechazo esperado para el registro inválido."),
                        esperado: backendText("backendDynamic041", "HTTP 400 y una lista de errores de validación.")
                    },

                    contact: {
                        titulo: backendText("backendDynamic042", "Validación del contacto"),
                        aprobado: backendText("backendDynamic043", "La API rechazó correctamente un mensaje vacío."),
                        fallido: backendText("backendDynamic044", "La API no devolvió el rechazo esperado para el mensaje vacío."),
                        esperado: backendText("backendDynamic041", "HTTP 400 y una lista de errores de validación.")
                    },

                    integration: {
                        titulo: backendText("backendDynamic045", "Integración de servicios"),
                        aprobado: backendText("backendDynamic046", "Se verificó la disponibilidad de la API y el rechazo de un visitante inválido."),
                        fallido: backendText("backendDynamic047", "Al menos una de las verificaciones de integración no cumplió el resultado esperado."),
                        esperado: backendText("backendDynamic048", "Disponibilidad correcta y rechazo HTTP 400 del registro inválido.")
                    }
                };

                const escenario = interpretaciones[tipo];

                if (!escenario) return null;

                return {
                    titulo: escenario.titulo,
                    descripcion: resultado.aprobado
                        ? escenario.aprobado
                        : escenario.fallido,
                    esperado: escenario.esperado
                };
            }

            function mostrarInterpretacionQA(contenedor, interpretacion) {
                if (!interpretacion) return;

                const bloque = document.createElement("div");
                bloque.className = "api-interpretacion-qa";

                const titulo = document.createElement("h4");
                titulo.textContent = backendText("backendDynamic049", "¿Qué demuestra esta prueba?");

                const escenario = document.createElement("strong");
                escenario.textContent = interpretacion.titulo;

                const descripcion = document.createElement("p");
                descripcion.textContent = interpretacion.descripcion;

                const esperado = document.createElement("p");

                const etiqueta = document.createElement("strong");
                etiqueta.textContent = backendText("backendDynamic050", "Resultado esperado: ");

                esperado.append(
                    etiqueta,
                    document.createTextNode(interpretacion.esperado)
                );

                bloque.append(titulo, escenario, descripcion, esperado);
                contenedor.appendChild(bloque);
            }

            function mostrarSolicitudEnviada(contenedor, tipo) {
                const solicitudes = {
                    health: {
                        metodo: "GET",
                        ruta: "/api/health",
                        datos: null
                    },

                    visitors: {
                        metodo: "POST",
                        ruta: "/api/visitors",
                        datos: casosVisitante.nombre
                    },

                    contact: {
                        metodo: "POST",
                        ruta: "/api/contact",
                        datos: casosContacto["mensaje-vacio"]
                    },

                    integration: {
                        metodo: "GET + POST",
                        ruta: "/api/health + /api/visitors",
                        datos: casosVisitante.nombre
                    }
                };

                const solicitud = solicitudes[tipo];
                if (!solicitud) return;
                if (tipo === "integration") {
                    const desplegable = document.createElement("details");
                    desplegable.className = "api-solicitud-desplegable";

                    const encabezado = document.createElement("summary");
                    encabezado.textContent = backendText("backendDynamic051", "Ver solicitudes enviadas");

                    const contenido = document.createElement("div");
                    contenido.className = "api-solicitud-contenido";

                    const tituloHealth = document.createElement("p");
                    tituloHealth.textContent = "1. GET /api/health";

                    const descripcionHealth = document.createElement("p");
                    descripcionHealth.textContent =
                        backendText("backendDynamic052", "Consulta de disponibilidad sin cuerpo JSON.");

                    const tituloVisitantes = document.createElement("p");
                    tituloVisitantes.textContent = "2. POST /api/visitors";

                    const codigo = document.createElement("pre");
                    const json = document.createElement("code");

                    json.textContent = JSON.stringify(
                        casosVisitante.nombre,
                        null,
                        2
                    );

                    codigo.appendChild(json);

                    contenido.append(
                        tituloHealth,
                        descripcionHealth,
                        tituloVisitantes,
                        codigo
                    );

                    desplegable.append(encabezado, contenido);
                    contenedor.appendChild(desplegable);

                    return;
                }

                const desplegable = document.createElement("details");
                desplegable.className = "api-solicitud-desplegable";

                const encabezado = document.createElement("summary");
                encabezado.textContent = backendText("backendDynamic053", "Ver solicitud enviada");

                const contenido = document.createElement("div");
                contenido.className = "api-solicitud-contenido";

                const metodo = document.createElement("p");
                metodo.textContent =
                    `${solicitud.metodo} ${solicitud.ruta}`;

                contenido.appendChild(metodo);

                if (solicitud.datos !== null) {
                    const codigo = document.createElement("pre");
                    const json = document.createElement("code");

                    json.textContent = JSON.stringify(
                        solicitud.datos,
                        null,
                        2
                    );

                    codigo.appendChild(json);
                    contenido.appendChild(codigo);
                } else {
                    const mensaje = document.createElement("p");
                    mensaje.textContent =
                        backendText("backendDynamic054", "Esta solicitud GET no envía un cuerpo JSON.");

                    contenido.appendChild(mensaje);
                }

                desplegable.append(encabezado, contenido);
                contenedor.appendChild(desplegable);
            }

            async function ejecutarPrueba(tipo, boton) {
                tarjetasPrueba.forEach((tarjeta) => {
                    tarjeta.disabled = true;
                });

                apiResultado.replaceChildren();

                const progreso = document.createElement('p');
                progreso.style.color = '#DCDCAA';
                progreso.textContent = backendText("backendDynamic055", "Ejecutando prueba...");
                apiResultado.appendChild(progreso);

                try {
                    let resultado;

                    switch (tipo) {
                        case 'health':
                            resultado = await probarHealth();
                            break;

                        case 'visitors':
                            resultado = await probarVisitantes();
                            break;

                        case 'contact':
                            resultado = await probarContacto();
                            break;

                        case 'integration':
                            resultado = await probarIntegracion();
                            break;

                        default:
                            throw new Error(backendText("backendDynamic056", "Tipo de prueba desconocido."));
                    }

                    ultimaPruebaAPI = {
                        tipo,
                        resultado
                    };

                    const estado = resultado.respuesta
                        ? `HTTP ${resultado.respuesta.status} — ${resultado.respuesta.statusText}`
                        : backendText("backendDynamic057", "Resultado de integración");

                    window.BackendResultRenderer.render(
                        apiResultado,
                        resultado.aprobado,
                        estado,
                        resultado.datos
                    );
                    mostrarSolicitudEnviada(
                        apiResultado,
                        tipo
                    );
                    const interpretacion = obtenerInterpretacionQA(tipo, resultado);

                    mostrarInterpretacionQA(
                        apiResultado,
                        interpretacion
                    );

                } catch (error) {
                    window.BackendResultRenderer.render(
                        apiResultado,
                        false,
                        backendText("backendDynamic058", "No se pudo completar la solicitud"),
                        {
                            error: backendText("backendDynamic059", "No se pudo conectar con la API."),
                            indicacion: backendText("backendDynamic060", "Verificá que el backend esté iniciado en localhost:3000."),
                            detalle: error.message
                        }
                    );
                
                } finally {
                    tarjetasPrueba.forEach((tarjeta) => {
                        tarjeta.disabled = false;
                    });

                    // NFR-005 — Recuperar el foco después
                    // de finalizar la ejecución de la API.
                    if (boton && boton.isConnected) {
                        boton.focus();
                    }
                }

                }

                function actualizarIdiomaResultadoAPI() {
                    if (!ultimaPruebaAPI) return;

                    const { tipo, resultado } = ultimaPruebaAPI;

                    const estado = resultado.respuesta
                        ? `HTTP ${resultado.respuesta.status} — ${resultado.respuesta.statusText}`
                        : backendText("backendDynamic057", "Resultado de integración");

                    window.BackendResultRenderer.render(
                        apiResultado,
                        resultado.aprobado,
                        estado,
                        resultado.datos
                    );

                    mostrarSolicitudEnviada(apiResultado, tipo);

                    const interpretacion = obtenerInterpretacionQA(tipo, resultado);

                    mostrarInterpretacionQA(
                        apiResultado,
                        interpretacion
                    );

                }

            document.addEventListener(
                "portfolio:languagechange",
                actualizarIdiomaResultadoAPI
            );
            tarjetasPrueba.forEach((boton) => {
                boton.addEventListener('click', (event) => {
                    event.preventDefault();
                    ejecutarPrueba(boton.dataset.apiPrueba, boton);
                });
            });