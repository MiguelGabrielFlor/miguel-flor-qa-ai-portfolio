document.addEventListener("DOMContentLoaded", () => {
            // Mantener el comportamiento actual de los reportes de bugs.
            const reportes = document.querySelectorAll(
                "#regresion-bugs .qa-panel details"
            );

            reportes.forEach((reporte) => {
                reporte.addEventListener("toggle", () => {
                    if (!reporte.open) return;

                    reportes.forEach((otroReporte) => {
                        if (otroReporte !== reporte) {
                            otroReporte.open = false;
                        }
                    });
                });
            });

            // Biblioteca interactiva de casos de prueba.
            const biblioteca = document.querySelector("#test-library");

            if (!biblioteca) return;

            const lomos = biblioteca.querySelectorAll(".test-spine");
            const detalle = biblioteca.querySelector("#test-case-detail");
            let casoSeleccionado = null;

            const casos = [
                {
                    id: "TC-001",
                    title: "Formulario de registro vacío",
                    requirement: "FR-002",
                    priority: "High",
                    type: "Negative Testing",
                    preconditions: "El usuario se encuentra en la pantalla de registro.",
                    steps: [
                        "Abrir la aplicación.",
                        "Dejar todos los campos vacíos.",
                        'Presionar "Ingresar al portfolio".'
                    ],
                    expected: "El sistema debe mostrar mensajes de validación para todos los campos obligatorios."
                },
                {
                    id: "TC-002",
                    title: "Registro exitoso",
                    requirement: "FR-001, FR-005",
                    priority: "High",
                    type: "Positive Testing",
                    preconditions: "El usuario se encuentra en la pantalla de registro.",
                    data: "Nombre: Miguel | Apellido: Flor | Correo electrónico: válido | Teléfono: válido | Consentimiento: aceptado",
                    steps: [
                        "Ingresar el nombre Miguel.",
                        "Ingresar el apellido Flor.",
                        "Ingresar un correo electrónico válido.",
                        "Ingresar un teléfono válido.",
                        "Aceptar el consentimiento.",
                        'Presionar "Ingresar al portfolio".'
                    ],
                    expected: "El sistema debe validar los datos y permitir el acceso al portfolio."
                },
                {
                    id: "TC-003",
                    title: "Nombre obligatorio",
                    requirement: "FR-002",
                    priority: "High",
                    type: "Negative Testing",
                    preconditions: "El usuario se encuentra en la pantalla de registro.",
                    steps: [
                        "Dejar vacío el campo Nombre.",
                        "Completar los demás campos con datos válidos.",
                        "Aceptar el consentimiento.",
                        'Presionar "Ingresar al portfolio".'
                    ],
                    expected: 'El sistema debe mostrar el mensaje "El nombre es obligatorio."'
                },
                {
                    id: "TC-004",
                    title: "Correo electrónico inválido",
                    requirement: "FR-003",
                    priority: "High",
                    type: "Negative Testing",
                    data: "Email: miguel@",
                    preconditions: "El usuario se encuentra en la pantalla de registro.",
                    steps: [
                        "Ingresar un nombre y apellido válidos.",
                        "Ingresar el correo electrónico inválido: miguel@.",
                        "Completar el teléfono con un valor válido.",
                        "Aceptar el consentimiento.",
                        'Presionar "Ingresar al portfolio".'
                    ],
                    expected: 'El sistema debe mostrar el mensaje "Ingresá un email válido."'
                },
                {
                    id: "TC-005",
                    title: "Consentimiento obligatorio",
                    requirement: "FR-004",
                    priority: "High",
                    type: "Negative Testing",
                    preconditions: "El usuario se encuentra en la pantalla de registro.",
                    steps: [
                        "Completar todos los campos con datos válidos.",
                        "Dejar sin marcar la casilla de consentimiento.",
                        'Presionar "Ingresar al portfolio".'
                    ],
                    expected: 'El sistema debe impedir el acceso y mostrar el mensaje "Debés aceptar el registro de tus datos."'
                },
                {
                    id: "TC-006",
                    title: "Navegación a Sobre mí",
                    requirement: "RF-07",
                    priority: "Medium",
                    type: "Functional Testing",
                    preconditions: "El usuario ya ingresó al portfolio.",
                    steps: [
                        'Seleccionar la opción "Sobre mí" en la navegación.',
                        "Observar la sección a la que se desplaza la página."
                    ],
                    expected: 'La página debe desplazarse hasta la sección "Sobre mí".'
                },
                {
                    id: "TC-007",
                    title: "Navegación a Especialidades",
                    requirement: "RF-07",
                    priority: "High",
                    type: "Functional Testing",
                    preconditions: "El usuario ya ingresó al portfolio.",
                    steps: [
                        'Seleccionar la opción "Especialidades" en la navegación.',
                        "Observar la sección a la que se desplaza la página."
                    ],
                    expected: 'La página debe desplazarse hasta la sección "Especialidades".'
                },
                {
                    id: "TC-008",
                    title: "Adaptación a dispositivos móviles",
                    requirement: "FR-007",
                    priority: "High",
                    type: "Responsive Testing",
                    preconditions: "La aplicación está disponible en un navegador con herramientas de desarrollo.",
                    steps: [
                        "Abrir las herramientas de desarrollo de Chrome.",
                        "Activar la barra de herramientas para dispositivos.",
                        "Seleccionar un dispositivo móvil.",
                        "Abrir la aplicación y recorrer sus secciones."
                    ],
                    expected: "La interfaz debe adaptarse al tamaño de la pantalla, sin desbordamientos que impidan utilizar el contenido y los controles."
                },
                {
                    id: "TC-009",
                    title: "Legibilidad de la interfaz",
                    requirement: "NFR-001",
                    priority: "Medium",
                    type: "UI Testing",
                    preconditions: "La aplicación está abierta en el navegador.",
                    steps: [
                        "Revisar los títulos y subtítulos.",
                        "Revisar los botones y formularios.",
                        "Revisar los elementos de navegación.",
                        "Comprobar que el texto pueda leerse y entenderse."
                    ],
                    expected: "Los textos, controles y elementos de navegación deben ser visibles, legibles y comprensibles."
                },
                {
                    id: "TC-010",
                    title: "Rendimiento y tiempos de respuesta",
                    requirement: "NFR-002",
                    priority: "Medium",
                    type: "Performance Testing",
                    preconditions: "La aplicación y el backend están disponibles en un entorno de prueba definido.",
                    steps: [
                        "Definir el entorno, la herramienta y las condiciones de medición.",
                        "Medir el tiempo de carga inicial de la aplicación.",
                        "Medir el tiempo de respuesta de las interacciones principales.",
                        "Medir los tiempos de respuesta de los endpoints de la API.",
                        "Registrar los resultados obtenidos.",
                        "Comparar las mediciones con los umbrales de aceptación que se definan."
                    ],

                    expected: "Las mediciones de carga inicial, interacción y respuesta de la API deben registrarse en condiciones reproducibles y compararse con criterios de aceptación cuantificables, previamente definidos y documentados. El caso permanecerá pendiente hasta establecer dichos criterios y ejecutar las mediciones."

                },
                {
                    id: "TC-011",
                    title: "Compatibilidad de navegador",
                    requirement: "NFR-003",
                    priority: "Medium",
                    type: "Compatibility Testing",
                    browsers: ["Chrome", "Firefox", "Edge"],
                    preconditions: "La aplicación está disponible para probar en Chrome, Firefox y Edge.",
                    steps: [
                        "Abrir la aplicación en Google Chrome, Mozilla Firefox y Microsoft Edge.",
                        "Verificar la navegación y las funcionalidades principales en cada navegador.",
                        "Comprobar la presentación visual de las páginas, formularios y componentes interactivos.",
                        "Verificar que no existan desbordamientos, superposiciones ni diferencias visuales que impidan utilizar la aplicación.",
                        "Registrar los resultados y las diferencias encontradas en cada navegador."
                    ],
                    expected: "Las funcionalidades principales deben operar correctamente en Chrome, Firefox y Edge. La interfaz debe conservar su legibilidad, estructura y comportamiento interactivo, sin defectos de compatibilidad que impidan su utilización."
                },
                {
                    id: "TC-012",
                    title: "Teléfono compuesto únicamente por letras",
                    requirement: "FR-008",
                    priority: "High",
                    type: "Negative Testing",
                    data: "Teléfono: abc",
                    preconditions: "El usuario se encuentra en la pantalla de registro.",
                    steps: [
                        "Completar el nombre, apellido y correo electrónico con datos válidos.",
                        "Ingresar letras en el campo Teléfono: abc.",
                        "Aceptar el consentimiento.",
                        'Presionar "Ingresar al portfolio".'
                    ],
                    expected: "El sistema debe rechazar el teléfono y mostrar un mensaje de validación.",
                    bug: "BUG-001"
                },
                {
                    id: "TC-013",
                    title: "Teléfono vacío",
                    requirement: "FR-008",
                    priority: "High",
                    type: "Negative Testing",
                    data: "Teléfono: (vacío)",
                    preconditions: "El usuario se encuentra en la pantalla de registro.",
                    steps: [
                        "Completar el nombre, apellido y correo electrónico con datos válidos.",
                        "Dejar vacío el campo Teléfono.",
                        "Aceptar el consentimiento.",
                        'Presionar "Ingresar al portfolio".'
                    ],
                    expected: "El sistema debe rechazar el registro e indicar que el teléfono es obligatorio."
                },
                {
                    id: "TC-014",
                    title: "Teléfono con Letras y Números Mezclados",
                    requirement: "FR-008",
                    priority: "High",
                    type: "Negative Testing",
                    data: "Teléfono: jdhfadg246",
                    preconditions: "El usuario se encuentra en la pantalla de registro.",
                    steps: [
                        "Completar los demás campos con datos válidos.",
                        "Ingresar jdhfadg246 en el campo Teléfono.",
                        "Aceptar el consentimiento.",
                        'Presionar "Ingresar al portfolio".'
                    ],
                    expected: "El sistema debe rechazar el teléfono que contiene letras y mostrar un mensaje de validación."
                },
                {
                    id: "TC-015",
                    title: "Teléfono por debajo de la longitud mínima",
                    requirement: "FR-008",
                    priority: "High",
                    type: "Negative Testing",
                    data: "Teléfono: 123456",
                    preconditions: "El usuario se encuentra en la pantalla de registro.",
                    steps: [
                        "Completar los demás campos con datos válidos.",
                        "Ingresar 123456 en el campo Teléfono.",
                        "Aceptar el consentimiento.",
                        'Presionar "Ingresar al portfolio".'
                    ],
                    expected: "El sistema debe rechazar el teléfono porque contiene menos de 7 dígitos."
                },
                {
                    id: "TC-016",
                    title: "Teléfono en la longitud mínima",
                    requirement: "FR-008",
                    priority: "Medium",
                    type: "Positive Testing",
                    data: "Teléfono: 1234567",
                    preconditions: "El usuario se encuentra en la pantalla de registro.",
                    steps: [
                        "Completar los demás campos con datos válidos.",
                        "Ingresar 1234567 en el campo Teléfono.",
                        "Aceptar el consentimiento.",
                        'Presionar "Ingresar al portfolio".'
                    ],
                    expected: "El sistema debe aceptar el teléfono de 7 dígitos y permitir continuar si los demás datos son válidos."
                },
                {
                    id: "TC-017",
                    title: "Teléfono con prefijo y separadores",
                    requirement: "FR-008",
                    priority: "Medium",
                    type: "Positive Testing",
                    data: "Teléfono: +54 9 2996299558",
                    preconditions: "El usuario se encuentra en la pantalla de registro.",
                    steps: [
                        "Completar los demás campos con datos válidos.",
                        "Ingresar +54 9 2996299558 en el campo Teléfono.",
                        "Aceptar el consentimiento.",
                        'Presionar "Ingresar al portfolio".'
                    ],
                    expected: "El sistema debe aceptar el prefijo internacional y los espacios si el teléfono cumple las reglas de validación."
                },
                {
                    id: "TC-018",
                    title: "Teléfono por encima de la longitud máxima",
                    requirement: "FR-008",
                    priority: "High",
                    type: "Negative Testing",
                    data: "Teléfono: 1234567890123456",
                    preconditions: "El usuario se encuentra en la pantalla de registro.",
                    steps: [
                        "Completar los demás campos con datos válidos.",
                        "Ingresar 1234567890123456 en el campo Teléfono.",
                        "Aceptar el consentimiento.",
                        'Presionar "Ingresar al portfolio".'
                    ],
                    expected: "El sistema debe rechazar el teléfono porque contiene más de 15 dígitos."
                },
                {
                    id: "TC-019",
                    title: "Navegación entre páginas del portfolio",
                    requirement: "RF-07",
                    priority: "High",
                    type: "Functional Testing",
                    preconditions: "El usuario ya ingresó al portfolio y tiene disponibles los enlaces de navegación.",
                    steps: [
                        "Acceder a la página principal del portfolio.",
                        "Seleccionar el enlace correspondiente a la trayectoria profesional.",
                        "Verificar que se abra cv.html.",
                        "Regresar al portfolio y acceder a la sección de Quality Assurance.",
                        "Seleccionar el enlace correspondiente a Frontend y verificar que se abra frontend.html.",
                        "Repetir la navegación hacia backend.html, qa.html y quality-management.html.",
                        "Comprobar que cada enlace abra la página correspondiente y que su contenido principal sea accesible."
                    ],
                    expected: "Los enlaces deben dirigir a las páginas correspondientes del portfolio, sin errores de navegación ni destinos incorrectos."
                },
                {
                    id: "TC-020",
                    title: "Retorno al perfil desde páginas internas",
                    requirement: "RF-07",
                    priority: "High",
                    type: "Functional Testing",
                    preconditions: "El usuario ya ingresó al portfolio y puede acceder a las páginas internas.",
                    steps: [
                        "Acceder a cv.html desde el portfolio.",
                        "Seleccionar el control de retorno al perfil.",
                        "Verificar que se abra la página principal del portfolio.",
                        "Acceder a frontend.html y utilizar el control de retorno correspondiente.",
                        "Repetir la verificación desde backend.html, qa.html y quality-management.html.",
                        "Comprobar que cada control dirija al destino previsto.",
                        "Verificar que el usuario pueda continuar navegando por el portfolio después del retorno."
                    ],
                    expected: "Los controles de retorno de las páginas internas deben dirigir correctamente al perfil o al destino de navegación previsto, sin errores ni pérdida inesperada de la sesión."
                }
            ];

            function agregarCampo(contenedor, etiqueta, valor) {
                if (!valor) return;

                const bloque = document.createElement("div");
                const titulo = document.createElement("h4");
                const contenido = document.createElement("p");

                titulo.textContent = etiqueta;
                contenido.textContent = valor;

                bloque.append(titulo, contenido);
                contenedor.append(bloque);
            }

            // El idioma global controla las etiquetas y el detalle generado.
            // Los casos originales y sus datos de prueba permanecen intactos.
            function traducirQA(clave, respaldo) {
                const idioma = localStorage.getItem("portfolioLanguage") || "es";
                return window.portfolioTranslations?.[idioma]?.[clave] ?? respaldo;
            }

            document.addEventListener("portfolio:languagechange", () => {
                if (casoSeleccionado) {
                    mostrarCaso(casoSeleccionado);
                }
            });

            function mostrarCaso(caso) {
                casoSeleccionado = caso;
                detalle.replaceChildren();
                const prefijo = `qaCase${caso.id.slice(-3)}`;
                const traducir = (campo, respaldo) => traducirQA(`${prefijo}${campo}`, respaldo);
                const titulo = document.createElement("h3");
                titulo.textContent = `${caso.id} — ${traducir("Title", caso.title)}`;
                detalle.append(titulo);

                agregarCampo(detalle, traducirQA("qaCaseFieldRequirement", "Requisito"), caso.requirement);
                const prioridades = { High: "High", Medium: "Medium", Low: "Low" };
                const clavesPrioridad = { High: "qaCasePriorityHigh", Medium: "qaCasePriorityMedium", Low: "qaCasePriorityLow" };
                agregarCampo(detalle, traducirQA("qaCaseFieldPriority", "Prioridad"),
                    traducirQA(clavesPrioridad[caso.priority], prioridades[caso.priority] || caso.priority));

                const clavesTipo = {
                    "Negative Testing": "qaCaseTypeNegative",
                    "Positive Testing": "qaCaseTypePositive",
                    "Functional Testing": "qaCaseTypeFunctional",
                    "Responsive Testing": "qaCaseTypeResponsive",
                    "UI Testing": "qaCaseTypeUI",
                    "Compatibility Testing": "qaCaseTypeCompatibility",
                    "Performance Testing": "qaCaseTypePerformance"
                };
                agregarCampo(detalle, traducirQA("qaCaseFieldType", "Tipo de prueba"),
                    traducirQA(clavesTipo[caso.type], caso.type));
                agregarCampo(detalle, traducirQA("qaCaseFieldPreconditions", "Precondiciones"),
                    traducir("Preconditions", caso.preconditions));
                agregarCampo(detalle, traducirQA("qaCaseFieldData", "Datos de prueba"),
                    traducir("Data", caso.data));
                if (caso.browsers) {
                    agregarCampo(detalle, traducirQA("qaCaseFieldBrowsers", "Navegadores compatibles"),
                        caso.browsers.join(", "));
                }
                if (caso.steps?.length) {
                    const lista = document.createElement("div");
                    const subtitulo = document.createElement("h4");
                    const pasos = document.createElement("ol");
                    subtitulo.textContent = traducirQA("qaCaseFieldSteps", "Pasos");
                    caso.steps.forEach((paso, indice) => {
                        const elemento = document.createElement("li");
                        elemento.textContent = traducir(`Step${String(indice + 1).padStart(2, "0")}`, paso);
                        pasos.append(elemento);
                    });
                    lista.append(subtitulo, pasos);
                    detalle.append(lista);
                }
                agregarCampo(detalle, traducirQA("qaCaseFieldExpected", "Resultado esperado"),
                    traducir("Expected", caso.expected));

                const estadosEspeciales = {
                    "TC-006": "qaCaseStatusManual",
                    "TC-007": "qaCaseStatusManual",
                    "TC-010": "qaCaseStatusPending",
                    "TC-011": "qaCaseStatusPartial",
                    "TC-019": "qaCaseStatusAutomated",
                    "TC-020": "qaCaseStatusAutomated"
                };

                const claveEstado = ["TC-019", "TC-020"].includes(caso.id)
                    ? "qaCaseStatusAutomated"
                    : (estadosEspeciales[caso.id] || "qaCaseStatusHistorical");
                const estado = traducirQA(claveEstado, "PASS — EJECUCIÓN HISTÓRICA");
                agregarCampo(detalle, traducirQA("qaCaseFieldStatus", "Estado documentado"), estado);
                if (estado.startsWith("PASS")) {
                    detalle.lastElementChild.classList.add("test-status-approved");
                }
                detalle.hidden = false;
            }

            function seleccionarCaso(lomo) {
                const caso = casos.find(
                    (item) => item.id === lomo.dataset.testId
                );

                if (!caso) return;

                const yaSeleccionado = lomo.getAttribute("aria-expanded") === "true";

                lomos.forEach((otro) => {
                    otro.setAttribute("aria-expanded", "false");
                });

                if (yaSeleccionado) {
                    casoSeleccionado = null;
                    detalle.hidden = true;
                    return;
                }

                lomo.setAttribute("aria-expanded", "true");
                mostrarCaso(caso);
            }

            lomos.forEach((lomo) => {
                lomo.addEventListener("click", () => seleccionarCaso(lomo));
            });
        });
