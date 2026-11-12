const { createDriver } = require('./selenium-config');

const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { By } = require('selenium-webdriver');

test('FRONTEND-I18N-005 — Revalidación dinámica ES/EN/PT', async (t) => {
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

    const invalidButton = await lab.findElement(
        By.css('[data-language-scenario="invalid"]')
    );

    const scenarios = [
        {
            language: 'es',
            errors: {
                name: 'Ingresá un nombre de 3 a 50 caracteres, utilizando solamente letras.',
                email: 'Ingresá un correo electrónico válido (máximo 254 caracteres).',
                message: 'Ingresá un mensaje de hasta 5000 caracteres.'
            },
            success: 'Todos los campos son válidos.'
        },
        {
            language: 'en',
            errors: {
                name: 'Enter a name between 3 and 50 characters, using letters only.',
                email: 'Enter a valid email address (maximum 254 characters).',
                message: 'Enter a message of up to 5000 characters.'
            },
            success: 'All fields are valid.'
        },
        {
            language: 'pt',
            errors: {
                name: 'Digite um nome de 3 a 50 caracteres, usando apenas letras.',
                email: 'Digite um endereço de e-mail válido (máximo de 254 caracteres).',
                message: 'Digite uma mensagem de até 5000 caracteres.'
            },
            success: 'Todos os campos são válidos.'
        }
    ];

    async function verifyField(key, valid, expectedError) {
        assert.equal(
            await fields[key].getAttribute('aria-invalid'),
            String(!valid),
            `Estado aria-invalid incorrecto: ${key}`
        );

        assert.equal(
            await errors[key].getText(),
            expectedError,
            `Mensaje incorrecto: ${key}`
        );
    }

    async function replaceValue(field, value) {
        await field.clear();
        if (value) {
            await field.sendKeys(value);
        }
    }

    for (const scenario of scenarios) {
        // Seleccionar idioma del laboratorio.
        const languageButton = await lab.findElement(
            By.css(
                `[data-demo-language="${scenario.language}"]`
            )
        );

        await driver.executeScript(
            'arguments[0].click();',
            languageButton
        );

        // Generar los tres errores.
        await driver.executeScript(
            'arguments[0].click();',
            invalidButton
        );

        for (const key of ['name', 'email', 'message']) {
            await verifyField(
                key,
                false,
                scenario.errors[key]
            );
        }

        // Corregir nombre mediante interacción real.
        await replaceValue(fields.name, 'Juan Pérez');

        await verifyField('name', true, '');
        await verifyField('email', false, scenario.errors.email);
        await verifyField('message', false, scenario.errors.message);

        // Corregir email.
        await replaceValue(fields.email, 'juan@example.com');

        await verifyField('name', true, '');
        await verifyField('email', true, '');
        await verifyField('message', false, scenario.errors.message);

        // Completar mensaje.
        await replaceValue(
            fields.message,
            'Mensaje de prueba válido.'
        );

        for (const key of ['name', 'email', 'message']) {
            await verifyField(key, true, '');
        }

        assert.equal(
            await result.getAttribute('class'),
            'language-demo-result success'
        );

        assert.equal(
            await result.getText(),
            scenario.success,
            `${scenario.language}: mensaje de éxito`
        );

        // Reintroducir un error sin presionar Validar.
        await replaceValue(fields.email, 'correo-invalido');

        await verifyField(
            'email',
            false,
            scenario.errors.email
        );

        await verifyField('name', true, '');
        await verifyField('message', true, '');

        assert.equal(
            await result.getAttribute('class'),
            'language-demo-result error'
        );

        assert.equal(
            await result.getText(),
            scenario.errors.email,
            `${scenario.language}: resultado después de introducir un error`
        );

        console.log(
            `FRONTEND-I18N-005 | ${actualBrowser} | ${scenario.language.toUpperCase()} | PASS`
        );
    }
});
