
/* =====================================================
   INTERNACIONALIZACIÓN — PÁGINAS INTERNAS
===================================================== */

(function () {
    "use strict";

    const idiomasDisponibles = ["es", "en", "pt"];

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
            return;
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

    }
    
    document.addEventListener("DOMContentLoaded", () => {
        const idiomaActual = obtenerIdioma();

        aplicarIdiomaPagina(idiomaActual);

        const selectorIdioma = document.getElementById("cv-language-select");

        if (selectorIdioma) {
            selectorIdioma.value = idiomaActual;

            selectorIdioma.addEventListener("change", () => {
                const nuevoIdioma = selectorIdioma.value;

                if (!idiomasDisponibles.includes(nuevoIdioma)) {
                    return;
                }

                localStorage.setItem("portfolioLanguage", nuevoIdioma);

                aplicarIdiomaPagina(nuevoIdioma);

                // Notificar el cambio a los componentes dinámicos.
                document.dispatchEvent(
                    new CustomEvent("portfolio:languagechange", {
                        detail: { idioma: nuevoIdioma }
                    })
                );
            });
        }
    });


    window.aplicarIdiomaPagina = aplicarIdiomaPagina;
})();
