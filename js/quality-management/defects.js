// =========================================
        // QUALITY MANAGEMENT — GESTIÓN DE DEFECTOS
        // =========================================

        // 01. PROCEDIMIENTO DE GESTIÓN

        const qmDefectSteps = [
            {
                title: "Detección y evidencia",
                titleKey: "qmDefectStep01Title",

                label: "Identificación del defecto",
                labelKey: "qmDefectStep01Label",

                description:
                    "Durante la ejecución de pruebas se identifica " +
                    "un comportamiento que no coincide con el " +
                    "resultado esperado. Se recopilan capturas de " +
                    "pantalla, grabaciones y datos de prueba para " +
                    "demostrar el problema y facilitar su reproducción.",

                descriptionKey: "qmDefectStep01Description",

                activities: [
                    "Identificar la funcionalidad afectada.",
                    "Comparar el resultado esperado con el obtenido.",
                    "Capturar pantallas o grabaciones del comportamiento.",
                    "Registrar el entorno y los datos utilizados."
                ],

                activityKeys: [
                    "qmDefectStep01Activity01",
                    "qmDefectStep01Activity02",
                    "qmDefectStep01Activity03",
                    "qmDefectStep01Activity04"
                ]
            },
            {
                title: "Registro documental",
                titleKey: "qmDefectStep02Title",

                label: "Excel y Jira",
                labelKey: "qmDefectStep02Label",

                description:
                    "Una vez identificado el defecto, se crea " +
                    "un registro documental. En el proyecto, " +
                    "el seguimiento comenzó mediante planillas " +
                    "Excel y posteriormente se incorporó Jira " +
                    "para organizar la información, clasificación " +
                    "y seguimiento de los defectos.",

                descriptionKey: "qmDefectStep02Description",

                activities: [
                    "Asignar un identificador y un resumen claro.",
                    "Documentar descripción y pasos de reproducción.",
                    "Registrar severidad, prioridad y estado.",
                    "Relacionar requisitos, casos de prueba y evidencias."
                ],

                activityKeys: [
                    "qmDefectStep02Activity01",
                    "qmDefectStep02Activity02",
                    "qmDefectStep02Activity03",
                    "qmDefectStep02Activity04"
                ]
            },
            {
                title: "Comunicación y corrección",
                titleKey: "qmDefectStep03Title",

                label: "Trabajo colaborativo",
                labelKey: "qmDefectStep03Label",

                description:
                    "Además de registrar el defecto, es necesario " +
                    "comunicarlo al equipo para que pueda visualizarse " +
                    "y reproducirse. El responsable técnico analiza " +
                    "el problema, implementa la corrección y comunica " +
                    "cuándo está disponible para una nueva verificación. " +
                    "En Jira puede mantenerse el seguimiento del " +
                    "responsable y del estado de la incidencia.",

                descriptionKey: "qmDefectStep03Description",

                activities: [
                    "Comunicar el defecto y su impacto.",
                    "Facilitar los pasos y datos de reproducción.",
                    "Dar seguimiento al responsable y la corrección.",
                    "Confirmar que existe una versión para reprueba."
                ],

                activityKeys: [
                    "qmDefectStep03Activity01",
                    "qmDefectStep03Activity02",
                    "qmDefectStep03Activity03",
                    "qmDefectStep03Activity04"
                ]
            },
            {
                title: "Reprueba y validación",
                titleKey: "qmDefectStep04Title",

                label: "Control de calidad",
                labelKey: "qmDefectStep04Label",

                description:
                    "Después de aplicar la corrección, QA vuelve " +
                    "a ejecutar el escenario que permitió detectar " +
                    "el defecto. Se compara la respuesta obtenida " +
                    "con el resultado esperado y, cuando corresponde, " +
                    "se realizan pruebas de regresión para comprobar " +
                    "que otras funcionalidades continúan funcionando.",

                descriptionKey: "qmDefectStep04Description",

                activities: [
                    "Reejecutar el caso de prueba afectado.",
                    "Comparar el resultado obtenido con el esperado.",
                    "Conservar evidencia posterior a la corrección.",
                    "Verificar funcionalidades relacionadas."
                ],

                activityKeys: [
                    "qmDefectStep04Activity01",
                    "qmDefectStep04Activity02",
                    "qmDefectStep04Activity03",
                    "qmDefectStep04Activity04"
                ]
            },
            {
                title: "Cierre documental",
                titleKey: "qmDefectStep05Title",

                label: "Defecto verificado",
                labelKey: "qmDefectStep05Label",

                description:
                    "Cuando la corrección supera satisfactoriamente " +
                    "la reprueba, el defecto puede marcarse como " +
                    "cerrado. Se conserva su historial, las evidencias " +
                    "y las referencias a las pruebas realizadas. " +
                    "Si el problema persiste, vuelve al circuito " +
                    "de análisis y corrección en lugar de cerrarse.",

                descriptionKey: "qmDefectStep05Description",

                activities: [
                    "Confirmar que el resultado esperado se cumple.",
                    "Actualizar el estado final del defecto.",
                    "Registrar la resolución y las evidencias disponibles.",
                    "Conservar el historial para futuras regresiones."
                ],

                activityKeys: [
                    "qmDefectStep05Activity01",
                    "qmDefectStep05Activity02",
                    "qmDefectStep05Activity03",
                    "qmDefectStep05Activity04"
                ]
            }
        ];

        const qmDefectStepButtons = document.querySelectorAll(
            ".qm-defect-step-button"
        );

        const qmDefectStepCode = document.getElementById(
            "qm-defect-step-code"
        );

        const qmDefectStepTitle = document.getElementById(
            "qm-defect-step-title"
        );

        const qmDefectStepLabel = document.getElementById(
            "qm-defect-step-label"
        );

        const qmDefectStepDescription = document.getElementById(
            "qm-defect-step-description"
        );

        const qmDefectActivitiesGrid = document.getElementById(
            "qm-defect-activities-grid"
        );

        const qmDefectPrev = document.getElementById(
            "qm-defect-prev"
        );

        const qmDefectNext = document.getElementById(
            "qm-defect-next"
        );

        const qmDefectCounter = document.getElementById(
            "qm-defect-counter"
        );

        let qmCurrentDefectStep = 0;

        function qmShowDefectStep(index) {

            if (
                !Number.isInteger(index) ||
                index < 0 ||
                index >= qmDefectSteps.length
            ) {
                return;
            }

            qmCurrentDefectStep = index;

            const step = qmDefectSteps[index];

            // Código de etapa traducido.
            const stepPrefix = qmTranslate(
                "qmDefectStepCodePrefix",
                "ETAPA"
            );

            qmDefectStepCode.textContent =
                `${stepPrefix} ${String(index + 1).padStart(2, "0")}`;

            // Título y etiqueta.
            qmDefectStepTitle.textContent = qmTranslate(
                step.titleKey,
                step.title
            );

            qmDefectStepLabel.textContent = qmTranslate(
                step.labelKey,
                step.label
            );

            // Descripción.
            qmDefectStepDescription.textContent = qmTranslate(
                step.descriptionKey,
                step.description
            );

            // Actividades.
            qmDefectActivitiesGrid.replaceChildren();

            step.activities.forEach((activity, activityIndex) => {

                const item = document.createElement("div");

                item.className = "qm-defect-activity";

                const activityKey =
                    step.activityKeys?.[activityIndex];

                item.textContent = activityKey
                    ? qmTranslate(activityKey, activity)
                    : activity;

                qmDefectActivitiesGrid.appendChild(item);

            });

            // Estado de los botones del selector.
            qmDefectStepButtons.forEach(button => {

                button.setAttribute(
                    "aria-pressed",
                    String(
                        Number(button.dataset.defectStep) === index
                    )
                );

            });

            // Navegación.
            qmDefectPrev.disabled = index === 0;

            qmDefectNext.disabled =
                index === qmDefectSteps.length - 1;

            // Contador traducido.
            const counterOf = qmTranslate(
                "qmDefectCounterOf",
                "de"
            );

            qmDefectCounter.textContent =
                `${index + 1} ${counterOf} ${qmDefectSteps.length}`;
        }

        qmDefectStepButtons.forEach(button => {
            button.addEventListener("click", () => {
                qmShowDefectStep(
                    Number(button.dataset.defectStep)
                );
            });
        });

        qmDefectPrev.addEventListener("click", () => {
            qmShowDefectStep(qmCurrentDefectStep - 1);
        });

        qmDefectNext.addEventListener("click", () => {
            qmShowDefectStep(qmCurrentDefectStep + 1);
        });

        // 02. DEFECTOS DOCUMENTADOS

        const qmBugs = [
            {
                id: "BUG-001",

                title: "Teléfono acepta letras",
                titleKey: "qmBug001Title",

                description:
                    "El campo teléfono aceptaba caracteres " +
                    "alfabéticos, aunque el formato permitido " +
                    "admite números y determinados caracteres " +
                    "de separación.",

                descriptionKey: "qmBug001Description",

                requirement: "FR-008",
                test: "TC-012",

                severity: "Media",
                severityKey: "qmBugSeverityMedium",

                priority: "Alta",
                priorityKey: "qmBugPriorityHigh",

                status: "Cerrado",
                statusKey: "qmBugStatusClosed",

                resolution:
                    "Se corrigió la validación del teléfono " +
                    "y se comprobó que el formulario rechaza " +
                    "caracteres alfabéticos.",

                resolutionKey: "qmBug001Resolution"
            },
            {
                id: "BUG-002",

                title: "Nombre con caracteres especiales",
                titleKey: "qmBug002Title",

                description:
                    "Se identificó un problema de validación " +
                    "en el campo nombre relacionado con " +
                    "la aceptación de caracteres no permitidos.",

                descriptionKey: "qmBug002Description",

                requirement: "FR-008",

                test: "Por confirmar",
                testKey: "qmBugTestPending",

                severity: "No documentada aquí",
                severityKey: "qmBugClassificationUndocumented",

                priority: "No documentada aquí",
                priorityKey: "qmBugClassificationUndocumented",

                status: "Cerrado",
                statusKey: "qmBugStatusClosed",

                resolution:
                    "Se ajustó la validación del campo nombre. " +
                    "El defecto figura como cerrado en los " +
                    "registros del proyecto.",

                resolutionKey: "qmBug002Resolution"
            },
            {
                id: "BUG-003",

                title: "Apellido con caracteres especiales",
                titleKey: "qmBug003Title",

                description:
                    "Se identificó un problema de validación " +
                    "en el campo apellido relacionado con " +
                    "la aceptación de caracteres no permitidos.",

                descriptionKey: "qmBug003Description",

                requirement: "FR-008",

                test: "Por confirmar",
                testKey: "qmBugTestPending",

                severity: "No documentada aquí",
                severityKey: "qmBugClassificationUndocumented",

                priority: "No documentada aquí",
                priorityKey: "qmBugClassificationUndocumented",

                status: "Cerrado",
                statusKey: "qmBugStatusClosed",

                resolution:
                    "Se ajustó la validación del campo apellido. " +
                    "El defecto figura como cerrado en los " +
                    "registros del proyecto.",

                resolutionKey: "qmBug003Resolution"
            },
            {
                id: "BUG-004",

                title: "Email inválido",
                titleKey: "qmBug004Title",

                description:
                    "Se detectó que una dirección de correo " +
                    "inválida podía superar la validación " +
                    "del formulario.",

                descriptionKey: "qmBug004Description",

                requirement: "FR-003",

                test: "TC-004",

                severity: "No documentada aquí",
                severityKey: "qmBugClassificationUndocumented",

                priority: "No documentada aquí",
                priorityKey: "qmBugClassificationUndocumented",

                status: "Cerrado",
                statusKey: "qmBugStatusClosed",

                resolution:
                    "Se corrigió la validación del correo " +
                    "electrónico y se comprobó el rechazo " +
                    "de entradas inválidas.",

                resolutionKey: "qmBug004Resolution"
            },
            {
                id: "BUG-005",

                title: "Teléfono mixto",
                titleKey: "qmBug005Title",

                description:
                    "El campo teléfono aceptaba entradas " +
                    "que combinaban números y letras, " +
                    "incumpliendo las reglas de validación.",

                descriptionKey: "qmBug005Description",

                requirement: "FR-008",

                test: "TC-014",

                severity: "No documentada aquí",
                severityKey: "qmBugClassificationUndocumented",

                priority: "No documentada aquí",
                priorityKey: "qmBugClassificationUndocumented",

                status: "Cerrado",
                statusKey: "qmBugStatusClosed",

                resolution:
                    "Se corrigió la validación del teléfono " +
                    "y se comprobó el rechazo de entradas " +
                    "con caracteres alfabéticos.",

                resolutionKey: "qmBug005Resolution"
            }
        ];

        const qmBugButtons = document.querySelectorAll(
            ".qm-bug-button"
        );

        const qmBugCode = document.getElementById(
            "qm-bug-code"
        );

        const qmBugTitle = document.getElementById(
            "qm-bug-title"
        );

        const qmBugStatus = document.getElementById(
            "qm-bug-status"
        );

        const qmBugDescription = document.getElementById(
            "qm-bug-description"
        );

        const qmBugRequirement = document.getElementById(
            "qm-bug-requirement"
        );

        const qmBugTest = document.getElementById(
            "qm-bug-test"
        );

        const qmBugSeverity = document.getElementById(
            "qm-bug-severity"
        );

        const qmBugPriority = document.getElementById(
            "qm-bug-priority"
        );

        const qmBugResolutionText = document.getElementById(
            "qm-bug-resolution-text"
        );

        function qmShowBug(id) {

            const bug = qmBugs.find(item => item.id === id);

            if (!bug) return;

            // Identificador técnico: no se traduce.
            qmBugCode.textContent = bug.id;

            // Título y estado.
            qmBugTitle.textContent = qmTranslate(
                bug.titleKey,
                bug.title
            );

            qmBugStatus.textContent = qmTranslate(
                bug.statusKey,
                bug.status
            );

            // Descripción del defecto.
            qmBugDescription.textContent = qmTranslate(
                bug.descriptionKey,
                bug.description
            );

            // Requisito técnico: no se traduce.
            qmBugRequirement.textContent = bug.requirement;

            // Caso de prueba: traducir solo si es un texto.
            qmBugTest.textContent = bug.testKey
                ? qmTranslate(bug.testKey, bug.test)
                : bug.test;

            // Clasificación.
            qmBugSeverity.textContent = qmTranslate(
                bug.severityKey,
                bug.severity
            );

            qmBugPriority.textContent = qmTranslate(
                bug.priorityKey,
                bug.priority
            );

            // Resolución y verificación.
            qmBugResolutionText.textContent = qmTranslate(
                bug.resolutionKey,
                bug.resolution
            );

            // Mantener el estado accesible del selector.
            qmBugButtons.forEach(button => {

                button.setAttribute(
                    "aria-pressed",
                    String(button.dataset.bug === bug.id)
                );

            });
        }

        qmBugButtons.forEach(button => {
            button.addEventListener("click", () => {
                qmShowBug(button.dataset.bug);
            });
        });

        // Inicialización de ambos componentes.
        qmShowDefectStep(0);
        qmShowBug("BUG-001");
        // Actualizar Gestión de defectos al cambiar de idioma.
        document.addEventListener("portfolio:languagechange", () => {

            // Conservar la etapa seleccionada.
            qmShowDefectStep(qmCurrentDefectStep);

            // Conservar el defecto seleccionado.
            const activeBug = Array.from(qmBugButtons).find(
                button => button.getAttribute("aria-pressed") === "true"
            );

            const selectedBug = activeBug
                ? activeBug.dataset.bug
                : "BUG-001";

            qmShowBug(selectedBug);
        });