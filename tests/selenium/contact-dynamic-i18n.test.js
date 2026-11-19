
"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { By } = require("selenium-webdriver");
const { createDriver } = require("./selenium-config");

const BASE_URL =
    process.env.TEST_BASE_URL || "http://127.0.0.1:5500";

const LANGUAGES = ["es", "en", "pt"];

const EXPECTED = {
    es: {
        emailRequired: "El correo electrónico es obligatorio.",
        messageRequired: "El mensaje es obligatorio.",
        connectionError:
            "No se pudo conectar con el servidor. Intentá nuevamente."
    },
    en: {
        emailRequired: "Email address is required.",
        messageRequired: "Message is required.",
        connectionError:
            "Could not connect to the server. Please try again."
    },
    pt: {
        emailRequired: "O endereço de e-mail é obrigatório.",
        messageRequired: "A mensagem é obrigatória.",
        connectionError:
            "Não foi possível conectar ao servidor. Tente novamente."
    }
};

async function initializeSession(driver, accessType) {
    await driver.get(`${BASE_URL}/index.html`);

    await driver.executeScript(
        function (type) {
            const session = {
                accessType: type,
                language: "es"
            };

            if (type === "registered") {
                Object.assign(session, {
                    firstName: "QA",
                    lastName: "Tester",
                    email: "qa@example.com",
                    phone: "1123456789"
                });
            }

            sessionStorage.setItem(
                "portfolioSession",
                JSON.stringify(session)
            );

            localStorage.setItem("portfolioLanguage", "es");
        },
        accessType
    );

    await driver.get(`${BASE_URL}/home.html`);

    await driver.wait(async () => {
        return await driver.executeScript(
            'return document.documentElement.lang === "es" ' +
            '&& !!document.getElementById("contactForm");'
        );
    }, 10000);
}

async function changeLanguage(driver, language) {
    await driver.executeScript(
        function (value) {
            const selector =
                document.getElementById("footerLanguageSelect");

            selector.value = value;
            selector.dispatchEvent(
                new Event("change", { bubbles: true })
            );
        },
        language
    );

    await driver.wait(async () => {
        return await driver.executeScript(
            function (value) {
                const selector =
                    document.getElementById("footerLanguageSelect");

                return document.documentElement.lang === value &&
                    selector.value === value &&
                    !selector.disabled;
            },
            language
        );
    }, 10000);
}

async function submitContact(driver) {
    await driver.executeScript(
        'document.getElementById("contactForm")' +
        '.requestSubmit();'
    );
}

async function getText(driver, id) {
    return driver.executeScript(
        "return document.getElementById(arguments[0]).textContent.trim();",
        id
    );
}

async function setValue(driver, id, value) {
    await driver.executeScript(
        function (elementId, newValue) {
            const element = document.getElementById(elementId);

            element.value = newValue;
            element.dispatchEvent(
                new Event("input", { bubbles: true })
            );
        },
        id,
        value
    );
}

for (const accessType of ["guest", "registered"]) {
    test(
        `CONTACT-I18N-001: validaciones dinámicas (${accessType})`,
        async (t) => {
            const driver = await createDriver();

            t.after(async () => {
                await driver.quit();
            });

            await initializeSession(driver, accessType);
            await submitContact(driver);

            for (const language of LANGUAGES) {
                await changeLanguage(driver, language);

                assert.equal(
                    await getText(driver, "contactMessageError"),
                    EXPECTED[language].messageRequired,
                    `Mensaje obligatorio incorrecto en ${language}`
                );

                if (accessType === "guest") {
                    assert.equal(
                        await getText(driver, "guestEmailError"),
                        EXPECTED[language].emailRequired,
                        `Correo obligatorio incorrecto en ${language}`
                    );
                }
            }
        }
    );

    test(
        `CONTACT-I18N-002: error de conexión dinámico (${accessType})`,
        async (t) => {
            const driver = await createDriver();

            t.after(async () => {
                await driver.quit();
            });

            await initializeSession(driver, accessType);

            // Simular una falla de red exclusivamente en /api/contact.
            // No se envía ningún correo real.
            await driver.executeScript(function () {
                const originalFetch = window.fetch;

                window.fetch = function (url, options) {
                    if (String(url).includes("/api/contact")) {
                        return Promise.reject(
                            new TypeError("QA simulated network failure")
                        );
                    }

                    return originalFetch.apply(this, arguments);
                };
            });

            await setValue(
                driver,
                "contactMessage",
                "Consulta de prueba QA"
            );

            if (accessType === "guest") {
                await setValue(
                    driver,
                    "guestEmail",
                    "qa@example.com"
                );
            }

            await submitContact(driver);

            await driver.wait(async () => {
                return (await getText(driver, "contactStatus")) ===
                    EXPECTED.es.connectionError;
            }, 10000);

            for (const language of LANGUAGES) {
                await changeLanguage(driver, language);

                assert.equal(
                    await getText(driver, "contactStatus"),
                    EXPECTED[language].connectionError,
                    `Error de conexión incorrecto en ${language}`
                );
            }
        }
    );
}

