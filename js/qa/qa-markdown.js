document.addEventListener("DOMContentLoaded", function () {
            const dialog = document.getElementById("qaMarkdownDialog");
            const content = document.getElementById("qaMarkdownContent");
            const closeButton = document.getElementById("qaMarkdownClose");

            if (!dialog || !content || !closeButton) return;

            let activeController = null;

            document.querySelectorAll(".qa-markdown-link").forEach(function (link) {
                link.addEventListener("click", async function (event) {
                    event.preventDefault();

                    if (activeController) {
                        activeController.abort();
                    }

                    activeController = new AbortController();

                    const url = link.getAttribute("href");

                    content.replaceChildren();

                    // Mantener el texto visible en el idioma seleccionado.
                    const language = localStorage.getItem("portfolioLanguage") || "es";

                    const messages = {
                        es: {
                            loading: "Cargando documento...",
                            error: "No se pudo cargar el documento."
                        },
                        en: {
                            loading: "Loading document...",
                            error: "Could not load the document."
                        },
                        pt: {
                            loading: "Carregando documento...",
                            error: "Não foi possível carregar o documento."
                        }
                    };

                    const message = messages[language] || messages.es;

                    content.textContent = message.loading;

                    if (!dialog.open) {
                        dialog.showModal();
                    }

                    try {
                        const response = await fetch(url, {
                            signal: activeController.signal
                        });

                        if (!response.ok) {
                            throw new Error("HTTP " + response.status);
                        }

                        const markdown = await response.text();

                        if (typeof marked === "undefined" ||
                            typeof DOMPurify === "undefined") {
                            throw new Error("Bibliotecas Markdown no disponibles");
                        }

                        const html = await marked.parse(markdown);

                        content.innerHTML = DOMPurify.sanitize(html);

                        content.scrollTop = 0;

                    } catch (error) {
                        if (error.name === "AbortError") return;

                        console.error("Error al cargar documento QA:", error);
                        content.textContent = message.error;
                    }
                });
            });
            
            /* NFR-005 — Apertura accesible del visor Markdown con Espacio */
            document.querySelectorAll(".qa-markdown-link").forEach(function (link) {
                link.addEventListener("keydown", function (event) {
                    if (event.code !== "Space" && event.key !== " ") {
                        return;
                    }

                    // Evitar que Espacio desplace la página.
                    event.preventDefault();

                    // Reutilizar el controlador de clic existente.
                    link.click();
                });
            });


            closeButton.addEventListener("click", function () {
                dialog.close();
            });

            dialog.addEventListener("close", function () {
                if (activeController) {
                    activeController.abort();
                    activeController = null;
                }
            });
        });
