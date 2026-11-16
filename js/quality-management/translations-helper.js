
// =========================================
// QUALITY MANAGEMENT — TRADUCCIONES
// =========================================

// Obtener una traducción según el idioma seleccionado.
function qmTranslate(key, fallback = "") {
    const language = localStorage.getItem("portfolioLanguage") || "es";

    return window.portfolioTranslations?.[language]?.[key]
        ?? window.portfolioTranslations?.es?.[key]
        ?? fallback;
}
