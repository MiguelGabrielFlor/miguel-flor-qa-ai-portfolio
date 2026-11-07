const form = document.getElementById("accessForm");

const accessPage = document.getElementById("accessPage");

const portfolio = document.getElementById("portfolio");

const firstName = document.getElementById("firstName");

const lastName = document.getElementById("lastName");

const email = document.getElementById("email");

const phone = document.getElementById("phone");

const consent = document.getElementById("consent");

const accessButton = document.getElementById("accessButton");

const serverError = document.getElementById("serverError");

const languageSelect = document.getElementById("languageSelect");
// Estado del formulario de contacto para internacionalización.
let contactStatusKey = "";

const savedLanguage = localStorage.getItem("portfolioLanguage");

if (["es", "en", "pt"].includes(savedLanguage)) {
    languageSelect.value = savedLanguage;
}

// Restaurar el idioma cuando el documento esté cargado.
window.addEventListener("DOMContentLoaded", function () {
    applyLanguage(languageSelect.value);
});


const contactForm = document.getElementById("contactForm");

const contactMessage = document.getElementById("contactMessage");

const contactButton = document.getElementById("contactButton");

const contactStatus = document.getElementById("contactStatus");

const contactMessageError = document.getElementById("contactMessageError");



function applyLanguage(language) {
    
    const selectedTranslations = translations[language] || translations.es;

    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach(function (element) {
        const key = element.dataset.i18n;

        if (selectedTranslations[key]) {
            element.textContent = selectedTranslations[key];
        }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
        const key = element.dataset.i18nPlaceholder;

        if (selectedTranslations[key]) {
            element.placeholder = selectedTranslations[key];
        }
    });
    
    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (element) {
        const key = element.dataset.i18nAriaLabel;

        if (selectedTranslations[key]) {
            element.setAttribute(
                "aria-label",
                selectedTranslations[key]
            );
        }
    });
    
    // Actualizar los errores visibles del formulario de acceso.
    // No generar errores nuevos al cambiar de idioma.
    const accessErrors = [
        {
            input: firstName,
            errorId: "firstNameError",
            requiredKey: "firstNameRequired",
            invalidKey: "firstNameInvalid"
        },
        {
            input: lastName,
            errorId: "lastNameError",
            requiredKey: "lastNameRequired",
            invalidKey: "lastNameInvalid"
        },
        {
            input: email,
            errorId: "emailError",
            requiredKey: "emailRequired",
            invalidKey: "emailInvalid"
        },
        {
            input: phone,
            errorId: "phoneError",
            requiredKey: "phoneRequired",
            invalidKey: "phoneInvalid"
        },
        {
            input: consent,
            errorId: "consentError",
            requiredKey: "consentRequired"
        }
    ];

    accessErrors.forEach(function (item) {
        const errorElement = document.getElementById(item.errorId);

        if (!errorElement || !errorElement.textContent.trim()) {
            return;
        }

        const translationKey = item.invalidKey &&
            item.input.value.trim() !== ""
                ? item.invalidKey
                : item.requiredKey;

        errorElement.textContent =
            selectedTranslations[translationKey] ||
            errorElement.textContent;
    });

    
    // Actualizar el saludo personalizado al cambiar de idioma.
    const welcomeMessage = document.getElementById("welcomeMessage");

    if (welcomeMessage && welcomeMessage.textContent.trim()) {
        const savedSession = sessionStorage.getItem("portfolioSession");

        if (savedSession) {
            try {
                const session = JSON.parse(savedSession);

                if (typeof session.firstName === "string" &&
                    session.firstName.trim() !== "") {

                    welcomeMessage.textContent =
                        `${selectedTranslations.greeting} ${session.firstName.trim().toUpperCase()}`;
                }
            } catch (error) {
                // Mantener el saludo existente si la sesión no es válida.
            }
        }
    }
    
    // Actualizar el error de validación del formulario de contacto.
    const contactMessageError =
        document.getElementById("contactMessageError");

    const contactMessage =
        document.getElementById("contactMessage");

    if (
        contactMessageError &&
        contactMessage &&
        contactMessageError.textContent.trim() !== "" &&
        contactMessage.value.trim() === ""
    ) {
        contactMessageError.textContent =
            selectedTranslations.contactRequiredError;
    }
    // Traducir el estado actual del formulario de contacto.
    const contactStatusElement =
        document.getElementById("contactStatus");

    if (contactStatusElement && contactStatusKey) {
        contactStatusElement.textContent =
            selectedTranslations[contactStatusKey] || "";
    }

}
applyLanguage(languageSelect.value);

