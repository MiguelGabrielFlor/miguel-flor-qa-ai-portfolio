const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { Builder, By } = require('selenium-webdriver');

test('UI-003: un email inválido impide acceder al portfolio', async (t) => {
    const browser = process.env.TEST_BROWSER || 'chrome';
    const driver = await new Builder().forBrowser(browser).build();

    t.after(async () => {
        await driver.quit();
    });

    const indexPath = path.resolve(__dirname, '../../index.html');
    await driver.get(pathToFileURL(indexPath).href);

    await driver.findElement(By.id('firstName')).sendKeys('Miguel');
    await driver.findElement(By.id('lastName')).sendKeys('Flor');
    await driver.findElement(By.id('email')).sendKeys('correo-invalido');
    await driver.findElement(By.id('phone')).sendKeys('1123456789');
    await driver.findElement(By.id('consent')).click();

    await driver.findElement(By.id('accessButton')).click();

    const emailError = await driver.findElement(By.id('emailError'));

    assert.equal(
        await emailError.getText(),
        'Ingresá un email válido.',
        'Debe mostrarse el mensaje de email inválido'
    );

    const portfolio = await driver.findElement(By.id('portfolio'));

    assert.equal(
        await portfolio.isDisplayed(),
        false,
        'El portfolio debe permanecer oculto'
    );
});
