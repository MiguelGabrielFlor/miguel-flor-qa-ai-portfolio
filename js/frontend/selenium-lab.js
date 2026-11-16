
            (() => {
                const lab = document.getElementById("selenium-lab");
                if (!lab) return;

                const buttons = lab.querySelectorAll("[data-selenium-test]");

                const elements = {
                    id: document.getElementById("selenium-lab-id"),
                    title: document.getElementById("selenium-lab-title"),
                    objective: document.getElementById("selenium-lab-objective"),
                    action: document.getElementById("selenium-lab-action"),
                    check: document.getElementById("selenium-lab-check")
                };

                const tests = {
                    "UI-001": {
                        title: "Carga de la página",
                        objective:
                            "Verificar que la página de acceso se abre correctamente y que el formulario está visible.",
                        action:
                            "Selenium abre la página de acceso y localiza el formulario y sus campos principales.",
                        check:
                            "Se comprueba el título de la página y que los elementos esperados están visibles."
                    },

                    "UI-002": {
                        title: "Formulario vacío",
                        objective:
                            "Verificar que el formulario de acceso no permita continuar cuando faltan datos obligatorios.",
                        action:
                            "Selenium intenta enviar el formulario sin completar los campos.",
                        check:
                            "Se verifica que el formulario rechaza la operación y permanece en la página de acceso."
                    },

                    "UI-003": {
                        title: "Correo electrónico inválido",
                        objective:
                            "Verificar que un correo electrónico con formato incorrecto sea rechazado.",
                        action:
                            "Selenium introduce un correo inválido junto con los demás datos necesarios.",
                        check:
                            "Se comprueba que la validación impide continuar con el registro."
                    },

                    "UI-004": {
                        title: "Nombre demasiado corto",
                        objective:
                            "Verificar que el formulario rechace un nombre que no cumple la longitud mínima.",
                        action:
                            "Selenium completa el formulario utilizando un nombre demasiado corto.",
                        check:
                            "Se verifica que la validación impide acceder al portfolio."
                    },

                    "UI-005": {
                        title: "Apellido demasiado corto",
                        objective:
                            "Verificar que el formulario rechace un apellido que no cumple la longitud mínima.",
                        action:
                            "Selenium completa el formulario utilizando un apellido demasiado corto.",
                        check:
                            "Se verifica que la validación impide acceder al portfolio."
                    },

                    "UI-006": {
                        title: "Teléfono demasiado corto",
                        objective:
                            "Verificar que el formulario rechace un número telefónico que no cumple la longitud mínima.",
                        action:
                            "Selenium introduce un teléfono demasiado corto en el formulario de acceso.",
                        check:
                            "Se verifica que la validación impide acceder al portfolio."
                    },

                    "UI-007": {
                        title: "Consentimiento obligatorio",
                        objective:
                            "Comprobar que no se permite acceder al portfolio sin aceptar el consentimiento.",
                        action:
                            "Selenium completa los datos personales, deja desmarcado el consentimiento e intenta acceder.",
                        check:
                            "Se comprueba que aparece el mensaje de consentimiento obligatorio y que el portfolio permanece oculto."
                    },

                    "UI-008": {
                        title: "Registro válido",
                        objective:
                            "Comprobar que un registro correctamente completado permite acceder al portfolio.",
                        action:
                            "Selenium completa los campos, acepta el consentimiento y presiona el botón de acceso.",
                        check:
                            "Se comprueba que el portfolio se muestra, que la pantalla de acceso queda oculta y que aparece el saludo personalizado."
                    },

                    "UI-009": {
                        title: "Selector de idioma",
                        objective:
                            "Verificar el cambio de idioma de la pantalla de acceso.",
                        action:
                            "Selenium interactúa con el selector de idiomas de la interfaz.",
                        check:
                            "Se verifica que la pantalla de acceso cambia al idioma seleccionado."
                    },

                    "UI-010": {
                        title: "Contacto válido",
                        objective:
                            "Verificar que un mensaje válido muestra la confirmación de envío.",
                        action:
                            "Selenium completa el formulario de contacto con datos válidos y solicita el envío.",
                        check:
                            "Se comprueba que la interfaz presenta la confirmación correspondiente."
                    },

                    "UI-011": {
                        title: "Mensaje de contacto vacío",
                        objective:
                            "Verificar que no se permita enviar el formulario de contacto con un mensaje vacío.",
                        action:
                            "Selenium intenta enviar el formulario de contacto sin ingresar un mensaje.",
                        check:
                            "Se comprueba que la interfaz rechaza el envío."
                    },

                    "UI-015": {
                        title: "Error HTTP 500",
                        objective:
                            "Verificar cómo responde el formulario de contacto ante un error interno del servidor.",
                        action:
                            "Selenium ejecuta el escenario de contacto preparado para recibir una respuesta HTTP 500.",
                        check:
                            "Se verifica que el formulario gestione el error sin mostrar una confirmación de envío exitoso."
                    }

                };

                function showTest(testId) {
                    const test = tests[testId];
                    if (!test) return;

                    elements.id.textContent = testId;
                    elements.title.textContent = frontTr("frontUi" + testId.slice(3) + "Title", test.title);
                    elements.objective.textContent = frontTr("frontUi" + testId.slice(3) + "Objective", test.objective);
                    elements.action.textContent = frontTr("frontUi" + testId.slice(3) + "Action", test.action);
                    elements.check.textContent = frontTr("frontUi" + testId.slice(3) + "Check", test.check);

                    buttons.forEach(button => {
                        const active = button.dataset.seleniumTest === testId;

                        button.classList.toggle("active", active);
                        button.setAttribute("aria-pressed", String(active));
                    });
                }

                buttons.forEach(button => {
                    button.addEventListener("click", () => {
                        showTest(button.dataset.seleniumTest);
                    });
                });

                showTest("UI-001");
            })();
            