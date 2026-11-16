
/* =====================================================
   NFR-005 — ACCESIBILIDAD DE ENLACES
   Aviso traducido de apertura en nueva pestaña
   Idiomas: ES / EN / PT
===================================================== */

(function () {
    "use strict";

    const NOTICE_ID = "portfolio-new-tab-notice";
    const SUPPORTED_LANGUAGES = ["es", "en", "pt"];

    const FALLBACK_MESSAGES = {
        es: "Se abre en una nueva pestaña",
        en: "Opens in a new tab",
        pt: "Abre em uma nova aba"
    };

    function getLanguage() {
        const documentLanguage = document.documentElement.lang
            .toLowerCase()
            .split("-")[0];

        if (SUPPORTED_LANGUAGES.includes(documentLanguage)) {
            return documentLanguage;
        }

        const storedLanguage = localStorage.getItem("portfolioLanguage");

        return SUPPORTED_LANGUAGES.includes(storedLanguage)
            ? storedLanguage
            : "es";
    }

    function getNoticeText(language) {
        const translations = window.portfolioTranslations?.[language];

        return translations?.newTabNotice ||
            FALLBACK_MESSAGES[language];
    }

    function ensureNotice() {
        let notice = document.getElementById(NOTICE_ID);

        if (!notice) {
            notice = document.createElement("span");
            notice.id = NOTICE_ID;

            Object.assign(notice.style, {
                position: "absolute",
                width: "1px",
                height: "1px",
                padding: "0",
                margin: "-1px",
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                whiteSpace: "nowrap",
                border: "0"
            });

            document.body.appendChild(notice);
        }

        return notice;
    }

    function updateNewTabAccessibility() {
        const language = getLanguage();
        const notice = ensureNotice();

        notice.textContent = getNoticeText(language);
        notice.lang = language;

        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            const references = (
                link.getAttribute("aria-describedby") || ""
            ).split(/\s+/).filter(Boolean);

            if (!references.includes(NOTICE_ID)) {
                references.push(NOTICE_ID);
            }

            link.setAttribute(
                "aria-describedby",
                references.join(" ")
            );
        });
    }

    document.addEventListener(
        "DOMContentLoaded",
        updateNewTabAccessibility
    );

    document.addEventListener(
        "portfolio:languagechange",
        updateNewTabAccessibility
    );

    // Actualizar también cuando cambie el idioma del documento.
    const observer = new MutationObserver(() => {
        updateNewTabAccessibility();
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["lang"]
    });

    window.updateNewTabAccessibility = updateNewTabAccessibility;
})();