languageSelect.addEventListener("change", function () {
    const selectedLanguage = languageSelect.value;

    // Aplicar las traducciones actuales.
    applyLanguage(selectedLanguage);

    // Guardar el idioma para las demás páginas.
    localStorage.setItem(
        "portfolioLanguage",
        selectedLanguage
    );

    // Sincronizar la sesión del visitante, si existe.
    const savedSession = sessionStorage.getItem(
        "portfolioSession"
    );

    if (savedSession) {
        try {
            const session = JSON.parse(savedSession);

            if (session && typeof session === "object") {
                session.language = selectedLanguage;

                sessionStorage.setItem(
                    "portfolioSession",
                    JSON.stringify(session)
                );
            }
        } catch (error) {
            // La validación existente de sesión
            // se encargará de los datos inválidos.
        }
    }
});

const footerLanguageSelect = document.getElementById(
    "footerLanguageSelect"
);

if (footerLanguageSelect) {

    // Mostrar el idioma actualmente seleccionado.
    footerLanguageSelect.value = languageSelect.value;

    // Cambiar el idioma desde el footer.
    footerLanguageSelect.addEventListener("change", function () {

        const selectedLanguage = footerLanguageSelect.value;

        // Sincronizar con el selector del registro.
        languageSelect.value = selectedLanguage;

        // Reutilizar el evento existente para aplicar
        // traducciones y guardar la preferencia.
        languageSelect.dispatchEvent(
            new Event("change")
        );

    });

    // Mantener actualizado el selector del footer.
    languageSelect.addEventListener("change", function () {
        footerLanguageSelect.value = languageSelect.value;
    });

}

const savedSession = sessionStorage.getItem("portfolioSession");

if (savedSession) {
    try {
        const session = JSON.parse(savedSession);

        if (
            typeof session.firstName === "string" &&
            session.firstName.trim() !== "" &&
            ["es", "en", "pt"].includes(session.language)
        ) {
            
            const preferredLanguage =
                localStorage.getItem("portfolioLanguage");

            const activeLanguage =
                ["es", "en", "pt"].includes(preferredLanguage)
                    ? preferredLanguage
                    : session.language;

            languageSelect.value = activeLanguage;
            applyLanguage(activeLanguage);


            firstName.value = session.firstName;
            showPortfolio();
        } else {
            sessionStorage.removeItem("portfolioSession");
        }
    } catch (error) {
        sessionStorage.removeItem("portfolioSession");
    }
}

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    clearErrors();

    let isValid = true;


    /*
    ============================================
    FIRST NAME
    ============================================
    */
    function isValidName(value) {
        const name = value.trim();

        if (name.length < 2 || name.length > 50) {
            return false;
        }

        const nameRegex = /^[\p{L}\s'-]+$/u;

        return nameRegex.test(name);
    }

    const currentTranslations = translations[languageSelect.value] || translations.es;

    if (firstName.value.trim() === "") {
        showError(
            firstName,
            "firstNameError",
            currentTranslations.firstNameRequired
        );
        isValid = false;
    } else if (!isValidName(firstName.value)) {
        showError(
            firstName,
            "firstNameError",
            currentTranslations.firstNameInvalid
        );
        isValid = false;
    }



    /*
    ============================================
    LAST NAME
    ============================================
    */


    if (lastName.value.trim() === "") {
        showError(
            lastName,
            "lastNameError",
            currentTranslations.lastNameRequired
        );
        isValid = false;
    } else if (!isValidName(lastName.value)) {
        showError(
            lastName,
            "lastNameError",
            currentTranslations.lastNameInvalid
        );
        isValid = false;
    }

    /*
    ============================================
    EMAIL
    ============================================
    */
    function isValidEmail(email) {
        const value = email.trim();

        const emailRegex =
            /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;

        return (
            value.length <= 254 &&
            emailRegex.test(value)
        );
    }

    if (email.value.trim() === "") {

        showError(
            email,
            "emailError",
            currentTranslations.emailRequired
        );

        isValid = false;

    } else if (!isValidEmail(email.value)) {

        showError(
            email,
            "emailError",
            currentTranslations.emailInvalid
        );

        isValid = false;
    }


    /*
    ============================================
    PHONE
    ============================================
    */
    function isValidPhone(phone) {
        const value = phone.trim();

        const allowedCharacters = /^\+?[0-9\s()-]+$/;
        const digits = value.replace(/\D/g, "");

        return (
            allowedCharacters.test(value) &&
            digits.length >= 7 &&
            digits.length <= 15
        );
    }



    if (phone.value.trim() === "") {
        showError(
            phone,
            "phoneError",
            currentTranslations.phoneRequired
        );
        isValid = false;
    } else if (!isValidPhone(phone.value)) {
        showError(
            phone,
            "phoneError",
            currentTranslations.phoneInvalid
        );
        isValid = false;
    }


    /*
    ============================================
    CONSENT
    ============================================
    */

    if (!consent.checked) {

        document.getElementById(
            "consentError"
        ).textContent =
            currentTranslations.consentRequired;

        isValid = false;
    }


    /*
    ============================================
    ACCESS
    ============================================
    */

    if (isValid) {
        serverError.textContent = "";
        accessButton.disabled = true;

        try {
            const response = await fetch(`${window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : ''}/api/visitors`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: firstName.value.trim(),
                    apellido: lastName.value.trim(),
                    email: email.value.trim(),
                    telefono: phone.value.trim(),
                    consentimiento: consent.checked
                })
            });

            const result = await response.json();


            if (!response.ok) {
                serverError.textContent =
                    currentTranslations.registrationFailed;
                return;
            }


            showPortfolio();


            } catch (error) {
                serverError.textContent =
                    currentTranslations.connectionError;
            } finally {
                accessButton.disabled = false;
            }

    }


});




