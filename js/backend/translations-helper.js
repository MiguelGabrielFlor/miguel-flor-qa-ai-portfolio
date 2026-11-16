
/**
 * Traducciones dinámicas de los laboratorios backend.
 * No modifica datos ni respuestas de la API.
 */
function backendText(key, fallback = "") {
    const language = localStorage.getItem("portfolioLanguage") || "es";

    return window.portfolioTranslations?.[language]?.[key]
        ?? fallback;
}
