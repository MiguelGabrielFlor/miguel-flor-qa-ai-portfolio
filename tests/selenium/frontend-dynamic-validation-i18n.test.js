'use strict';
const { createDriver } = require('./selenium-config');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { By } = require('selenium-webdriver');
const BASE_URL = (process.env.TEST_BASE_URL || 'http://127.0.0.1:5500').replace(/\/$/, '');
const TIMEOUT = 12000;

const scenarios = [
    { lang: 'es', errors: {
        name: 'Ingresá un nombre de 3 a 50 caracteres, utilizando solamente letras.',
        email: 'Ingresá un correo electrónico válido (máximo 254 caracteres).',
        message: 'Ingresá un mensaje de hasta 5000 caracteres.'
    }, success: 'Todos los campos son válidos.' },
    { lang: 'en', errors: {
        name: 'Enter a name between 3 and 50 characters, using letters only.',
        email: 'Enter a valid email address (maximum 254 characters).',
        message: 'Enter a message of up to 5000 characters.'
    }, success: 'All fields are valid.' },
    { lang: 'pt', errors: {
        name: 'Digite um nome de 3 a 50 caracteres, usando apenas letras.',
        email: 'Digite um endereço de e-mail válido (máximo de 254 caracteres).',
        message: 'Digite uma mensagem de até 5000 caracteres.'
    }, success: 'Todos os campos são válidos.' }
];

test('FRONTEND-I18N-005 — Revalidación dinámica ES/EN/PT', async (t) => {
    const browser = process.env.TEST_BROWSER || 'chrome';
    const driver = await createDriver(browser);
    t.after(async () => driver.quit());
    const actual = String((await driver.getCapabilities()).get('browserName') || '').toLowerCase();
    assert.equal(actual, browser.toLowerCase() === 'edge' ? 'microsoftedge' : browser.toLowerCase());
    await driver.get(`${BASE_URL}/frontend.html`);
    const lab = await driver.findElement(By.id('language-lab'));
    await driver.wait(() => driver.executeScript(() =>
        document.querySelector('.language-lab-preview')?.getAttribute('lang') === 'es' &&
        !!document.querySelector('[data-demo-language="en"]')
    ), TIMEOUT);

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
    const result = await lab.findElement(By.id('language-demo-result'));

    async function verify(key, valid, error, expectValidClass = false) {
        assert.equal(await fields[key].getAttribute('aria-invalid'), String(!valid), `${key}: aria-invalid`);
        assert.equal(await errors[key].getText(), error, `${key}: texto de error`);
        if (!valid || expectValidClass) {
            const expectedClass = valid ? 'demo-field-valid' : 'demo-field-error';
            const classes = (await fields[key].getAttribute('class')) || '';
            assert.ok(classes.split(/\s+/).includes(expectedClass), `${key}: clase visual incorrecta (${expectedClass})`);
        }
    }
    async function replace(field, value) {
        await field.clear();
        if (value) await field.sendKeys(value);
    }
    async function validate() {
        await driver.executeScript(() => document.getElementById('language-demo-submit').click());
    }

    for (const scenario of scenarios) {
        await driver.executeScript((lang) => {
            document.querySelector(`[data-demo-language="${lang}"]`).click();
        }, scenario.lang);
        await driver.wait(() => driver.executeScript((lang) =>
            document.querySelector('.language-lab-preview')?.lang === lang &&
            document.getElementById('language-lab-current')?.textContent === lang.toUpperCase()
        , scenario.lang), TIMEOUT);

        await driver.executeScript(() => document.querySelector('[data-language-scenario="invalid"]').click());
        for (const key of ['name', 'email', 'message']) await verify(key, false, scenario.errors[key]);
        assert.ok((await result.getText()).includes(scenario.errors.email));

        await replace(fields.name, 'Juan Pérez');
        await verify('name', true, '');
        await verify('email', false, scenario.errors.email);
        await verify('message', false, scenario.errors.message);
        await replace(fields.email, 'juan@example.com');
        await verify('name', true, '');
        await verify('email', true, '');
        await verify('message', false, scenario.errors.message);
        await replace(fields.message, 'Mensaje de prueba válido.');
        for (const key of ['name', 'email', 'message']) {
            assert.equal(await fields[key].getAttribute('aria-invalid'), 'false');
            assert.equal(await errors[key].getText(), '');
        }
        assert.equal(await result.getText(), '', 'Al editar se debe limpiar el resultado previo');
        await validate();
        for (const key of ['name', 'email', 'message']) await verify(key, true, '', true);
        assert.equal(await result.getAttribute('class'), 'language-demo-result success');
        assert.equal(await result.getText(), scenario.success);

        await replace(fields.email, 'correo-invalido');
        await verify('email', false, scenario.errors.email);
        assert.equal(await result.getText(), '', 'La edición exige revalidar');
        await validate();
        await verify('name', true, '');
        await verify('email', false, scenario.errors.email);
        await verify('message', true, '');
        assert.equal(await result.getAttribute('class'), 'language-demo-result error');
        assert.equal(await result.getText(), scenario.errors.email);
        console.log(`FRONTEND-I18N-005 | ${actual} | ${scenario.lang.toUpperCase()} | PASS`);
    }
});
