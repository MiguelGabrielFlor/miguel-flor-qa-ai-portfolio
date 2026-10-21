const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { Builder, By } = require('selenium-webdriver');

test('UI-007: sin consentimiento no se permite acceder al portfolio', async (t) => {
    const browser = process.env.TEST_BROWSER || 'chrome';
    const driver = await new Builder().forBrowser(browser).build();

    t.after(async () => {
        await driver.quit();
    });

    const indexPath = path.resolve(__dirname, '../../index.html');
    await driver.get(pathToFileURL(indexPath).href);

    await driver.findElement(By.id('firstName')).sendKeys('Miguel');
    await driver.findElement(By.id('lastName')).sendKeys('Flor');
    await driver.findElement(By.id('email')).sendKeys('miguel@example.com');
    await driver.findElement(By.id('phone')).sendKeys('1123456789');

    const consent = await driver.findElement(By.id('consent'));

    assert.equal(
        await consent.isSelected(),
        false,
        'El consentimiento debe estar desmarcado inicialmente'
    );

    await driver.findElement(By.id('accessButton')).click();

    const consentError = await driver.findElement(By.id('consentError'));

    assert.equal(
        await consentError.getText(),
        'Debés aceptar el registro de tus datos.',
        'Debe mostrarse el mensaje de consentimiento obligatorio'
    );

    const portfolio = await driver.findElement(By.id('portfolio'));

    assert.equal(
        await portfolio.isDisplayed(),
        false,
        'El portfolio debe permanecer oculto'
    );
});
