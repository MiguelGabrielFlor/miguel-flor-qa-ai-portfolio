const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { Builder, By } = require('selenium-webdriver');

test('La página de acceso se abre y muestra el formulario', async (t) => {
    const browser = process.env.TEST_BROWSER || 'chrome';
    const driver = await new Builder().forBrowser(browser).build();

    t.after(async () => {
        await driver.quit();
    });

    const indexPath = path.resolve(__dirname, '../../index.html');
    const pageUrl = pathToFileURL(indexPath).href;

    await driver.get(pageUrl);

    const title = await driver.getTitle();
    assert.equal(title, 'Miguel Flor | QA Tester & AI Consultant');

    const accessForm = await driver.findElement(By.id('accessForm'));
    assert.equal(await accessForm.isDisplayed(), true);

    const firstName = await driver.findElement(By.id('firstName'));
    assert.equal(await firstName.isDisplayed(), true);
});
