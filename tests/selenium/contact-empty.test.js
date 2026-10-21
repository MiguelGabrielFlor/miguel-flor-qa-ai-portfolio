
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { Builder, By, until } = require('selenium-webdriver');

test('UI-011: un mensaje vacío no permite enviar el formulario de contacto', async (t) => {
    const browser = process.env.TEST_BROWSER || 'chrome';
    const driver = await new Builder().forBrowser(browser).build();

    t.after(async () => {
        await driver.quit();
    });

    const filePath = path.resolve(__dirname, '../../index.html');
    await driver.get(pathToFileURL(filePath).href);

    // Completar el formulario de acceso.
    await driver.findElement(By.id('firstName')).sendKeys('Miguel');
    await driver.findElement(By.id('lastName')).sendKeys('Flor');
    await driver.findElement(By.id('email')).sendKeys('selenium.test@example.com');
    await driver.findElement(By.id('phone')).sendKeys('1123456789');
    await driver.findElement(By.id('consent')).click();
    await driver.findElement(By.id('accessButton')).click();

    // Esperar a que se muestre el portfolio.
    await driver.wait(
        until.elementIsVisible(
            await driver.findElement(By.id('portfolio'))
        ),
        10000
    );

    // Intentar enviar el formulario sin escribir un mensaje.
    const contactButton = await driver.findElement(By.id('contactButton'));
    await contactButton.click();

    const messageField = await driver.findElement(
    By.id('contactMessage')
);

    const isInvalid = await driver.executeScript(
        'return !arguments[0].checkValidity();',
        messageField
    );

    assert.equal(
        isInvalid,
        true,
        'El campo vacío debe ser inválido según la validación HTML.'
    );

    const error = await driver.findElement(
        By.id('contactMessageError')
    );

    const errorText = await error.getText();

    assert.ok(
        errorText === '' || errorText === 'El mensaje es obligatorio.',
        'No debe aparecer un mensaje de validación inesperado.'
    );

    const status = await driver.findElement(By.id('contactStatus'));

    assert.equal(
        await status.getText(),
        '',
        'No debe mostrarse una confirmación de envío.'
    );
});
