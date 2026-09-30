const form = document.getElementById("accessForm");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const consent = document.getElementById("consent");


form.addEventListener("submit", function (event) {

    event.preventDefault();

    clearErrors();

    let isValid = true;


    if (firstName.value.trim() === "") {

        showError(
            firstName,
            "firstNameError",
            "El nombre es obligatorio."
        );

        isValid = false;
    }


    if (lastName.value.trim() === "") {

        showError(
            lastName,
            "lastNameError",
            "El apellido es obligatorio."
        );

        isValid = false;
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


    if (phone.value.trim() === "") {

        showError(
            phone,
            "phoneError",
            "El teléfono es obligatorio."
        );

        isValid = false;
    }


    if (!consent.checked) {

        document.getElementById("consentError").textContent =
            "Debés aceptar el registro de tus datos.";

        isValid = false;
    }


    if (isValid) {

        alert("Validación exitosa. Próximamente accederás al portfolio.");

    }

});


function showError(input, errorId, message) {

    input.classList.add("input-error");

    document.getElementById(errorId).textContent = message;
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