
"use strict";

// Recuperar la modalidad de acceso del visitante.
function getPortfolioSession() {
    try {
        const storedSession = sessionStorage.getItem("portfolioSession");

        if (!storedSession) {
            return null;
        }

        const session = JSON.parse(storedSession);

        if (!session || typeof session !== "object") {
            return null;
        }

        const validLanguage = ["es", "en", "pt"].includes(session.language);

        if (!validLanguage) {
            return null;
        }

        // Compatibilidad con sesiones registradas existentes.
        if (
            typeof session.firstName === "string" &&
            session.firstName.trim() !== "" &&
            (session.accessType === undefined ||
             session.accessType === "registered")
        ) {
            return {
                ...session,
                accessType: "registered"
            };
        }

        // Nueva modalidad de acceso directo.
        if (session.accessType === "guest") {
            return session;
        }

        return null;

    } catch (error) {
        return null;
    }
}


function initializeHome() {
    const session = getPortfolioSession();

    if (!session) {
        window.location.replace("index.html");
        return;
    }

    const languageSelector =
        document.getElementById("footerLanguageSelect");

    const welcomeMessage =
        document.getElementById("welcomeMessage");
    
    const guestEmailGroup =
        document.getElementById("guestEmailGroup");

    const guestEmail =
        document.getElementById("guestEmail");

    const guestEmailError =
        document.getElementById("guestEmailError");

    // Configurar el contacto según la modalidad de acceso.
    if (guestEmailGroup && guestEmail) {
        const isGuest = session.accessType === "guest";

        guestEmailGroup.hidden = !isGuest;
        guestEmail.disabled = !isGuest;
        guestEmail.required = isGuest;

        if (guestEmailError) {
            guestEmailError.textContent = "";
        }
    }

    const contactForm =
        document.getElementById("contactForm");

    const contactMessage =
        document.getElementById("contactMessage");

    const contactButton =
        document.getElementById("contactButton");

    const contactStatus =
        document.getElementById("contactStatus");

    const contactMessageError =
        document.getElementById("contactMessageError");

    let contactStatusKey = "";
    let contactErrorKey = "";
    let guestEmailErrorKey = "";

    const supportedLanguages = ["es", "en", "pt"];

    const savedLanguage =
        localStorage.getItem("portfolioLanguage");

    let currentLanguage =
        supportedLanguages.includes(savedLanguage)
            ? savedLanguage
            : session.language;

    function applyHomeLanguage(language) {
        const selectedTranslations =
            translations[language] || translations.es;

        document.documentElement.lang = language;

        // Traducir los textos estáticos.
        document.querySelectorAll("[data-i18n]").forEach(element => {
            const key = element.dataset.i18n;

            if (selectedTranslations[key] !== undefined) {
                element.textContent = selectedTranslations[key];
            }
        });

        // Traducir placeholders.
        document.querySelectorAll(
            "[data-i18n-placeholder]"
        ).forEach(element => {
            const key = element.dataset.i18nPlaceholder;

            if (selectedTranslations[key] !== undefined) {
                element.placeholder = selectedTranslations[key];
            }
        });

        // Traducir etiquetas accesibles.
        document.querySelectorAll(
            "[data-i18n-aria-label]"
        ).forEach(element => {
            const key = element.dataset.i18nAriaLabel;

            if (selectedTranslations[key] !== undefined) {
                element.setAttribute(
                    "aria-label",
                    selectedTranslations[key]
                );
            }
        });

        // Actualizar los mensajes dinámicos de contacto.
        if (contactStatus && contactStatusKey) {
            contactStatus.textContent =
                selectedTranslations[contactStatusKey] || "";
        }

        if (contactMessageError && contactErrorKey) {
            contactMessageError.textContent =
                selectedTranslations[contactErrorKey] || "";
        }

        if (guestEmailError && guestEmailErrorKey) {
            guestEmailError.textContent =
                selectedTranslations[guestEmailErrorKey] || "";
        }

        // Saludo según la modalidad de acceso.
        if (welcomeMessage) {
            const greeting =
                selectedTranslations.greeting
                    .trim()
                    .replace(/,\s*$/, "");

            if (session.accessType === "registered") {
                welcomeMessage.textContent =
                    `${greeting}, ${session.firstName.trim().toLocaleUpperCase(language)}`;
            } else {
                welcomeMessage.textContent = greeting;
            }
        }

        if (languageSelector) {
            languageSelector.value = language;
        }

        // Conservar la preferencia de idioma.
        localStorage.setItem("portfolioLanguage", language);

        session.language = language;

        sessionStorage.setItem(
            "portfolioSession",
            JSON.stringify(session)
        );
    }

    applyHomeLanguage(currentLanguage);

    if (languageSelector) {
        languageSelector.addEventListener("change", function () {
            currentLanguage = languageSelector.value;
            applyHomeLanguage(currentLanguage);
        });
    }

    if (contactForm) {
        contactForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            contactStatusKey = "";
            contactErrorKey = "";
            guestEmailErrorKey = "";

            contactStatus.textContent = "";
            contactMessageError.textContent = "";

            if (guestEmailError) {
                guestEmailError.textContent = "";
            }

            const language = document.documentElement.lang || "es";
            const t = translations[language] || translations.es;

            const mensaje = contactMessage.value.trim();
            const isGuest = session.accessType === "guest";

            if (!mensaje) {
                contactErrorKey = "contactRequiredError";
                contactMessageError.textContent = t[contactErrorKey];
                contactMessage.focus();
                return;
            }

            let contactData;

            if (isGuest) {
                const guestAddress = guestEmail.value.trim();

                if (!guestAddress) {
                    guestEmailErrorKey = "guestEmailRequiredError";
                    guestEmailError.textContent = t[guestEmailErrorKey];
                    guestEmail.focus();
                    return;
                }

                if (!guestEmail.checkValidity()) {
                    guestEmailErrorKey = "guestEmailInvalidError";
                    guestEmailError.textContent = t[guestEmailErrorKey];
                    guestEmail.focus();
                    return;
                }

                contactData = {
                    nombre: "",
                    apellido: "",
                    email: guestAddress,
                    telefono: "",
                    mensaje
                };

            } else {
                contactData = {
                    nombre: session.firstName?.trim() || "",
                    apellido: session.lastName?.trim() || "",
                    email: session.email?.trim() || "",
                    telefono: session.phone?.trim() || "",
                    mensaje
                };

                // Evitar enviar datos incompletos de sesiones antiguas.
                if (
                    !contactData.nombre ||
                    !contactData.apellido ||
                    !contactData.email ||
                    !contactData.telefono
                ) {
                    contactStatusKey = "contactSendError";
                    contactStatus.textContent = t[contactStatusKey];
                    return;
                }
            }

            contactButton.disabled = true;
            contactStatusKey = "contactSending";
            contactStatus.textContent = t[contactStatusKey];

            const apiBase =
                ["localhost", "127.0.0.1"].includes(
                    window.location.hostname
                )
                    ? "http://localhost:3000"
                    : "";

            try {
                const response = await fetch(`${apiBase}/api/contact`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(contactData)
                });

                if (!response.ok) {
                    contactStatusKey =
                        response.status === 503
                            ? "contactServiceUnavailable"
                            : "contactSendError";
                } else {
                    contactStatusKey = "contactSuccess";
                    contactForm.reset();
                }

            } catch (error) {
                contactStatusKey = "contactConnectionError";

            } finally {
                const activeLanguage =
                    document.documentElement.lang || "es";

                const activeTranslations =
                    translations[activeLanguage] || translations.es;

                contactStatus.textContent =
                    activeTranslations[contactStatusKey] || "";

                contactButton.disabled = false;
            }
        });
    }

}

document.addEventListener("DOMContentLoaded", initializeHome);
