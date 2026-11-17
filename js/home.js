
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


async function initializeHome() {
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
                // Traducir textos alternativos de imágenes.
        document.querySelectorAll(
            "[data-i18n-alt]"
        ).forEach(element => {
            const key = element.dataset.i18nAlt;

            if (selectedTranslations[key] !== undefined) {
                element.setAttribute(
                    "alt",
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

    // Cargar el idioma guardado antes de aplicar sus traducciones.
    try {
        await window.loadPortfolioLanguage(currentLanguage);
        applyHomeLanguage(currentLanguage);
    } catch (error) {
        console.error("Error al cargar el idioma inicial:", error);

        currentLanguage = "es";
        applyHomeLanguage(currentLanguage);
    }

    // Cambiar de idioma sin descargar diccionarios innecesarios.
    if (languageSelector) {
        let languageRequestId = 0;

        languageSelector.addEventListener("change", async function () {
            const requestedLanguage = languageSelector.value;
            const requestId = ++languageRequestId;

            languageSelector.disabled = true;

            try {
                await window.loadPortfolioLanguage(requestedLanguage);

                // Ignorar resultados de solicitudes anteriores.
                if (requestId !== languageRequestId) return;

                currentLanguage = requestedLanguage;
                applyHomeLanguage(currentLanguage);

                document.dispatchEvent(
                    new CustomEvent("portfolio:languagechange", {
                        detail: { language: currentLanguage }
                    })
                );
            } catch (error) {
                if (requestId !== languageRequestId) return;

                console.error("Error al cambiar el idioma:", error);

                languageSelector.value = currentLanguage;
            } finally {
                if (requestId === languageRequestId) {
                    languageSelector.disabled = false;
                }
            }
        });
    }

    if (contactForm) {
        // Eliminar el error del mensaje cuando vuelva a ser válido.
        contactMessage.addEventListener("input", () => {
            if (contactMessage.value.trim()) {
                contactErrorKey = "";
                contactMessageError.textContent = "";
                contactMessage.removeAttribute("aria-invalid");
            }
        });

        // Eliminar el error del correo cuando vuelva a ser válido.
        if (guestEmail && guestEmailError) {
            guestEmail.addEventListener("input", () => {
                if (
                    guestEmail.value.trim() &&
                    guestEmail.checkValidity()
                ) {
                    guestEmailErrorKey = "";
                    guestEmailError.textContent = "";
                    guestEmail.removeAttribute("aria-invalid");
                }
            });
        }

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
            contactMessage.removeAttribute("aria-invalid");

            if (guestEmail) {
                guestEmail.removeAttribute("aria-invalid");
            }

            const language = document.documentElement.lang || "es";
            const t = translations[language] || translations.es;

            const mensaje = contactMessage.value.trim();
            const isGuest = session.accessType === "guest";

            // Validar todos los campos antes de detener el envío.
            let primerCampoInvalido = null;

            if (isGuest) {
                const guestAddress = guestEmail.value.trim();

                if (!guestAddress) {
                    guestEmailErrorKey = "guestEmailRequiredError";
                } else if (!guestEmail.checkValidity()) {
                    guestEmailErrorKey = "guestEmailInvalidError";
                }

                if (guestEmailErrorKey) {
                    guestEmailError.textContent = t[guestEmailErrorKey];
                    guestEmail.setAttribute("aria-invalid", "true");
                    primerCampoInvalido = guestEmail;
                }
            }

            if (!mensaje) {
                contactErrorKey = "contactRequiredError";
                contactMessageError.textContent = t[contactErrorKey];
                contactMessage.setAttribute("aria-invalid", "true");

                if (!primerCampoInvalido) {
                    primerCampoInvalido = contactMessage;
                }
            }

            if (primerCampoInvalido) {
                primerCampoInvalido.focus();
                return;
            }

            let contactData;

            if (isGuest) {
                const guestAddress = guestEmail.value.trim();

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
