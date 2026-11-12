const { createDriver } = require('./selenium-config');

const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { By, until } = require('selenium-webdriver');

test('El laboratorio cambia de idioma independientemente del portfolio', async (t) => {
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

    const frontendPath = path.resolve(
        __dirname,
        '../../frontend.html'
    );

    await driver.get(pathToFileURL(frontendPath).href);

    const lab = await driver.wait(
        until.elementLocated(By.id('language-lab')),
        10000
    );

    const preview = await lab.findElement(
        By.css('.language-lab-preview')
    );

    const current = await lab.findElement(
        By.id('language-lab-current')
    );

    const title = await lab.findElement(
        By.css('[data-demo-translation="title"]')
    );

    const name = await lab.findElement(
        By.css('[data-demo-translation="name"]')
    );

    const pageLanguage = await driver.executeScript(
        'return document.documentElement.lang'
    );

    const scenarios = [
        {
            language: 'es',
            indicator: 'ES',
            title: 'Formulario de contacto',
            name: 'Nombre'
        },
        {
            language: 'en',
            indicator: 'EN',
            title: 'Contact form',
            name: 'Name'
        },
        {
            language: 'pt',
            indicator: 'PT',
            title: 'Formulário de contato',
            name: 'Nome'
        },

    ];

    for (const scenario of scenarios) {
        const button = await lab.findElement(
            By.css(
                `[data-demo-language="${scenario.language}"]`
            )
        );

        await driver.executeScript(`
            arguments[0].scrollIntoView({
                behavior: 'instant',
                block: 'center',
                inline: 'nearest'
            });
        `, button);

        await driver.wait(async () => {
            return await button.isDisplayed() && await button.isEnabled();
        }, 5000);

        await button.click();

        await driver.wait(async () => {
            return (
                (await current.getText()) === scenario.indicator &&
                (await preview.getAttribute('lang')) === scenario.language
            );
        }, 5000);

        assert.equal(
            await button.getAttribute('aria-pressed'),
            'true'
        );

        if (scenario.title) {
            assert.equal(
                await title.getText(),
                scenario.title
            );
        }

        if (scenario.name) {
            assert.equal(
                await name.getText(),
                scenario.name
            );
        }

        assert.equal(
            await driver.executeScript(
                'return document.documentElement.lang'
            ),
            pageLanguage,
            'El idioma general del portfolio no debe cambiar'
        );
    }
});
