// =========================================
        // QUALITY MANAGEMENT — ESCENARIOS BDD
        // =========================================

        const qmBddScenarios = [
            {
                id: "BDD-001",

                titleKey: "qmBDD001Title",

                story: "HU-001",

                statusKey: "qmBDD001Status",

                statusType: "implemented",

                givenKey: "qmBDD001Given",

                whenKey: "qmBDD001When",

                thenKey: "qmBDD001Then"
            },
            {
                id: "BDD-002",

                titleKey: "qmBDD002Title",

                story: "HU-001",

                statusKey: "qmBDD002Status",

                statusType: "implemented",

                givenKey: "qmBDD002Given",

                whenKey: "qmBDD002When",

                thenKey: "qmBDD002Then"
            },
            {
                id: "BDD-003",

                titleKey: "qmBDD003Title",

                story: "HU-002",

                statusKey: "qmBDD003Status",

                statusType: "implemented",

                givenKey: "qmBDD003Given",

                whenKey: "qmBDD003When",

                thenKey: "qmBDD003Then"
            },
            {
                id: "BDD-004",

                titleKey: "qmBDD004Title",

                story: "HU-003",

                statusKey: "qmBDD004Status",

                statusType: "implemented",

                givenKey: "qmBDD004Given",

                whenKey: "qmBDD004When",

                thenKey: "qmBDD004Then"
            },
            {
                id: "BDD-005",

                titleKey: "qmBDD005Title",

                story: "HU-004",

                statusKey: "qmBDD005Status",

                statusType: "implemented",

                givenKey: "qmBDD005Given",

                whenKey: "qmBDD005When",

                thenKey: "qmBDD005Then"
            },
            {
                id: "BDD-006",

                titleKey: "qmBDD006Title",

                story: "HU-005",

                statusKey: "qmBDD006Status",

                statusType: "implemented",

                givenKey: "qmBDD006Given",

                whenKey: "qmBDD006When",

                thenKey: "qmBDD006Then"
            }
        ];

        const qmBddButtons = document.querySelectorAll(
            ".qm-bdd-button"
        );

        const qmBddDetailCode = document.getElementById(
            "qm-bdd-detail-code"
        );

        const qmBddDetailTitle = document.getElementById(
            "qm-bdd-detail-title"
        );

        const qmBddStatus = document.getElementById(
            "qm-bdd-status"
        );

        const qmBddGiven = document.getElementById(
            "qm-bdd-given"
        );

        const qmBddWhen = document.getElementById(
            "qm-bdd-when"
        );

        const qmBddThen = document.getElementById(
            "qm-bdd-then"
        );

        const qmBddStory = document.getElementById(
            "qm-bdd-story"
        );

        // Mostrar escenario seleccionado.
        function qmShowBddScenario(id) {
            const scenario = qmBddScenarios.find(
                item => item.id === id
            );

            if (!scenario) return;

            qmBddDetailCode.textContent = scenario.id;

            qmBddDetailTitle.textContent = scenario.titleKey
                ? qmTranslate(scenario.titleKey, scenario.title || "")
                : scenario.title;

            qmBddStatus.textContent = scenario.statusKey
                ? qmTranslate(scenario.statusKey, scenario.status || "")
                : scenario.status;

            qmBddStatus.dataset.status = scenario.statusType;

            qmBddGiven.textContent = scenario.givenKey
                ? qmTranslate(scenario.givenKey, scenario.given || "")
                : scenario.given;

            qmBddWhen.textContent = scenario.whenKey
                ? qmTranslate(scenario.whenKey, scenario.when || "")
                : scenario.when;

            qmBddThen.textContent = scenario.thenKey
                ? qmTranslate(scenario.thenKey, scenario.then || "")
                : scenario.then;

            qmBddStory.textContent = scenario.story;

            // Destacar el escenario seleccionado.
            qmBddButtons.forEach(button => {
                button.setAttribute(
                    "aria-pressed",
                    String(button.dataset.bdd === scenario.id)
                );
            });
        }

        // Eventos de selección.
        qmBddButtons.forEach(button => {
            button.addEventListener("click", () => {
                qmShowBddScenario(button.dataset.bdd);
            });
        });

        // Escenario inicial.
        qmShowBddScenario("BDD-001");
        // Actualizar el escenario BDD seleccionado al cambiar de idioma.
        document.addEventListener("portfolio:languagechange", () => {

            const activeButton = Array.from(qmBddButtons).find(
                button => button.getAttribute("aria-pressed") === "true"
            );

            const selectedBdd = activeButton
                ? activeButton.dataset.bdd
                : "BDD-001";

            qmShowBddScenario(selectedBdd);
        });