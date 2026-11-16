
/**
 * Traducciones dinámicas de los laboratorios frontend.
 * No incorpora nuevos manejadores de eventos.
 */
window.frontTr = function (key, fallback) {
    const lang = localStorage.getItem("portfolioLanguage") || "es";
    const dictionary =
        window.portfolioTranslations?.[lang] ||
        window.portfolioTranslations?.es;

    return dictionary?.[key] ?? fallback;
};
