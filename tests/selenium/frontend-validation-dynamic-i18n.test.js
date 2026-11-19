
"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { By } = require("selenium-webdriver");
const { createDriver } = require("./selenium-config");

const BASE_URL =
    process.env.TEST_BASE_URL || "http://127.0.0.1:5500";

const expected = {
    es: {
        waiting: "Esperando datos de entrada.",
        empty: "El correo electrónico es obligatorio.",
        emptyResult: "VALIDACIÓN RECHAZADA — Campo vacío.",
        invalid: "Ingresá un correo electrónico válido.",
        invalidResult: "VALIDACIÓN RECHAZADA — Formato incorrecto.",
        valid: "Correo electrónico válido.",
        validResult: "VALIDACIÓN APROBADA — Formato correcto."
    },
    en: {
        waiting: "Waiting for input.",
        empty: "Email address is required.",
        emptyResult: "VALIDATION REJECTED — Empty field.",
        invalid: "Enter a valid email address.",
        invalidResult: "VALIDATION REJECTED — Invalid format.",
        valid: "Valid email address.",
        validResult: "VALIDATION PASSED — Correct format."
    },
    pt: {
        waiting: "Aguardando dados de entrada.",
        empty: "O e-mail é obrigatório.",
        emptyResult: "VALIDAÇÃO REJEITADA — Campo vazio.",
        invalid: "Digite um endereço de e-mail válido.",
        invalidResult: "VALIDAÇÃO REJEITADA — Formato inválido.",
        valid: "E-mail válido.",
        validResult: "VALIDAÇÃO APROVADA — Formato correto."
    }
};

test(
    "FRONTEND-VALIDATION-I18N-001: estados dinámicos ES/EN/PT",
    async (t) => {
        const driver = await createDriver();

        t.after(async () => {
            await driver.quit();
        });

        await driver.get(`${BASE_URL}/frontend.html`);

        await driver.wait(
            async () => driver.executeScript(
                "return !!window.frontTr && !!document.getElementById('demo-email');"
            ),
            10000
        );

        async function changeLanguage(language) {
            await driver.executeScript(function (lang) {
                const selector =
                    document.getElementById("cv-language-select");

                if (!selector) {
                    throw new Error("Selector global no encontrado");
                }

                selector.value = lang;
                selector.dispatchEvent(
                    new Event("change", { bubbles: true })
                );
            }, language);

            await driver.wait(
                async () => driver.executeScript(
                    "return localStorage.getItem('portfolioLanguage') === arguments[0];",
                    language
                ),
                10000
            );
        }

        async function readState() {
            return driver.executeScript(() => ({
                message: document.getElementById(
                    "demo-email-message"
                ).textContent.trim(),
                result: document.getElementById(
                    "demo-validation-result"
                ).textContent.trim(),
                ariaInvalid: document.getElementById(
                    "demo-email"
                ).getAttribute("aria-invalid")
            }));
        }

        async function validate(value) {
            await driver.executeScript(function (email) {
                const input = document.getElementById("demo-email");

                input.value = email;
                input.dispatchEvent(
                    new Event("input", { bubbles: true })
                );

                document.getElementById("demo-validate").click();
            }, value);
        }

        const scenarios = [
            {
                name: "empty",
                value: "",
                messageKey: "empty",
                resultKey: "emptyResult",
                ariaInvalid: "true"
            },
            {
                name: "invalid",
                value: "correo-invalido",
                messageKey: "invalid",
                resultKey: "invalidResult",
                ariaInvalid: "true"
            },
            {
                name: "valid",
                value: "qa@example.com",
                messageKey: "valid",
                resultKey: "validResult",
                ariaInvalid: "false"
            }
        ];

        for (const scenario of scenarios) {
            await changeLanguage("es");
            await validate(scenario.value);

            for (const language of ["es", "en", "pt"]) {
                await changeLanguage(language);

                const state = await readState();
                const texts = expected[language];

                assert.equal(
                    state.message,
                    texts[scenario.messageKey],
                    `${scenario.name}: mensaje incorrecto en ${language}`
                );

                assert.equal(
                    state.result,
                    texts[scenario.resultKey],
                    `${scenario.name}: resultado incorrecto en ${language}`
                );

                assert.equal(
                    state.ariaInvalid,
                    scenario.ariaInvalid,
                    `${scenario.name}: aria-invalid incorrecto en ${language}`
                );
            }
        }

        await driver.executeScript(() => {
            const resetButton = document.getElementById("demo-reset");

            if (!resetButton) {
                throw new Error("No se encontró el botón Restablecer");
            }

            resetButton.click();
        });

        const resetState = await readState();

        assert.equal(resetState.message, "");
        assert.equal(resetState.result, expected.pt.waiting);
        assert.equal(resetState.ariaInvalid, null);
    }
);
