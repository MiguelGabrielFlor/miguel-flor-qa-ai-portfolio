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

const contactForm = document.getElementById("contactForm");

const contactMessage = document.getElementById("contactMessage");

const contactButton = document.getElementById("contactButton");

const contactStatus = document.getElementById("contactStatus");

const contactMessageError = document.getElementById("contactMessageError");

const translations = {
    es: {
        accessEyebrow: "PORTFOLIO PROFESIONAL",
        accessWelcome: "Te doy la bienvenida",
        accessIntro: "Para acceder a mi portfolio profesional, completá tus datos de contacto.",
        formHelp: "Los campos marcados con * son obligatorios.",
        firstNameLabel: "Nombre",
        firstNamePlaceholder: "Ingresá tu nombre",
        lastNameLabel: "Apellido",
        lastNamePlaceholder: "Ingresá tu apellido",
        emailLabel: "Email",
        emailPlaceholder: "nombre@email.com",
        emailHint: "Ejemplo: nombre@email.com",
        phoneLabel: "Teléfono",
        phonePlaceholder: "+54 9 11 1234 5678",
        phoneHint: "Incluí el código de país si corresponde. Ejemplo: +54 9 11 1234 5678.",
        consentLabel: "Acepto el registro de mis datos para acceder al portfolio.",
        accessButton: "Ingresar al portfolio",
        portfolioInDevelopment: "Portfolio en desarrollo",
        greeting: "Te doy la bienvenida,",
        firstNameRequired: "El nombre es obligatorio.",
        firstNameInvalid: "Ingresá un nombre válido.",
        lastNameRequired: "El apellido es obligatorio.",
        lastNameInvalid: "Ingresá un apellido válido.",
        emailRequired: "El email es obligatorio.",
        emailInvalid: "Ingresá un email válido.",
        phoneRequired: "El teléfono es obligatorio.",
        phoneInvalid: "Ingresá un teléfono válido.",
        consentRequired: "Debés aceptar el registro de tus datos.",
        registrationFailed: "No se pudo completar el registro.",
        connectionError: "No se pudo conectar con el servidor. Verificá que la API esté iniciada e intentá nuevamente."
    },

    en: {
        accessEyebrow: "PROFESSIONAL PORTFOLIO",
        accessWelcome: "Welcome",
        accessIntro: "To access my professional portfolio, please enter your contact details.",
        formHelp: "Fields marked with * are required.",
        firstNameLabel: "First name",
        firstNamePlaceholder: "Enter your first name",
        lastNameLabel: "Last name",
        lastNamePlaceholder: "Enter your last name",
        emailLabel: "Email",
        emailPlaceholder: "name@email.com",
        emailHint: "Example: name@email.com",
        phoneLabel: "Phone",
        phonePlaceholder: "+1 555 123 4567",
        phoneHint: "Include the country code if applicable. Example: +1 555 123 4567.",
        consentLabel: "I agree to the registration of my data to access the portfolio.",
        accessButton: "Enter portfolio",
        portfolioInDevelopment: "Portfolio under development",
        greeting: "Welcome,",
        firstNameRequired: "First name is required.",
        firstNameInvalid: "Enter a valid first name.",
        lastNameRequired: "Last name is required.",
        lastNameInvalid: "Enter a valid last name.",
        emailRequired: "Email is required.",
        emailInvalid: "Enter a valid email address.",
        phoneRequired: "Phone number is required.",
        phoneInvalid: "Enter a valid phone number.",
        consentRequired: "You must agree to the registration of your data.",
        registrationFailed: "Registration could not be completed.",
        connectionError: "Could not connect to the server. Make sure the API is running and try again."
    },

    pt: {
        accessEyebrow: "PORTFÓLIO PROFISSIONAL",
        accessWelcome: "Dou-lhe as boas-vindas",
        accessIntro: "Para acessar meu portfólio profissional, preencha seus dados de contato.",
        formHelp: "Os campos marcados com * são obrigatórios.",
        firstNameLabel: "Nome",
        firstNamePlaceholder: "Digite seu nome",
        lastNameLabel: "Sobrenome",
        lastNamePlaceholder: "Digite seu sobrenome",
        emailLabel: "E-mail",
        emailPlaceholder: "nome@email.com",
        emailHint: "Exemplo: nome@email.com",
        phoneLabel: "Telefone",
        phonePlaceholder: "+55 11 91234 5678",
        phoneHint: "Inclua o código do país, se necessário. Exemplo: +55 11 91234 5678.",
        consentLabel: "Aceito o registro dos meus dados para acessar o portfólio.",
        accessButton: "Acessar portfólio",
        portfolioInDevelopment: "Portfólio em desenvolvimento",
        greeting: "Dou-lhe as boas-vindas,",
        firstNameRequired: "O nome é obrigatório.",
        firstNameInvalid: "Digite um nome válido.",
        lastNameRequired: "O sobrenome é obrigatório.",
        lastNameInvalid: "Digite um sobrenome válido.",
        emailRequired: "O e-mail é obrigatório.",
        emailInvalid: "Digite um e-mail válido.",
        phoneRequired: "O telefone é obrigatório.",
        phoneInvalid: "Digite um telefone válido.",
        consentRequired: "Você deve aceitar o registro dos seus dados.",
        registrationFailed: "Não foi possível concluir o cadastro.",
        connectionError: "Não foi possível conectar ao servidor. Verifique se a API está iniciada e tente novamente."
    }
};

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
}

languageSelect.addEventListener("change", function () {
    applyLanguage(languageSelect.value);
});


const savedSession = sessionStorage.getItem("portfolioSession");

if (savedSession) {
    try {
        const session = JSON.parse(savedSession);

        if (
            typeof session.firstName === "string" &&
            session.firstName.trim() !== "" &&
            ["es", "en", "pt"].includes(session.language)
        ) {
            languageSelect.value = session.language;
            applyLanguage(session.language);

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
            const response = await fetch("http://localhost:3000/api/visitors", {
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

    const mensaje = contactMessage.value.trim();

    if (!mensaje) {
        contactMessageError.textContent =
            "El mensaje es obligatorio.";
        contactMessage.focus();
        return;
    }

    contactButton.disabled = true;
    contactStatus.textContent = "Enviando mensaje...";

    try {
        const response = await fetch("http://localhost:3000/api/contact", {
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

        const result = await response.json();

        if (!response.ok) {
            contactStatus.textContent =
                result.message || "No se pudo enviar el mensaje.";
            return;
        }

        contactStatus.textContent = result.message;
        contactForm.reset();
    } catch (error) {
        contactStatus.textContent =
            "No se pudo conectar con el servidor. Intentá nuevamente.";
    } finally {
        contactButton.disabled = false;
    }
});