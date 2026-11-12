const { createDriver } = require('./selenium-config');

const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { By } = require('selenium-webdriver');

test('FRONTEND-I18N-004 — Datos válidos ES/EN/PT', async (t) => {
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
        name: 'Juan Pérez',
        email: 'juan@example.com',
        message: 'Mensaje de prueba válido.'
    };

    const scenarios = [
        {
            language: 'es',
            success: 'Todos los campos son válidos.'
        },
        {
            language: 'en',
            success: 'All fields are valid.'
        },
        {
            language: 'pt',
            success: 'Todos os campos são válidos.'
        }
    ];

    // Ejecutar el escenario válido una sola vez.
    const validButton = await lab.findElement(
        By.css('[data-language-scenario="valid"]')
    );

    await driver.executeScript(
        'arguments[0].click();',
        validButton
    );

    assert.equal(
        await validButton.getAttribute('aria-pressed'),
        'true'
    );

    // Traducir el resultado sin volver a ejecutar el escenario.
    for (const scenario of [...scenarios, scenarios[0]]) {
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
                'false',
                `${scenario.language}: estado de ${key}`
            );

            assert.equal(
                await errors[key].getText(),
                '',
                `${scenario.language}: no debe existir error de ${key}`
            );
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

        assert.equal(
            await validButton.getAttribute('aria-pressed'),
            'true',
            'El escenario válido debe permanecer seleccionado'
        );

        console.log(
            `FRONTEND-I18N-004 | ${actualBrowser} | ${scenario.language.toUpperCase()} | PASS`
        );
    }
});
