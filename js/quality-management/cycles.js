// QUALITY MANAGEMENT — CICLOS INTERACTIVOS

        const qmCycles = {
            s1: {
                category: "SPRINT 1 · FRONTEND Y QA",
                categoryKey: "qmS1Category",

                title: "Sprint 1 · Frontend y validaciones",
                titleKey: "qmS1Title",

                description:
                    "Desarrollo del acceso al portfolio, " +
                    "validación de formularios y verificación funcional.",
                descriptionKey: "qmS1Description",

                center: ["SPRINT 1", "FRONTEND", "Validaciones · QA"],

                centerKeys: [
                    "qmS1CenterLabel",
                    "qmS1CenterTitle",
                    "qmS1CenterSubtitle"
                ],
                steps: [
                    {
                        label: "Requisitos",
                        labelKey: "qmS1Step1Label",

                        title: "Definición de comportamientos",
                        titleKey: "qmS1Step1Title",

                        description:
                            "Identificación de los datos y condiciones " +
                            "necesarios para acceder al portfolio.",
                        descriptionKey: "qmS1Step1Description",

                        activities: [
                            "Campos obligatorios del formulario.",
                            "Reglas de nombre, apellido, email y teléfono.",
                            "Consentimiento para registrar visitantes."
                        ],

                        activityKeys: [
                            "qmS1Step1Activity1",
                            "qmS1Step1Activity2",
                            "qmS1Step1Activity3"
                        ]
                    },
                    {
                        label: "Desarrollo",
                        labelKey: "qmS1Step2Label",

                        title: "Implementación del formulario",
                        titleKey: "qmS1Step2Title",

                        description:
                            "Construcción de la interfaz y sus validaciones " +
                            "mediante HTML, CSS y JavaScript.",
                        descriptionKey: "qmS1Step2Description",

                        activities: [
                            "Formulario de acceso.",
                            "Validación de entradas.",
                            "Mensajes ante datos inválidos."
                        ],

                        activityKeys: [
                            "qmS1Step2Activity1",
                            "qmS1Step2Activity2",
                            "qmS1Step2Activity3"
                        ]
                    },
                    {
                        label: "Casos de prueba",
                        labelKey: "qmS1Step3Label",

                        title: "Diseño de verificaciones",
                        titleKey: "qmS1Step3Title",

                        description:
                            "Documentación de escenarios funcionales " +
                            "y datos de entrada.",
                        descriptionKey: "qmS1Step3Description",

                        activities: [
                            "Casos positivos y negativos.",
                            "Límites de longitud y formatos.",
                            "Verificaciones de consentimiento."
                        ],

                        activityKeys: [
                            "qmS1Step3Activity1",
                            "qmS1Step3Activity2",
                            "qmS1Step3Activity3"
                        ]
                    },
                    {
                        label: "Ejecución",
                        labelKey: "qmS1Step4Label",

                        title: "Pruebas funcionales",
                        titleKey: "qmS1Step4Title",

                        description:
                            "Comprobación del comportamiento del formulario " +
                            "frente a distintos datos.",
                        descriptionKey: "qmS1Step4Description",

                        activities: [
                            "Ejecución de casos manuales.",
                            "Comprobación de mensajes.",
                            "Registro de resultados."
                        ],

                        activityKeys: [
                            "qmS1Step4Activity1",
                            "qmS1Step4Activity2",
                            "qmS1Step4Activity3"
                        ]
                    },
                    {
                        label: "Correcciones",
                        labelKey: "qmS1Step5Label",

                        title: "Resolución de defectos",
                        titleKey: "qmS1Step5Title",

                        description:
                            "Ajustes derivados de comportamientos " +
                            "incorrectos detectados durante las pruebas.",
                        descriptionKey: "qmS1Step5Description",

                        activities: [
                            "Correcciones en validaciones.",
                            "Verificación de casos afectados.",
                            "Actualización de reportes de defectos."
                        ],

                        activityKeys: [
                            "qmS1Step5Activity1",
                            "qmS1Step5Activity2",
                            "qmS1Step5Activity3"
                        ]
                    },
                    {
                        label: "Resultados",
                        labelKey: "qmS1Step6Label",

                        title: "Consolidación de calidad",
                        titleKey: "qmS1Step6Title",

                        description:
                            "Documentación del resultado final " +
                            "de las verificaciones funcionales.",
                        descriptionKey: "qmS1Step6Description",

                        activities: [
                            "18 casos funcionales aprobados.",
                            "Reporte de ejecución actualizado.",
                            "Evidencias disponibles en QA."
                        ],

                        activityKeys: [
                            "qmS1Step6Activity1",
                            "qmS1Step6Activity2",
                            "qmS1Step6Activity3"
                        ]
                    }
                ],
                results: [
                            ["18/18", "Casos funcionales aprobados"],
                            ["0", "Fallos en el reporte final"],
                            ["QA", "Casos y evidencias documentados"]
                        ],

                        resultKeys: [
                            "qmS1Result1",
                            "qmS1Result2",
                            "qmS1Result3"
                        ]
            },

            s15: {
                category: "SPRINT 1.5 · ESTABILIZACIÓN",
                categoryKey: "qmS15Category",

                title: "Sprint 1.5 · Regresión y estabilidad",
                titleKey: "qmS15Title",

                description:
                    "Verificación de correcciones y comprobación " +
                    "de los flujos principales antes de ampliar el sistema.",
                descriptionKey: "qmS15Description",

                center: ["SPRINT 1.5", "ESTABILIZACIÓN", "Smoke · Regresión"],

                centerKeys: [
                    "qmS15CenterLabel",
                    "qmS15CenterTitle",
                    "qmS15CenterSubtitle"
                ],
                steps: [
                    {
                        label: "Revisión",
                        labelKey: "qmS15Step1Label",

                        title: "Identificación de riesgos",
                        titleKey: "qmS15Step1Title",

                        description:
                            "Revisión de las funcionalidades corregidas " +
                            "y los escenarios críticos.",
                        descriptionKey: "qmS15Step1Description",

                        activities: [
                            "Revisión de defectos registrados.",
                            "Identificación de flujos principales.",
                            "Selección de comprobaciones prioritarias."
                        ],

                        activityKeys: [
                            "qmS15Step1Activity1",
                            "qmS15Step1Activity2",
                            "qmS15Step1Activity3"
                        ]
                    },
                    {
                        label: "Correcciones",
                        labelKey: "qmS15Step2Label",

                        title: "Estabilización funcional",
                        titleKey: "qmS15Step2Title",

                        description:
                            "Consolidación de las correcciones " +
                            "aplicadas durante el desarrollo.",
                        descriptionKey: "qmS15Step2Description",

                        activities: [
                            "Ajustes en reglas de validación.",
                            "Revisión de comportamientos corregidos.",
                            "Comprobación de mensajes de error."
                        ],

                        activityKeys: [
                            "qmS15Step2Activity1",
                            "qmS15Step2Activity2",
                            "qmS15Step2Activity3"
                        ]
                    },
                    {
                        label: "Smoke testing",
                        labelKey: "qmS15Step3Label",

                        title: "Verificación de funciones críticas",
                        titleKey: "qmS15Step3Title",

                        description:
                            "Ejecución de pruebas de humo " +
                            "sobre las funciones principales.",
                        descriptionKey: "qmS15Step3Description",

                        activities: [
                            "Carga de la página de acceso.",
                            "Disponibilidad del formulario.",
                            "Comportamientos esenciales."
                        ],

                        activityKeys: [
                            "qmS15Step3Activity1",
                            "qmS15Step3Activity2",
                            "qmS15Step3Activity3"
                        ]
                    },
                    {
                        label: "Regresión",
                        labelKey: "qmS15Step4Label",

                        title: "Control de efectos secundarios",
                        titleKey: "qmS15Step4Title",

                        description:
                            "Comprobación de que los cambios " +
                            "no afectaran funciones existentes.",
                        descriptionKey: "qmS15Step4Description",

                        activities: [
                            "Reejecución de escenarios relevantes.",
                            "Verificación de validaciones.",
                            "Control de navegación."
                        ],

                        activityKeys: [
                            "qmS15Step4Activity1",
                            "qmS15Step4Activity2",
                            "qmS15Step4Activity3"
                        ]
                    },
                    {
                        label: "Verificación",
                        labelKey: "qmS15Step5Label",

                        title: "Comprobación de resultados",
                        titleKey: "qmS15Step5Title",

                        description:
                            "Comparación de los resultados observados " +
                            "con los esperados.",
                        descriptionKey: "qmS15Step5Description",

                        activities: [
                            "Revisión de las ejecuciones.",
                            "Comprobación de las correcciones.",
                            "Registro de resultados."
                        ],

                        activityKeys: [
                            "qmS15Step5Activity1",
                            "qmS15Step5Activity2",
                            "qmS15Step5Activity3"
                        ]
                    },
                    {
                        label: "Cierre",
                        labelKey: "qmS15Step6Label",

                        title: "Consolidación de estabilidad",
                        titleKey: "qmS15Step6Title",

                        description:
                            "Preparación de una base funcional " +
                            "más estable para la siguiente etapa.",
                        descriptionKey: "qmS15Step6Description",

                        activities: [
                            "5 pruebas de humo aprobadas.",
                            "Revisión del estado de defectos.",
                            "Continuidad hacia el backend."
                        ],

                        activityKeys: [
                            "qmS15Step6Activity1",
                            "qmS15Step6Activity2",
                            "qmS15Step6Activity3"
                        ]
                    }
                ],
                results: [
                    ["5/5", "Pruebas de humo aprobadas"],
                    ["Regresión", "Flujos principales verificados"],
                    ["S1.5", "Etapa de estabilización"]
                ],

                resultKeys: [
                    "qmS15Result1",
                    "qmS15Result2",
                    "qmS15Result3"
                ],

                resultValueKeys: [
                    null,
                    "qmS15Result2Value",
                    null
                ]
            },

            s2: {
                category: "SPRINT 2 · BACKEND Y QA",
                categoryKey: "qmS2Category",

                title: "Sprint 2 · APIs y datos",
                titleKey: "qmS2Title",

                description:
                    "Implementación del backend, persistencia SQLite, " +
                    "validaciones, pruebas automatizadas e integración.",
                descriptionKey: "qmS2Description",

                center: [
                    "SPRINT 2",
                    "APIs Y DATOS",
                    "Backend · QA · Integración"
                ],

                centerKeys: [
                    "qmS2CenterLabel",
                    "qmS2CenterTitle",
                    "qmS2CenterSubtitle"
                ],
                steps: [
                    {
                        label: "Planificación",
                        labelKey: "qmS2Step1Label",

                        title: "Definición del alcance",
                        titleKey: "qmS2Step1Title",

                        description:
                            "Organización de endpoints, reglas de validación, " +
                            "persistencia y escenarios de prueba.",
                        descriptionKey: "qmS2Step1Description",

                        activities: [
                            "Definición de funcionalidades de la API.",
                            "Identificación de datos obligatorios.",
                            "Planificación de pruebas de backend."
                        ],

                        activityKeys: [
                            "qmS2Step1Activity1",
                            "qmS2Step1Activity2",
                            "qmS2Step1Activity3"
                        ]
                    },
                    {
                        label: "Implementación",
                        labelKey: "qmS2Step2Label",

                        title: "Desarrollo de APIs",
                        titleKey: "qmS2Step2Title",

                        description:
                            "Construcción de servicios mediante Node.js, " +
                            "Express, SQLite y nodemailer.",
                        descriptionKey: "qmS2Step2Description",

                        activities: [
                            "GET /api/health.",
                            "POST /api/visitors.",
                            "POST /api/contact.",
                            "Persistencia SQLite y servicio SMTP."
                        ],

                        activityKeys: [
                            "qmS2Step2Activity1",
                            "qmS2Step2Activity2",
                            "qmS2Step2Activity3",
                            "qmS2Step2Activity4"
                        ]
                    },
                    {
                        label: "Validaciones",
                        labelKey: "qmS2Step3Label",

                        title: "Control de entradas",
                        titleKey: "qmS2Step3Title",

                        description:
                            "Verificación de los datos recibidos " +
                            "y manejo de solicitudes inválidas.",
                        descriptionKey: "qmS2Step3Description",

                        activities: [
                            "Validación de nombre, apellido y email.",
                            "Formato y longitud del teléfono.",
                            "Consentimiento obligatorio.",
                            "Contenido y longitud del mensaje."
                        ],

                        activityKeys: [
                            "qmS2Step3Activity1",
                            "qmS2Step3Activity2",
                            "qmS2Step3Activity3",
                            "qmS2Step3Activity4"
                        ]
                    },
                    {
                        label: "Pruebas",
                        labelKey: "qmS2Step4Label",

                        title: "Automatización del backend",
                        titleKey: "qmS2Step4Title",

                        description:
                            "Verificación de endpoints, validadores, " +
                            "persistencia y errores controlados.",
                        descriptionKey: "qmS2Step4Description",

                        activities: [
                            "Pruebas con Node.js Test Runner.",
                            "Respuestas HTTP esperadas.",
                            "Pruebas de SQLite.",
                            "Simulación de fallos SMTP."
                        ],

                        activityKeys: [
                            "qmS2Step4Activity1",
                            "qmS2Step4Activity2",
                            "qmS2Step4Activity3",
                            "qmS2Step4Activity4"
                        ]
                    },
                    {
                        label: "Integración",
                        labelKey: "qmS2Step5Label",

                        title: "Conexión frontend-backend",
                        titleKey: "qmS2Step5Title",

                        description:
                            "Comprobación del intercambio de datos " +
                            "entre el formulario y la API.",
                        descriptionKey: "qmS2Step5Description",

                        activities: [
                            "Registro válido desde la interfaz.",
                            "Acceso al portfolio.",
                            "Manejo de errores de conexión."
                        ],

                        activityKeys: [
                            "qmS2Step5Activity1",
                            "qmS2Step5Activity2",
                            "qmS2Step5Activity3"
                        ]
                    },
                    {
                        label: "Revisión",
                        labelKey: "qmS2Step6Label",

                        title: "Consolidación de resultados",
                        titleKey: "qmS2Step6Title",

                        description:
                            "Revisión de pruebas automatizadas, " +
                            "integración y documentación técnica.",
                        descriptionKey: "qmS2Step6Description",

                        activities: [
                            "15 pruebas de backend aprobadas.",
                            "3 verificaciones de integración aprobadas.",
                            "Actualización de documentación QA."
                        ],

                        activityKeys: [
                            "qmS2Step6Activity1",
                            "qmS2Step6Activity2",
                            "qmS2Step6Activity3"
                        ]
                    }
                ],
                results: [
                    ["15/15", "Pruebas de backend aprobadas"],
                    ["3/3", "Verificaciones de integración aprobadas"],
                    ["SQLite", "Persistencia comprobada"]
                ],

                resultKeys: [
                    "qmS2Result1",
                    "qmS2Result2",
                    "qmS2Result3"
                ]
            },

            ec: {
                category: "EVOLUCIÓN CONTINUA · PORTFOLIO",
                categoryKey: "qmEcCategory",

                title: "Evolución continua · Mejora del portfolio",
                titleKey: "qmEcTitle",

                description:
                    "Ampliación progresiva de las demostraciones " +
                    "técnicas, evidencias y experiencia de usuario.",
                descriptionKey: "qmEcDescription",

                center: [
                    "EVOLUCIÓN",
                    "MEJORA CONTINUA",
                    "Diseño · Calidad · Evidencia"
                ],

                centerKeys: [
                    "qmEcCenterLabel",
                    "qmEcCenterTitle",
                    "qmEcCenterSubtitle"
                ],
                steps: [
                    {
                        label: "Necesidades",
                        labelKey: "qmEcStep1Label",

                        title: "Identificación de mejoras",
                        titleKey: "qmEcStep1Title",

                        description:
                            "Detección de oportunidades de ampliación " +
                            "del portfolio.",
                        descriptionKey: "qmEcStep1Description",

                        activities: [
                            "Revisión de contenido y navegación.",
                            "Identificación de información repetida.",
                            "Priorización de nuevas funcionalidades."
                        ],

                        activityKeys: [
                            "qmEcStep1Activity1",
                            "qmEcStep1Activity2",
                            "qmEcStep1Activity3"
                        ]
                    },
                    {
                        label: "Diseño",
                        labelKey: "qmEcStep2Label",

                        title: "Organización de soluciones",
                        titleKey: "qmEcStep2Title",

                        description:
                            "Definición de componentes y formas " +
                            "de presentar las evidencias.",
                        descriptionKey: "qmEcStep2Description",

                        activities: [
                            "Diseño de laboratorios interactivos.",
                            "Organización de secciones.",
                            "Adaptación visual al portfolio."
                        ],

                        activityKeys: [
                            "qmEcStep2Activity1",
                            "qmEcStep2Activity2",
                            "qmEcStep2Activity3"
                        ]
                    },
                    {
                        label: "Desarrollo",
                        labelKey: "qmEcStep3Label",

                        title: "Incorporación de funcionalidades",
                        titleKey: "qmEcStep3Title",

                        description:
                            "Implementación incremental de páginas " +
                            "y componentes especializados.",
                        descriptionKey: "qmEcStep3Description",

                        activities: [
                            "Página de Backend.",
                            "Biblioteca de casos QA.",
                            "Página de Quality Management."
                        ],

                        activityKeys: [
                            "qmEcStep3Activity1",
                            "qmEcStep3Activity2",
                            "qmEcStep3Activity3"
                        ]
                    },
                    {
                        label: "Verificación",
                        labelKey: "qmEcStep4Label",

                        title: "Comprobación de cambios",
                        titleKey: "qmEcStep4Title",

                        description:
                            "Revisión de funcionamiento y presentación " +
                            "de los componentes incorporados.",
                        descriptionKey: "qmEcStep4Description",

                        activities: [
                            "Comprobación de interacciones.",
                            "Revisión de navegación.",
                            "Validación visual y responsive."
                        ],

                        activityKeys: [
                            "qmEcStep4Activity1",
                            "qmEcStep4Activity2",
                            "qmEcStep4Activity3"
                        ]
                    },
                    {
                        label: "Evidencias",
                        labelKey: "qmEcStep5Label",

                        title: "Documentación verificable",
                        titleKey: "qmEcStep5Title",

                        description:
                            "Organización de información técnica " +
                            "y resultados disponibles.",
                        descriptionKey: "qmEcStep5Description",

                        activities: [
                            "Casos de prueba.",
                            "Automatización Selenium.",
                            "Reportes y evidencias."
                        ],

                        activityKeys: [
                            "qmEcStep5Activity1",
                            "qmEcStep5Activity2",
                            "qmEcStep5Activity3"
                        ]
                    },
                    {
                        label: "Mejora",
                        labelKey: "qmEcStep6Label",

                        title: "Refinamiento continuo",
                        titleKey: "qmEcStep6Title",

                        description:
                            "Ajustes de contenido, diseño " +
                            "y experiencia de usuario.",
                        descriptionKey: "qmEcStep6Description",

                        activities: [
                            "Reducción de duplicaciones.",
                            "Mejoras de legibilidad.",
                            "Optimización de componentes."
                        ],

                        activityKeys: [
                            "qmEcStep6Activity1",
                            "qmEcStep6Activity2",
                            "qmEcStep6Activity3"
                        ]
                    }
                ],
                results: [
                    ["Frontend", "Interfaz y validaciones"],
                    ["Backend", "Laboratorios de APIs y datos"],
                    ["QA", "Evidencias y gestión de calidad"]
                ],

                resultKeys: [
                    "qmEcResult1",
                    "qmEcResult2",
                    "qmEcResult3"
                ]
            }
        };

        const qmCycleButtons = document.querySelectorAll(
            ".qm-cycle-button"
        );

        const qmStepButtons = document.querySelectorAll(
            ".qm-sprint-step"
        );

        const qmDetail = document.getElementById(
            "qm-sprint-detail"
        );

        const qmResults = document.getElementById(
            "qm-sprint-results"
        );

        let qmCurrentCycle = "s2";

        function qmShowStep(index) {
            const cycle = qmCycles[qmCurrentCycle];
            const step = cycle?.steps[index];

            if (!step) return;

            qmStepButtons.forEach((button, buttonIndex) => {
                button.setAttribute(
                    "aria-pressed",
                    String(buttonIndex === index)
                );
            });

            // Etiqueta de la etapa
            const translatedLabel = step.labelKey
                ? qmTranslate(step.labelKey, step.label)
                : step.label;

            const stageWord = qmTranslate("qmSprintStageLabel", "ETAPA");

            const category = document.createElement("span");
            category.className = "qm-card-category";

            category.textContent =
                `${stageWord} ${String(index + 1).padStart(2, "0")} · ` +
                translatedLabel.toUpperCase();

            // Título
            const title = document.createElement("h4");

            title.textContent = step.titleKey
                ? qmTranslate(step.titleKey, step.title)
                : step.title;

            // Descripción
            const description = document.createElement("p");

            description.textContent = step.descriptionKey
                ? qmTranslate(step.descriptionKey, step.description)
                : step.description;

            // Actividades
            const list = document.createElement("ul");

            step.activities.forEach((activity, activityIndex) => {
                const item = document.createElement("li");

                const activityKey =
                    step.activityKeys?.[activityIndex];

                item.textContent = activityKey
                    ? qmTranslate(activityKey, activity)
                    : activity;

                list.appendChild(item);
            });

            qmDetail.replaceChildren(
                category,
                title,
                description,
                list
            );
        }

        function qmShowCycle(cycleId) {
            const cycle = qmCycles[cycleId];

            if (!cycle) return;

            qmCurrentCycle = cycleId;

            qmCycleButtons.forEach(button => {
                button.setAttribute(
                    "aria-pressed",
                    String(button.dataset.cycle === cycleId)
                );
            });

            // Cabecera del ciclo
            document.getElementById("qm-cycle-category").textContent =
                qmTranslate(cycle.categoryKey, cycle.category);

            document.getElementById("qm-cycle-title").textContent =
                qmTranslate(cycle.titleKey, cycle.title);

            document.getElementById("qm-cycle-description").textContent =
                qmTranslate(cycle.descriptionKey, cycle.description);

            // Centro de la rueda
            const centerIds = [
                "qm-wheel-label",
                "qm-wheel-title",
                "qm-wheel-subtitle"
            ];

            centerIds.forEach((id, index) => {
                document.getElementById(id).textContent =
                    qmTranslate(
                        cycle.centerKeys?.[index],
                        cycle.center[index]
                    );
            });

            // Etiquetas de las seis etapas
            qmStepButtons.forEach((button, index) => {
                const step = cycle.steps[index];

                if (!step) return;

                button.querySelector("strong").textContent =
                    qmTranslate(step.labelKey, step.label);
            });

            // Tarjetas de resultados
            qmResults.replaceChildren();

            cycle.results.forEach((result, index) => {
                const card = document.createElement("div");
                card.className = "qm-sprint-result";

                const value = document.createElement("strong");

                const valueKey = cycle.resultValueKeys?.[index];

                value.textContent = valueKey
                    ? qmTranslate(valueKey, result[0])
                    : result[0];

                const label = document.createElement("span");

                label.textContent = qmTranslate(
                    cycle.resultKeys?.[index],
                    result[1]
                );

                card.append(value, label);
                qmResults.appendChild(card);
            });

            // Mostrar la primera etapa del ciclo
            qmShowStep(0);
        }

        qmCycleButtons.forEach(button => {
            button.addEventListener("click", () => {
                qmShowCycle(button.dataset.cycle);
            });
        });

        qmStepButtons.forEach(button => {
            button.addEventListener("click", () => {
                qmShowStep(Number(button.dataset.step));
            });
        });

        // Estado inicial.
        qmShowCycle("s2");
        // Actualizar los ciclos interactivos al cambiar de idioma.
        document.addEventListener("portfolio:languagechange", () => {

            // Conservar la etapa seleccionada.
            const activeStep = Array.from(qmStepButtons).find(
                button => button.getAttribute("aria-pressed") === "true"
            );

            const selectedStep = activeStep
                ? Number(activeStep.dataset.step)
                : 0;

            // Actualizar el ciclo actual y sus traducciones.
            qmShowCycle(qmCurrentCycle);

            // Restaurar la etapa seleccionada.
            qmShowStep(selectedStep);
        });