
            // Laboratorio interactivo — Estructura HTML
            (() => {
                const lab = document.getElementById("html-lab");

                if (!lab) return;
                
                const elements = {
                    accessPage: {
                        title: "Pantalla de acceso",
                        description:
                            "Página de acceso con dos opciones: ingreso como invitado " +
                            "o registro de visitante. El formulario de registro " +
                            "permanece inicialmente oculto.",
                        code: '<main id="accessPage">',
                        tree:
                            '<main id="accessPage">  ← SELECCIONADO\n' +
                            '  ├── <article data-access-target="guestAccessButton">\n' +
                            '  │     └── <button id="guestAccessButton">\n' +
                            '  ├── <article data-access-target="registeredAccessButton">\n' +
                            '  │     └── <button id="registeredAccessButton">\n' +
                            '  └── <form id="accessForm" hidden>'
                    },

                    accessForm: {
                        title: "Formulario de registro",
                        description:
                            "Formulario de visitantes registrados, inicialmente oculto. " +
                            "Contiene los datos personales, el consentimiento " +
                            "y las validaciones necesarias antes del registro.",
                        code: '<form id="accessForm" novalidate hidden>',
                        tree:
                            '<main id="accessPage">\n' +
                            '  └── <form id="accessForm" hidden>  ← SELECCIONADO\n' +
                            '        ├── Nombre y apellido\n' +
                            '        ├── Correo electrónico\n' +
                            '        ├── Teléfono\n' +
                            '        └── Consentimiento'
                    },

                    portfolio: {
                        title: "Contenido del portfolio",
                        description:
                            "Página principal home.html, separada de index.html. " +
                            "Presenta las secciones profesionales después de " +
                            "establecer una sesión válida.",
                        code: '<main id="main-content">',
                        tree:
                            '<main id="main-content">  ← SELECCIONADO\n' +
                            '  ├── <section id="home">\n' +
                            '  ├── <section id="about">\n' +
                            '  ├── <section id="specialties">\n' +
                            '  ├── <section id="qa">\n' +
                            '  ├── <section id="ai">\n' +
                            '  ├── <section id="projects">\n' +
                            '  └── <section id="contact">'
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
                        "SELECCIONADO": "frontHtmlTreeSelected",

                        "Nombre y apellido": "frontHtmlTreeFullName",
                        "Correo electrónico": "frontHtmlTreeEmail",
                        "Teléfono": "frontHtmlTreePhone",
                        "Consentimiento": "frontHtmlTreeConsent",

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
                
                let activeElement = "accessPage";

                // Selección de elementos HTML.
                tabs.forEach(tab => {
                    tab.addEventListener("click", () => {
                        activeElement = tab.dataset.htmlElement;
                        showElement(activeElement);
                    });
                });

                // Actualización al cambiar el idioma global.
                document.addEventListener("portfolio:languagechange", () => {
                    showElement(activeElement);
                });

                // Estado inicial.
                showElement(activeElement);

            })();

        