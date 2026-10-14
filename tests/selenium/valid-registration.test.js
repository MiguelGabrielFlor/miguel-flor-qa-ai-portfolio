const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { Builder, By, until } = require('selenium-webdriver');

test('UI-008: un registro válido permite acceder al portfolio', async (t) => {
    const driver = await new Builder().forBrowser('chrome').build();

    t.after(async () => {
        await driver.quit();
    });

    const filePath = path.resolve(__dirname, '../../index.html');
    await driver.get(pathToFileURL(filePath).href);

    await driver.findElement(By.id('firstName')).sendKeys('Miguel');
    await driver.findElement(By.id('lastName')).sendKeys('Flor');
    await driver.findElement(By.id('email')).sendKeys('selenium.test@example.com');
    await driver.findElement(By.id('phone')).sendKeys('1123456789');
    await driver.findElement(By.id('consent')).click();
    await driver.findElement(By.id('accessButton')).click();

    const portfolio = await driver.wait(
    until.elementIsVisible(
        await driver.findElement(By.id('portfolio'))
    ),
    10000,
    'El portfolio debería mostrarse después del registro válido.'
    );

    assert.equal(await portfolio.isDisplayed(), true);
    assert.equal(
        await driver.findElement(By.id('accessPage')).isDisplayed(),
        false,
        'El formulario de acceso debería quedar oculto.'
    );
    const welcomeMessage = await driver.findElement(
        By.id('welcomeMessage')
    );

    assert.equal(
        await welcomeMessage.getText(),
        'Bienvenido MIGUEL',
        'El saludo debe mostrar el nombre en mayúsculas.'
    );
});