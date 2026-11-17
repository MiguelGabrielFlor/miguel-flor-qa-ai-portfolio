
/* =====================================================
   INTERNACIONALIZACIÓN — PÁGINAS INTERNAS
===================================================== */

(function () {
    "use strict";

    const idiomasDisponibles = ["es", "en", "pt"];
    let idiomaAplicado = "es";
    let solicitudActual = 0;

    function obtenerIdioma() {
        const idiomaGuardado = localStorage.getItem("portfolioLanguage");

        return idiomasDisponibles.includes(idiomaGuardado)
            ? idiomaGuardado
            : "es";
    }

    function aplicarIdiomaPagina(idioma) {
        const diccionario = window.portfolioTranslations?.[idioma];

        if (!diccionario) {
            console.warn("No se encontró el diccionario:", idioma);
            return false;
        }

        document.documentElement.lang = idioma;

        document.querySelectorAll("[data-i18n]").forEach(elemento => {
            const clave = elemento.dataset.i18n;
            const traduccion = diccionario[clave];

            if (typeof traduccion === "string") {
                elemento.textContent = traduccion;
            }
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach(elemento => {
            const clave = elemento.dataset.i18nPlaceholder;
            const traduccion = diccionario[clave];

            if (typeof traduccion === "string") {
                elemento.setAttribute("placeholder", traduccion);
            }
        });

        document.querySelectorAll("[data-i18n-aria-label]").forEach(elemento => {
            const clave = elemento.dataset.i18nAriaLabel;
            const traduccion = diccionario[clave];

            if (typeof traduccion === "string") {
                elemento.setAttribute("aria-label", traduccion);
            }
        });

        document.querySelectorAll("[data-i18n-content]").forEach(elemento => {
            const clave = elemento.dataset.i18nContent;
            const traduccion = diccionario[clave];

            if (typeof traduccion === "string") {
                elemento.setAttribute("content", traduccion);
            }
        });

        idiomaAplicado = idioma;
        return true;
    }

    async function seleccionarIdioma(idioma, selectorIdioma) {
        if (!idiomasDisponibles.includes(idioma)) {
            return;
        }

        const solicitud = ++solicitudActual;

        if (selectorIdioma) {
            selectorIdioma.disabled = true;
        }

        try {
            await window.loadPortfolioLanguage(idioma);

            // Evitar que una solicitud anterior sobrescriba
            // el idioma seleccionado más recientemente.
            if (solicitud !== solicitudActual) {
                return;
            }

            if (!aplicarIdiomaPagina(idioma)) {
                throw new Error(`No se pudo aplicar el idioma: ${idioma}`);
            }

            localStorage.setItem("portfolioLanguage", idioma);

            // Sincronizar la preferencia con la sesión.
            const sesionGuardada =
                sessionStorage.getItem("portfolioSession");

            if (sesionGuardada) {
                try {
                    const sesion = JSON.parse(sesionGuardada);

                    if (sesion && typeof sesion === "object") {
                        sesion.language = idioma;

                        sessionStorage.setItem(
                            "portfolioSession",
                            JSON.stringify(sesion)
                        );
                    }
                } catch (error) {
                    console.warn(
                        "No se pudo sincronizar el idioma de la sesión.",
                        error
                    );
                }
            }

            if (selectorIdioma) {
                selectorIdioma.value = idioma;
            }

            // Notificar a los componentes dinámicos.
            document.dispatchEvent(
                new CustomEvent("portfolio:languagechange", {
                    detail: {
                        idioma: idioma,
                        language: idioma
                    }
                })
            );

        } catch (error) {
            if (solicitud !== solicitudActual) {
                return;
            }

            console.error("Error al cargar el idioma:", error);

            if (selectorIdioma) {
                selectorIdioma.value = idiomaAplicado;
            }

        } finally {
            if (solicitud === solicitudActual && selectorIdioma) {
                selectorIdioma.disabled = false;
            }
        }
    }

    document.addEventListener("DOMContentLoaded", async () => {
        const selectorIdioma =
            document.getElementById("cv-language-select");

        const idiomaInicial = obtenerIdioma();

        // Registrar el evento antes de iniciar la descarga.
        if (selectorIdioma) {
            selectorIdioma.value = idiomaInicial;

            selectorIdioma.addEventListener("change", () => {
                seleccionarIdioma(
                    selectorIdioma.value,
                    selectorIdioma
                );
            });
        }

        // Restaurar el idioma guardado.
        await seleccionarIdioma(idiomaInicial, selectorIdioma);
    });

    window.aplicarIdiomaPagina = aplicarIdiomaPagina;
})();
