
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { Builder, By, until } = require('selenium-webdriver');

test('UI-010: un mensaje válido muestra la confirmación de envío', async (t) => {
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

    // Esperar a que el portfolio esté visible.
    const portfolio = await driver.findElement(By.id('portfolio'));

    await driver.wait(
        until.elementIsVisible(portfolio),
        10000,
        'El portfolio debería mostrarse después del acceso.'
    );

    // Completar y enviar el formulario de contacto.
    const message = await driver.findElement(By.id('contactMessage'));

    await message.sendKeys(
        'Prueba automatizada Selenium: consulta de contacto válida.'
    );

    const contactButton = await driver.findElement(By.id('contactButton'));

    await contactButton.click();

    // Esperar la confirmación de la API simulada.
    const status = await driver.findElement(By.id('contactStatus'));

    await driver.wait(
        until.elementTextIs(status, 'Mensaje enviado correctamente.'),
        10000,
        'Debe mostrarse la confirmación de envío.'
    );

    assert.equal(
        await status.getText(),
        'Mensaje enviado correctamente.'
    );

    // El formulario debe quedar limpio después del envío.
    assert.equal(
        await message.getAttribute('value'),
        '',
        'El campo de mensaje debe quedar vacío.'
    );

    // El botón debe volver a estar habilitado.
    assert.equal(
        await contactButton.isEnabled(),
        true,
        'El botón debe habilitarse nuevamente.'
    );
});
