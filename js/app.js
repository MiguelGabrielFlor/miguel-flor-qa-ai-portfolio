const form = document.getElementById("accessForm");

const accessPage = document.getElementById("accessPage");

const portfolio = document.getElementById("portfolio");


const firstName = document.getElementById("firstName");

const lastName = document.getElementById("lastName");

const email = document.getElementById("email");

const phone = document.getElementById("phone");

const consent = document.getElementById("consent");


form.addEventListener("submit", function (event) {

    event.preventDefault();

    clearErrors();

    let isValid = true;


    /*
    ============================================
    FIRST NAME
    ============================================
    */

    if (firstName.value.trim() === "") {

        showError(
            firstName,
            "firstNameError",
            "El nombre es obligatorio."
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
            "El apellido es obligatorio."
        );

        isValid = false;
    }


    /*
    ============================================
    EMAIL
    ============================================
    */

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

    if (phone.value.trim() === "") {

        showError(
            phone,
            "phoneError",
            "El teléfono es obligatorio."
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

        showPortfolio();

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


function isValidEmail(email) {

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);

}