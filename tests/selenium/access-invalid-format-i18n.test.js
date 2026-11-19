const { test } = require('node:test');
const assert = require('node:assert/strict');
const { By, until } = require('selenium-webdriver');
const { Select } = require('selenium-webdriver/lib/select');
const { createDriver } = require('./selenium-config');

const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:5500';
const browser = process.env.TEST_BROWSER || 'chrome';

async function prepare(driver) {
    await driver.get(`${baseUrl}/index.html`);
    await driver.executeScript("sessionStorage.removeItem('portfolioSession'); localStorage.removeItem('portfolioLanguage');");
    await driver.navigate().refresh();
    await driver.wait(until.elementIsEnabled(driver.findElement(By.id('languageSelect'))), 10000);
    await driver.findElement(By.id('registeredAccessButton')).click();
    const form = await driver.findElement(By.id('accessForm'));
    await driver.wait(until.elementIsVisible(form), 10000);
}

async function language(driver, code) {
    const selector = await driver.findElement(By.id('languageSelect'));
    await driver.wait(until.elementIsEnabled(selector), 10000);
    await new Select(selector).selectByValue(code);
    await driver.wait(async () => driver.executeScript(`
        return document.documentElement.lang === arguments[0] &&
               document.getElementById('languageSelect').disabled === false &&
               !!window.portfolioTranslations?.[arguments[0]];
    `, code), 10000, `Idioma ${code} no terminó de cargarse`);
}

async function checkErrors(driver, code, fields) {
    const dictionary = await driver.executeScript(
        'return window.portfolioTranslations?.[arguments[0]]', code
    );
    assert.ok(dictionary, `Diccionario ausente: ${code}`);
    for (const [errorId, key] of Object.entries(fields)) {
        assert.ok(dictionary[key], `${code}: falta la clave ${key}`);
        await driver.wait(async () => {
            const actual = await driver.findElement(By.id(errorId)).getText();
            return actual === dictionary[key];
        }, 5000, `${code}: error incorrecto en ${errorId}`);
    }
    assert.ok((await driver.getCurrentUrl()).includes('index.html'),
        `${code}: no debe acceder a home.html con datos inválidos`);
}

async function runTest(t, fn) {
    const driver = await createDriver(browser);
    t.after(async () => driver.quit());
    const actual = String((await driver.getCapabilities()).get('browserName')).toLowerCase();
    assert.equal(actual, browser.toLowerCase(), 'Navegador incorrecto');
    await fn(driver);
}

const invalidFields = [
    { inputId: 'firstName', errorId: 'firstNameError', key: 'firstNameInvalid', value: '123' },
    { inputId: 'lastName', errorId: 'lastNameError', key: 'lastNameInvalid', value: '456' },
    { inputId: 'email', errorId: 'emailError', key: 'emailInvalid', value: 'correo-invalido' },
    { inputId: 'phone', errorId: 'phoneError', key: 'phoneInvalid', value: 'abc123' }
];

test('ACCESS-I18N-004 — Errores de formato ES/EN/PT', async t => {
    await runTest(t, async driver => {
        await prepare(driver);
        await language(driver, 'es');
        for (const field of invalidFields) {
            await driver.findElement(By.id(field.inputId)).sendKeys(field.value);
        }
        await driver.findElement(By.id('accessButton')).click();
        const errors = Object.fromEntries(invalidFields.map(f => [f.errorId, f.key]));
        for (const code of ['es', 'en', 'pt', 'es']) {
            await language(driver, code);
            await checkErrors(driver, code, errors);
            for (const field of invalidFields) {
                assert.equal(await driver.findElement(By.id(field.inputId)).getAttribute('value'),
                    field.value, `${code}: valor modificado en ${field.inputId}`);
                assert.equal(await driver.findElement(By.id(field.inputId)).getAttribute('aria-invalid'),
                    'true', `${code}: falta aria-invalid en ${field.inputId}`);
            }
            console.log(`ACCESS-I18N-004 | ${browser} | ${code.toUpperCase()} | 4 ERRORES | PASS`);
        }
    });
});
