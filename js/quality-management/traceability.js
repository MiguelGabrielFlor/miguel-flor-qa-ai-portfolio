// =========================================
        // QUALITY MANAGEMENT — TRAZABILIDAD
        // =========================================

        const qmTraceData = [
            {
                id: "acceso",
                titleKey: "qmTraceAccessTitle",
                requirement: "RF-01",
                requirementNameKey: "qmTraceAccessRequirement",
                story: "HU-001",
                storyNameKey: "qmTraceAccessStory",
                bdd: "BDD-001",
                bddNameKey: "qmTraceAccessBDD",
                statusKey: "qmTraceAccessStatus",
                statusType: "implemented",
                verificationKey: "qmTraceAccessVerification",
                tests: ["TC-001", "TC-002", "INT-002"]
            },
            {
                id: "registro",
                titleKey: "qmTraceRegistrationTitle",
                requirement: "RF-02",
                requirementNameKey: "qmTraceRegistrationRequirement",
                story: "HU-001",
                storyNameKey: "qmTraceRegistrationStory",
                bdd: "BDD-001",
                bddNameKey: "qmTraceRegistrationBDD",
                statusKey: "qmTraceRegistrationStatus",
                statusType: "implemented",
                verificationKey: "qmTraceRegistrationVerification",
                tests: ["TC-002", "INT-001"]
            },
            {
                id: "consentimiento",
                titleKey: "qmTraceConsentTitle",
                requirement: "RF-03",
                requirementNameKey: "qmTraceConsentRequirement",
                story: "HU-001",
                storyNameKey: "qmTraceConsentStory",
                bdd: "BDD-002",
                bddNameKey: "qmTraceConsentBDD",
                statusKey: "qmTraceConsentStatus",
                statusType: "implemented",
                verificationKey: "qmTraceConsentVerification",                
                tests: [
                    "TC-005",
                    "UI-007",
                    "API-TC-005"
                ]
            },
            {
                id: "contacto",
                titleKey: "qmTraceContactTitle",
                requirement: "RF-04",
                requirementNameKey: "qmTraceContactRequirement",
                story: "HU-003",
                storyNameKey: "qmTraceContactStory",
                bdd: "BDD-004",
                bddNameKey: "qmTraceContactBDD",
                statusKey: "qmTraceContactStatus",
                statusType: "implemented",
                verificationKey: "qmTraceContactVerification",                
                tests: [
                    "API-TC-007",
                    "API-TC-008",
                    "API-TC-009",
                    "API-TC-010",
                    "UI-010",
                    "UI-011",
                    "UI-015"
                ]
            },
            {
                id: "idioma",
                titleKey: "qmTraceLanguageTitle",
                requirement: "RF-05",
                requirementNameKey: "qmTraceLanguageRequirement",
                story: "HU-004",
                storyNameKey: "qmTraceLanguageStory",
                bdd: "BDD-005",
                bddNameKey: "qmTraceLanguageBDD",
                statusKey: "qmTraceLanguageStatus",
                statusType: "implemented",
                verificationKey: "qmTraceLanguageVerification",
                tests: [
                    "ACCESS-I18N-005",
                    "LANG-NAV-006",
                    "NAV-ALL"
                ]
            },
            {
                id: "buscador",
                titleKey: "qmTraceSearchTitle",
                requirement: "RF-06",
                requirementNameKey: "qmTraceSearchRequirement",
                story: "HU-005",
                storyNameKey: "qmTraceSearchStory",
                bdd: "BDD-006",
                bddNameKey: "qmTraceSearchBDD",
                statusKey: "qmTraceSearchStatus",
                statusType: "implemented",
                verificationKey: "qmTraceSearchVerification",
                tests: [
                    "SEARCH-TC-001",
                    "SEARCH-TC-002",
                    "SEARCH-TC-003",
                    "SEARCH-TC-004",
                    "SEARCH-TC-005",
                    "SEARCH-TC-006",
                    "SEARCH-TC-007",
                    "SEARCH-TC-008",
                    "SEARCH-TC-009",
                    "SEARCH-TC-010",
                    "SEARCH-TC-011",
                    "SEARCH-TC-012",
                    "SEARCH-TC-013",
                    "SEARCH-TC-014",
                    "SEARCH-TC-015",
                    "SEARCH-TC-016",
                    "SEARCH-TC-017",
                    "SEARCH-TC-018",
                    "SEARCH-TC-019",
                    "SEARCH-TC-020",
                    "SEARCH-TC-021",
                    "SEARCH-TC-022",
                    "SEARCH-TC-023",
                    "SEARCH-TC-024",
                    "SEARCH-TC-025",
                    "SEARCH-TC-026",
                    "SEARCH-TC-027",
                    "SEARCH-TC-028",
                    "SEARCH-TC-029",
                    "SEARCH-TC-030",
                    "SEARCH-TC-031",
                    "SEARCH-TC-032",
                    "SEARCH-TC-033",
                    "SEARCH-TC-034",
                    "SEARCH-TC-035",
                    "SEARCH-TC-036",
                    "SEARCH-TC-037",
                    "SEARCH-TC-038",
                    "SEARCH-TC-040",
                    "SEARCH-TC-041",
                    "SEARCH-TC-042",
                    "SEARCH-TC-043",
                    "SEARCH-TC-044"
                ]
            },
            {
                id: "navegacion",
                titleKey: "qmTraceNavigationTitle",
                requirement: "RF-07",
                requirementNameKey: "qmTraceNavigationRequirement",
                story: "HU-002",
                storyNameKey: "qmTraceNavigationStory",
                bdd: "BDD-003",
                bddNameKey: "qmTraceNavigationBDD",
                statusKey: "qmTraceNavigationStatus",
                statusType: "implemented",
                verificationKey: "qmTraceNavigationVerification",
                tests: [
                    "TC-006",
                    "TC-007",
                    "TC-019",
                    "TC-020",
                    "NAV-ALL",
                    "LANG-NAV-006"
                ]
            },
            {
                id: "responsive",
                titleKey: "qmTraceResponsiveTitle",
                requirement: "RNF-01",
                requirementNameKey: "qmTraceResponsiveRequirement",
                story: null,
                storyNameKey: "qmTraceNotApplicable",
                bdd: null,
                bddNameKey: "qmTraceNotApplicable",
                statusKey: "qmTraceResponsiveStatus",
                statusType: "partial",
                verificationKey: "qmTraceResponsiveVerification",
                tests: [
                    "docs/test-report.md — Responsive 05/11/2026",
                    "docs/test-report.md — NFR-005 Responsive 16/11/2026"
                ]
            },
            {
                id: "compatibilidad",
                titleKey: "qmTraceCompatibilityTitle",
                requirement: "RNF-02",
                requirementNameKey: "qmTraceCompatibilityRequirement",
                story: null,
                storyNameKey: "qmTraceNotApplicable",
                bdd: null,
                bddNameKey: "qmTraceNotApplicable",
                statusKey: "qmTraceCompatibilityStatus",
                statusType: "partial",
                verificationKey: "qmTraceCompatibilityVerification",
                tests: [
                    "UI-001",
                    "UI-002",
                    "UI-003",
                    "UI-004",
                    "UI-005",
                    "UI-006",
                    "UI-007",
                    "UI-008",
                    "UI-009",
                    "UI-010",
                    "UI-011",
                    "UI-015",
                    "SEARCH-TC-001 a SEARCH-TC-044 (43 casos; sin SEARCH-TC-039)"
                ]
            },
            {
                id: "claridad-errores",
                titleKey: "qmTraceErrorClarityTitle",
                requirement: "RNF-03",
                requirementNameKey: "qmTraceErrorClarityRequirement",
                story: null,
                storyNameKey: "qmTraceNotApplicable",
                bdd: null,
                bddNameKey: "qmTraceNotApplicable",
                statusKey: "qmTraceErrorClarityStatus",
                statusType: "partial",
                verificationKey: "qmTraceErrorClarityVerification",
                tests: [
                    "UI-006",
                    "UI-007",
                    "UI-011",
                    "UI-015",
                    "CT-003",
                    "CT-006"
                ]
            },            
            {
                id: "mantenibilidad",
                titleKey: "qmTraceMaintainabilityTitle",
                requirement: "RNF-04",
                requirementNameKey: "qmTraceMaintainabilityRequirement",
                story: null,
                storyNameKey: "qmTraceNotApplicable",
                bdd: null,
                bddNameKey: "qmTraceNotApplicable",
                statusKey: "qmTraceMaintainabilityStatus",
                statusType: "implemented",
                verificationKey: "qmTraceMaintainabilityVerification",
                tests: [
                    "NFR-004 — Auditoría estructural",
                    "BACKEND-I18N-001",
                    "BACKEND-I18N-002",
                    "BACKEND-I18N-003",
                    "BACKEND-I18N-004",
                    "BACKEND-I18N-005",
                    "QM-I18N — 66 PASS",
                    "FRONTEND-I18N — 15 PASS"
                ]
            },
            {
                id: "accesibilidad",
                titleKey: "qmTraceAccessibilityTitle",
                requirement: "RNF-05",
                requirementNameKey: "qmTraceAccessibilityRequirement",
                story: null,
                storyNameKey: "qmTraceNotApplicable",
                bdd: null,
                bddNameKey: "qmTraceNotApplicable",
                statusKey: "qmTraceAccessibilityStatus",
                statusType: "implemented",
                verificationKey: "qmTraceAccessibilityVerification",
                tests: [
                    "ACCESS-001",
                    "ACCESS-002",
                    "ACCESS-003",
                    "ACCESS-004",
                    "ACCESS-005",
                    "ACCESS-006",
                    "ACCESS-007",
                    "ACCESS-008",
                    "ACCESS-009",
                    "ACCESS-010",
                    "ACCESS-011",
                    "ACCESS-012",
                    "ACCESS-013",
                    "ACCESS-014",
                    "NFR-005-CONTRAST-001",
                    "NFR-005-RESP-001"
                ]
            },
            {
                id: "rendimiento",
                titleKey: "qmTracePerformanceTitle",
                requirement: "RNF-06",
                requirementNameKey: "qmTracePerformanceRequirement",
                story: null,
                storyNameKey: "qmTraceNotApplicable",
                bdd: null,
                bddNameKey: "qmTraceNotApplicable",
                statusKey: "qmTracePerformanceStatus",
                statusType: "pending",
                verificationKey: "qmTracePerformanceVerification",
                tests: []
            },
            {
                id: "consistencia-visual",
                titleKey: "qmTraceVisualConsistencyTitle",
                requirement: "RNF-07",
                requirementNameKey: "qmTraceVisualConsistencyRequirement",
                story: null,
                storyNameKey: "qmTraceNotApplicable",
                bdd: null,
                bddNameKey: "qmTraceNotApplicable",
                statusKey: "qmTraceVisualConsistencyStatus",
                statusType: "pending",
                verificationKey: "qmTraceVisualConsistencyVerification",
                tests: []
            },
            {
                id: "usabilidad",
                titleKey: "qmTraceUsabilityTitle",
                requirement: "RNF-08",
                requirementNameKey: "qmTraceUsabilityRequirement",
                story: null,
                storyNameKey: "qmTraceNotApplicable",
                bdd: null,
                bddNameKey: "qmTraceNotApplicable",
                statusKey: "qmTraceUsabilityStatus",
                statusType: "pending",
                verificationKey: "qmTraceUsabilityVerification",
                tests: []
            },
        ];

        const qmTraceButtons = document.querySelectorAll(
            ".qm-trace-button"
        );

        const qmTraceTitle = document.getElementById(
            "qm-trace-title"
        );

        const qmTraceStatus = document.getElementById(
            "qm-trace-status"
        );

        const qmTraceRequirement = document.getElementById(
            "qm-trace-requirement"
        );

        const qmTraceRequirementName = document.getElementById(
            "qm-trace-requirement-name"
        );

        const qmTraceStory = document.getElementById(
            "qm-trace-story"
        );

        const qmTraceStoryName = document.getElementById(
            "qm-trace-story-name"
        );

        const qmTraceBdd = document.getElementById(
            "qm-trace-bdd"
        );

        const qmTraceBddName = document.getElementById(
            "qm-trace-bdd-name"
        );

        const qmTraceVerificationText = document.getElementById(
            "qm-trace-verification-text"
        );

        const qmTraceTestList = document.getElementById(
            "qm-trace-test-list"
        );

        const qmTraceTableBody = document.getElementById(
            "qm-trace-table-body"
        );

        // Mostrar el recorrido seleccionado.
        function qmShowTrace(id) {
            const trace = qmTraceData.find(
                item => item.id === id
            );

            if (!trace) return;

            qmTraceTitle.textContent = trace.titleKey
                ? qmTranslate(trace.titleKey, trace.title || "")
                : trace.title;

            qmTraceStatus.textContent = trace.statusKey
                ? qmTranslate(trace.statusKey, trace.status || "")
                : trace.status;

            qmTraceStatus.dataset.status = trace.statusType;

            qmTraceRequirement.textContent = trace.requirementKey
                ? qmTranslate(trace.requirementKey, trace.requirement || "")
                : trace.requirement;

            qmTraceRequirementName.textContent = trace.requirementNameKey
                ? qmTranslate(trace.requirementNameKey, trace.requirementName || "")
                : trace.requirementName;
            
            // Historia de usuario: no aplica a RNF-05.
            qmTraceStory.textContent = trace.story ||
                qmTranslate("qmTraceNotApplicable");

            qmTraceStoryName.textContent = trace.story
                ? (
                    trace.storyNameKey
                        ? qmTranslate(trace.storyNameKey, trace.storyName || "")
                        : trace.storyName || ""
                )
                : qmTranslate("qmTraceQualityAttribute");

            // Escenario BDD: no aplica a RNF-05.
            qmTraceBdd.textContent = trace.bdd ||
                qmTranslate("qmTraceNotApplicable");

            qmTraceBddName.textContent = trace.bdd
                ? (
                    trace.bddNameKey
                        ? qmTranslate(trace.bddNameKey, trace.bddName || "")
                        : trace.bddName || ""
                )
                : qmTranslate("qmTraceDirectVerification");

            qmTraceVerificationText.textContent = trace.verificationKey
                ? qmTranslate(trace.verificationKey, trace.verification || "")
                : trace.verification;

            // Limpiar las verificaciones anteriores.
            qmTraceTestList.replaceChildren();

            trace.tests.forEach(testId => {
                const item = document.createElement("span");

                item.className = "qm-trace-test-item";
                item.textContent = testId;

                qmTraceTestList.appendChild(item);
            });

            // Actualizar el botón activo.
            qmTraceButtons.forEach(button => {
                button.setAttribute(
                    "aria-pressed",
                    String(button.dataset.trace === trace.id)
                );
            });
        }

        // Generar la matriz documental.
        function qmBuildTraceTable() {
            qmTraceTableBody.replaceChildren();

            qmTraceData.forEach(trace => {
                const row = document.createElement("tr");

                const values = [
                    trace.requirementKey
                        ? qmTranslate(trace.requirementKey, trace.requirement || "")
                        : trace.requirement,
                    trace.story || qmTranslate("qmTraceNotApplicable"),
                    trace.bdd || qmTranslate("qmTraceNotApplicable"),                                    
                    trace.tests.length
                        ? trace.tests.join(", ")
                        : qmTranslate(
                            trace.id === "rendimiento"
                                ? "qmTracePendingEvidence"
                                : trace.id === "consistencia-visual"
                                    ? "qmTracePendingAudit"
                                    : trace.id === "usabilidad"
                                        ? "qmTracePendingUsability"
                                        : "qmTracePartialVerification"
                        )

                ];

                values.forEach(value => {
                    const cell = document.createElement("td");

                    cell.textContent = value;
                    row.appendChild(cell);
                });

                const statusCell = document.createElement("td");
                const status = document.createElement("span");

                status.className = "qm-trace-table-status";
                status.dataset.status = trace.statusType;
                status.textContent = trace.statusKey
                    ? qmTranslate(trace.statusKey, trace.status || "")
                    : trace.status;

                statusCell.appendChild(status);
                row.appendChild(statusCell);

                qmTraceTableBody.appendChild(row);
            });
        }

        // Activar los botones.
        qmTraceButtons.forEach(button => {
            button.addEventListener("click", () => {
                qmShowTrace(button.dataset.trace);
            });
        });

        // Inicialización.
        qmBuildTraceTable();
        qmShowTrace("registro");

        // Actualizar la trazabilidad al cambiar de idioma.
        document.addEventListener("portfolio:languagechange", () => {

            // Conservar la relación seleccionada.
            const activeButton = Array.from(qmTraceButtons).find(
                button => button.getAttribute("aria-pressed") === "true"
            );

            const selectedTrace = activeButton
                ? activeButton.dataset.trace
                : "registro";

            // Reconstruir la tabla con los textos traducidos.
            qmBuildTraceTable();

            // Actualizar el detalle sin perder la selección.
            qmShowTrace(selectedTrace);

        });