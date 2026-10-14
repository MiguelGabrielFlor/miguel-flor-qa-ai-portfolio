const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { Builder, By } = require('selenium-webdriver');

test('UI-002: el formulario vacío muestra errores y no permite acceder', async (t) => {
    const driver = await new Builder()
        .forBrowser('chrome')
        .build();

    t.after(async () => {
        await driver.quit();
    });

    const indexPath = path.resolve(__dirname, '../../index.html');
    await driver.get(pathToFileURL(indexPath).href);

    await driver.findElement(By.id('accessButton')).click();

    const expectedErrors = {
        firstNameError: 'El nombre es obligatorio.',
        lastNameError: 'El apellido es obligatorio.',
        emailError: 'El email es obligatorio.',
        phoneError: 'El teléfono es obligatorio.',
        consentError: 'Debés aceptar el registro de tus datos.'
    };

    for (const [errorId, expectedMessage] of Object.entries(expectedErrors)) {
        const errorElement = await driver.findElement(By.id(errorId));

        assert.equal(
            await errorElement.getText(),
            expectedMessage,
            `Mensaje incorrecto en ${errorId}`
        );
    }

    for (const fieldId of ['firstName', 'lastName', 'email', 'phone']) {
        const field = await driver.findElement(By.id(fieldId));

        assert.equal(
            await field.getAttribute('class').then(value => value.includes('input-error')),
            true,
            `El campo ${fieldId} debería marcarse como inválido`
        );
    }

    const portfolio = await driver.findElement(By.id('portfolio'));

    assert.equal(
        await portfolio.isDisplayed(),
        false,
        'El portfolio debe permanecer oculto'
    );
});
