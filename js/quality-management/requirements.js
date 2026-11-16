// =========================================
        // QUALITY MANAGEMENT — EXPLORADOR REQUISITOS
        // =========================================
        
        const qmRequirements = {
            RF: [
                {
                    code: "RF-01",

                    nameKey: "qmRF01Name",

                    descriptionKey: "qmRF01Description",

                    applicationKeys: [
                        "qmRF01Application01",
                        "qmRF01Application02",
                        "qmRF01Application03"
                    ]
                },
                {
                    code: "RF-02",

                    nameKey: "qmRF02Name",

                    descriptionKey: "qmRF02Description",

                    applicationKeys: [
                        "qmRF02Application01",
                        "qmRF02Application02",
                        "qmRF02Application03"
                    ]
                },
                {
                    code: "RF-03",

                    nameKey: "qmRF03Name",

                    descriptionKey: "qmRF03Description",

                    applicationKeys: [
                        "qmRF03Application01",
                        "qmRF03Application02",
                        "qmRF03Application03"
                    ]
                },
                {
                    code: "RF-04",

                    nameKey: "qmRF04Name",

                    descriptionKey: "qmRF04Description",

                    applicationKeys: [
                        "qmRF04Application01",
                        "qmRF04Application02",
                        "qmRF04Application03"
                    ]
                },
                {
                    code: "RF-05",

                    nameKey: "qmRF05Name",

                    descriptionKey: "qmRF05Description",

                    applicationKeys: [
                        "qmRF05Application01",
                        "qmRF05Application02",
                        "qmRF05Application03",
                        "qmRF05Application04",
                        "qmRF05Application05"
                    ],

                    statusKey: "qmRF05Status"
                },
                {
                    code: "RF-06",

                    nameKey: "qmRF06Name",

                    descriptionKey: "qmRF06Description",

                    applicationKeys: [
                        "qmRF06Application01",
                        "qmRF06Application02",
                        "qmRF06Application03",
                        "qmRF06Application04",
                        "qmRF06Application05",
                        "qmRF06Application06",
                        "qmRF06Application07"
                    ],

                    statusKey: "qmRF06Status"
                },
                {
                    code: "RF-07",

                    nameKey: "qmRF07Name",

                    descriptionKey: "qmRF07Description",

                    applicationKeys: [
                        "qmRF07Application01",
                        "qmRF07Application02",
                        "qmRF07Application03"
                    ]
                }
                ],

            RNF: [
                {
                    code: "RNF-01",

                    nameKey: "qmRNF01Name",

                    descriptionKey: "qmRNF01Description",

                    applicationKeys: [
                        "qmRNF01Application01",
                        "qmRNF01Application02",
                        "qmRNF01Application03"
                    ]
                },
                {
                    code: "RNF-02",

                    nameKey: "qmRNF02Name",

                    descriptionKey: "qmRNF02Description",

                    applicationKeys: [
                        "qmRNF02Application01",
                        "qmRNF02Application02",
                        "qmRNF02Application03"
                    ]
                },
                {
                    code: "RNF-03",

                    nameKey: "qmRNF03Name",

                    descriptionKey: "qmRNF03Description",

                    applicationKeys: [
                        "qmRNF03Application01",
                        "qmRNF03Application02",
                        "qmRNF03Application03"
                    ]
                },                
                {
                    code: "RNF-04",

                    nameKey: "qmRNF04Name",

                    descriptionKey: "qmRNF04Description",

                    applicationKeys: [
                        "qmRNF04Application01",
                        "qmRNF04Application02",
                        "qmRNF04Application03"
                    ]
                },
                {
                    code: "RNF-05",

                    nameKey: "qmRNF05Name",

                    descriptionKey: "qmRNF05Description",

                    applicationKeys: [
                        "qmRNF05Application01",
                        "qmRNF05Application02",
                        "qmRNF05Application03",
                        "qmRNF05Application04"
                    ],

                    statusKey: "qmRNF05Status"
                },
                {
                    code: "RNF-06",

                    nameKey: "qmRNF06Name",

                    descriptionKey: "qmRNF06Description",

                    applicationKeys: [
                        "qmRNF06Application01",
                        "qmRNF06Application02",
                        "qmRNF06Application03",
                        "qmRNF06Application04"
                    ],

                    statusKey: "qmRNF06Status"
                },
                {
                    code: "RNF-07",

                    nameKey: "qmRNF07Name",

                    descriptionKey: "qmRNF07Description",

                    applicationKeys: [
                        "qmRNF07Application01",
                        "qmRNF07Application02",
                        "qmRNF07Application03",
                        "qmRNF07Application04"
                    ],

                    statusKey: "qmRNF07Status"
                },
                {
                    code: "RNF-08",

                    nameKey: "qmRNF08Name",

                    descriptionKey: "qmRNF08Description",

                    applicationKeys: [
                        "qmRNF08Application01",
                        "qmRNF08Application02",
                        "qmRNF08Application03",
                        "qmRNF08Application04"
                    ],

                    statusKey: "qmRNF08Status"
                }

            ]
            
        };


        const qmRequirementTabs = document.querySelectorAll(
            ".qm-requirement-tab"
        );

        const qmRequirementExplorer = document.getElementById(
            "qm-requirement-explorer"
        );

        const qmRequirementLists = {
            RF: document.getElementById(
                "qm-requirement-list-rf"
            ),
            RNF: document.getElementById(
                "qm-requirement-list-rnf"
            )
        };

        const qmRequirementDetails = {
            RF: document.getElementById(
                "qm-requirement-detail-rf"
            ),
            RNF: document.getElementById(
                "qm-requirement-detail-rnf"
            )
        };

        let qmCurrentRequirementType = "RF";
        let qmCurrentRequirementIndex = 0;

        // Mostrar el detalle de un requisito.
        function qmShowRequirement(type, index) {
            const requirement = qmRequirements[type]?.[index];

            if (!requirement) return;

            // Conservar el requisito seleccionado.
            qmCurrentRequirementType = type;
            qmCurrentRequirementIndex = index;

            const list = qmRequirementLists[type];
            const detail = qmRequirementDetails[type];

            list.querySelectorAll(
                ".qm-requirement-item"
            ).forEach((button, buttonIndex) => {
                button.setAttribute(
                    "aria-pressed",
                    String(buttonIndex === index)
                );
            });

            const category = document.createElement("span");
            category.className = "qm-card-category";
            category.textContent = qmTranslate(
                type === "RF"
                    ? "qmRequirementCategoryRF"
                    : "qmRequirementCategoryRNF"
            );

            const title = document.createElement("h3");
            title.textContent = requirement.nameKey
                ? qmTranslate(requirement.nameKey, requirement.name || "")
                : requirement.name;

            const description = document.createElement("p");
            description.textContent = requirement.descriptionKey
                ? qmTranslate(requirement.descriptionKey, requirement.description || "")
                : requirement.description;

            const subtitle = document.createElement("h4");
            subtitle.textContent = qmTranslate("qmRequirementApplicationTitle");

            const applications = document.createElement("ul");

            const applicationTexts = requirement.applicationKeys
                ? requirement.applicationKeys.map(key => qmTranslate(key))
                : requirement.application || [];

            applicationTexts.forEach(text => {
                const item = document.createElement("li");
                item.textContent = text;
                applications.appendChild(item);
            });

            detail.replaceChildren(
                category,
                title,
                description,
                subtitle,
                applications
            );

            if (requirement.status || requirement.statusKey) {
            const status = document.createElement("p");
            status.className = "qm-requirement-status";

            const label = document.createElement("strong");
            label.textContent = qmTranslate("qmRequirementStatusLabel");

            const statusText = requirement.statusKey
                ? qmTranslate(
                    requirement.statusKey,
                    requirement.status || ""
                )
                : requirement.status;

            status.append(
                label,
                document.createTextNode(" " + statusText)
            );

            detail.appendChild(status);
        }

        }

        // Construir el listado de una categoría.
        function qmBuildRequirementList(type) {
            const list = qmRequirementLists[type];

            list.replaceChildren();

            qmRequirements[type].forEach((requirement, index) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "qm-requirement-item";
                button.setAttribute("aria-pressed", "false");

                const code = document.createElement("span");
                code.className = "qm-requirement-item-code";
                code.textContent = requirement.code;

                const name = document.createElement("span");
                name.className = "qm-requirement-item-name";

                name.textContent = requirement.nameKey
                    ? qmTranslate(requirement.nameKey, requirement.name || "")
                    : requirement.name;

                button.append(code, name);

                button.addEventListener("click", () => {
                    qmShowRequirement(type, index);
                });

                list.appendChild(button);
            });
        }

        // Cambiar entre RF y RNF.
        function qmShowRequirementType(type) {
            if (!qmRequirements[type]) return;

            qmCurrentRequirementType = type;

            qmRequirementExplorer.dataset.activeType = type;

            qmRequirementTabs.forEach(button => {
                button.setAttribute(
                    "aria-pressed",
                    String(
                        button.dataset.requirementType === type
                    )
                );
            });

            qmRequirementLists.RF.hidden = type !== "RF";
            qmRequirementDetails.RF.hidden = type !== "RF";

            qmRequirementLists.RNF.hidden = type !== "RNF";
            qmRequirementDetails.RNF.hidden = type !== "RNF";

            // Seleccionar el primer requisito de la categoría.
            qmShowRequirement(type, 0);
        }

        // Inicialización.
        qmBuildRequirementList("RF");
        qmBuildRequirementList("RNF");

        qmRequirementTabs.forEach(button => {
            button.addEventListener("click", () => {
                qmShowRequirementType(
                    button.dataset.requirementType
                );
            });
        });

        qmShowRequirementType("RF");
        // Actualizar el explorador al cambiar de idioma.
        document.addEventListener("portfolio:languagechange", () => {

            // Reconstruir los listados con los títulos traducidos.
            qmBuildRequirementList("RF");
            qmBuildRequirementList("RNF");

            // Restaurar el mismo requisito y categoría.
            qmShowRequirement(
                qmCurrentRequirementType,
                qmCurrentRequirementIndex
            );

        });