
const { createDriver } = require('./selenium-config');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { By, until } = require('selenium-webdriver');

test('La página de acceso permite mostrar el formulario de registro', async (t) => {
    const browser = process.env.TEST_BROWSER || 'chrome';
    const driver = await createDriver(browser);

    t.after(async () => {
        await driver.quit();
    });

    const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:5500';

    await driver.get(`${baseUrl}/index.html`);

    const title = await driver.getTitle();
    assert.equal(title, 'Miguel Flor | QA Tester & AI Consultant');

    const accessForm = await driver.findElement(By.id('accessForm'));

    // El formulario debe estar oculto inicialmente.
    assert.equal(await accessForm.isDisplayed(), false);

    // Seleccionar el acceso registrado.
    const registeredButton = await driver.findElement(
        By.id('registeredAccessButton')
    );

    await registeredButton.click();

    // El formulario debe aparecer después de seleccionar el acceso.
    await driver.wait(until.elementIsVisible(accessForm), 10000);

    assert.equal(await accessForm.isDisplayed(), true);

    const firstName = await driver.findElement(By.id('firstName'));
    assert.equal(await firstName.isDisplayed(), true);
});
