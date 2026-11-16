// =========================================
        // QUALITY MANAGEMENT — HISTORIAS DE USUARIO
        // =========================================

        const qmStories = [
            {
                id: "HU-001",

                titleKey: "qmHU001Title",

                statusKey: "qmHU001Status",

                statusType: "implemented",

                descriptionKey: "qmHU001Description",

                applicationKey: "qmHU001Application",

                criteriaKeys: [
                    "qmHU001Criterion01",
                    "qmHU001Criterion02",
                    "qmHU001Criterion03",
                    "qmHU001Criterion04",
                    "qmHU001Criterion05",
                    "qmHU001Criterion06"
                ]
            },
            {
                id: "HU-002",

                titleKey: "qmHU002Title",

                statusKey: "qmHU002Status",

                statusType: "implemented",

                descriptionKey: "qmHU002Description",

                applicationKey: "qmHU002Application",

                criteriaKeys: [
                    "qmHU002Criterion01",
                    "qmHU002Criterion02",
                    "qmHU002Criterion03",
                    "qmHU002Criterion04",
                    "qmHU002Criterion05"
                ]
            },
            {
                id: "HU-003",

                titleKey: "qmHU003Title",

                statusKey: "qmHU003Status",

                statusType: "implemented",

                descriptionKey: "qmHU003Description",

                applicationKey: "qmHU003Application",

                criteriaKeys: [
                    "qmHU003Criterion01",
                    "qmHU003Criterion02",
                    "qmHU003Criterion03",
                    "qmHU003Criterion04",
                    "qmHU003Criterion05"
                ]
            },
            {
                id: "HU-004",

                titleKey: "qmHU004Title",

                statusKey: "qmHU004Status",

                statusType: "implemented",

                descriptionKey: "qmHU004Description",

                applicationKey: "qmHU004Application",

                criteriaKeys: [
                    "qmHU004Criterion01",
                    "qmHU004Criterion02",
                    "qmHU004Criterion03",
                    "qmHU004Criterion04",
                    "qmHU004Criterion05"
                ]
            },
            {
                id: "HU-005",

                titleKey: "qmHU005Title",

                statusKey: "qmHU005Status",

                statusType: "implemented",

                descriptionKey: "qmHU005Description",

                applicationKey: "qmHU005Application",

                criteriaKeys: [
                    "qmHU005Criterion01",
                    "qmHU005Criterion02",
                    "qmHU005Criterion03",
                    "qmHU005Criterion04",
                    "qmHU005Criterion05",
                    "qmHU005Criterion06",
                    "qmHU005Criterion07"
                ]
            }
        ];

        const qmStoryButtons = document.querySelectorAll(
            ".qm-story-step"
        );

        const qmStoryDetailCode = document.getElementById(
            "qm-story-detail-code"
        );

        const qmStoryDetailTitle = document.getElementById(
            "qm-story-detail-title"
        );

        const qmStoryStatus = document.getElementById(
            "qm-story-status"
        );

        const qmStoryDescription = document.getElementById(
            "qm-story-description"
        );

        const qmStoryApplication = document.getElementById(
            "qm-story-application"
        );

        const qmStoryCriteriaList = document.getElementById(
            "qm-story-criteria-list"
        );

        const qmStoryPrev = document.getElementById(
            "qm-story-prev"
        );

        const qmStoryNext = document.getElementById(
            "qm-story-next"
        );

        const qmStoryCounter = document.getElementById(
            "qm-story-counter"
        );

        let qmCurrentStoryIndex = 0;

        // Mostrar la historia seleccionada.
        function qmShowStory(index) {
            if (index < 0 || index >= qmStories.length) return;

            qmCurrentStoryIndex = index;

            const story = qmStories[index];

            qmStoryDetailCode.textContent = story.id;

            qmStoryDetailTitle.textContent = story.titleKey
                ? qmTranslate(story.titleKey, story.title || "")
                : story.title;

            qmStoryStatus.textContent = story.statusKey
                ? qmTranslate(story.statusKey, story.status || "")
                : story.status;

            qmStoryStatus.dataset.status = story.statusType;

            qmStoryDescription.textContent = story.descriptionKey
                ? qmTranslate(story.descriptionKey, story.description || "")
                : story.description;

            qmStoryApplication.textContent = story.applicationKey
                ? qmTranslate(story.applicationKey, story.application || "")
                : story.application;

            // Actualizar criterios de aceptación.
            qmStoryCriteriaList.replaceChildren();

            const criteriaTexts = story.criteriaKeys
                ? story.criteriaKeys.map(key => qmTranslate(key))
                : story.criteria || [];

            criteriaTexts.forEach(criterion => {
                const item = document.createElement("li");
                item.textContent = criterion;
                qmStoryCriteriaList.appendChild(item);
            });

            // Destacar la historia activa.
            qmStoryButtons.forEach(button => {
                button.setAttribute(
                    "aria-pressed",
                    String(button.dataset.story === story.id)
                );
            });

            // Actualizar navegación.

            const counterSeparator = qmTranslate("qmStoryCounterSeparator");

            qmStoryCounter.textContent =
                `${index + 1} ${counterSeparator} ${qmStories.length}`;


            qmStoryPrev.disabled = index === 0;
            qmStoryNext.disabled =
                index === qmStories.length - 1;
        }

        // Selección directa.
        qmStoryButtons.forEach(button => {
            button.addEventListener("click", () => {
                const index = qmStories.findIndex(
                    story => story.id === button.dataset.story
                );

                qmShowStory(index);
            });
        });

        // Navegación anterior.
        qmStoryPrev.addEventListener("click", () => {
            qmShowStory(qmCurrentStoryIndex - 1);
        });

        // Navegación siguiente.
        qmStoryNext.addEventListener("click", () => {
            qmShowStory(qmCurrentStoryIndex + 1);
        });

        // Estado inicial.
        qmShowStory(0);
        // Actualizar la historia seleccionada al cambiar de idioma.
        document.addEventListener("portfolio:languagechange", () => {
            qmShowStory(qmCurrentStoryIndex);
        });