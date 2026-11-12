const { createDriver } = require('./selenium-config');

const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { By } = require('selenium-webdriver');
const { Select } = require('selenium-webdriver/lib/select');

test('ACCESS-I18N-002 — Errores obligatorios ES/EN/PT', async (t) => {
    const browser = process.env.TEST_BROWSER || 'chrome';

    const driver = await createDriver(browser);

    t.after(async () => {
        await driver.quit();
    });

    const capabilities = await driver.getCapabilities();
    const actualBrowser = String(
        capabilities.get('browserName') || ''
    ).toLowerCase();

    const expectedBrowsers = {
        chrome: 'chrome',
        firefox: 'firefox',
        MicrosoftEdge: 'MicrosoftEdge'
    };

    assert.equal(
        actualBrowser,
        expectedBrowsers[browser].toLowerCase(),
        `Se solicitó ${browser}, pero Selenium abrió ${actualBrowser}`
    );

    const pageUrl = pathToFileURL(
        path.resolve(__dirname, '../../index.html')
    ).href;

    await driver.get(pageUrl);

    const languageSelect = await driver.findElement(
        By.id('languageSelect')
    );

    const errors = {
        firstNameError: 'firstNameRequired',
        lastNameError: 'lastNameRequired',
        emailError: 'emailRequired',
        phoneError: 'phoneRequired',
        consentError: 'consentRequired'
    };

    for (const language of ['es', 'en', 'pt', 'es']) {
        await new Select(languageSelect).selectByValue(language);

        await driver.wait(
            async () => await driver.executeScript(
                'return document.documentElement.lang === arguments[0]',
                language
            ),
            5000
        );

        // El formulario permanece vacío.
        await driver.findElement(By.id('accessButton')).click();

        const dictionary = await driver.executeScript(
            'return window.portfolioTranslations?.[arguments[0]]',
            language
        );

        assert.ok(dictionary, `Diccionario ausente: ${language}`);

        for (const [errorId, translationKey] of Object.entries(errors)) {
            const expected = dictionary[translationKey];

            assert.ok(
                expected,
                `${language}: falta la traducción ${translationKey}`
            );

            const actual = await driver.findElement(
                By.id(errorId)
            ).getText();

            assert.equal(
                actual,
                expected,
                `${language}: mensaje incorrecto en ${errorId}`
            );
        }

        const portfolio = await driver.findElement(
            By.id('portfolio')
        );

        assert.equal(
            await portfolio.isDisplayed(),
            false,
            `${language}: el acceso no debe permitirse`
        );

        console.log(
            `ACCESS-I18N-002 | ${actualBrowser} | ${language.toUpperCase()} | 5 ERRORES | PASS`
        );
    }
});
