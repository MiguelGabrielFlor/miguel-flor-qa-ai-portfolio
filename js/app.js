const form = document.getElementById("accessForm");

const firstName = document.getElementById("firstName");

const lastName = document.getElementById("lastName");

const email = document.getElementById("email");

const phone = document.getElementById("phone");

const consent = document.getElementById("consent");

const accessButton = document.getElementById("accessButton");

const serverError = document.getElementById("serverError");

const languageSelect = document.getElementById("languageSelect");
// Estado del formulario de contacto para internacionalización.

const savedLanguage = localStorage.getItem("portfolioLanguage");

if (["es", "en", "pt"].includes(savedLanguage)) {
    languageSelect.value = savedLanguage;
}

applyLanguage(languageSelect.value);


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
    

}

function restorePortfolioSession() {
    const savedSession = sessionStorage.getItem("portfolioSession");

    if (!savedSession) {
        return;
    }

    try {
        const session = JSON.parse(savedSession);

        const validLanguage =
            ["es", "en", "pt"].includes(session?.language);

        const isGuest =
            session?.accessType === "guest";

        const isRegistered =
            (session?.accessType === "registered" ||
             session?.accessType === undefined) &&
            typeof session?.firstName === "string" &&
            session.firstName.trim() !== "";

        if (!validLanguage || (!isGuest && !isRegistered)) {
            sessionStorage.removeItem("portfolioSession");
            return;
        }

        const preferredLanguage =
            localStorage.getItem("portfolioLanguage");

        session.language =
            ["es", "en", "pt"].includes(preferredLanguage)
                ? preferredLanguage
                : session.language;

        sessionStorage.setItem(
            "portfolioSession",
            JSON.stringify(session)
        );

        window.location.replace("home.html");

    } catch (error) {
        sessionStorage.removeItem("portfolioSession");
    }
}

document.addEventListener("DOMContentLoaded", restorePortfolioSession);

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
    const selectedLanguage = languageSelect.value;
    const visitorName = firstName.value.trim();
    
    sessionStorage.setItem(
        "portfolioSession",
        JSON.stringify({
            accessType: "registered",
            firstName: visitorName,
            lastName: lastName.value.trim(),
            email: email.value.trim(),
            phone: phone.value.trim(),
            language: selectedLanguage
        })
    );

    localStorage.setItem(
        "portfolioLanguage",
        selectedLanguage
    );

    window.location.assign("home.html");
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

document.addEventListener("DOMContentLoaded", () => {
    const guestButton = document.getElementById("guestAccessButton");
    const registeredButton = document.getElementById("registeredAccessButton");
    const accessForm = document.getElementById("accessForm");

    if (!guestButton || !registeredButton || !accessForm) {
        return;
    }

    // El formulario se muestra únicamente al elegir registrarse.
    accessForm.hidden = true;

    registeredButton.setAttribute("aria-expanded", "false");

    registeredButton.addEventListener("click", () => {
        accessForm.hidden = false;
        registeredButton.setAttribute("aria-expanded", "true");

        accessForm.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        accessForm.querySelector("input")?.focus({
            preventScroll: true
        });
    });

    guestButton.addEventListener("click", () => {
        const language = languageSelect.value;

        const safeLanguage = ["es", "en", "pt"].includes(language)
            ? language
            : "es";

        sessionStorage.setItem(
            "portfolioSession",
            JSON.stringify({
                accessType: "guest",
                language: safeLanguage
            })
        );

        window.location.href = "home.html";
    });
});
document.querySelectorAll(".access-option-card[data-access-target]")
    .forEach(card => {
        const button = document.getElementById(card.dataset.accessTarget);

        if (!button) return;

        card.addEventListener("click", event => {
            if (event.target.closest("button, a, input, select, textarea")) {
                return;
            }

            button.click();
        });
    });

