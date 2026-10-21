
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { Builder, By } = require('selenium-webdriver');
const { Select } = require('selenium-webdriver/lib/select');

test('UI-009: el selector cambia el idioma de la pantalla de acceso', async (t) => {
    const browser = process.env.TEST_BROWSER || 'chrome';
    const driver = await new Builder().forBrowser(browser).build();

    t.after(async () => {
        await driver.quit();
    });

    const filePath = path.resolve(__dirname, '../../index.html');
    await driver.get(pathToFileURL(filePath).href);

    const languageSelect = await driver.findElement(By.id('languageSelect'));
    const accessWelcome = await driver.findElement(
        By.css('[data-i18n="accessWelcome"]')
    );

    const languages = [
        { code: 'es', expected: 'Te doy la bienvenida' },
        { code: 'en', expected: 'Welcome' },
        { code: 'pt', expected: 'Dou-lhe as boas-vindas' }
    ];

    for (const language of languages) {
        await new Select(languageSelect).selectByValue(language.code);

        assert.equal(
            await accessWelcome.getText(),
            language.expected,
            `El encabezado debería mostrarse en ${language.code}.`
        );
    }
});
