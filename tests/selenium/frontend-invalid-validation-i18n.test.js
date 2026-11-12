const { createDriver } = require('./selenium-config');

const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { By } = require('selenium-webdriver');

test('FRONTEND-I18N-003 — Datos inválidos ES/EN/PT', async (t) => {
    const browser = process.env.TEST_BROWSER || 'chrome';

    const driver = await createDriver(browser);

    t.after(async () => {
        await driver.quit();
    });

    const actualBrowser = String(
        (await driver.getCapabilities()).get('browserName') || ''
    ).toLowerCase();

    assert.equal(
        actualBrowser,
        browser.toLowerCase(),
        `Se solicitó ${browser}, pero Selenium abrió ${actualBrowser}`
    );

    const frontendPath = path.resolve(
        __dirname,
        '../../frontend.html'
    );

    await driver.get(pathToFileURL(frontendPath).href);

    const lab = await driver.findElement(By.id('language-lab'));

    const fields = {
        name: await lab.findElement(By.id('language-demo-name')),
        email: await lab.findElement(By.id('language-demo-email')),
        message: await lab.findElement(By.id('language-demo-message'))
    };

    const errors = {
        name: await lab.findElement(By.id('language-name-error')),
        email: await lab.findElement(By.id('language-email-error')),
        message: await lab.findElement(By.id('language-message-error'))
    };

    const result = await lab.findElement(
        By.id('language-demo-result')
    );

    const expectedValues = {
        name: 'Juan123',
        email: 'correo-invalido',
        message: ''
    };

    const scenarios = [
        {
            language: 'es',
            errors: {
                name: 'Ingresá un nombre de 3 a 50 caracteres, utilizando solamente letras.',
                email: 'Ingresá un correo electrónico válido (máximo 254 caracteres).',
                message: 'Ingresá un mensaje de hasta 5000 caracteres.'
            }
        },
        {
            language: 'en',
            errors: {
                name: 'Enter a name between 3 and 50 characters, using letters only.',
                email: 'Enter a valid email address (maximum 254 characters).',
                message: 'Enter a message of up to 5000 characters.'
            }
        },
        {
            language: 'pt',
            errors: {
                name: 'Digite um nome de 3 a 50 caracteres, usando apenas letras.',
                email: 'Digite um endereço de e-mail válido (máximo de 254 caracteres).',
                message: 'Digite uma mensagem de até 5000 caracteres.'
            }
        }
    ];

    // Activar el escenario inválido una sola vez.
    const invalidButton = await lab.findElement(
        By.css('[data-language-scenario="invalid"]')
    );

    await driver.executeScript(
        'arguments[0].click();',
        invalidButton
    );

    assert.equal(
        await invalidButton.getAttribute('aria-pressed'),
        'true'
    );

    // Cambiar el idioma sin volver a ejecutar el escenario.
    for (const scenario of [
        ...scenarios,
        scenarios[0]
    ]) {
        const languageButton = await lab.findElement(
            By.css(
                `[data-demo-language="${scenario.language}"]`
            )
        );

        await driver.executeScript(
            'arguments[0].click();',
            languageButton
        );

        for (const key of ['name', 'email', 'message']) {
            assert.equal(
                await fields[key].getAttribute('value'),
                expectedValues[key],
                `${scenario.language}: valor de ${key}`
            );

            assert.equal(
                await fields[key].getAttribute('aria-invalid'),
                'true',
                `${scenario.language}: estado de ${key}`
            );

            assert.equal(
                await errors[key].getText(),
                scenario.errors[key],
                `${scenario.language}: error de ${key}`
            );
        }

        assert.equal(
            await result.getAttribute('class'),
            'language-demo-result error'
        );

        assert.equal(
            await result.getText(),
            [
                scenario.errors.name,
                scenario.errors.email,
                scenario.errors.message
            ].join(' '),
            `${scenario.language}: resultado general`
        );

        assert.equal(
            await invalidButton.getAttribute('aria-pressed'),
            'true',
            'El escenario inválido debe permanecer seleccionado'
        );

        console.log(
            `FRONTEND-I18N-003 | ${actualBrowser} | ${scenario.language.toUpperCase()} | PASS`
        );
    }
});
