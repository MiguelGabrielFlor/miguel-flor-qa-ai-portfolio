
(() => {
    const lab = document.getElementById("language-lab");
    if (!lab) return;

    const preview = lab.querySelector(".language-lab-preview");
    const buttons = lab.querySelectorAll("[data-demo-language]");
    const current = document.getElementById("language-lab-current");
    const feedback = document.getElementById("language-lab-feedback");
    const result = document.getElementById("language-demo-result");

    const fields = {
        name: document.getElementById("language-demo-name"),
        email: document.getElementById("language-demo-email"),
        message: document.getElementById("language-demo-message")
    };

    const translations = {
        es: {
            title: "Formulario de contacto",
            name: "Nombre",
            namePlaceholder: "Ej.: Juan Pérez",
            email: "Correo electrónico",
            message: "Mensaje",
            send: "Validar formulario",
            reset: "Restablecer",
            placeholder: "Escribí tu mensaje...",
            feedback: "Interfaz en español.",
            errors: {
                name: "Ingresá un nombre de 3 a 50 caracteres, utilizando solamente letras.",
                email: "Ingresá un correo electrónico válido (máximo 254 caracteres).",
                message: "Ingresá un mensaje de hasta 5000 caracteres."
            },
            success: "Todos los campos son válidos.",
            scenariosTitle: "Escenarios de prueba",
            scenariosDescription: "Seleccioná un escenario para comprobar las validaciones y sus mensajes en diferentes idiomas.",
            scenarioEmpty: "Formulario vacío",
            scenarioInvalid: "Datos inválidos",
            scenarioValid: "Datos válidos",
        },
        en: {
            title: "Contact form",
            name: "Name",
            namePlaceholder: "E.g.: John Smith",
            email: "Email address",
            message: "Message",
            send: "Validate form",
            reset: "Reset",
            placeholder: "Write your message...",
            feedback: "Interface in English.",
            errors: {
                name: "Enter a name between 3 and 50 characters, using letters only.",
                email: "Enter a valid email address (maximum 254 characters).",
                message: "Enter a message of up to 5000 characters."
            },
            success: "All fields are valid.",
            scenariosTitle: "Test scenarios",
            scenariosDescription: "Select a scenario to check validations and their messages in different languages.",
            scenarioEmpty: "Empty form",
            scenarioInvalid: "Invalid data",
            scenarioValid: "Valid data",
        },
        pt: {
            title: "Formulário de contato",
            name: "Nome",
            namePlaceholder: "Ex.: João Silva",
            email: "E-mail",
            message: "Mensagem",
            send: "Validar formulário",
            reset: "Redefinir",
            placeholder: "Escreva sua mensagem...",
            feedback: "Interface em português.",
            errors: {
                name: "Digite um nome de 3 a 50 caracteres, usando apenas letras.",
                email: "Digite um endereço de e-mail válido (máximo de 254 caracteres).",
                message: "Digite uma mensagem de até 5000 caracteres."
            },
            success: "Todos os campos são válidos.",
            scenariosTitle: "Cenários de teste",
            scenariosDescription: "Selecione um cenário para verificar as validações e suas mensagens em diferentes idiomas.",
            scenarioEmpty: "Formulário vazio",
            scenarioInvalid: "Dados inválidos",
            scenarioValid: "Dados válidos",
        }
    };

    let activeLanguage = "es";
    const submitButton = document.getElementById("language-demo-submit");

    const errorElements = {
        name: document.getElementById("language-name-error"),
        email: document.getElementById("language-email-error"),
        message: document.getElementById("language-message-error")
    };

    let hasValidated = false;

    function validateDemoForm() {
        const selected = translations[activeLanguage];

        const values = {
            name: fields.name.value.trim(),
            email: fields.email.value.trim(),
            message: fields.message.value.trim()
        };

        const nameValid =
            values.name.length >= 3 &&
            values.name.length <= 50 &&
            /^[\p{L}\s'’-]+$/u.test(values.name);

        const emailValid =
            values.email.length <= 254 &&
            /^[^\s@]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(values.email);

        const messageValid =
            values.message.length > 0 &&
            values.message.length <= 5000;

        const validation = {
            name: nameValid,
            email: emailValid,
            message: messageValid
        };

        Object.entries(validation).forEach(([key, valid]) => {
            const field = fields[key];
            const error = errorElements[key];

            field.classList.toggle("demo-field-error", !valid);
            field.classList.toggle("demo-field-valid", valid);
            field.setAttribute("aria-invalid", String(!valid));

            error.textContent = valid ? "" : selected.errors[key];
        });

        const allValid = Object.values(validation).every(Boolean);

        result.className = allValid
            ? "language-demo-result success"
            : "language-demo-result error";

        result.textContent = allValid
            ? selected.success
            : Object.entries(validation)
                .filter(([, valid]) => !valid)
                .map(([key]) => selected.errors[key])
                .join(" ");

        hasValidated = true;
    }
    const scenarioButtons = lab.querySelectorAll(
        "[data-language-scenario]"
    );

    const scenarios = {
        es: {
            empty: {
                name: "",
                email: "",
                message: ""
            },
            invalid: {
                name: "Juan123",
                email: "correo-invalido",
                message: ""
            },
            valid: {
                name: "Juan Pérez",
                email: "juan@ejemplo.com",
                message: "Mensaje de prueba válido."
            }
        },

        en: {
            empty: {
                name: "",
                email: "",
                message: ""
            },
            invalid: {
                name: "John123",
                email: "invalid-email",
                message: ""
            },
            valid: {
                name: "John Smith",
                email: "john@example.com",
                message: "Valid test message."
            }
        },

        pt: {
            empty: {
                name: "",
                email: "",
                message: ""
            },
            invalid: {
                name: "João123",
                email: "e-mail-inválido",
                message: ""
            },
            valid: {
                name: "João Silva",
                email: "joao@exemplo.com",
                message: "Mensagem de teste válida."
            }
        }
    };

    scenarioButtons.forEach(button => {
        button.addEventListener("click", () => {
            const scenario = scenarios[activeLanguage]?.[button.dataset.languageScenario];
            if (!scenario) return;

            fields.name.value = scenario.name;
            fields.email.value = scenario.email;
            fields.message.value = scenario.message;

            scenarioButtons.forEach(item => {
                const active = item === button;
                item.classList.toggle("active", active);
                item.setAttribute("aria-pressed", String(active));
            });

            validateDemoForm();
        });
    });

    function applyDemoLanguage(language) {
        const selected = translations[language];
        if (!selected) return;

        activeLanguage = language;
        preview.lang = language;

        lab.querySelectorAll("[data-demo-translation]").forEach(element => {
            const key = element.dataset.demoTranslation;
            if (selected[key]) {
                element.textContent = selected[key];
            }
        });

        fields.message.placeholder = selected.placeholder;
        fields.name.placeholder = selected.namePlaceholder;

        // Adaptar los datos precargados al idioma del laboratorio.
        const activeScenarioButton = lab.querySelector(
            "[data-language-scenario].active"
        );

        if (activeScenarioButton) {
            const scenarioKey = activeScenarioButton.dataset.languageScenario;
            const scenario = scenarios[language]?.[scenarioKey];

            if (scenario) {
                fields.name.value = scenario.name;
                fields.email.value = scenario.email;
                fields.message.value = scenario.message;
            }
        }

        current.textContent = language.toUpperCase();
        feedback.textContent = selected.feedback;

        buttons.forEach(button => {
            const active = button.dataset.demoLanguage === language;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        // Volveremos a validar al cambiar el idioma
        // cuando incorporemos la lógica del formulario.
        if (hasValidated) {
            validateDemoForm();
        } else {
            result.textContent = "";
            result.className = "language-demo-result";
        }
    }

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            applyDemoLanguage(button.dataset.demoLanguage);
        });
    });
    submitButton.addEventListener("click", validateDemoForm);
    // FRONTEND — Restablecer laboratorio de internacionalización.
    const resetButton = document.getElementById("language-demo-reset");

    resetButton.addEventListener("click", () => {

        // Vaciar los campos y eliminar sus estados visuales.
        Object.values(fields).forEach(field => {
            field.value = "";
            field.classList.remove(
                "demo-field-error",
                "demo-field-valid"
            );
            field.removeAttribute("aria-invalid");
        });

        // Eliminar los mensajes de error.
        Object.values(errorElements).forEach(element => {
            element.textContent = "";
        });

        // Limpiar el resultado general.
        result.textContent = "";
        result.className = "language-demo-result";

        // Desactivar los escenarios guiados.
        scenarioButtons.forEach(button => {
            button.classList.remove("active");
            button.setAttribute("aria-pressed", "false");
        });

        // Reiniciar el estado de validación.
        hasValidated = false;

        // Mantener el idioma seleccionado.
        fields.name.focus();
    });

    Object.entries(fields).forEach(([key, field]) => {
        field.addEventListener("input", () => {
            const value = field.value.trim();
            const selected = translations[activeLanguage];

            const validation = {
                name: value.length >= 3 &&
                    value.length <= 50 &&
                    /^[\p{L}\s'’-]+$/u.test(value),

                email: value.length <= 254 &&
                    /^[^\s@]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(value),

                message: value.length > 0 &&
                        value.length <= 5000
            };

            const valid = validation[key];

            // Quitar el estado de éxito anterior.
            Object.values(fields).forEach(item => {
                item.classList.remove("demo-field-valid");
            });

            // Mostrar errores solamente en campos inválidos.
            field.classList.toggle("demo-field-error", !valid);
            field.setAttribute("aria-invalid", String(!valid));

            errorElements[key].textContent = valid
                ? ""
                : selected.errors[key];

            // Limpiar el resultado de la validación anterior.
            result.textContent = "";
            result.className = "language-demo-result";

            // Exigir una nueva validación manual.
            hasValidated = false;
        });
    });
    applyDemoLanguage("es");
})();