function showPortfolio() {

    const welcomeMessage = document.getElementById("welcomeMessage");

    const selectedLanguage = languageSelect.value;
    const visitorName = firstName.value.trim();

    const currentTranslations = translations[selectedLanguage] || translations.es;

    // Mantener la sesión durante la navegación en esta pestaña.
    sessionStorage.setItem("portfolioSession", JSON.stringify({
        firstName: visitorName,
        language: selectedLanguage
    }));

    welcomeMessage.textContent =
        `${currentTranslations.greeting} ${visitorName.toLocaleUpperCase()}`;

    accessPage.classList.add("hidden");
    portfolio.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}



function showError(
    input,
    errorId,
    message
) {

    input.classList.add("input-error");

    document.getElementById(
        errorId
    ).textContent = message;

}


function clearErrors() {

    document
        .querySelectorAll(".error-message")
        .forEach(function (element) {

            element.textContent = "";

        });


    document
        .querySelectorAll("input")
        .forEach(function (input) {

            input.classList.remove("input-error");

        });

}

contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    contactMessageError.textContent = "";
    contactStatus.textContent = "";
    contactStatusKey = "";

    const getContactTranslations = () => {
        const language = document.documentElement.lang || "es";
        return translations[language] || translations.es;
    };

    const mensaje = contactMessage.value.trim();

    if (!mensaje) {
        contactMessageError.textContent =
            getContactTranslations().contactRequiredError;

        contactMessage.focus();
        return;
    }

    contactButton.disabled = true;

    contactStatusKey = "contactSending";
    contactStatus.textContent =
        getContactTranslations()[contactStatusKey];

    try {
        const response = await fetch(`${window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : ''}/api/contact`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: firstName.value.trim(),
                apellido: lastName.value.trim(),
                email: email.value.trim(),
                telefono: phone.value.trim(),
                mensaje
            })
        });

        await response.json();

        if (!response.ok) {
            contactStatusKey =
                response.status === 503
                    ? "contactServiceUnavailable"
                    : "contactSendError";

            contactStatus.textContent =
                getContactTranslations()[contactStatusKey];

            return;
        }

        contactStatusKey = "contactSuccess";
        contactStatus.textContent =
            getContactTranslations()[contactStatusKey];

        contactForm.reset();

    } catch (error) {
        contactStatusKey = "contactConnectionError";

        contactStatus.textContent =
            getContactTranslations()[contactStatusKey];

    } finally {
        contactButton.disabled = false;
    }
});

