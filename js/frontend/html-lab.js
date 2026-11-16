
            // Laboratorio interactivo — Estructura HTML
            (() => {
                const lab = document.getElementById("html-lab");

                if (!lab) return;

                const elements = {
                    accessPage: {
                        title: "Pantalla de acceso",
                        description:
                            "Contenedor principal de la pantalla de acceso. " +
                            "Agrupa el formulario que permite ingresar al portfolio.",
                        code: '<main id="accessPage" class="access-page">',
                        tree:
                            '<main id="accessPage">\n' +
                            '  └── <form id="accessForm">\n' +
                            '        └── Campos de registro'
                    },

                    accessForm: {
                        title: "Formulario de acceso",
                        description:
                            "Agrupa los campos de registro y permite ejecutar " +
                            "las validaciones antes de procesar la información.",
                        code: '<form id="accessForm" novalidate>',
                        tree:
                            '<main id="accessPage">\n' +
                            '  └── <form id="accessForm">  ← SELECCIONADO\n' +
                            '        └── Campos de registro'
                    },

                    portfolio: {
                        title: "Contenido del portfolio",
                        description:
                            "Contenedor del portfolio profesional. " +
                            "Se presenta después de completar correctamente " +
                            "el proceso de acceso.",
                        code: '<div id="portfolio" class="portfolio hidden">',
                        tree:
                            '<div id="portfolio">  ← SELECCIONADO\n' +
                            '  ├── Sobre mí\n' +
                            '  ├── Especialidades\n' +
                            '  ├── Proyectos\n' +
                            '  └── Contacto'
                    }
                };

                const tabs = lab.querySelectorAll("[data-html-element]");
                const title = document.getElementById("html-lab-title");
                const description = document.getElementById("html-lab-description");
                const code = document.getElementById("html-lab-code");
                const tree = document.getElementById("html-lab-tree");

                function showElement(key) {
                    const element = elements[key];

                    if (!element) return;

                    const htmlKeys = {
                        accessPage: ["frontHtmlAccessTitle", "frontHtmlAccessDesc"],
                        accessForm: ["frontHtmlFormTitle", "frontHtmlFormDesc"],
                        portfolio: ["frontHtmlPortfolioTitle", "frontHtmlPortfolioDesc"]
                    };
                    title.textContent = frontTr(htmlKeys[key][0], element.title);
                    description.textContent = frontTr(htmlKeys[key][1], element.description);
                    code.textContent = element.code;
                    tree.replaceChildren();

                    const fragment = document.createDocumentFragment();
                    const treeWords = {
                        "Campos de registro": "frontHtmlTreeFields",
                        "SELECCIONADO": "frontHtmlTreeSelected",
                        "Sobre mí": "frontHtmlTreeAbout",
                        "Especialidades": "frontHtmlTreeSpecialties",
                        "Proyectos": "frontHtmlTreeProjects",
                        "Contacto": "frontHtmlTreeContact"
                    };
                    let translatedTree = element.tree;
                    Object.entries(treeWords).forEach(([word, translationKey]) => {
                        translatedTree = translatedTree.replaceAll(word, frontTr(translationKey, word));
                    });
                    const lines = translatedTree.split("\n");

                    lines.forEach((line, index) => {
                        const lineElement = document.createElement("div");
                        lineElement.className = "html-tree-line";

                        if (line.includes("← " + frontTr("frontHtmlTreeSelected", "SELECCIONADO"))) {
                            lineElement.classList.add("selected");
                        }

                        const parts = line.split(/(<[^>]+>)/g);

                        parts.forEach(part => {
                            if (!part) return;

                            const span = document.createElement("span");

                            if (part.startsWith("<") && part.endsWith(">")) {
                                span.className = "html-tree-tag";
                            } else {
                                span.className = "html-tree-text";
                            }

                            span.textContent = part;
                            lineElement.appendChild(span);
                        });

                        fragment.appendChild(lineElement);
                    });

                    tree.appendChild(fragment);

                    tabs.forEach(tab => {
                        const active = tab.dataset.htmlElement === key;

                        tab.classList.toggle("active", active);
                        tab.setAttribute("aria-pressed", String(active));
                    });
                }

                tabs.forEach(tab => {
                    tab.addEventListener("click", () => {
                        showElement(tab.dataset.htmlElement);
                    });
                });

                showElement("accessPage");
            })();

        