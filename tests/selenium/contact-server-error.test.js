
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { Builder, By, until } = require('selenium-webdriver');

test('UI-015: el formulario gestiona un error HTTP 500', async (t) => {
    const browser = process.env.TEST_BROWSER || 'chrome';

    const driver = await new Builder()
        .forBrowser(browser)
        .build();

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

    const portfolio = await driver.findElement(By.id('portfolio'));

    await driver.wait(
        until.elementIsVisible(portfolio),
        10000,
        'El portfolio debería mostrarse después del acceso.'
    );

    // Completar el formulario de contacto.
    const message = await driver.findElement(By.id('contactMessage'));
    const testMessage = 'Prueba Selenium: error HTTP 500 simulado.';

    await message.sendKeys(testMessage);

    const contactButton = await driver.findElement(By.id('contactButton'));
    await contactButton.click();

    // Comprobar el mensaje de error mostrado por el frontend.
    const status = await driver.findElement(By.id('contactStatus'));
    const expectedError =
        'No se pudo enviar el mensaje. Intentá nuevamente más tarde.';

    await driver.wait(
        until.elementTextIs(status, expectedError),
        10000,
        'El formulario debería mostrar el error HTTP 500.'
    );

    assert.equal(await status.getText(), expectedError);

    // El mensaje no debe perderse después del error.
    assert.equal(
        await message.getAttribute('value'),
        testMessage,
        'El mensaje debe conservarse después del error.'
    );

    // El botón debe habilitarse nuevamente.
    assert.equal(
        await contactButton.isEnabled(),
        true,
        'El botón debe permitir un nuevo intento.'
    );
});
