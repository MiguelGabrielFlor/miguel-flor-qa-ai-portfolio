
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { Builder, By } = require('selenium-webdriver');

test('ACCESS-I18N-003 — Cambio de idioma con errores visibles', async (t) => {
    const browser = process.env.TEST_BROWSER || 'chrome';

    const driver = await new Builder()
        .forBrowser(browser)
        .build();

    t.after(async () => {
        await driver.quit();
    });

    const actualBrowser = String(
        (await driver.getCapabilities()).get('browserName')
    ).toLowerCase();

    assert.equal(
        actualBrowser,
        browser.toLowerCase(),
        `Navegador incorrecto: ${actualBrowser}`
    );

    const pageUrl = pathToFileURL(
        path.resolve(__dirname, '../../index.html')
    ).href;

    await driver.get(pageUrl);

    const errors = {
        firstNameError: 'firstNameRequired',
        lastNameError: 'lastNameRequired',
        emailError: 'emailRequired',
        phoneError: 'phoneRequired',
        consentError: 'consentRequired'
    };

    async function changeLanguage(language) {
        await driver.executeScript(`
            const select = document.getElementById('languageSelect');
            select.value = arguments[0];
            select.dispatchEvent(
                new Event('change', { bubbles: true })
            );
        `, language);

        await driver.wait(async () => {
            return driver.executeScript(
                'return document.documentElement.lang === arguments[0]',
                language
            );
        }, 5000);
    }

    async function verifyErrors(language) {
        const dictionary = await driver.executeScript(
            'return window.portfolioTranslations?.[arguments[0]]',
            language
        );

        assert.ok(dictionary, `Falta diccionario ${language}`);

        for (const [errorId, translationKey] of Object.entries(errors)) {
            const expected = dictionary[translationKey];

            assert.ok(expected, `Falta clave ${translationKey}`);

            await driver.wait(async () => {
                const actual = await driver.findElement(
                    By.id(errorId)
                ).getText();

                return actual === expected;
            }, 3000, `${language}: ${errorId} no se tradujo`);

        }

        console.log(
            `ACCESS-I18N-003 | ${language.toUpperCase()} | 5 ERRORES | PASS`
        );
    }

    // Estado inicial: español.
    await changeLanguage('es');

    // Generar los cinco errores una sola vez.
    await driver.findElement(By.id('accessButton')).click();

    await verifyErrors('es');

    // Cambiar idioma SIN volver a enviar el formulario.
    await changeLanguage('en');
    await verifyErrors('en');

    await changeLanguage('pt');
    await verifyErrors('pt');

    await changeLanguage('es');
    await verifyErrors('es');

    assert.equal(
        await driver.findElement(By.id('portfolio')).isDisplayed(),
        false,
        'El portfolio no debe abrirse con datos inválidos'
    );
});
