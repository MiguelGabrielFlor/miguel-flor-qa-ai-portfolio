// PUNTO 03 — LABORATORIO DE PERSISTENCIA
            
            function mostrarEvidenciaSQLite(contenedor, respuesta, http) {
                const visitante = respuesta?.visitor;

                if (
                    http !== 201 ||
                    !Number.isInteger(visitante?.id)
                ) {
                    return;
                }

                const panel = document.createElement("div");
                panel.className = "sqlite-evidence-panel";

                const titulo = document.createElement("h4");
                titulo.textContent = backendText(
                    "backendDynamic063",
                    "Verificación real en SQLite"
                );

                const descripcion = document.createElement("p");
                descripcion.textContent = backendText(
                    "backendDynamic064",
                    "El registro fue recuperado mediante una consulta SELECT a la base de datos."
                );

                const detalles = document.createElement("div");
                detalles.className = "sqlite-evidence-details";

                const fila = document.createElement("div");

                const etiqueta = document.createElement("span");
                etiqueta.textContent = backendText(
                    "backendDynamic066",
                    "Identificador del registro"
                );

                const valor = document.createElement("strong");
                valor.textContent = String(visitante.id);

                fila.append(etiqueta, valor);
                detalles.appendChild(fila);

                const estado = document.createElement("p");
                estado.className = "sqlite-evidence-status";
                estado.textContent = backendText(
                    "backendDynamic071",
                    "✓ Registro encontrado en SQLite"
                );

                panel.append(titulo, descripcion, detalles, estado);
                contenedor.appendChild(panel);
            }

            function mostrarRechazoSQLite(contenedor, respuesta, http) {
                if (
                    http !== 400 ||
                    !Array.isArray(respuesta?.errors) ||
                    respuesta.errors.length === 0
                ) {
                    return;
                }

                const panel = document.createElement("div");
                panel.className = "sqlite-evidence-panel";

                const titulo = document.createElement("h4");
                titulo.textContent = backendText(
                    "backendDynamic072",
                    "Protección de datos en SQLite"
                );

                const descripcion = document.createElement("p");
                descripcion.textContent = backendText(
                    "backendDynamic073",
                    "La API rechazó la solicitud durante la validación, antes de ejecutar una operación INSERT."
                );

                const detalles = document.createElement("div");
                detalles.className = "sqlite-evidence-details";

                const campos = [
                    [
                        backendText("backendDynamic074", "Resultado HTTP"),
                        "400 — Bad Request"
                    ],
                    [
                        backendText("backendDynamic075", "Validación"),
                        backendText(
                            "backendDynamic076",
                            "Consentimiento obligatorio"
                        )
                    ],
                    [
                        backendText("backendDynamic077", "Operación INSERT"),
                        backendText("backendDynamic078", "No ejecutada")
                    ]
                ];

                campos.forEach(([etiqueta, valor]) => {
                    const fila = document.createElement("div");

                    const nombre = document.createElement("span");
                    nombre.textContent = etiqueta;

                    const dato = document.createElement("strong");
                    dato.textContent = valor;

                    fila.append(nombre, dato);
                    detalles.appendChild(fila);
                });

                const estado = document.createElement("p");
                estado.className = "sqlite-evidence-status";
                estado.textContent = backendText(
                    "backendDynamic080",
                    "✓ Solicitud rechazada antes de insertar datos"
                );

                panel.append(titulo, descripcion, detalles, estado);
                contenedor.appendChild(panel);
            }


            const botonPersistenciaValido = document.getElementById(
                'persistencia-valido-ejecutar'
            );
            const resultadoPersistenciaValido = document.getElementById(
                'persistencia-valido-resultado'
            );

            const botonPersistenciaSinConsentimiento = document.getElementById(
                'persistencia-sin-consentimiento-ejecutar'
            );
            const resultadoPersistenciaSinConsentimiento = document.getElementById(
                'persistencia-sin-consentimiento-resultado'
            );

            async function solicitarPersistencia(datos) {
                const resultado = await window.BackendAPI.post(
                    '/api/visitors',
                    datos
                );

                return {
                    http: resultado.status,
                    cuerpo: resultado.data
                };
            }
            // Conservar los resultados de ambas pruebas de persistencia.
            const ultimasPersistencias = new Map();

            async function ejecutarPersistencia(
                boton,
                contenedor,
                datos,
                validarResultado
            ) {
                boton.disabled = true;
                contenedor.replaceChildren();

                const progreso = document.createElement('p');
                progreso.classList.add('backend-progreso');
                progreso.textContent = backendText("backendDynamic081", "Ejecutando prueba de persistencia...");
                contenedor.appendChild(progreso);

                try {
                    const resultado = await solicitarPersistencia(datos);
                    const aprobado = validarResultado(resultado);

                    // Guardar la respuesta original para reconstruir la interfaz
                    // sin repetir el POST ni generar nuevos registros en SQLite.
                    ultimasPersistencias.set(contenedor.id, {
                        datos,
                        resultado,
                        aprobado
                    });

                    window.BackendResultRenderer.render(
                        contenedor,
                        aprobado,
                        `HTTP ${resultado.http}`,
                        resultado.cuerpo
                    );
                    window.BackendResultRenderer.showRequest(
                        contenedor,
                        '/api/visitors',
                        datos,
                        backendText("backendDynamic053", "Ver solicitud enviada")
                    );
                    // Mostrar la evidencia del registro válido.
                    mostrarEvidenciaSQLite(
                        contenedor,
                        resultado.cuerpo,
                        resultado.http
                    );

                    // Mostrar la evidencia del rechazo.
                    mostrarRechazoSQLite(
                        contenedor,
                        resultado.cuerpo,
                        resultado.http
                    );

                } catch (error) {
                    window.BackendResultRenderer.render(
                        contenedor,
                        false,
                        backendText("backendDynamic082", "Sin respuesta"),
                        {
                            error: backendText("backendDynamic059", "No se pudo conectar con la API."),
                            detalle: error.message,
                            indicacion:
                                backendText("backendDynamic060", "Verificá que el backend esté iniciado en localhost:3000.")
                        }
                    );

                } finally {
                    boton.disabled = false;
                }
            }
            // Actualizar los resultados de persistencia al cambiar de idioma,
            // sin repetir solicitudes POST ni insertar nuevos registros.
            function actualizarIdiomaPersistencias() {

                ultimasPersistencias.forEach((datosGuardados, idContenedor) => {

                    const contenedor = document.getElementById(idContenedor);

                    if (!contenedor) return;

                    const { datos, resultado, aprobado } = datosGuardados;

                    // Reconstruir el resultado HTTP y JSON original.
                    window.BackendResultRenderer.render(
                        contenedor,
                        aprobado,
                        `HTTP ${resultado.http}`,
                        resultado.cuerpo
                    );

                    // Reconstruir la solicitud enviada.
                    window.BackendResultRenderer.showRequest(
                        contenedor,
                        '/api/visitors',
                        datos,
                        backendText("backendDynamic053", "Ver solicitud enviada")
                    );
                    
                    // Mostrar la evidencia del registro válido.
                    mostrarEvidenciaSQLite(
                        contenedor,
                        resultado.cuerpo,
                        resultado.http
                    );

                    // Mostrar la evidencia del rechazo.
                    mostrarRechazoSQLite(
                        contenedor,
                        resultado.cuerpo,
                        resultado.http
                    );

                });
            }

            // Escuchar los cambios de idioma de la página.
            document.addEventListener(
                "portfolio:languagechange",
                actualizarIdiomaPersistencias
            );

            // 03.1 — Registro válido
            if (botonPersistenciaValido && resultadoPersistenciaValido) {
                botonPersistenciaValido.addEventListener('click', () => {
                    ejecutarPersistencia(
                        botonPersistenciaValido,
                        resultadoPersistenciaValido,
                        {
                            nombre: 'QA Persistencia',
                            apellido: 'Demo',
                            email: 'qa.persistencia@example.com',
                            telefono: '1123456789',
                            consentimiento: true
                        },
                        resultado => {
                            const id = resultado.cuerpo?.visitor?.id;

                            return resultado.http === 201 &&
                                Number.isInteger(id);
                        }
                    );
                });
            }

            // 03.2 — Registro sin consentimiento
            if (
                botonPersistenciaSinConsentimiento &&
                resultadoPersistenciaSinConsentimiento
            ) {
                botonPersistenciaSinConsentimiento.addEventListener('click', () => {
                    ejecutarPersistencia(
                        botonPersistenciaSinConsentimiento,
                        resultadoPersistenciaSinConsentimiento,
                        {
                            nombre: 'QA Persistencia',
                            apellido: 'Demo',
                            email: 'qa.persistencia@example.com',
                            telefono: '1123456789',
                            consentimiento: false
                        },
                        resultado => {
                            return resultado.http === 400 &&
                                Array.isArray(resultado.cuerpo?.errors) &&
                                resultado.cuerpo.errors.length > 0;
                        }
                    );
                });
            }