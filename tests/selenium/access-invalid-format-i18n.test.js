const { createDriver } = require('./selenium-config');

const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { By } = require('selenium-webdriver');
const { Select } = require('selenium-webdriver/lib/select');

test('ACCESS-I18N-004 — Errores de formato ES/EN/PT', async (t) => {
    const browser = process.env.TEST_BROWSER || 'chrome';

    const driver = await createDriver(browser);

    t.after(async () => {
        await driver.quit();
    });

    const actualBrowser = String(
        (await driver.getCapabilities()).get('browserName') || ''
    ).toLowerCase();

    assert.equal(
        actualBrowser,
        browser.toLowerCase(),
        `Se solicitó ${browser}, pero Selenium abrió ${actualBrowser}`
    );

    const pageUrl = pathToFileURL(
        path.resolve(__dirname, '../../index.html')
    ).href;

    await driver.get(pageUrl);

    const languageSelect = await driver.findElement(
        By.id('languageSelect')
    );

    const invalidFields = [
        {
            inputId: 'firstName',
            errorId: 'firstNameError',
            translationKey: 'firstNameInvalid',
            value: '123'
        },
        {
            inputId: 'lastName',
            errorId: 'lastNameError',
            translationKey: 'lastNameInvalid',
            value: '456'
        },
        {
            inputId: 'email',
            errorId: 'emailError',
            translationKey: 'emailInvalid',
            value: 'correo-invalido'
        },
        {
            inputId: 'phone',
            errorId: 'phoneError',
            translationKey: 'phoneInvalid',
            value: 'abc123'
        }
    ];

    async function changeLanguage(language) {
        await new Select(languageSelect).selectByValue(language);

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

        assert.ok(dictionary, `Diccionario ausente: ${language}`);

        for (const field of invalidFields) {
            const expected = dictionary[field.translationKey];

            assert.ok(
                expected,
                `${language}: falta ${field.translationKey}`
            );

            await driver.wait(async () => {
                const actual = await driver.findElement(
                    By.id(field.errorId)
                ).getText();

                return actual === expected;
            }, 3000,
            `${language}: ${field.errorId} no se tradujo correctamente`);
        }

        console.log(
            `ACCESS-I18N-004 | ${actualBrowser} | ${language.toUpperCase()} | 4 ERRORES | PASS`
        );
    }

    // Preparar el formulario en español.
    await changeLanguage('es');

    for (const field of invalidFields) {
        await driver.findElement(
            By.id(field.inputId)
        ).sendKeys(field.value);
    }

    // Generar los errores una sola vez.
    await driver.findElement(By.id('accessButton')).click();

    await verifyErrors('es');

    // Cambiar idioma sin volver a enviar el formulario.
    for (const language of ['en', 'pt', 'es']) {
        await changeLanguage(language);
        await verifyErrors(language);
    }

    // Comprobar que los valores originales se conservan.
    for (const field of invalidFields) {
        const actualValue = await driver.findElement(
            By.id(field.inputId)
        ).getAttribute('value');

        assert.equal(
            actualValue,
            field.value,
            `${field.inputId}: el valor fue modificado`
        );
    }

    assert.equal(
        await driver.findElement(By.id('portfolio')).isDisplayed(),
        false,
        'No debe permitirse el acceso con datos inválidos'
    );
});
