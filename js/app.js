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
    if (firstName.value.trim() === "") {
    showError(firstName, "firstNameError", "El nombre es obligatorio.");
    isValid = false;
    } else if (!isValidName(firstName.value)) {
    showError(
        firstName,
        "firstNameError",
        "Ingresá un nombre válido."
    );
    isValid = false;
    }


    /*
    ============================================
    LAST NAME
    ============================================
    */

    if (lastName.value.trim() === "") {
    showError(lastName, "lastNameError", "El apellido es obligatorio.");
    isValid = false;
    } else if (!isValidName(lastName.value)) {
    showError(
        lastName,
        "lastNameError",
        "Ingresá un apellido válido."
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
            "El email es obligatorio."
        );

        isValid = false;

    } else if (!isValidEmail(email.value)) {

        showError(
            email,
            "emailError",
            "Ingresá un email válido."
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
            "El teléfono es obligatorio."
        );
        isValid = false;
    } else if (!isValidPhone(phone.value)) {
        showError(
            phone,
            "phoneError",
            "Ingresá un teléfono válido."
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
            "Debés aceptar el registro de tus datos.";

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
                    result.message || "No se pudo completar el registro.";
                return;
            }

            showPortfolio();

        } catch (error) {
            serverError.textContent =
                "No se pudo conectar con el servidor. Verificá que la API esté iniciada e intentá nuevamente.";
        } finally {
            accessButton.disabled = false;
        }
    }


});


function showPortfolio() {

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