for (const accessType of ["guest", "registered"]) {
    for (const scenario of [
        {
            status: 503,
            key: "contactServiceUnavailable"
        },
        {
            status: 500,
            key: "contactSendError"
        },
        {
            status: 200,
            key: "contactSuccess"
        }
    ]) {
        test(
            `CONTACT-I18N-003: HTTP ${scenario.status} (${accessType})`,
            async (t) => {
                const driver = await createDriver();

                t.after(async () => {
                    await driver.quit();
                });

                await initializeSession(driver, accessType);

                // Simular únicamente la respuesta de /api/contact.
                // No se envían correos ni se modifica el backend.
                await driver.executeScript(function (status) {
                    const originalFetch = window.fetch;

                    window.fetch = function (url, options) {
                        if (String(url).includes("/api/contact")) {
                            return Promise.resolve(
                                new Response(
                                    JSON.stringify({
                                        simulated: true
                                    }),
                                    {
                                        status,
                                        headers: {
                                            "Content-Type": "application/json"
                                        }
                                    }
                                )
                            );
                        }

                        return originalFetch.apply(this, arguments);
                    };
                }, scenario.status);

                await setValue(
                    driver,
                    "contactMessage",
                    "Consulta automatizada QA"
                );

                if (accessType === "guest") {
                    await setValue(
                        driver,
                        "guestEmail",
                        "qa@example.com"
                    );
                }

                await submitContact(driver);

                // Esperar la respuesta antes de cambiar de idioma.
                await driver.wait(async () => {
                    return await driver.executeScript(
                        function () {
                            return document.getElementById(
                                "contactButton"
                            ).disabled === false;
                        }
                    );
                }, 10000);

                // Comprobar la traducción usando los diccionarios
                // cargados por la propia aplicación.
                for (const language of LANGUAGES) {
                    await changeLanguage(driver, language);
                    
                    const expectedMessages = {
                        es: {
                            contactServiceUnavailable:
                                "El servicio de correo no está disponible.",
                            contactSendError:
                                "No se pudo enviar el mensaje.",
                            contactSuccess:
                                "Mensaje enviado correctamente."
                        },
                        en: {
                            contactServiceUnavailable:
                                "The email service is unavailable.",
                            contactSendError:
                                "The message could not be sent.",
                            contactSuccess:
                                "Message sent successfully."
                        },
                        pt: {
                            contactServiceUnavailable:
                                "O serviço de e-mail está indisponível.",
                            contactSendError:
                                "Não foi possível enviar a mensagem.",
                            contactSuccess:
                                "Mensagem enviada com sucesso."
                        }
                    };

                    const actualMessage = await getText(driver, "contactStatus");

                    assert.equal(
                        actualMessage,
                        expectedMessages[language][scenario.key],
                        `HTTP ${scenario.status}, ${accessType}, ${language}`
                    );

                }

                // HTTP 200 debe limpiar el mensaje.
                // Los errores HTTP deben conservarlo.
                const messageValue =
                    await driver.findElement(
                        By.id("contactMessage")
                    ).getAttribute("value");

                if (scenario.status === 200) {
                    assert.equal(messageValue, "");
                } else {
                    assert.equal(
                        messageValue,
                        "Consulta automatizada QA"
                    );
                }
            }
        );
    }
}

test(
    "CONTACT-I18N-004: formato de correo dinámico (guest)",
    async (t) => {
        const driver = await createDriver();

        t.after(async () => {
            await driver.quit();
        });

        await initializeSession(driver, "guest");

        const expectedMessages = {
            es: "Ingresá un correo electrónico válido.",
            en: "Enter a valid email address.",
            pt: "Digite um endereço de e-mail válido."
        };

        // Mantener válido el mensaje para aislar
        // la validación del correo electrónico.
        await setValue(
            driver,
            "contactMessage",
            "Consulta de prueba QA"
        );

        // Ingresar un correo con formato inválido.
        await setValue(
            driver,
            "guestEmail",
            "correo-invalido"
        );

        await submitContact(driver);

        // Verificar que se haya generado el error inicial.
        await driver.wait(async () => {
            return (
                await getText(driver, "guestEmailError")
            ) === expectedMessages.es;
        }, 10000);

        // Verificar el cambio dinámico ES/EN/PT.
        for (const language of LANGUAGES) {
            await changeLanguage(driver, language);

            assert.equal(
                await getText(driver, "guestEmailError"),
                expectedMessages[language],
                `Error de formato incorrecto en ${language}`
            );

            const ariaInvalid = await driver
                .findElement(By.id("guestEmail"))
                .getAttribute("aria-invalid");

            assert.equal(
                ariaInvalid,
                "true",
                `El campo debe permanecer inválido en ${language}`
            );
        }

        // Corregir el correo sin recargar la página.
        await setValue(
            driver,
            "guestEmail",
            "qa@example.com"
        );

        assert.equal(
            await getText(driver, "guestEmailError"),
            "",
            "El error debe desaparecer al corregir el correo"
        );

        const ariaInvalidAfterCorrection = await driver
            .findElement(By.id("guestEmail"))
            .getAttribute("aria-invalid");

        assert.equal(
            ariaInvalidAfterCorrection,
            null,
            "Debe eliminarse aria-invalid al corregir el correo"
        );
    }
);
