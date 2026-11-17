"use strict";
// El diccionario español se carga antes de este archivo.
// Las páginas aún no migradas pueden seguir incluyendo EN y PT directamente.
const translations = window.portfolioTranslations || {};
window.portfolioTranslations = translations;
const pendingPortfolioLanguages = new Map();
window.loadPortfolioLanguage = function (language) {
    if (!["es", "en", "pt"].includes(language)) {
        return Promise.reject(new Error("Idioma no admitido"));
    }
    if (translations[language]) return Promise.resolve(translations[language]);
    if (pendingPortfolioLanguages.has(language)) {
        return pendingPortfolioLanguages.get(language);
    }
    const promise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `js/i18n/${language}.js`;
        script.onload = () => {
            if (translations[language]) resolve(translations[language]);
            else reject(new Error(`Diccionario ${language} no disponible`));
        };
        script.onerror = () => reject(new Error(`No se pudo descargar ${language}`));
        document.head.appendChild(script);
    }).catch(error => {
        pendingPortfolioLanguages.delete(language);
        throw error;
    });
    pendingPortfolioLanguages.set(language, promise);
    return promise;
};
