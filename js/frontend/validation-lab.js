
/**
 * FRONTEND — Laboratorio interactivo de validaciones.
 * Mantiene el estado y actualiza los mensajes en ES/EN/PT.
 */
(() => {
    const input = document.getElementById("demo-email");
    const validateButton = document.getElementById("demo-validate");
    const resetButton = document.getElementById("demo-reset");
    const message = document.getElementById("demo-email-message");
    const result = document.getElementById("demo-validation-result");

    if (!input || !validateButton || !resetButton || !message || !result) {
        return;
    }

    const translations = {
        waiting: {
            result: ["frontWaiting", "Esperando datos de entrada."]
        },
        empty: {
            message: ["frontEmailRequired", "El correo electrónico es obligatorio."],
            result: ["frontRejectedEmpty", "VALIDACIÓN RECHAZADA — Campo vacío."]
        },
        invalid: {
            message: ["frontEmailFormat", "Ingresá un correo electrónico válido."],
            result: ["frontRejectedFormat", "VALIDACIÓN RECHAZADA — Formato incorrecto."]
        },
        valid: {
            message: ["frontEmailOk", "Correo electrónico válido."],
            result: ["frontApprovedFormat", "VALIDACIÓN APROBADA — Formato correcto."]
        }
    };

    let validationState = "waiting";

    let activeScenario = null;

    const scenarioTranslations = {
        invalid: "frontDemoInvalidEmail",
        valid: "frontDemoValidEmail"
    };

    function updateScenarioExamples() {
        const buttons = document.querySelectorAll(
            "#validation-lab [data-demo-email]"
        );

        buttons.forEach(button => {
            const scenario = button.dataset.demoEmail;

            let translationKey = null;

            if (scenario === "correo-invalido") {
                translationKey = scenarioTranslations.invalid;
            } else if (scenario === "usuario@ejemplo.com") {
                translationKey = scenarioTranslations.valid;
            }

            if (!translationKey) {
                return;
            }

            const translatedValue = frontTr(
                translationKey,
                button.dataset.demoEmail
            );

            if (activeScenario === button) {
                input.value = translatedValue;
            }
        });

        input.placeholder = frontTr(
            "frontDemoEmailPlaceholder",
            "usuario@ejemplo.com"
        );
    }


    function translate(pair) {
        return frontTr(pair[0], pair[1]);
    }

    function renderValidationState() {
        const current = translations[validationState];

        message.textContent = current.message
            ? translate(current.message)
            : "";

        result.textContent = translate(current.result);

        message.className = "validation-lab-message";
        result.className = "validation-lab-status";

        input.classList.remove("demo-valid", "demo-invalid");
        input.removeAttribute("aria-invalid");

        if (validationState === "valid") {
            input.classList.add("demo-valid");
            input.setAttribute("aria-invalid", "false");

            message.classList.add("success");
            result.classList.add("success");
        }

        if (validationState === "empty" || validationState === "invalid") {
            input.classList.add("demo-invalid");
            input.setAttribute("aria-invalid", "true");

            message.classList.add("error");
            result.classList.add("error");
        }
    }

    function resetVisualState() {
        validationState = "waiting";
        renderValidationState();
    }

    function validateEmail() {
        const email = input.value.trim();

        // Regla de demostración; no sustituye la validación real.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = email.length <= 254 && emailRegex.test(email);

        if (!email) {
            validationState = "empty";
        } else if (!isValid) {
            validationState = "invalid";
        } else {
            validationState = "valid";
        }

        renderValidationState();
    }

    // Escenarios de prueba precargados.
    const scenarioButtons = document.querySelectorAll(
        "#validation-lab [data-demo-email]"
    );

    scenarioButtons.forEach(button => {
        button.addEventListener("click", () => {
            activeScenario = button;

            const scenario = button.dataset.demoEmail;

            if (scenario === "correo-invalido") {
                input.value = frontTr("frontDemoInvalidEmail", scenario);
            } else if (scenario === "usuario@ejemplo.com") {
                input.value = frontTr("frontDemoValidEmail", scenario);
            } else {
                input.value = scenario;
            }

            scenarioButtons.forEach(item => {
                item.classList.toggle("active", item === button);
            });

            validateEmail();

            // Mantener visibles los escenarios después de validar.
            const escenarios = document.querySelector(
                "#validation-lab .validation-scenarios"
            );

            if (escenarios) {
                const encabezado = document.querySelector(".navbar");
                const alturaEncabezado = encabezado
                    ? encabezado.getBoundingClientRect().height
                    : 0;

                const posicion = escenarios.getBoundingClientRect().top
                    + window.scrollY
                    - alturaEncabezado
                    - 16;

                window.scrollTo({
                    top: Math.max(0, posicion),
                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                        ? "instant"
                        : "smooth"
                });
            }
        });
    });

    // La edición manual desactiva el escenario seleccionado.
    input.addEventListener("input", () => {
        activeScenario = null;
        scenarioButtons.forEach(button => {
            button.classList.remove("active");
        });

        resetVisualState();
    });

    validateButton.addEventListener("click", validateEmail);

    resetButton.addEventListener("click", () => {
        activeScenario = null;
        scenarioButtons.forEach(button => {
            button.classList.remove("active");
        });

        input.value = "";
        resetVisualState();
        input.focus();
    });

    document.addEventListener("portfolio:languagechange", () => {
        updateScenarioExamples();
        renderValidationState();
    });

    updateScenarioExamples();

    resetVisualState();
})();
