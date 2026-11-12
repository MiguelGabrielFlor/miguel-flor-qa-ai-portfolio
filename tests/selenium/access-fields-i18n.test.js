const { createDriver } = require('./selenium-config');

const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { By } = require('selenium-webdriver');

test('ACCESS-I18N-001 — Etiquetas y placeholders ES/EN/PT', async (t) => {
    const browser = process.env.TEST_BROWSER || 'chrome';
    const driver = await createDriver(browser);
        
    const capabilities = await driver.getCapabilities();

    const actualBrowser = String(
        capabilities.get('browserName') || ''
    ).toLowerCase();

    assert.equal(
        actualBrowser,
        browser.toLowerCase(),
        `Se solicitó ${browser}, pero Selenium abrió ${actualBrowser}`
    );


    t.after(async () => {
        await driver.quit();
    });

    const pageUrl = pathToFileURL(
        path.resolve(__dirname, '../../index.html')
    ).href;

    await driver.get(pageUrl);

    const fields = [
        ['firstNameLabel', 'firstNamePlaceholder', 'firstName'],
        ['lastNameLabel', 'lastNamePlaceholder', 'lastName'],
        ['emailLabel', 'emailPlaceholder', 'email'],
        ['phoneLabel', 'phonePlaceholder', 'phone']
    ];

    for (const language of ['es', 'en', 'pt', 'es']) {
        await driver.executeScript(
            "document.getElementById('languageSelect').value = arguments[0];" +
            "document.getElementById('languageSelect').dispatchEvent(new Event('change', { bubbles: true }));",
            language
        );

        await driver.wait(async () => {
            return driver.executeScript(
                'return document.documentElement.lang === arguments[0]',
                language
            );
        }, 5000);

        for (const [labelKey, placeholderKey, inputId] of fields) {
            const actual = await driver.executeScript(
                `
                const dict = window.portfolioTranslations?.[arguments[0]];
                const label = document.querySelector(
                    '[data-i18n="' + arguments[1] + '"]'
                );
                const input = document.getElementById(arguments[3]);

                return {
                    expectedLabel: dict?.[arguments[1]],
                    expectedPlaceholder: dict?.[arguments[2]],
                    actualLabel: label?.textContent.trim(),
                    actualPlaceholder: input?.placeholder
                };
                `,
                language, labelKey, placeholderKey, inputId
            );

            assert.ok(actual.expectedLabel,
                `${language}: falta ${labelKey}`);

            assert.ok(actual.expectedPlaceholder,
                `${language}: falta ${placeholderKey}`);

            assert.equal(
                actual.actualLabel,
                actual.expectedLabel.trim(),
                `${language}: etiqueta ${labelKey}`
            );

            assert.equal(
                actual.actualPlaceholder,
                actual.expectedPlaceholder,
                `${language}: placeholder ${placeholderKey}`
            );
        }

        console.log(
            `ACCESS-I18N-001 | ${language.toUpperCase()} | 8 ELEMENTOS | PASS`
        );
    }
});
